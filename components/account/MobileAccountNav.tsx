const items = [
    { label: "Trang chủ", icon: "home", active: false },
    { label: "Lớp học", icon: "menu_book", active: false },
    { label: "Lịch học", icon: "calendar_month", active: false },
    { label: "Tài khoản", icon: "person", active: true },
];

export function MobileAccountNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-200 bg-white py-2 md:hidden">
            {items.map((item) => (
                <button
                    key={item.label}
                    className={`flex flex-col items-center gap-0.5 ${
                        item.active ? "text-orange-500" : "text-slate-400"
                    }`}
                >
          <span
              className="material-symbols-outlined"
              style={
                  item.active
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
                      : undefined
              }
          >
            {item.icon}
          </span>
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}