type HighlightStudent = {
    initials: string;
    name: string;
    className: string;
    score: string;
    badge: string;
};

type Props = {
    items: HighlightStudent[];
};

export function StudentHighlightList({ items }: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
                <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-500">
            emoji_events
          </span>
                    <h3 className="text-lg font-bold text-slate-900">Học sinh tiêu biểu</h3>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {items.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between p-4 transition hover:bg-slate-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-500">
                                {item.initials}
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-500">
                                    {item.className} • Điểm TB: {item.score}
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
              {item.badge}
            </span>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 p-4 text-center">
                <button className="text-sm font-bold text-orange-500 hover:underline">
                    Xem tất cả 45 học sinh
                </button>
            </div>
        </section>
    );
}