"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Classroom = {
    _id: string;
    name: string;
    code: string;
    semester?: string;
    academicYear?: string;
};

type CurrentUser = {
    _id?: string;
    role?: "admin" | "teacher" | "User";
    name?: string;
};

type ApiResult<T> = {
    success: boolean;
    message?: string;
    data?: T;
    user?: T;
};

type FormState = {
    title: string;
    classroomId: string;
    language: string;
    description: string;
    rubricText: string;
    startAt: string;
    dueAt: string;
    allowLateSubmit: boolean;
    allowResubmit: boolean;
    latePenaltyPercent: string;
    maxScore: string;
};

const LANGUAGES = [
    { value: "cpp", label: "C++ (G++ 11)" },
    { value: "java", label: "Java 17" },
    { value: "python", label: "Python 3.10" },
    { value: "javascript", label: "JavaScript (Node.js)" },
    { value: "typescript", label: "TypeScript" },
];

function toDateTimeLocal(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function FileListCard({
                          title,
                          files,
                          onChange,
                          multiple = true,
                      }: {
    title: string;
    files: File[];
    onChange: (files: File[]) => void;
    multiple?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Chọn file
                    <input
                        type="file"
                        multiple={multiple}
                        className="hidden"
                        onChange={(event) => {
                            const nextFiles = Array.from(event.target.files || []);
                            onChange(nextFiles);
                            event.currentTarget.value = "";
                        }}
                    />
                </label>
            </div>

            {files.length ? (
                <div className="space-y-3">
                    {files.map((file) => (
                        <div
                            key={`${file.name}-${file.size}`}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-slate-800">{file.name}</p>
                                <p className="text-xs text-slate-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Chưa có file nào được chọn.
                </div>
            )}
        </div>
    );
}

export default function CreateAssignmentPage() {
    const router = useRouter();
    const now = useMemo(() => new Date(), []);
    const defaultStartAt = useMemo(() => toDateTimeLocal(now), [now]);
    const defaultDueAt = useMemo(() => {
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        return toDateTimeLocal(nextWeek);
    }, [now]);

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState<FormState>({
        title: "",
        classroomId: "",
        language: "cpp",
        description: "",
        rubricText: "",
        startAt: defaultStartAt,
        dueAt: defaultDueAt,
        allowLateSubmit: false,
        allowResubmit: true,
        latePenaltyPercent: "10",
        maxScore: "10",
    });

    const [resourceFiles, setResourceFiles] = useState<File[]>([]);
    const [rubricFiles, setRubricFiles] = useState<File[]>([]);
    const [templateFiles, setTemplateFiles] = useState<File[]>([]);

    const canManageAssignments =
        currentUser?.role === "teacher" || currentUser?.role === "admin";

    useEffect(() => {
        const bootstrap = async () => {
            try {
                setLoading(true);
                setError("");

                const [userRes, classesRes] = await Promise.all([
                    fetch("/api/auth/me", { cache: "no-store" }),
                    fetch("/api/classes", { cache: "no-store" }),
                ]);

                const userJson: ApiResult<CurrentUser> = await userRes.json();
                const classesJson: ApiResult<Classroom[]> = await classesRes.json();

                if (userRes.ok) {
                    setCurrentUser((userJson.user as CurrentUser) || null);
                }

                if (!classesRes.ok) {
                    throw new Error(classesJson.message || "Không tải được danh sách lớp học");
                }

                const items = classesJson.data || [];
                setClasses(items);
                if (items.length) {
                    setForm((prev) => ({
                        ...prev,
                        classroomId: prev.classroomId || items[0]._id,
                    }));
                }
            } catch (fetchError) {
                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : "Không thể khởi tạo dữ liệu tạo bài tập"
                );
            } finally {
                setLoading(false);
            }
        };

        void bootstrap();
    }, []);

    const selectedClass = useMemo(
        () => classes.find((item) => item._id === form.classroomId) || null,
        [classes, form.classroomId]
    );

    const handleSubmit = async (status: "draft" | "published") => {
        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const body = new FormData();
            const parsedMaxScore = Number(form.maxScore || "10");

            const rubric = [
                {
                    code: "overall",
                    title: "Chấm tổng thể",
                    description: form.rubricText.trim() || "Chấm tổng thể theo yêu cầu bài tập",
                    maxPoints: Number.isFinite(parsedMaxScore) && parsedMaxScore > 0 ? parsedMaxScore : 10,
                    gradingSource: "manual",
                    requiredEvidence: [],
                    passThreshold: null,
                    notes: "",
                },
            ];

            const submissionPolicy = {
                acceptedFileTypes: ["zip"],
                maxFileSizeMb: 100,
                maxAttempts: form.allowResubmit ? 999999 : 1,
                requireZip: true,
                allowGithubUrl: true,
                allowScreenshots: true,
            };

            body.set("title", form.title);
            body.set("classroomId", form.classroomId);
            body.set("language", form.language);
            body.set("description", form.description);
            body.set("rubricText", form.rubricText);
            body.set("rubric", JSON.stringify(rubric));
            body.set("submissionPolicy", JSON.stringify(submissionPolicy));
            body.set("startAt", new Date(form.startAt).toISOString());
            body.set("dueAt", new Date(form.dueAt).toISOString());
            body.set("allowLateSubmit", String(form.allowLateSubmit));
            body.set("allowResubmit", String(form.allowResubmit));
            body.set("latePenaltyPercent", form.latePenaltyPercent || "0");
            body.set("maxScore", form.maxScore || "10");
            body.set("status", status);

            for (const file of resourceFiles) {
                body.append("resourceFiles", file);
            }

            for (const file of rubricFiles) {
                body.append("rubricFiles", file);
            }

            for (const file of templateFiles) {
                body.append("templateFiles", file);
            }

            const res = await fetch("/api/assignments", {
                method: "POST",
                body,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Tạo bài tập thất bại");
            }

            setSuccess(
                status === "draft"
                    ? "Đã lưu bài tập ở trạng thái bản nháp."
                    : "Đã tạo và công bố bài tập thành công."
            );

            setTimeout(() => {
                router.push("/ui/assignment_list");
                router.refresh();
            }, 1200);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Không thể tạo bài tập"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
                Đang tải dữ liệu tạo bài tập...
            </div>
        );
    }

    if (!canManageAssignments) {
        return (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-700 shadow-sm">
                Bạn cần đăng nhập bằng tài khoản giảng viên hoặc quản trị để tạo bài tập.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        Tạo bài tập
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Tạo bài tập theo từng lớp, cấu hình deadline, rubric, file đính kèm và
                        quyền nộp lại.
                    </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <span className="font-semibold text-slate-900">Lớp đang chọn:</span>{" "}
                    {selectedClass
                        ? `${selectedClass.name} (${selectedClass.code})`
                        : "Chưa chọn lớp"}
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <div className="space-y-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-bold text-slate-900">Thông tin cơ bản</h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tên bài tập
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, title: event.target.value }))
                                    }
                                    placeholder="Ví dụ: Lab 03 - Quản lý danh bạ"
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Lớp học
                                </label>
                                <select
                                    value={form.classroomId}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            classroomId: event.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                >
                                    {classes.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} ({item.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ngôn ngữ chấm
                                </label>
                                <select
                                    value={form.language}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, language: event.target.value }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                >
                                    {LANGUAGES.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Mô tả đề bài
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Mô tả yêu cầu, cấu trúc project, đầu vào đầu ra, quy ước đặt tên file..."
                                    className="min-h-[180px] w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Rubric / thang điểm mô tả
                                </label>
                                <textarea
                                    value={form.rubricText}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            rubricText: event.target.value,
                                        }))
                                    }
                                    placeholder="Ví dụ: giao diện 2 điểm, xử lý dữ liệu 4 điểm, validation 2 điểm, clean code 2 điểm..."
                                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>
                        </div>
                    </section>

                    <FileListCard
                        title="File đính kèm đề bài"
                        files={resourceFiles}
                        onChange={setResourceFiles}
                    />

                    <FileListCard
                        title="File rubric / thang điểm"
                        files={rubricFiles}
                        onChange={setRubricFiles}
                    />

                    <FileListCard
                        title="Template / test case / starter code"
                        files={templateFiles}
                        onChange={setTemplateFiles}
                    />
                </div>

                <div className="space-y-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-bold text-slate-900">Thiết lập nộp bài</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.startAt}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, startAt: event.target.value }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Hạn nộp
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.dueAt}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, dueAt: event.target.value }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tổng điểm tối đa
                                </label>
                                <input
                                    type="number"
                                    min="0.5"
                                    step="0.5"
                                    value={form.maxScore}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, maxScore: event.target.value }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phạt nộp trễ (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.latePenaltyPercent}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            latePenaltyPercent: event.target.value,
                                        }))
                                    }
                                    disabled={!form.allowLateSubmit}
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-100"
                                />
                            </div>

                            <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={form.allowLateSubmit}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            allowLateSubmit: event.target.checked,
                                        }))
                                    }
                                    className="mt-1"
                                />
                                <span>
                                    <span className="block font-semibold text-slate-900">
                                        Cho phép nộp trễ
                                    </span>
                                    Sinh viên vẫn có thể nộp sau deadline và hệ thống tự gắn trạng thái
                                    nộp trễ.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={form.allowResubmit}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            allowResubmit: event.target.checked,
                                        }))
                                    }
                                    className="mt-1"
                                />
                                <span>
                                    <span className="block font-semibold text-slate-900">
                                        Cho phép nộp lại
                                    </span>
                                    Khi bật, sinh viên có thể upload phiên bản mới nếu đã nộp trước đó.
                                </span>
                            </label>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Tóm tắt</h2>

                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-center justify-between gap-3">
                                <span>Tên bài tập</span>
                                <span className="font-medium text-slate-900">
                                    {form.title || "Chưa nhập"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Số file đính kèm</span>
                                <span className="font-medium text-slate-900">
                                    {resourceFiles.length + rubricFiles.length + templateFiles.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Nộp lại</span>
                                <span className="font-medium text-slate-900">
                                    {form.allowResubmit ? "Cho phép" : "Không"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Nộp trễ</span>
                                <span className="font-medium text-slate-900">
                                    {form.allowLateSubmit ? "Cho phép" : "Không"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => void handleSubmit("published")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                                {submitting ? "Đang xử lý..." : "Tạo và công bố bài tập"}
                            </button>

                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => void handleSubmit("draft")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span className="material-symbols-outlined text-[18px]">draft</span>
                                Lưu nháp
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}