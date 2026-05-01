"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { DashboardData } from "@/app/ui/dashboard/type/dashboard.type";
import EmptyState from "./EmptyState";
import { SubmissionTooltip } from "./ChartTooltips";

type SubmissionsByDayChartProps = {
    rangeDays: number;
    data: DashboardData["charts"]["submissionsByDay"];
};

export default function SubmissionsByDayChart({
                                                  rangeDays,
                                                  data,
                                              }: SubmissionsByDayChartProps) {
    const totalSubmissions = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Lượt nộp bài theo thời gian
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Số lượt nộp bài trong {rangeDays} ngày gần nhất.
                    </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {totalSubmissions} lượt
                </span>
            </div>

            {data.length ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="submissionGradientDashboard"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                            />
                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                            />
                            <Tooltip
                                content={<SubmissionTooltip />}
                                cursor={{ stroke: "#fdba74", strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#ea580c"
                                strokeWidth={3}
                                fill="url(#submissionGradientDashboard)"
                            />
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
    );
}
