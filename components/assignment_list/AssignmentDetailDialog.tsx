"use client";

import Link from "next/link";
import Dialog from "./Dialog";
import type { AssignmentItem } from "@/app/ui/assignment_list/type/assignment_list.type";
import {
    formatDate,
    getStatusClasses,
    getStatusLabel,
} from "@/app/ui/assignment_list/type/assignment_list.utils";

type AssignmentDetailDialogProps = {
    item: AssignmentItem | null;
    canManage: boolean;
    isStudent: boolean;
    deletingId: string;
    onClose: () => void;
    onOpenEdit: (item: AssignmentItem) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
};

export default function AssignmentDetailDialog({
                                                   item,
                                                   canManage,
                                                   isStudent,
                                                   deletingId,
                                                   onClose,
                                                   onOpenEdit,
                                                   onDelete,
                                               }: AssignmentDetailDialogProps) {
    return (
        <Dialog
            open={Boolean(item)}
            title="Chi tiết bài tập"
            onClose={onClose}
            maxWidth="max-w-5xl"
        >
            {item ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Tên bài tập</p>
                            <p className="mt-1 text-lg font-bold text-slate-900">
                                {item.title}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Lớp học</p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {item.classroom
                                    ? `${item.classroom.name} (${item.classroom.code})`
                                    : "--"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Ngày giao</p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {formatDate(item.startAt || item.createdAt)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Hạn nộp</p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {formatDate(item.dueAt)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Điểm tối đa</p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {item.maxScore}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Ngôn ngữ</p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {item.language || "--"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Chính sách nộp bài</p>
                            <div className="mt-1 space-y-1 text-sm text-slate-700">
                                <p>
                                    Late submit: {item.allowLateSubmit ? "Có" : "Không"}
                                </p>
                                <p>
                                    Resubmit: {item.allowResubmit ? "Có" : "Không"}
                                </p>
                                <p>
                                    Late penalty: {item.latePenaltyPercent || 0}%
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Trạng thái</p>
                            <span
                                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusClasses(
                                    item.displayStatus
                                )}`}
                            >
                                    {getStatusLabel(item.displayStatus)}
                                </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="mb-2 font-semibold text-slate-900">Mô tả đề bài</p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {item.description || "Chưa có mô tả"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <p className="mb-2 font-semibold text-orange-700">
                            Rubric / thang điểm
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {item.rubricText || "Chưa có rubric"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="mb-3 font-semibold text-slate-900">
                            Rubric cấu trúc
                        </p>
                        {Array.isArray(item.rubric) && item.rubric.length ? (
                            <div className="space-y-3">
                                {item.rubric.map((criterion) => (
                                    <div
                                        key={criterion.code}
                                        className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {criterion.title}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {criterion.code} · {criterion.gradingSource}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                                                {criterion.maxPoints}đ
                                            </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Chưa có rubric cấu trúc.
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="mb-3 font-semibold text-slate-900">
                            File đính kèm
                        </p>
                        {(item.attachments || []).length ? (
                            <div className="space-y-3">
                                {(item.attachments || []).map((file) => (
                                    <a
                                        key={file.url}
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-2xl bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                    >
                                        {file.originalName}
                                        <span className="ml-2 text-xs uppercase text-slate-400">
                                                {file.kind}
                                            </span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Không có file đính kèm
                            </p>
                        )}
                    </div>

                    {item.teacher ? (
                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="mb-2 font-semibold text-slate-900">
                                Giảng viên phụ trách
                            </p>
                            <p className="text-sm text-slate-700">
                                {item.teacher.name} - {item.teacher.email}
                            </p>
                        </div>
                    ) : null}

                    {item.latestSubmission ? (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <p className="font-semibold text-blue-800">
                                Bài nộp gần nhất
                            </p>
                            <p className="mt-2 text-sm text-blue-700">
                                Attempt #{item.latestSubmission.attemptNo} -{" "}
                                {item.latestSubmission.status}
                            </p>
                            <p className="mt-1 text-sm text-blue-700">
                                Grade status:{" "}
                                {item.latestSubmission.gradeStatus || "pending"}
                            </p>
                            <p className="mt-1 text-sm text-blue-700">
                                Final score:{" "}
                                {item.latestSubmission.finalScore ?? "Chưa có"}
                            </p>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap justify-end gap-3">
                        {isStudent ? (
                            <>
                                <Link
                                    href="/ui/submit_assignment"
                                    className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                                >
                                    Đi tới nộp bài
                                </Link>

                                {item.latestSubmission?._id ? (
                                    <Link
                                        href={`/ui/grading_detail?assignmentId=${item._id}&submissionId=${item.latestSubmission._id}`}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                                    >
                                        Xem kết quả chấm
                                    </Link>
                                ) : null}
                            </>
                        ) : null}

                        {canManage ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        void onOpenEdit(item);
                                    }}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                                >
                                    Sửa bài tập
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void onDelete(item._id)}
                                    disabled={deletingId === item._id}
                                    className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 disabled:opacity-60"
                                >
                                    {deletingId === item._id ? "Đang xóa..." : "Xóa"}
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </Dialog>
    );
}
