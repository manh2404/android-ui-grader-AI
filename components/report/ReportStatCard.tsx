type ReportStatItem = {
    title: string;
    value: string;
    subValue: string;
    subValueColor: string;
    subtitle: string;
    icon: string;
    iconClassName: string;
};

type Props = {
    item: ReportStatItem;
};

export function ReportStatCard({ item }: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.title}</p>

                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClassName}`}
                >
          <span className="material-symbols-outlined text-sm">{item.icon}</span>
        </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{item.value}</span>
                <span className={`flex items-center text-xs font-bold ${item.subValueColor}`}>
          <span className="material-symbols-outlined text-xs">trending_up</span>
                    {item.subValue}
        </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
        </div>
    );
}