import Link from "next/link";
import type { DashboardData } from "@/app/ui/dashboard/type/dashboard.type";
import { formatRelativeTime, formatScore } from "@/app/ui/dashboard/type/dashboard.utils";
import ActivityStatus from "./ActivityStatus";
import EmptyState from "./EmptyState";

type RecentActivitiesTableProps = {
    activities: DashboardData["recentActivities"];
};

export default function RecentActivitiesTable({
                                                  activities,
                                              }: RecentActivitiesTableProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Hoạt động chấm bài gần đây
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Danh sách bài nộp mới nhất trong phạm vi bạn có thể xem.
                    </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {activities.length} bài
                </span>
            </div>

            {activities.length ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] table-fixed text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th className="w-[220px] px-6 py-4">Học sinh</th>
                            <th className="w-[150px] px-6 py-4">Lớp</th>
                            <th className="w-[260px] px-6 py-4">Bài tập</th>
                            <th className="w-[120px] px-6 py-4 text-center">Điểm</th>
                            <th className="w-[140px] px-6 py-4 text-center">Trạng thái</th>
                            <th className="w-[130px] px-6 py-4 text-center">Thời gian</th>
                            <th className="w-[80px] px-6 py-4 text-right">Xem</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                        {activities.map((item) => (
                            <tr
                                key={item.submissionId}
                                className="transition hover:bg-slate-50/80"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                                            {item.studentName.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {item.studentName}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Bài nộp mới
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.className}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.assignmentTitle}
                                </td>

                                <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex min-w-[82px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold leading-5 ${item.scoreClassName}`}
                                        >
                                            {item.score === null
                                                ? "Chưa có điểm"
                                                : `${formatScore(item.score)}/10`}
                                        </span>
                                </td>

                                <td className="px-6 py-4">
                                    <ActivityStatus status={item.status} />
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {formatRelativeTime(item.submittedAt)}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={item.actionHref}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
                                    >
                                            <span className="material-symbols-outlined">
                                                visibility
                                            </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-6">
                    <EmptyState
                        title="Chưa có hoạt động gần đây"
                        description="Sau khi người học nộp bài, danh sách hoạt động sẽ tự động hiển thị ở đây."
                    />
                </div>
            )}
        </div>
    );
}
