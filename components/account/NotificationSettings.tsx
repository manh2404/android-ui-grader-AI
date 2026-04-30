import type { NotificationSettingsPayload } from "@/app/ui/account/type/account.types";

type Props = {
    value: NotificationSettingsPayload;
    loading?: boolean;
    onChange: (next: NotificationSettingsPayload) => void;
};

const rows = [
    {
        key: "emailAssignments" as const,
        title: "Email thông báo bài tập",
        description: "Nhận cập nhật khi có bài tập mới hoặc bài được chấm",
        icon: "mail",
    },
    {
        key: "pushReminders" as const,
        title: "Thông báo đẩy trên thiết bị",
        description: "Nhắc nhở hạn chót, trạng thái chấm và cập nhật lớp học",
        icon: "notifications_active",
    },
];

export function NotificationSettings({ value, loading = false, onChange }: Props) {
    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Cài đặt thông báo</h2>
                </div>

                {loading && <span className="text-xs font-medium text-orange-600">Đang lưu...</span>}
            </div>

            <div className="space-y-4">
                {rows.map((item) => {
                    const enabled = Boolean(value[item.key]);

                    return (
                        <div
                            key={item.key}
                            className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    onChange({
                                        ...value,
                                        [item.key]: !enabled,
                                    })
                                }
                                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                                    enabled ? "bg-orange-500" : "bg-slate-300"
                                } disabled:cursor-not-allowed disabled:opacity-70`}
                                aria-pressed={enabled}
                                aria-label={item.title}
                            >
                                <span
                                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                                        enabled ? "left-6" : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
