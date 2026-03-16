export function AccountTopBar() {
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-[#f8f6f6]/90 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
          <span className="material-symbols-outlined text-[20px]">
            account_circle
          </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight">Tài khoản</h1>
            </div>

            <div className="flex items-center gap-2">
                <button className="rounded-full p-2 transition hover:bg-slate-200">
                    <span className="material-symbols-outlined">search</span>
                </button>

                <button className="rounded-full p-2 transition hover:bg-slate-200">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    );
}