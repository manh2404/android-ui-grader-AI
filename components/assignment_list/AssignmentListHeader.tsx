"use client";

import Link from "next/link";

type AssignmentListHeaderProps = {
    canManage: boolean;
    isStudent: boolean;
};

export default function AssignmentListHeader({
                                                 canManage,
                                                 isStudent,
                                             }: AssignmentListHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Danh sách bài tập
                </h1>
                <p className="mt-1 text-slate-500">
                    Xem chi tiết bài tập, rubric, bài nộp gần nhất và thao tác
                    sửa/xóa theo quyền.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                {canManage ? (
                    <Link
                        href="/ui/server_config/create_assignment"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            add
                        </span>
                        Tạo bài tập mới
                    </Link>
                ) : null}

                {isStudent ? (
                    <Link
                        href="/ui/submit_assignment"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            upload
                        </span>
                        Đi tới nộp bài
                    </Link>
                ) : null}
            </div>
        </div>
    );
}
