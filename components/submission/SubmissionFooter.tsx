export function SubmissionFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-6">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
                <p>© 2023 Hệ thống Quản lý Học tập - Đại học Công nghệ</p>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-orange-500">
                        Quy định
                    </a>
                    <a href="#" className="hover:text-orange-500">
                        Chính sách bảo mật
                    </a>
                    <a href="#" className="hover:text-orange-500">
                        Hỗ trợ
                    </a>
                </div>
            </div>
        </footer>
    );
}