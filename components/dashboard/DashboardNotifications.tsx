import type { DashboardData } from "@/app/ui/dashboard/type/dashboard.type";
import { formatRelativeTime } from "@/app/ui/dashboard/type/dashboard.utils";
import EmptyState from "./EmptyState";

type DashboardNotificationsProps = {
    notifications: DashboardData["notifications"];
};

function getNotificationTone(type: DashboardData["notifications"][number]["type"]) {
    if (type === "warning") {
        return {
            toneClass: "border-orange-500 text-orange-500",
            icon: "warning",
        };
    }

    if (type === "success") {
        return {
            toneClass: "border-emerald-500 text-emerald-500",
            icon: "check_circle",
        };
    }

    return {
        toneClass: "border-blue-500 text-blue-500",
        icon: "info",
    };
}

export default function DashboardNotifications({
                                                   notifications,
                                               }: DashboardNotificationsProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Thông báo mới</h2>
                <span className="text-sm font-semibold text-orange-500">
                    {notifications.length} mục
                </span>
            </div>

            {notifications.length ? (
                <div className="space-y-4">
                    {notifications.map((item) => {
                        const { toneClass, icon } = getNotificationTone(item.type);

                        return (
                            <div
                                key={item.id}
                                className={`rounded-2xl border-l-4 bg-slate-50 p-4 ${toneClass}`}
                            >
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined mt-0.5">
                                        {icon}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.description}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            {formatRelativeTime(item.occurredAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    title="Chưa có thông báo"
                    description="Khi hệ thống phát hiện bài gần đến hạn hoặc bài cần xử lý, bạn sẽ thấy tại đây."
                />
            )}
        </div>
    );
}
