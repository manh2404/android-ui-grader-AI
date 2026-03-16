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

const data = [
    { day: "Thứ 2", value: 78 },
    { day: "Thứ 3", value: 66 },
    { day: "Thứ 4", value: 72 },
    { day: "Thứ 5", value: 61 },
    { day: "Thứ 6", value: 35 },
    { day: "Thứ 7", value: 89 },
    { day: "Chủ Nhật", value: 76 },
];

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: { day: string; value: number };
    }>;
    label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">
                Tỷ lệ nộp: <span className="font-bold">{payload[0].value}%</span>
            </p>
        </div>
    );
}

export function LineChartCard() {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                    Tỷ lệ nộp bài theo thời gian
                </h3>
                <button className="text-slate-400">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ea580c" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#ea580c" stopOpacity={0.03} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />

                        <YAxis hide domain={[0, 100]} />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: "#fdba74", strokeWidth: 2, strokeDasharray: "4 4" }}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#ea580c"
                            strokeWidth={4}
                            fill="url(#submissionGradient)"
                            dot={{ r: 0 }}
                            activeDot={{
                                r: 6,
                                stroke: "#ea580c",
                                strokeWidth: 2,
                                fill: "#fff",
                            }}
                            animationDuration={700}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}