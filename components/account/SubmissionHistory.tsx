type SubmissionItem = {
    title: string;
    submittedAt: string;
    status: string;
    score: string;
    icon: string;
    statusColor: "green" | "orange";
};

type Props = {
    items: SubmissionItem[];
};

export function SubmissionHistory({ items }: Props) {
    return (
        <section className="pb-10">
            <div className="mb-4 flex items-center justify-between px-2">
                <h3 className="text-lg font-bold">Lịch sử nộp bài</h3>
                <span className="material-symbols-outlined cursor-pointer text-slate-400">
          filter_list
        </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                        const isGreen = item.statusColor === "green";

                        return (
                            <div
                                key={item.title}
                                className="flex items-center justify-between p-4 transition hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                            isGreen
                                                ? "bg-green-100 text-green-600"
                                                : "bg-orange-100 text-orange-500"
                                        }`}
                                    >
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.submittedAt}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold ${
                                            isGreen ? "text-green-600" : "text-orange-500"
                                        }`}
                                    >
                                        {item.status}
                                    </p>
                                    <p className="text-xs font-medium">{item.score}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="w-full border-t border-slate-100 py-3 text-sm font-semibold text-slate-500">
                    Xem tất cả lịch sử
                </button>
            </div>
        </section>
    );
}