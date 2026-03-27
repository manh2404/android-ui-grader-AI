import { AssignmentStatusBadge } from "./AssignmentStatusBadge";

type AssignmentRow = {
    id: string;
    title: string;
    icon: string;
    className: string;
    assignedDate: string;
    dueDate: string;
    status: "Đang mở" | "Đã đóng" | "Bản nháp";
};

type Props = {
    rows: AssignmentRow[];
};

export function AssignmentTable({ rows }: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-slate-50">
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-4">Tên bài tập</th>
                        <th className="px-4 py-4">Lớp học</th>
                        <th className="px-4 py-4">Ngày giao</th>
                        <th className="px-4 py-4">Hạn nộp</th>
                        <th className="px-4 py-4">Trạng thái</th>
                        <th className="px-4 py-4 text-right">Thao tác</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {rows.map((row) => (
                        <tr key={row.id} className="transition hover:bg-slate-50">
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                            row.status === "Đã đóng"
                                                ? "bg-slate-100 text-slate-400"
                                                : "bg-orange-100 text-orange-500"
                                        }`}
                                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {row.icon}
                      </span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{row.title}</span>
                                </div>
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-slate-500">
                                {row.className}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500">
                                {row.assignedDate}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500">
                                {row.dueDate}
                            </td>

                            <td className="px-4 py-4">
                                <AssignmentStatusBadge status={row.status} />
                            </td>

                            <td className="px-4 py-4 text-right">
                                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-orange-500">
                                    <span className="material-symbols-outlined">more_vert</span>
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