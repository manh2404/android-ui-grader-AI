export function ReportFooter() {
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center">
            <p className="text-sm text-slate-500">
                © 2024 EduAnalytics. Tất cả quyền được bảo lưu.
            </p>

            <div className="mt-2 flex justify-center gap-6 text-xs font-medium text-slate-400">
                <a href="#" className="hover:text-orange-500">
                    Điều khoản sử dụng
                </a>
                <a href="#" className="hover:text-orange-500">
                    Chính sách bảo mật
                </a>
                <a href="#" className="hover:text-orange-500">
                    Hỗ trợ
                </a>
            </div>
        </footer>
    );
}