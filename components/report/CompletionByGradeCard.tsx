type CompletionItem = {
    label: string;
    value: number;
};

type Props = {
    items: CompletionItem[];
};

export function CompletionByGradeCard({ items }: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                    Hoàn thành bài tập theo khối
                </h3>

                <button className="text-xs font-semibold text-orange-500">
                    Xem chi tiết
                </button>
            </div>

            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <span className="font-bold text-slate-900">{item.value}%</span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full bg-orange-500"
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}