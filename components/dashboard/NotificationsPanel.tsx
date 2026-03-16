import type { NotificationItem } from "../../lib/dashboard-data";

type Props = {
    items: NotificationItem[];
};

export function NotificationsPanel({ items }: Props) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Thông báo mới</h3>
                <a href="#" className="text-sm font-semibold text-orange-500 hover:underline">
                    Tất cả
                </a>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.title}
                        className={`rounded-xl border-l-4 bg-white p-3 transition hover:bg-slate-50 ${item.borderClassName}`}
                    >
                        <div className="flex gap-4">
              <span className={`material-symbols-outlined mt-1 ${item.iconClassName}`}>
                {item.icon}
              </span>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.description}</p>
                                <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}