const menuItems = [
    { label: "Bảng điều khiển", icon: "dashboard", active: true },
    { label: "Danh sách lớp", icon: "groups" },
    { label: "Kho bài tập", icon: "assignment" },
    { label: "Báo cáo chi tiết", icon: "assessment" },
];

const bottomItems = [
    { label: "Cài đặt hệ thống", icon: "settings" },
    { label: "Trợ giúp", icon: "help" },
];

export function Sidebar() {
    return (
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            item.active
                                ? "bg-orange-50 font-bold text-orange-600"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}

                <div className="my-4 border-t border-slate-200" />

                {bottomItems.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </aside>
    );
}