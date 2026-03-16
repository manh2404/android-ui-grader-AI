export function CreateAssignmentTopBar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-20">
            <div className="flex items-center gap-4">
                <div className="text-orange-500">
                    <span className="material-symbols-outlined text-4xl">grade</span>
                </div>

                <div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight">
                        AutoGrade
                    </h1>
                    <p className="text-xs text-slate-500">
                        Hệ thống chấm điểm tự động
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="hidden h-10 min-w-[100px] items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 md:flex">
                    Hủy bỏ
                </button>

                <button className="flex h-10 min-w-[120px] items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:brightness-110">
                    <span className="truncate">Lưu bài tập</span>
                </button>

                <button className="flex rounded-xl bg-slate-100 p-2 md:hidden">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </header>
    );
}