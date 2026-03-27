type ReportPageHeaderData = {
    breadcrumbStart: string;
    breadcrumbCurrent: string;
    title: string;
    description: string;
};

type Props = {
    data: ReportPageHeaderData;
};

export function ReportPageHeader({ data }: Props) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                    <span>{data.breadcrumbStart}</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="font-medium text-orange-500">{data.breadcrumbCurrent}</span>
                </nav>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {data.title}
                </h1>

                <p className="mt-1 text-slate-600">{data.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    Bộ lọc
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Xuất báo cáo (PDF/Excel)
                </button>
            </div>
        </div>
    );
}