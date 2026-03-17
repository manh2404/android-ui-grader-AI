export function AssignmentLibraryFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2 opacity-50 grayscale">
                    <div className="rounded bg-orange-500 p-1 text-white">
                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                    </div>
                    <span className="text-sm font-bold tracking-tight">AutoGrade</span>
                </div>

                <p className="text-xs text-slate-400">
                    © 2023 AutoGrade LMS. Tất cả quyền được bảo lưu.
                </p>

                <div className="flex gap-6">
                    <a href="#" className="text-xs text-slate-400 transition hover:text-orange-500">
                        Trợ giúp
                    </a>
                    <a href="#" className="text-xs text-slate-400 transition hover:text-orange-500">
                        Điều khoản
                    </a>
                    <a href="#" className="text-xs text-slate-400 transition hover:text-orange-500">
                        Bảo mật
                    </a>
                </div>
            </div>
        </footer>
    );
}