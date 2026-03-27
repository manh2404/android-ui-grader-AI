type WarningStudent = {
    initials: string;
    name: string;
    className: string;
    score: string;
    level: string;
    note: string;
};

type Props = {
    items: WarningStudent[];
};

export function AttentionStudentList({ items }: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
                <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">
            priority_high
          </span>
                    <h3 className="text-lg font-bold text-slate-900">Cần lưu ý</h3>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {items.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between p-4 transition hover:bg-slate-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                                {item.initials}
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-500">
                                    {item.className} • Điểm TB: {item.score}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase text-red-500">
                {item.level}
              </span>
                            <span className="text-[9px] text-slate-400">{item.note}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 p-4 text-center">
                <button className="text-sm font-bold text-slate-600 transition hover:text-orange-500">
                    Gửi thông báo cho phụ huynh
                </button>
            </div>
        </section>
    );
}