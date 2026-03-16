import type { ActivityItem } from "../../lib/dashboard-data";

type Props = {
    items: ActivityItem[];
};

export function RecentActivityTable({ items }: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Hoạt động chấm bài gần đây</h3>
                <button className="text-slate-500 transition hover:text-orange-500">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                    <thead className="border-b border-slate-100">
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Học sinh</th>
                        <th className="px-4 py-3">Lớp</th>
                        <th className="px-4 py-3">Môn học</th>
                        <th className="px-4 py-3">Điểm số</th>
                        <th className="px-4 py-3 text-right">Hành động</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <tr key={`${item.name}-${item.subject}`} className="transition hover:bg-slate-50">
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">{item.className}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{item.subject}</td>

                            <td className="px-4 py-4">
                  <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.scoreClassName}`}
                  >
                    {item.score}
                  </span>
                            </td>

                            <td className="px-4 py-4 text-right">
                                <button className="text-slate-400 transition hover:text-orange-500">
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}