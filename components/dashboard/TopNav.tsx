const navItems = ["Tổng quan", "Lớp học", "Bài tập", "Cấu hình"];

export function TopNav() {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-6">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <span className="material-symbols-outlined">auto_stories</span>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">AutoGrading AI</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navItems.map((item, index) => (
                            <a
                                key={item}
                                href="#"
                                className={`pb-1 text-sm font-medium transition ${
                                    index === 0
                                        ? "border-b-2 border-orange-500 text-orange-500"
                                        : "text-slate-600 hover:text-orange-500"
                                }`}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp học, học sinh..."
                            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white"
                        />
                    </div>

                    <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}