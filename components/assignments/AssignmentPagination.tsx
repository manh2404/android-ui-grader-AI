type PaginationData = {
    summary: string;
    pages: number[];
    currentPage: number;
};

type Props = {
    data: PaginationData;
};

export function AssignmentPagination({ data }: Props) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-b-2xl border border-t-0 border-slate-200 bg-white px-4 py-4 md:flex-row">
            <p className="text-sm text-slate-400">{data.summary}</p>

            <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100">
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
                </button>

                {data.pages.map((page) => (
                    <button
                        key={page}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
                            data.currentPage === page
                                ? "bg-orange-500 text-white"
                                : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100">
          <span className="material-symbols-outlined text-[18px]">
            chevron_right
          </span>
                </button>
            </div>
        </div>
    );
}