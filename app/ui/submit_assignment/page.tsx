"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AssignmentAttachment = {
    kind: string;
    url: string;
    originalName: string;
};

type LatestSubmission = {
    _id: string;
    attemptNo: number;
    status: "draft" | "submitted" | "late";
    submittedAt?: string;
    repositoryUrl?: string;
    note?: string;
    files: Array<{
        url: string;
        originalName: string;
    }>;
};

type AssignmentItem = {
    _id: string;
    title: string;
    description: string;
    language: string;
    dueAt?: string;
    startAt?: string;
    allowLateSubmit: boolean;
    allowResubmit: boolean;
    latePenaltyPercent: number;
    maxScore: number;
    rubricText?: string;
    displayStatus: "draft" | "published" | "closed";
    classroom: {
        _id: string;
        name: string;
        code: string;
    } | null;
    attachments: AssignmentAttachment[];
    latestSubmission: LatestSubmission | null;
};

type ApiResult<T> = {
    success: boolean;
    message?: string;
    data?: T;
};

function formatDateTime(value?: string) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatTimeRemaining(value?: string) {
    if (!value) return "Không xác định";
    const diffMs = new Date(value).getTime() - Date.now();
    if (diffMs <= 0) return "Đã quá hạn";

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days} ngày ${hours} giờ`;
}

function getSubmissionBadge(status?: LatestSubmission["status"]) {
    if (status === "late") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (status === "submitted") {
        return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "draft") {
        return "border-slate-200 bg-slate-100 text-slate-700";
    }

    return "border-blue-200 bg-blue-50 text-blue-700";
}

function getSubmissionLabel(status?: LatestSubmission["status"]) {
    if (status === "late") return "Đã nộp trễ";
    if (status === "submitted") return "Đã nộp";
    if (status === "draft") return "Đã lưu nháp";
    return "Chưa nộp";
}

function MarkdownBlock({
                           content,
                           variant = "default",
                       }: {
    content?: string;
    variant?: "default" | "rubric";
}) {
    if (!content?.trim()) {
        return <p className="text-sm text-slate-500">Chưa có nội dung.</p>;
    }

    const tableBorder =
        variant === "rubric" ? "border-orange-200" : "border-slate-200";
    const tableHead =
        variant === "rubric" ? "bg-orange-100/70 text-orange-900" : "bg-slate-100 text-slate-900";

    return (
        <div
            className={[
                "max-w-none break-words text-sm leading-7 text-slate-700",
                "[&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900",
                "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900",
                "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900",
                "[&_p]:mb-3 [&_p]:whitespace-pre-wrap",
                "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6",
                "[&_li]:mb-1 [&_li]:break-words",
                "[&_strong]:font-semibold [&_strong]:text-slate-900",
                "[&_code]:break-words [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1.5 [&_code]:py-0.5",
                "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100",
                "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
            ].join(" ")}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <div className={`my-4 overflow-x-auto rounded-xl border ${tableBorder}`}>
                            <table className="min-w-full border-collapse text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className={tableHead}>{children}</thead>,
                    th: ({ children }) => (
                        <th className={`border px-3 py-2 text-left font-semibold ${tableBorder}`}>
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className={`border px-3 py-2 align-top ${tableBorder}`}>
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default function SubmitAssignmentPage() {
    const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("/api/assignments/available", {
                cache: "no-store",
            });
            const result: ApiResult<AssignmentItem[]> = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Không tải được danh sách bài tập");
            }

            const items = result.data || [];
            setAssignments(items);

            if (items.length) {
                setSelectedId((prev) => prev || items[0]._id);
            }
        } catch (fetchError) {
            setError(
                fetchError instanceof Error
                    ? fetchError.message
                    : "Không tải được danh sách bài tập"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchAssignments();
    }, []);

    const selectedAssignment = useMemo(
        () => assignments.find((item) => item._id === selectedId) || null,
        [assignments, selectedId]
    );

    useEffect(() => {
        if (!selectedAssignment) {
            setRepositoryUrl("");
            setNote("");
            return;
        }

        setRepositoryUrl(selectedAssignment.latestSubmission?.repositoryUrl || "");
        setNote(selectedAssignment.latestSubmission?.note || "");
        setFiles([]);
    }, [selectedAssignment]);

    const canSubmit = useMemo(() => {
        if (!selectedAssignment) return false;
        if (selectedAssignment.displayStatus === "closed") return false;
        if (
            selectedAssignment.latestSubmission &&
            selectedAssignment.latestSubmission.status !== "draft" &&
            !selectedAssignment.allowResubmit
        ) {
            return false;
        }

        if (
            new Date(String(selectedAssignment.dueAt)).getTime() < Date.now() &&
            !selectedAssignment.allowLateSubmit
        ) {
            return false;
        }

        return true;
    }, [selectedAssignment]);

    const removeSelectedFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (action: "draft" | "submit") => {
        if (!selectedAssignment) return;

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.set("assignmentId", selectedAssignment._id);
            formData.set("repositoryUrl", repositoryUrl);
            formData.set("note", note);
            formData.set("action", action);

            for (const file of files) {
                formData.append("submissionFiles", file);
            }

            const res = await fetch("/api/submissions", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Nộp bài thất bại");
            }

            setSuccess(
                action === "draft"
                    ? "Đã lưu nháp bài nộp của bạn."
                    : "Nộp bài thành công. Danh sách đã được cập nhật."
            );

            setFiles([]);
            await fetchAssignments();
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Không thể nộp bài"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Nộp bài
                </h1>
                <p className="mt-1 text-slate-500">
                    Upload file, xem deadline, theo dõi trạng thái đã nộp hoặc trễ hạn và nộp lại
                    nếu bài tập cho phép.
                </p>
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
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Chọn bài tập
                            </label>
                            <select
                                value={selectedId}
                                onChange={(event) => setSelectedId(event.target.value)}
                                disabled={loading || !assignments.length}
                                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-100"
                            >
                                {assignments.length ? (
                                    assignments.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.title} {item.classroom ? `- ${item.classroom.code}` : ""}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Không có bài tập khả dụng</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Trạng thái hiện tại
                            </label>
                            <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                                <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getSubmissionBadge(
                                        selectedAssignment?.latestSubmission?.status
                                    )}`}
                                >
                                    {getSubmissionLabel(selectedAssignment?.latestSubmission?.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">
                            Đang tải dữ liệu bài tập...
                        </div>
                    ) : selectedAssignment ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {selectedAssignment.title}
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    {selectedAssignment.classroom
                                        ? `${selectedAssignment.classroom.name} (${selectedAssignment.classroom.code})`
                                        : "Chưa có thông tin lớp học"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p className="mb-3 text-sm font-semibold text-slate-900">
                                    Mô tả bài tập
                                </p>
                                <MarkdownBlock content={selectedAssignment.description} />
                            </div>

                            {selectedAssignment.rubricText ? (
                                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                    <p className="mb-3 font-semibold text-orange-700">
                                        Rubric / thang điểm
                                    </p>
                                    <MarkdownBlock
                                        content={selectedAssignment.rubricText}
                                        variant="rubric"
                                    />
                                </div>
                            ) : null}

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700">
                                    File bài nộp
                                </label>
                                <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition hover:border-orange-300 hover:bg-orange-50">
                                    <span className="material-symbols-outlined mb-2 block text-4xl text-orange-500">
                                        cloud_upload
                                    </span>
                                    Nhấn để chọn file hoặc kéo thả vào đây
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(event) => {
                                            setFiles(Array.from(event.target.files || []));
                                            event.currentTarget.value = "";
                                        }}
                                    />
                                </label>

                                {files.length ? (
                                    <div className="space-y-2">
                                        {files.map((file, index) => (
                                            <div
                                                key={`${file.name}-${file.size}-${index}`}
                                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700"
                                            >
                                                <div className="min-w-0 break-words pr-3">
                                                    {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedFile(index)}
                                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Xóa file đã chọn"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Link GitHub / GitLab
                                </label>
                                <input
                                    value={repositoryUrl}
                                    onChange={(event) => setRepositoryUrl(event.target.value)}
                                    placeholder="https://github.com/username/project"
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ghi chú cho giảng viên
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(event) => setNote(event.target.value)}
                                    placeholder="Ví dụ: em đã bổ sung thêm video demo ở trong repository..."
                                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => void handleSubmit("submit")}
                                    disabled={submitting || !selectedAssignment || !canSubmit}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                    {submitting
                                        ? "Đang xử lý..."
                                        : selectedAssignment.latestSubmission &&
                                        selectedAssignment.allowResubmit
                                            ? "Nộp lại bài"
                                            : "Nộp bài ngay"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void handleSubmit("draft")}
                                    disabled={submitting || !selectedAssignment}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="material-symbols-outlined text-[18px]">draft</span>
                                    Lưu nháp
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">
                            Chưa có bài tập nào bạn có thể nộp ở thời điểm hiện tại.
                        </div>
                    )}
                </section>

                <div className="space-y-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Deadline</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                <p className="text-slate-500">Còn lại</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {formatTimeRemaining(selectedAssignment?.dueAt)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                <p className="text-slate-500">Hạn nộp</p>
                                <p className="font-semibold text-slate-900">
                                    {formatDateTime(selectedAssignment?.dueAt)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                <p className="text-slate-500">Nộp trễ</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedAssignment?.allowLateSubmit
                                        ? `Có, trừ ${selectedAssignment.latePenaltyPercent}%`
                                        : "Không cho phép"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                <p className="text-slate-500">Nộp lại</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedAssignment?.allowResubmit ? "Có" : "Không"}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Tệp đính kèm</h3>
                        {selectedAssignment?.attachments.length ? (
                            <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1 text-sm">
                                {selectedAssignment.attachments.map((file) => (
                                    <a
                                        key={`${file.kind}-${file.url}`}
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block break-words rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                    >
                                        {file.originalName}
                                        <span className="ml-2 text-xs uppercase text-slate-400">
                                            {file.kind}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Bài tập này không có file đính kèm.</p>
                        )}
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Lần nộp gần nhất</h3>
                        {selectedAssignment?.latestSubmission ? (
                            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1 text-sm text-slate-600">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-slate-500">Lần nộp</p>
                                    <p className="font-semibold text-slate-900">
                                        #{selectedAssignment.latestSubmission.attemptNo}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-slate-500">Thời gian</p>
                                    <p className="font-semibold text-slate-900">
                                        {formatDateTime(selectedAssignment.latestSubmission.submittedAt)}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-slate-500">Trạng thái</p>
                                    <p className="font-semibold text-slate-900">
                                        {getSubmissionLabel(selectedAssignment.latestSubmission.status)}
                                    </p>
                                </div>
                                {selectedAssignment.latestSubmission.repositoryUrl ? (
                                    <a
                                        href={selectedAssignment.latestSubmission.repositoryUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block break-words rounded-2xl bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                    >
                                        {selectedAssignment.latestSubmission.repositoryUrl}
                                    </a>
                                ) : null}
                                {selectedAssignment.latestSubmission.files.length ? (
                                    <div className="space-y-2">
                                        {selectedAssignment.latestSubmission.files.map((file) => (
                                            <a
                                                key={file.url}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block break-words rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                            >
                                                {file.originalName}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Bạn chưa có lần nộp nào cho bài tập này.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}