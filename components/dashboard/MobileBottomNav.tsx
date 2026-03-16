const items = [
    { label: "Dashboard", icon: "dashboard", active: true },
    { label: "Lớp học", icon: "groups" },
    { label: "Bài tập", icon: "assignment" },
    { label: "Hồ sơ", icon: "person" },
];

export function MobileBottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-2 lg:hidden">
            <div className="flex items-center justify-around">
                {items.map((item) => (
                    <button
                        key={item.label}
                        className={`flex flex-col items-center gap-1 ${
                            item.active ? "text-orange-500" : "text-slate-400"
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-[10px] font-semibold">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}