type DistributionItem = {
    label: string;
    value: number;
    className: string;
};

type ScoreDistributionData = {
    title: string;
    filterLabel: string;
    items: DistributionItem[];
};

type Props = {
    data: ScoreDistributionData;
};

export function ScoreDistributionCard({ data }: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{data.title}</h3>

                <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-1.5 text-xs text-slate-500 outline-none">
                    <option>{data.filterLabel}</option>
                    <option>Toán học</option>
                    <option>Ngữ văn</option>
                    <option>Tiếng Anh</option>
                </select>
            </div>

            <div className="flex h-64 items-end justify-between gap-2 px-2">
                {data.items.map((item) => (
                    <div key={item.label} className="group flex flex-1 flex-col items-center">
                        <div
                            className={`w-full rounded-t-lg transition-all group-hover:opacity-90 ${item.className}`}
                            style={{ height: `${item.value}%` }}
                        />
                        <span className="mt-2 text-[10px] text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}