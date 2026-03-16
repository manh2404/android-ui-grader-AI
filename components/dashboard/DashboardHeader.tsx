export function DashboardHeader() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Chào buổi sáng, Admin! 👋
                </h1>
                <p className="mt-1 text-slate-500">
                    Dưới đây là tóm tắt hoạt động chấm bài của hệ thống hôm nay.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    <span>7 ngày qua</span>
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Xuất báo cáo</span>
                </button>
            </div>
        </div>
    );
}