import type { StatItem } from "../../lib/dashboard-data";

export function StatCard({
                             title,
                             value,
                             trend,
                             trendUp,
                             subtitle,
                             icon,
                             iconClassName,
                         }: StatItem) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
          {title}
        </span>

                <span
                    className={`material-symbols-outlined rounded-lg p-2 text-[20px] ${iconClassName}`}
                >
          {icon}
        </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{value}</span>

                <span
                    className={`flex items-center text-sm font-bold ${
                        trendUp ? "text-green-500" : "text-red-500"
                    }`}
                >
          <span className="material-symbols-outlined text-base">
            {trendUp ? "arrow_upward" : "arrow_downward"}
          </span>
                    {trend}
        </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
        </div>
    );
}