"use client";

import type { DashboardData, RangeDays } from "@/app/ui/dashboard/type/dashboard.type";
import { downloadCsv, formatDateTime } from "@/app/ui/dashboard/type/dashboard.utils";

type DashboardHeaderProps = {
    data: DashboardData | null;
    rangeDays: RangeDays;
    onRangeDaysChange: (value: RangeDays) => void;
};

export default function DashboardHeader({
                                            data,
                                            rangeDays,
                                            onRangeDaysChange,
                                        }: DashboardHeaderProps) {
    return (
        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    {data?.user.greeting || "Đang tải dashboard..."}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Theo dõi nhanh lớp học, tiến độ nộp bài và các hoạt động chấm
                    điểm mới nhất.
                </p>

                {data ? (
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                            {data.summary.totalClasses} lớp
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                            {data.summary.totalAssignments} bài tập
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                            {data.summary.totalStudents} người học
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                            Cập nhật {formatDateTime(data.generatedAt)}
                        </span>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                    {[7, 30, 90].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onRangeDaysChange(value as RangeDays)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                rangeDays === value
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {value} ngày
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => data && downloadCsv(data)}
                    disabled={!data}
                    className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        download
                    </span>
                    Xuất báo cáo
                </button>
            </div>
        </section>
    );
}
