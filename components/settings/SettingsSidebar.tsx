type SidebarItem = {
    label: string;
    icon: string;
    active?: boolean;
};

type SidebarGroup = {
    title: string;
    items: SidebarItem[];
};

type VersionInfo = {
    version: string;
    updatedAt: string;
};

type Props = {
    groups: SidebarGroup[];
    versionInfo: VersionInfo;
};

export function SettingsSidebar({ groups, versionInfo }: Props) {
    return (
        <aside className="hidden w-72 flex-col gap-6 overflow-y-auto border-r border-slate-200 bg-white p-4 md:flex">
            {groups.map((group) => (
                <div key={group.title}>
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {group.title}
                    </h3>

                    <nav className="flex flex-col gap-1">
                        {group.items.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                                    item.active
                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-500"
                                }`}
                            >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            ))}

            <div className="mt-auto rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="mb-1 text-xs font-bold text-orange-500">
                    Phiên bản {versionInfo.version}
                </p>
                <p className="text-[10px] text-slate-500">{versionInfo.updatedAt}</p>
            </div>
        </aside>
    );
}