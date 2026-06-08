import fs from "fs";
import { promises as fsp } from "fs";
import os from "os";
import path from "path";
import { execFile, spawn } from "child_process";
import AdmZip from "adm-zip";
import type { RunnerCheck, RunnerReportInput } from "@/lib/grading-contract";
import { compareStudentScreenshotWithBaseline } from "@/services/visual-comparison.service";

type SourceArchive = {
    url?: string | null;
    storedName?: string | null;
    originalName?: string | null;
} | null | undefined;
type AssignmentAttachment = {
    kind?: string;
    url?: string;
    originalName?: string;
    mimeType?: string;
};

function makeCheck(input: {
    code: string;
    label: string;
    status: RunnerCheck["status"];
    message: string;
    evidence?: string[];
}): RunnerCheck {
    return {
        code: input.code,
        label: input.label,
        status: input.status,
        message: input.message,
        evidence: input.evidence ?? [],
        score: input.status === "passed" ? 1 : 0,
        maxScore: 1,
    };
}

function archiveToAbsolutePath(sourceArchive: SourceArchive) {
    const url = String(sourceArchive?.url || "").trim();
    if (!url) return null;

    if (url.startsWith("/")) {
        return path.join(process.cwd(), "public", url.replace(/^\//, ""));
    }

    return path.join(process.cwd(), "public", url);
}

function runText(
    cmd: string,
    args: string[],
    cwd?: string,
    timeoutMs = 120_000
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
        execFile(
            cmd,
            args,
            {
                cwd,
                timeout: timeoutMs,
                maxBuffer: 1024 * 1024 * 20,
                env: process.env,
            },
            (error, stdout, stderr) => {
                resolve({
                    ok: !error,
                    stdout: String(stdout || ""),
                    stderr: String(stderr || error?.message || ""),
                });
            }
        );
    });
}


function runTextLive(
    cmd: string,
    args: string[],
    cwd?: string,
    timeoutMs = 120_000
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
        console.log("[RUN-LIVE] start", { cmd, args, cwd, timeoutMs });

        const child = spawn(cmd, args, {
            cwd,
            env: process.env,
            shell: false,
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";
        let finished = false;

        const timer = setTimeout(() => {
            if (finished) return;

            finished = true;
            console.log("[RUN-LIVE] timeout, killing process", { cmd, args });

            child.kill("SIGKILL");

            resolve({
                ok: false,
                stdout,
                stderr: stderr || `Command timeout after ${timeoutMs}ms`,
            });
        }, timeoutMs);

        child.stdout.on("data", (data) => {
            const text = data.toString();
            stdout += text;
            console.log("[RUN-LIVE][stdout]", text);
        });

        child.stderr.on("data", (data) => {
            const text = data.toString();
            stderr += text;
            console.log("[RUN-LIVE][stderr]", text);
        });

        child.on("error", (error) => {
            if (finished) return;

            finished = true;
            clearTimeout(timer);

            console.log("[RUN-LIVE] error", error.message);

            resolve({
                ok: false,
                stdout,
                stderr: stderr || error.message,
            });
        });

        child.on("close", (code) => {
            if (finished) return;

            finished = true;
            clearTimeout(timer);

            console.log("[RUN-LIVE] close", { code });

            resolve({
                ok: code === 0,
                stdout,
                stderr,
            });
        });
    });
}

function runBinary(
    cmd: string,
    args: string[],
    cwd?: string,
    timeoutMs = 30_000
): Promise<{ ok: boolean; stdout: Buffer; stderr: string }> {
    return new Promise((resolve) => {
        execFile(
            cmd,
            args,
            {
                cwd,
                timeout: timeoutMs,
                maxBuffer: 1024 * 1024 * 20,
                encoding: "buffer",
                env: process.env,
            },
            (error, stdout, stderr) => {
                resolve({
                    ok: !error,
                    stdout: Buffer.isBuffer(stdout) ? stdout : Buffer.from([]),
                    stderr: Buffer.isBuffer(stderr)
                        ? stderr.toString("utf8")
                        : String(stderr || error?.message || ""),
                });
            }
        );
    });
}

async function walk(dir: string): Promise<string[]> {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            results.push(...await walk(fullPath));
        } else {
            results.push(fullPath);
        }
    }

    return results;
}

async function findAndroidProjectRoot(tempDir: string) {
    const files = await walk(tempDir);

    const settings = files.find((file) => {
        const lower = file.replace(/\\/g, "/").toLowerCase();
        return lower.endsWith("/settings.gradle.kts") || lower.endsWith("/settings.gradle");
    });

    return settings ? path.dirname(settings) : null;
}

async function findDebugApk(projectRoot: string) {
    const files = await walk(projectRoot);

    return files.find((file) => {
        const lower = file.replace(/\\/g, "/").toLowerCase();
        return lower.endsWith(".apk") && lower.includes("/build/outputs/apk/debug/");
    }) || null;
}

async function readPackageName(projectRoot: string) {
    const candidates = [
        path.join(projectRoot, "app", "build.gradle.kts"),
        path.join(projectRoot, "app", "build.gradle"),
        path.join(projectRoot, "app", "src", "main", "AndroidManifest.xml"),
    ];

    for (const file of candidates) {
        if (!fs.existsSync(file)) continue;

        const text = await fsp.readFile(file, "utf8").catch(() => "");

        const applicationId =
            text.match(/applicationId\s*=\s*["']([^"']+)["']/)?.[1] ||
            text.match(/applicationId\s+["']([^"']+)["']/)?.[1];

        if (applicationId) return applicationId;
    }

    for (const file of candidates) {
        if (!fs.existsSync(file)) continue;

        const text = await fsp.readFile(file, "utf8").catch(() => "");

        const namespace =
            text.match(/namespace\s*=\s*["']([^"']+)["']/)?.[1] ||
            text.match(/namespace\s+["']([^"']+)["']/)?.[1];

        if (namespace) return namespace;

        const manifestPackage = text.match(/package\s*=\s*["']([^"']+)["']/)?.[1];
        if (manifestPackage) return manifestPackage;
    }

    return null;
}
// hàm kiê tra lệnh
async function commandExists(command: string) {
    const check = process.platform === "win32"
        ? await runText("where", [command], undefined, 10_000)
        : await runText("which", [command], undefined, 10_000);

    console.log("[RUNTIME-CMD] commandExists", {
        command,
        ok: check.ok,
        stdout: check.stdout.trim(),
        stderr: check.stderr.trim(),
    });

    return check.ok && check.stdout.trim().length > 0;
}

function findWindowsGradleExecutable() {
    if (process.platform !== "win32") return null;

    const candidates = [
        "C:\\ProgramData\\chocolatey\\bin\\gradle.exe",
        "C:\\ProgramData\\chocolatey\\lib\\gradle\\tools\\gradle\\bin\\gradle.bat",
        path.join(process.env.USERPROFILE || "", "scoop", "shims", "gradle.cmd"),
        path.join(process.env.USERPROFILE || "", "scoop", "apps", "gradle", "current", "bin", "gradle.bat"),
        "C:\\Gradle\\gradle-8.7\\bin\\gradle.bat",
        "C:\\Gradle\\gradle-8.9\\bin\\gradle.bat",
    ];

    return candidates.find((item) => item && fs.existsSync(item)) || null;
}
// hàm đọc phien bản android
async function detectAndroidGradlePluginVersion(projectRoot: string) {
    const candidates = [
        path.join(projectRoot, "build.gradle.kts"),
        path.join(projectRoot, "build.gradle"),
        path.join(projectRoot, "settings.gradle.kts"),
        path.join(projectRoot, "settings.gradle"),
    ];

    for (const file of candidates) {
        if (!fs.existsSync(file)) continue;

        const text = await fsp.readFile(file, "utf8").catch(() => "");

        const patterns = [
            /id\s*\(\s*["']com\.android\.application["']\s*\)\s*version\s*["']([^"']+)["']/,
            /id\s+["']com\.android\.application["']\s+version\s+["']([^"']+)["']/,
            /com\.android\.application["']?\s*version\s*["']([^"']+)["']/,
            /com\.android\.tools\.build:gradle:([^"'\s]+)/,
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match?.[1]) {
                return match[1];
            }
        }
    }

    return null;
}
// hàm chọn gradle version phù hợp
function pickGradleVersionForAgp(agpVersion: string | null) {
    if (!agpVersion) {
        return "8.7";
    }

    const majorMinor = agpVersion
        .split(".")
        .slice(0, 2)
        .join(".");

    const version = Number(majorMinor);

    if (Number.isNaN(version)) {
        return "8.7";
    }

    if (version >= 8.7) return "8.9";
    if (version >= 8.5) return "8.7";
    if (version >= 8.4) return "8.6";
    if (version >= 8.3) return "8.4";
    if (version >= 8.2) return "8.2";
    if (version >= 8.1) return "8.0";
    if (version >= 8.0) return "8.0";
    if (version >= 7.4) return "7.6";
    if (version >= 7.3) return "7.5";
    if (version >= 7.2) return "7.4.2";

    return "8.7";
}

// hàm tự sinh gradle wrapper
async function ensureGradleWrapper(projectRoot: string) {
    console.log("[RUNTIME-WRAPPER] enter", { projectRoot });
    console.log("[RUNTIME-WRAPPER] platform =", process.platform);
    console.log("[RUNTIME-WRAPPER] PATH =", process.env.PATH);

    const gradlew = path.join(projectRoot, "gradlew");
    const gradlewBat = path.join(projectRoot, "gradlew.bat");

    console.log("[RUNTIME-WRAPPER] wrapper files", {
        gradlew,
        gradlewExists: fs.existsSync(gradlew),
        gradlewBat,
        gradlewBatExists: fs.existsSync(gradlewBat),
    });

    if (process.platform === "win32" && fs.existsSync(gradlewBat)) {
        return {
            ok: true,
            generated: false,
            message: "Project đã có gradlew.bat.",
            cmd: "cmd.exe",
            argsPrefix: ["/c", gradlewBat],
        };
    }

    if (process.platform !== "win32" && fs.existsSync(gradlew)) {
        await fsp.chmod(gradlew, 0o755).catch(() => {});

        return {
            ok: true,
            generated: false,
            message: "Project đã có gradlew.",
            cmd: gradlew,
            argsPrefix: [] as string[],
        };
    }

    let systemGradleCmd = "gradle";

    console.log("[RUNTIME-WRAPPER] checking gradle command in PATH");
    const hasSystemGradle = await commandExists("gradle");

    if (!hasSystemGradle) {
        const fallbackGradle = findWindowsGradleExecutable();

        console.log("[RUNTIME-WRAPPER] fallbackGradle =", fallbackGradle);

        if (fallbackGradle) {
            systemGradleCmd = fallbackGradle;
        } else {
            return {
                ok: false,
                generated: false,
                message:
                    "Project không có Gradle Wrapper và máy runner chưa tìm thấy Gradle global trong PATH hoặc đường dẫn phổ biến. " +
                    "Hãy chạy gradle -v trong terminal đang chạy npm run dev, hoặc sửa code trỏ đúng đường dẫn gradle.exe/gradle.bat.",
                cmd: "",
                argsPrefix: [] as string[],
            };
        }
    }

    const agpVersion = await detectAndroidGradlePluginVersion(projectRoot);
    const gradleVersion = pickGradleVersionForAgp(agpVersion);

    console.log("[RUNTIME-WRAPPER] detected versions", {
        agpVersion,
        gradleVersion,
        systemGradleCmd,
    });

    console.log("[RUNTIME-WRAPPER] run gradle wrapper start");

    const wrapperResult = await runTextLive(
        systemGradleCmd,
        [
            "wrapper",
            "--gradle-version",
            gradleVersion,
            "--distribution-type",
            "bin",
            "--no-daemon",
        ],
        projectRoot,
        600_000
    );

    console.log("[RUNTIME-WRAPPER] run gradle wrapper done", {
        ok: wrapperResult.ok,
        stdoutTail: wrapperResult.stdout.slice(-1000),
        stderrTail: wrapperResult.stderr.slice(-1000),
    });

    if (!wrapperResult.ok) {
        return {
            ok: false,
            generated: false,
            message:
                "Máy runner có Gradle global nhưng sinh Gradle Wrapper thất bại.\n\n" +
                `${wrapperResult.stdout}\n${wrapperResult.stderr}`,
            cmd: "",
            argsPrefix: [] as string[],
        };
    }

    if (process.platform === "win32" && fs.existsSync(gradlewBat)) {
        return {
            ok: true,
            generated: true,
            message: `Đã tự sinh gradlew.bat bằng Gradle ${gradleVersion}.`,
            cmd: "cmd.exe",
            argsPrefix: ["/c", gradlewBat],
        };
    }

    if (fs.existsSync(gradlew)) {
        await fsp.chmod(gradlew, 0o755).catch(() => {});

        return {
            ok: true,
            generated: true,
            message: `Đã tự sinh gradlew bằng Gradle ${gradleVersion}.`,
            cmd: gradlew,
            argsPrefix: [] as string[],
        };
    }

    return {
        ok: false,
        generated: false,
        message: "Đã chạy gradle wrapper nhưng không thấy gradlew/gradlew.bat được tạo.",
        cmd: "",
        argsPrefix: [] as string[],
    };
}

function findBaselineScreenshot(attachments?: AssignmentAttachment[]) {
    const list = Array.isArray(attachments) ? attachments : [];

    const image = list.find((item) => {
        const kind = String(item.kind || "").toLowerCase();
        const mime = String(item.mimeType || "").toLowerCase();
        const name = String(item.originalName || "").toLowerCase();

        return (
            kind === "template" &&
            (
                mime.startsWith("image/") ||
                name.endsWith(".png") ||
                name.endsWith(".jpg") ||
                name.endsWith(".jpeg") ||
                name.endsWith(".webp")
            )
        );
    });

    return image?.url || null;
}
function resolveAdbCommand() {
    const candidates = [
        process.env.ADB_PATH,
        process.env.ANDROID_HOME
            ? path.join(process.env.ANDROID_HOME, "platform-tools", "adb.exe")
            : null,
        process.env.ANDROID_SDK_ROOT
            ? path.join(process.env.ANDROID_SDK_ROOT, "platform-tools", "adb.exe")
            : null,
        process.env.LOCALAPPDATA
            ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk", "platform-tools", "adb.exe")
            : null,
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return "adb";
}
export async function runAndroidProjectRuntime(input: {
    sourceArchive: SourceArchive;
    assignmentAttachments?: AssignmentAttachment[];
    adbSerial?: string;
}): Promise<RunnerReportInput> {
    console.log("[RUNTIME-STEP] 01 enter runAndroidProjectRuntime");
    console.time("[RUNTIME-TIME] total");

    const checks: RunnerCheck[] = [];
    const logs: Array<{ label: string; content: string }> = [];

    console.log("[RUNTIME-STEP] 02 resolve archive path");
    const archivePath = archiveToAbsolutePath(input.sourceArchive);
    console.log("[RUNTIME-STEP] 03 archivePath =", archivePath);
    console.log("[RUNTIME-STEP] 04 archive exists =", archivePath ? fs.existsSync(archivePath) : false);

    if (!archivePath || !fs.existsSync(archivePath)) {
        return {
            runtimeStatus: "project_invalid",
            buildPassed: false,
            testPassed: false,
            checks: [
                makeCheck({
                    code: "archive_missing",
                    label: "File ZIP bài nộp",
                    status: "failed",
                    message: "Không tìm thấy file ZIP bài nộp.",
                }),
            ],
            rawSummary: "Không chạy được vì thiếu file ZIP bài nộp.",
        };
    }

    const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "android-runtime-"));
    const outputDir = path.join(process.cwd(), "public", "uploads", "runner-artifacts");
    await fsp.mkdir(outputDir, { recursive: true });

    try {
        console.log("[RUNTIME-STEP] 05 start unzip", { archivePath, tempDir });
        const zip = new AdmZip(archivePath);
        zip.extractAllTo(tempDir, true);
        console.log("[RUNTIME-STEP] 06 unzip done");

        console.log("[RUNTIME-STEP] 07 find Android project root");
        const projectRoot = await findAndroidProjectRoot(tempDir);
        console.log("[RUNTIME-STEP] 08 projectRoot =", projectRoot);

        if (!projectRoot) {
            return {
                runtimeStatus: "project_invalid",
                buildPassed: false,
                testPassed: false,
                checks: [
                    makeCheck({
                        code: "android_project_root",
                        label: "Project Android hợp lệ",
                        status: "failed",
                        message: "Không tìm thấy settings.gradle hoặc settings.gradle.kts. Có thể sinh viên nén sai thư mục.",
                    }),
                ],
                rawSummary: "Bài không phải project Android Studio hợp lệ hoặc nén sai cấp thư mục.",
            };
        }

        checks.push(
            makeCheck({
                code: "android_project_root",
                label: "Project Android hợp lệ",
                status: "passed",
                message: "Tìm thấy project Android Studio.",
                evidence: [projectRoot],
            })
        );

        console.log("[RUNTIME-STEP] 09 ensure Gradle wrapper start");
        const wrapper = await ensureGradleWrapper(projectRoot);
        console.log("[RUNTIME-STEP] 10 ensure Gradle wrapper result =", {
            ok: wrapper.ok,
            generated: wrapper.generated,
            message: wrapper.message,
            cmd: wrapper.cmd,
            argsPrefix: wrapper.argsPrefix,
        });

        if (!wrapper.ok) {
            checks.push(
                makeCheck({
                    code: "gradle_wrapper",
                    label: "Gradle Wrapper",
                    status: "failed",
                    message: wrapper.message,
                })
            );

            logs.push({
                label: "Gradle wrapper log",
                content: wrapper.message,
            });

            return {
                runtimeStatus: "build_failed",
                buildPassed: false,
                testPassed: false,
                visualSimilarity: null,
                checks,
                logs,
                rawSummary:
                    "Bài không chạy được vì thiếu Gradle Wrapper và máy runner chưa tự sinh được wrapper.",
            };
        }

        checks.push(
            makeCheck({
                code: "gradle_wrapper",
                label: "Gradle Wrapper",
                status: "passed",
                message: wrapper.message,
            })
        );

        console.log("[RUNTIME-STEP] 11 build APK start", {
            cmd: wrapper.cmd,
            args: [
                ...wrapper.argsPrefix,
                ":app:assembleDebug",
                "--no-daemon",
                "--stacktrace",
            ],
            projectRoot,
        });

        const build = await runTextLive(
            wrapper.cmd,
            [
                ...wrapper.argsPrefix,
                ":app:assembleDebug",
                "--no-daemon",
                "--stacktrace",
            ],
            projectRoot,
            900_000
        );

        console.log("[RUNTIME-STEP] 12 build APK done", {
            ok: build.ok,
            stdoutTail: build.stdout.slice(-1000),
            stderrTail: build.stderr.slice(-1000),
        });

        logs.push({
            label: "Gradle build log",
            content: `${build.stdout}\n${build.stderr}`.slice(-12000),
        });

        if (!build.ok) {
            checks.push(
                makeCheck({
                    code: "gradle_build",
                    label: "Build APK bằng Gradle",
                    status: "failed",
                    message: "Bài không build được. Giáo viên xem Gradle build log để biết lỗi.",
                })
            );

            return {
                runtimeStatus: "build_failed",
                buildPassed: false,
                testPassed: false,
                checks,
                logs,
                rawSummary: "Bài không chạy được vì lỗi build Gradle.",
            };
        }

        checks.push(
            makeCheck({
                code: "gradle_build",
                label: "Build APK bằng Gradle",
                status: "passed",
                message: "Build APK thành công.",
            })
        );

        console.log("[RUNTIME-STEP] 13 find debug APK");
        const apkPath = await findDebugApk(projectRoot);
        console.log("[RUNTIME-STEP] 14 apkPath =", apkPath);

        if (!apkPath) {
            return {
                runtimeStatus: "apk_missing",
                buildPassed: false,
                testPassed: false,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "debug_apk",
                        label: "File APK debug",
                        status: "failed",
                        message: "Build xong nhưng không tìm thấy file APK debug.",
                    }),
                ],
                logs,
                rawSummary: "Không tìm thấy APK sau khi build.",
            };
        }

        console.log("[RUNTIME-STEP] 15 read package name");
        const packageName = await readPackageName(projectRoot);
        console.log("[RUNTIME-STEP] 16 packageName =", packageName);

        if (!packageName) {
            return {
                runtimeStatus: "launch_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "package_name",
                        label: "Package name",
                        status: "failed",
                        message: "Không đọc được applicationId/packageName nên không mở được app.",
                    }),
                ],
                logs,
                rawSummary: "Build được APK nhưng không xác định được package name.",
            };
        }

        const adbCmd = resolveAdbCommand();
        const adbBase = input.adbSerial ? ["-s", input.adbSerial] : [];
        console.log("[RUNTIME-STEP] adbCmd =", adbCmd);
        console.log("[RUNTIME-STEP] adbCmd =", adbCmd);

        const devices = await runText(adbCmd, ["devices"], undefined, 30_000);

        logs.push({
            label: "ADB devices",
            content: `${devices.stdout}\n${devices.stderr}`,
        });

        if (!devices.ok) {
            return {
                runtimeStatus: "install_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                packageName,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "adb_command",
                        label: "ADB command",
                        status: "failed",
                        message:
                            "Build APK thành công nhưng máy runner không tìm thấy adb. Cần cài Android SDK Platform-Tools hoặc cấu hình ADB_PATH.",
                    }),
                ],
                logs,
                rawSummary: "Build APK thành công nhưng chưa chạy được vì không tìm thấy adb.",
            };
        }

        if (!devices.stdout.includes("\tdevice") && !devices.stdout.includes(" device")) {
            return {
                runtimeStatus: "install_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                packageName,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "adb_device",
                        label: "Emulator/device",
                        status: "failed",
                        message:
                            "Build APK thành công nhưng chưa có emulator/device Android đang chạy.",
                    }),
                ],
                logs,
                rawSummary: "Build APK thành công nhưng chưa có emulator/device để cài app.",
            };
        }

        checks.push(
            makeCheck({
                code: "adb_device",
                label: "Emulator/device",
                status: "passed",
                message: "ADB thấy emulator/device đang chạy.",
            })
        );

        console.log("[RUNTIME-STEP] 19 adb install start");
        const install = await runTextLive(
            adbCmd,
            [...adbBase, "install", "-r", apkPath],
            undefined,
            180_000
        );
        console.log("[RUNTIME-STEP] 20 adb install done", {
            ok: install.ok,
            stdoutTail: install.stdout.slice(-1000),
            stderrTail: install.stderr.slice(-1000),
        });

        logs.push({
            label: "ADB install log",
            content: `${install.stdout}\n${install.stderr}`.slice(-12000),
        });

        if (!install.ok) {
            return {
                runtimeStatus: "install_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                packageName,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "adb_install",
                        label: "Cài APK vào emulator",
                        status: "failed",
                        message: "APK build được nhưng không cài được vào emulator.",
                    }),
                ],
                logs,
                rawSummary: "APK không cài được vào emulator.",
            };
        }

        checks.push(
            makeCheck({
                code: "adb_install",
                label: "Cài APK vào emulator",
                status: "passed",
                message: "Cài APK thành công.",
            })
        );

        console.log("[RUNTIME-STEP] 21 app launch start");
        const launch = await runTextLive(
            adbCmd,
            [...adbBase, "shell", "monkey", "-p", packageName, "-c", "android.intent.category.LAUNCHER", "1"],
            undefined,
            30_000
        );
        console.log("[RUNTIME-STEP] 22 app launch done", {
            ok: launch.ok,
            stdoutTail: launch.stdout.slice(-1000),
            stderrTail: launch.stderr.slice(-1000),
        });

        logs.push({
            label: "ADB launch log",
            content: `${launch.stdout}\n${launch.stderr}`.slice(-12000),
        });

        if (!launch.ok) {
            return {
                runtimeStatus: "launch_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                packageName,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "app_launch",
                        label: "Mở app",
                        status: "failed",
                        message: "Cài được APK nhưng không mở được app.",
                    }),
                ],
                logs,
                rawSummary: "App không mở được sau khi cài.",
            };
        }

        checks.push(
            makeCheck({
                code: "app_launch",
                label: "Mở app",
                status: "passed",
                message: "Mở app thành công.",
            })
        );

        await new Promise((resolve) => setTimeout(resolve, 7000));

        const safePackage = packageName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const screenshotName = `${Date.now()}-${safePackage}-home.png`;
        const screenshotPath = path.join(outputDir, screenshotName);
        const screenshotUrl = `/uploads/runner-artifacts/${screenshotName}`;

        console.log("[RUNTIME-STEP] 23 screenshot start");
        const screencap = await runBinary(
            adbCmd,
            [...adbBase, "exec-out", "screencap", "-p"],
            undefined,
            30_000
        );
        console.log("[RUNTIME-STEP] 24 screenshot done", {
            ok: screencap.ok,
            size: screencap.stdout.length,
            stderr: screencap.stderr,
        });

        if (!screencap.ok || screencap.stdout.length === 0) {
            return {
                runtimeStatus: "screenshot_failed",
                buildPassed: true,
                testPassed: false,
                apkPath,
                packageName,
                checks: [
                    ...checks,
                    makeCheck({
                        code: "screenshot",
                        label: "Chụp giao diện thật",
                        status: "failed",
                        message: "App mở được nhưng không chụp được screenshot.",
                    }),
                ],
                logs,
                rawSummary: "Không chụp được screenshot từ emulator.",
            };
        }

        await fsp.writeFile(screenshotPath, screencap.stdout);

        checks.push(
            makeCheck({
                code: "screenshot",
                label: "Chụp giao diện thật",
                status: "passed",
                message: "Đã chụp được giao diện thật từ emulator.",
                evidence: [screenshotUrl],
            })
        );

        const baselineUrl = findBaselineScreenshot(input.assignmentAttachments);

        const visualComparison = await compareStudentScreenshotWithBaseline({
            studentScreenshotPath: screenshotPath,
            studentScreenshotUrl: screenshotUrl,
            baselineUrl,
            outputDir,
        });

        if (baselineUrl && visualComparison) {
            checks.push(
                makeCheck({
                    code: "visual_compare",
                    label: "So sánh với giao diện chuẩn",
                    status: visualComparison.similarity >= 70 ? "passed" : "warning",
                    message: `Độ giống giao diện: ${visualComparison.similarity}%.`,
                    evidence: [
                        visualComparison.baselineUrl || "",
                        visualComparison.studentUrl || "",
                        visualComparison.diffUrl || "",
                    ].filter(Boolean),
                })
            );
        } else if (!baselineUrl) {
            checks.push(
                makeCheck({
                    code: "visual_compare",
                    label: "So sánh với giao diện chuẩn",
                    status: "not_run",
                    message: "Giáo viên chưa upload ảnh giao diện chuẩn loại template nên chưa so sánh được.",
                })
            );
        }

        return {
            runtimeStatus: "passed",
            buildPassed: true,
            testPassed: true,
            apkPath,
            packageName,
            checks,
            logs,
            visualSimilarity: visualComparison?.similarity ?? null,
            visualComparison,
            screenshots: [
                {
                    label: "Giao diện thật của sinh viên",
                    path: screenshotPath,
                    url: screenshotUrl,
                    mimeType: "image/png",
                },
            ],
            artifacts: visualComparison?.diffUrl
                ? [
                    {
                        label: "Ảnh diff so với giao diện chuẩn",
                        url: visualComparison.diffUrl,
                        mimeType: "image/png",
                    },
                ]
                : [],
            rawSummary: visualComparison
                ? `Bài chạy được. Độ giống giao diện với ảnh chuẩn: ${visualComparison.similarity}%.`
                : "Bài chạy được và đã sinh screenshot thật, nhưng chưa có ảnh chuẩn để so sánh.",
        };
    } catch (error) {
        return {
            runtimeStatus: "not_run",
            buildPassed: false,
            testPassed: false,
            checks: [
                makeCheck({
                    code: "runtime_exception",
                    label: "Runtime runner exception",
                    status: "failed",
                    message: error instanceof Error ? error.message : "Lỗi runtime không xác định.",
                }),
            ],
            logs,
            rawSummary: error instanceof Error ? error.message : "Runtime runner exception.",
        };
    } finally {
        console.log("[RUNTIME-STEP] cleanup tempDir", tempDir);
        await fsp.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        console.timeEnd("[RUNTIME-TIME] total");
    }
}
