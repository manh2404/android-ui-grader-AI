type PaginationData = {
    summary: string;
    pages: number[];
    currentPage: number;
};

type Props = {
    data: PaginationData;
};

export function PaginationBar({ data }: Props) {
    return (
        <div className="mt-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">{data.summary}</p>

            <div className="flex items-center gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {data.pages.map((page) => (
                    <button
                        key={page}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            data.currentPage === page
                                ? "bg-orange-500 font-bold text-white"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
}