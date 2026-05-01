"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { DashboardData } from "@/app/ui/dashboard/type/dashboard.type";
import EmptyState from "./EmptyState";
import { ScoreTooltip } from "./ChartTooltips";

type AverageScoreByClassChartProps = {
    data: DashboardData["charts"]["averageScoreByClass"];
};

export default function AverageScoreByClassChart({
                                                     data,
                                                 }: AverageScoreByClassChartProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Điểm trung bình theo lớp
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Tổng hợp điểm các bài đã chấm trong kỳ đang xem.
                    </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Tối đa 6 lớp
                </span>
            </div>

            {data.length ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            barCategoryGap={16}
                        >
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
                                domain={[0, 10]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                            />
                            <Tooltip
                                content={<ScoreTooltip />}
                                cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                            />
                            <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                                {data.map((item, index) => (
                                    <Cell
                                        key={`${item.label}-${index}`}
                                        fill={index === 0 ? "#f97316" : "#cbd5e1"}
                                    />
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
    );
}
