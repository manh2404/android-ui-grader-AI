type NotificationItem = {
    title: string;
    description: string;
    icon: string;
    enabled: boolean;
};

type Props = {
    items: NotificationItem[];
};

export function NotificationSettings({ items }: Props) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 className="mb-4 px-2 text-lg font-bold">Cài đặt thông báo</h3>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.title} className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">
                {item.icon}
              </span>

                            <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                        </div>

                        <button
                            className={`relative h-6 w-11 rounded-full transition ${
                                item.enabled ? "bg-orange-500" : "bg-slate-200"
                            }`}
                        >
              <span
                  className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition ${
                      item.enabled ? "left-[22px]" : "left-[2px]"
                  }`}
              />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}