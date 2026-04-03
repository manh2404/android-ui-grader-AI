import type { SubmissionHistoryItem } from "@/app/ui/account/type/account.types";

type Props = {
    items: SubmissionHistoryItem[];
};

function colorClass(color: SubmissionHistoryItem["statusColor"]) {
    if (color === "green") return "bg-green-100 text-green-600";
    if (color === "orange") return "bg-orange-100 text-orange-600";
    return "bg-slate-100 text-slate-600";
}

function textColorClass(color: SubmissionHistoryItem["statusColor"]) {
    if (color === "green") return "text-green-600";
    if (color === "orange") return "text-orange-600";
    return "text-slate-600";
}

export function SubmissionHistory({ items }: Props) {
    const shouldScroll = items.length > 3;

    return (
        <section className="pb-6">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Lịch sử hoạt động</h2>
                    <p className="text-sm text-slate-500">Hiển thị bài nộp hoặc hoạt động chấm gần đây nhất.</p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                    {items.length} mục
                </span>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                {!items.length ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        Chưa có hoạt động nộp bài nào để hiển thị.
                    </div>
                ) : (
                    <div className={shouldScroll ? "max-h-[360px] overflow-y-auto" : ""}>
                        <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colorClass(item.statusColor)}`}>
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                                            <p className="mt-1 truncate text-xs text-slate-500">{item.secondary}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{item.submittedAt}</p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className={`text-sm font-bold ${textColorClass(item.statusColor)}`}>{item.status}</p>
                                        <p className="text-xs font-medium text-slate-600">{item.score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
