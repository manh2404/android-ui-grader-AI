import fs from "fs";
import path from "path";
import { promises as fsp } from "fs";
import sharp from "sharp";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import type { VisualComparisonResult } from "@/lib/grading-contract";

function publicUrlToAbsolutePath(url?: string | null) {
    const value = String(url || "").trim();
    if (!value) return null;

    if (value.startsWith("/")) {
        return path.join(process.cwd(), "public", value.replace(/^\//, ""));
    }

    return path.join(process.cwd(), "public", value);
}

async function normalizePng(inputPath: string, outputPath: string, width = 390, height = 844) {
    await sharp(inputPath)
        .resize(width, height, {
            fit: "contain",
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 1,
            },
        })
        .png()
        .toFile(outputPath);
}

export async function compareStudentScreenshotWithBaseline(input: {
    studentScreenshotPath: string;
    studentScreenshotUrl?: string;
    baselineUrl?: string | null;
    outputDir: string;
}): Promise<VisualComparisonResult | null> {
    const baselinePath = publicUrlToAbsolutePath(input.baselineUrl);

    if (!baselinePath || !fs.existsSync(baselinePath)) {
        return null;
    }

    await fsp.mkdir(input.outputDir, { recursive: true });

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const normalizedStudentPath = path.join(input.outputDir, `${id}-student-normalized.png`);
    const normalizedBaselinePath = path.join(input.outputDir, `${id}-baseline-normalized.png`);
    const diffPath = path.join(input.outputDir, `${id}-diff.png`);

    const width = 390;
    const height = 844;

    await normalizePng(input.studentScreenshotPath, normalizedStudentPath, width, height);
    await normalizePng(baselinePath, normalizedBaselinePath, width, height);

    const studentPng = PNG.sync.read(await fsp.readFile(normalizedStudentPath));
    const baselinePng = PNG.sync.read(await fsp.readFile(normalizedBaselinePath));

    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(
        baselinePng.data,
        studentPng.data,
        diff.data,
        width,
        height,
        {
            threshold: 0.15,
            includeAA: false,
        }
    );

    await fsp.writeFile(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const diffPercent = (diffPixels / totalPixels) * 100;
    const similarity = Math.max(0, 100 - diffPercent);

    const diffFileName = path.basename(diffPath);

    return {
        similarity: Math.round(similarity * 100) / 100,
        diffPercent: Math.round(diffPercent * 100) / 100,
        baselineUrl: input.baselineUrl || "",
        studentUrl: input.studentScreenshotUrl || "",
        diffUrl: `/uploads/runner-artifacts/${diffFileName}`,
        message:
            similarity >= 85
                ? "Giao diện sinh viên khá giống ảnh chuẩn."
                : similarity >= 65
                    ? "Giao diện sinh viên giống một phần ảnh chuẩn, giáo viên nên xem ảnh diff."
                    : "Giao diện sinh viên khác nhiều so với ảnh chuẩn.",
    };
}
