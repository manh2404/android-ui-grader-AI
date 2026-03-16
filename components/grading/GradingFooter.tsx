export function GradingFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 px-10 py-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
                <p>© 2024 AI Grading System. Phát triển bởi EduTech Global.</p>

                <div className="flex gap-6">
                    <a href="#" className="transition hover:text-orange-500">
                        Hướng dẫn
                    </a>
                    <a href="#" className="transition hover:text-orange-500">
                        Chính sách bảo mật
                    </a>
                    <a href="#" className="transition hover:text-orange-500">
                        Hỗ trợ kỹ thuật
                    </a>
                </div>
            </div>
        </footer>
    );
}