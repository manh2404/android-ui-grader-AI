export function ClassesFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2 text-orange-500 opacity-80 grayscale">
                    <span className="material-symbols-outlined">auto_stories</span>
                    <span className="font-bold">AutoGrade</span>
                </div>

                <div className="text-sm text-slate-500">
                    © 2023 AutoGrade System. Hệ thống chấm điểm tự động.
                </div>

                <div className="flex gap-6 text-sm font-medium text-slate-600">
                    <a href="#" className="hover:text-orange-500">
                        Điều khoản
                    </a>
                    <a href="#" className="hover:text-orange-500">
                        Bảo mật
                    </a>
                    <a href="#" className="hover:text-orange-500">
                        Hỗ trợ
                    </a>
                </div>
            </div>
        </footer>
    );
}