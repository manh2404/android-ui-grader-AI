"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Trend = {
    delta: number;
    direction: "up" | "down" | "flat";
    absolute: number;
};

type DashboardData = {
    generatedAt: string;
    rangeDays: number;
    user: {
        role: "admin" | "teacher" | "User";
        name: string;
        greeting: string;
    };
    summary: {
        totalClasses: number;
        totalAssignments: number;
        totalStudents: number;
        totalSubmissions: number;
    };
    stats: {
        totalSubmissions: {
            current: number;
            previous: number;
            trend: Trend;
            subtitle: string;
        };
        completionRate: {
            current: number;
            previous: number;
            trend: Trend;
            subtitle: string;
        };
        averageScore: {
            current: number;
            previous: number;
            trend: Trend;
            subtitle: string;
        };
        needsAttention: {
            current: number;
            previous: number;
            trend: Trend;
            subtitle: string;
        };
    };
    charts: {
        submissionsByDay: Array<{
            date: string;
            label: string;
            value: number;
        }>;
        averageScoreByClass: Array<{
            label: string;
            value: number;
        }>;
    };
    notifications: Array<{
        id: string;
        type: "warning" | "info" | "success";
        title: string;
        description: string;
        occurredAt: string;
    }>;
    recentActivities: Array<{
        submissionId: string;
        studentName: string;
        className: string;
        assignmentTitle: string;
        score: number | null;
        scoreClassName: string;
        status: string;
        submittedAt: string | null;
        actionHref: string;
    }>;
};

function formatDateTime(value?: string | null) {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatRelativeTime(value?: string | null) {
    if (!value) return "Vừa xong";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Vừa xong";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.round(diffMs / 60000);

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} ngày trước`;
}

function formatScore(value?: number | null) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "--";
    }

    const num = Number(value);
    return Number.isInteger(num) ? `${num}.0` : num.toFixed(1);
}

function formatPercent(value?: number | null) {
    const num = Number(value || 0);
    return `${Number.isInteger(num) ? num : num.toFixed(1)}%`;
}

function buildCsv(data: DashboardData) {
    const rows: string[][] = [];

    rows.push(["DASHBOARD TỔNG QUAN"]);
    rows.push(["Thời điểm xuất", formatDateTime(data.generatedAt)]);
    rows.push(["Khoảng thời gian", `${data.rangeDays} ngày qua`]);
    rows.push([]);

    rows.push(["THỐNG KÊ"]);
    rows.push(["Tổng bài nộp", String(data.stats.totalSubmissions.current)]);
    rows.push(["Tỷ lệ hoàn thành", formatPercent(data.stats.completionRate.current)]);
    rows.push(["Điểm trung bình", `${formatScore(data.stats.averageScore.current)}/10`]);
    rows.push(["Cần xử lý", String(data.stats.needsAttention.current)]);
    rows.push([]);

    rows.push(["LƯỢT NỘP THEO NGÀY"]);
    rows.push(["Ngày", "Số lượt nộp"]);
    data.charts.submissionsByDay.forEach((item) => {
        rows.push([item.label, String(item.value)]);
    });
    rows.push([]);

    rows.push(["ĐIỂM TRUNG BÌNH THEO LỚP"]);
    rows.push(["Lớp", "Điểm TB"]);
    data.charts.averageScoreByClass.forEach((item) => {
        rows.push([item.label, formatScore(item.value)]);
    });
    rows.push([]);

    rows.push(["HOẠT ĐỘNG GẦN ĐÂY"]);
    rows.push(["Học sinh", "Lớp", "Bài tập", "Điểm", "Trạng thái", "Thời gian"]);
    data.recentActivities.forEach((item) => {
        rows.push([
            item.studentName,
            item.className,
            item.assignmentTitle,
            item.score === null ? "--" : formatScore(item.score),
            item.status,
            formatDateTime(item.submittedAt),
        ]);
    });

    return rows
        .map((row) =>
            row
                .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
                .join(",")
        )
        .join("\n");
}

function downloadCsv(data: DashboardData) {
    const csv = buildCsv(data);
    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function getTrendTone(direction: Trend["direction"], positiveIsGood = true) {
    if (direction === "flat") {
        return "text-slate-500";
    }

    const good = positiveIsGood ? direction === "up" : direction === "down";
    return good ? "text-emerald-600" : "text-red-500";
}

function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-slate-300">dashboard</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
        </div>
    );
}

function StatCard({
                      title,
                      value,
                      subtitle,
                      icon,
                      iconClassName,
                      trend,
                      suffix = "",
                      positiveIsGood = true,
                  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    iconClassName: string;
    trend: Trend;
    suffix?: string;
    positiveIsGood?: boolean;
}) {
    const toneClass = getTrendTone(trend.direction, positiveIsGood);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
                    <div className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</div>
                </div>

                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}>
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
                <span className={`inline-flex items-center gap-1 font-semibold ${toneClass}`}>
                    <span className="material-symbols-outlined text-[18px]">
                        {trend.direction === "flat"
                            ? "trending_flat"
                            : trend.direction === "up"
                                ? "arrow_upward"
                                : "arrow_downward"}
                    </span>
                    {trend.absolute}
                    {suffix}
                </span>
                <span className="text-slate-400">so với kỳ trước</span>
            </div>

            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}

function SubmissionTooltip({
                               active,
                               payload,
                               label,
                           }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">{payload[0].value} lượt nộp</p>
        </div>
    );
}

function ScoreTooltip({
                          active,
                          payload,
                          label,
                      }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">Điểm trung bình: {formatScore(payload[0].value)}/10</p>
        </div>
    );
}

function ActivityStatus({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-slate-100 text-slate-700",
        auto_graded: "bg-emerald-100 text-emerald-700",
        needs_teacher_review: "bg-amber-100 text-amber-700",
        overridden: "bg-blue-100 text-blue-700",
    };

    const labelMap: Record<string, string> = {
        pending: "Chờ chấm",
        auto_graded: "Đã chấm",
        needs_teacher_review: "Cần xem lại",
        overridden: "Đã sửa tay",
    };

    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${map[status] || "bg-slate-100 text-slate-700"}`}>
            {labelMap[status] || status}
        </span>
    );
}

export default function DashboardPage() {
    const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(7);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`/api/dashboard/overview?range=${rangeDays}`, {
                    cache: "no-store",
                });
                const json = await res.json().catch(() => ({}));

                if (!res.ok) {
                    throw new Error(json.message || "Không thể tải dashboard");
                }

                if (!cancelled) {
                    setData(json.data || null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Không thể tải dashboard");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadData();

        return () => {
            cancelled = true;
        };
    }, [rangeDays]);

    const statCards = useMemo(() => {
        if (!data) return [];

        const attentionTitle = data.user.role === "User" ? "Chờ chấm" : "Cần xử lý";

        return [
            {
                title: "Tổng bài nộp",
                value: data.stats.totalSubmissions.current.toLocaleString("vi-VN"),
                subtitle: data.stats.totalSubmissions.subtitle,
                icon: "description",
                iconClassName: "bg-orange-100 text-orange-600",
                trend: data.stats.totalSubmissions.trend,
                suffix: "",
                positiveIsGood: true,
            },
            {
                title: "Tỷ lệ hoàn thành",
                value: formatPercent(data.stats.completionRate.current),
                subtitle: data.stats.completionRate.subtitle,
                icon: "task_alt",
                iconClassName: "bg-blue-100 text-blue-600",
                trend: data.stats.completionRate.trend,
                suffix: "%",
                positiveIsGood: true,
            },
            {
                title: "Điểm trung bình",
                value: `${formatScore(data.stats.averageScore.current)}/10`,
                subtitle: data.stats.averageScore.subtitle,
                icon: "star",
                iconClassName: "bg-yellow-100 text-yellow-600",
                trend: data.stats.averageScore.trend,
                suffix: "",
                positiveIsGood: true,
            },
            {
                title: attentionTitle,
                value: data.stats.needsAttention.current.toLocaleString("vi-VN"),
                subtitle: data.stats.needsAttention.subtitle,
                icon: "schedule",
                iconClassName: "bg-purple-100 text-purple-600",
                trend: data.stats.needsAttention.trend,
                suffix: "",
                positiveIsGood: false,
            },
        ];
    }, [data]);

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        {data?.user.greeting || "Đang tải dashboard..."}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Theo dõi nhanh lớp học, tiến độ nộp bài và các hoạt động chấm điểm mới nhất.
                    </p>
                    {data && (
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
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                        {[7, 30, 90].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRangeDays(value as 7 | 30 | 90)}
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
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            </section>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <div>
                            <p className="font-semibold">Không tải được dashboard</p>
                            <p className="mt-1 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            ) : data ? (
                <>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((item) => (
                            <StatCard key={item.title} {...item} />
                        ))}
                    </section>

                    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Lượt nộp bài theo thời gian</h2>
                                    <p className="mt-1 text-sm text-slate-500">Số lượt nộp bài trong {data.rangeDays} ngày gần nhất.</p>
                                </div>
                                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                    {data.charts.submissionsByDay.reduce((sum, item) => sum + item.value, 0)} lượt
                                </span>
                            </div>

                            {data.charts.submissionsByDay.length ? (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.charts.submissionsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="submissionGradientDashboard" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                                                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                            <Tooltip content={<SubmissionTooltip />} cursor={{ stroke: "#fdba74", strokeWidth: 2 }} />
                                            <Area type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={3} fill="url(#submissionGradientDashboard)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Chưa có dữ liệu nộp bài"
                                    description="Khi học sinh bắt đầu nộp bài, biểu đồ này sẽ hiển thị theo thời gian thực."
                                />
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Điểm trung bình theo lớp</h2>
                                    <p className="mt-1 text-sm text-slate-500">Tổng hợp điểm các bài đã chấm trong kỳ đang xem.</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    Tối đa 6 lớp
                                </span>
                            </div>

                            {data.charts.averageScoreByClass.length ? (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.charts.averageScoreByClass} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap={16}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                            <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                            <Tooltip content={<ScoreTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
                                            <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                                                {data.charts.averageScoreByClass.map((item, index) => (
                                                    <Cell key={`${item.label}-${index}`} fill={index === 0 ? "#f97316" : "#cbd5e1"} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Chưa có dữ liệu điểm số"
                                    description="Các lớp sẽ xuất hiện ở đây sau khi có bài nộp được chấm điểm."
                                />
                            )}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">Thông báo mới</h2>
                                <span className="text-sm font-semibold text-orange-500">{data.notifications.length} mục</span>
                            </div>

                            {data.notifications.length ? (
                                <div className="space-y-4">
                                    {data.notifications.map((item) => {
                                        const toneClass =
                                            item.type === "warning"
                                                ? "border-orange-500 text-orange-500"
                                                : item.type === "success"
                                                    ? "border-emerald-500 text-emerald-500"
                                                    : "border-blue-500 text-blue-500";

                                        const icon = item.type === "warning" ? "warning" : item.type === "success" ? "check_circle" : "info";

                                        return (
                                            <div key={item.id} className={`rounded-2xl border-l-4 bg-slate-50 p-4 ${toneClass}`}>
                                                <div className="flex gap-3">
                                                    <span className="material-symbols-outlined mt-0.5">{icon}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                                        <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                                                        <p className="mt-2 text-xs text-slate-400">{formatRelativeTime(item.occurredAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState
                                    title="Chưa có thông báo"
                                    description="Khi hệ thống phát hiện bài gần đến hạn hoặc bài cần xử lý, bạn sẽ thấy tại đây."
                                />
                            )}
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Hoạt động chấm bài gần đây</h2>
                                    <p className="mt-1 text-sm text-slate-500">Danh sách bài nộp mới nhất trong phạm vi bạn có thể xem.</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {data.recentActivities.length} bài
                                </span>
                            </div>

                            {data.recentActivities.length ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-[760px] w-full text-left">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4">Học sinh</th>
                                            <th className="px-6 py-4">Lớp</th>
                                            <th className="px-6 py-4">Bài tập</th>
                                            <th className="px-6 py-4">Điểm</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4">Thời gian</th>
                                            <th className="px-6 py-4 text-right">Xem</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                        {data.recentActivities.map((item) => (
                                            <tr key={item.submissionId} className="transition hover:bg-slate-50/80">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                                                            {item.studentName.slice(0, 1).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">{item.studentName}</p>
                                                            <p className="text-xs text-slate-400">Bài nộp mới</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{item.className}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.assignmentTitle}</td>
                                                <td className="px-6 py-4">
                                                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.scoreClassName}`}>
                                                            {item.score === null ? "Chưa có điểm" : `${formatScore(item.score)}/10`}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <ActivityStatus status={item.status} />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{formatRelativeTime(item.submittedAt)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={item.actionHref}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
                                                    >
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <EmptyState
                                        title="Chưa có hoạt động gần đây"
                                        description="Sau khi người học nộp bài, danh sách hoạt động sẽ tự động hiển thị ở đây."
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </>
            ) : null}
        </div>
    );
}
