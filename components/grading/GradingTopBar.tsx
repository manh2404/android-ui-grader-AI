export function GradingTopBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md md:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-orange-500">
            assignment_turned_in
          </span>

                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight">
                            Chi tiết & Chấm điểm
                        </h1>
                        <p className="text-xs text-slate-500">Hệ thống hỗ trợ chấm điểm AI</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100">
                        <span className="material-symbols-outlined">settings_suggest</span>
                    </button>

                    <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:opacity-90">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Chấm lại toàn bộ
                    </button>
                </div>
            </div>
        </header>
    );
}