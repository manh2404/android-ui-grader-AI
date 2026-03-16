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

type ClassScoreItem = {
    label: string;
    value: number;
    highlight?: boolean;
};

type Props = {
    items: ClassScoreItem[];
};

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: ClassScoreItem;
    }>;
    label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">
                Điểm trung bình: <span className="font-bold">{(payload[0].value / 10).toFixed(1)}/10</span>
            </p>
            <p className="text-xs text-slate-500">Tỷ lệ cột: {payload[0].value}%</p>
        </div>
    );
}

export function BarChartCard({ items }: Props) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                    Điểm trung bình theo lớp
                </h3>
                <button className="text-slate-400">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={items}
                        margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                        barCategoryGap={16}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                        />

                        <YAxis hide domain={[0, 100]} />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                        />

                        <Bar
                            dataKey="value"
                            radius={[16, 16, 0, 0]}
                            animationDuration={700}
                        >
                            {items.map((item) => (
                                <Cell
                                    key={item.label}
                                    fill={item.highlight ? "#f97316" : "#cbd5e1"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}