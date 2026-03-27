type FilterOption = {
    label: string;
    value: string;
};

type AssignmentSearchFilters = {
    statusOptions: FilterOption[];
    classOptions: FilterOption[];
};

type Props = {
    data: AssignmentSearchFilters;
};

export function AssignmentSearchBar({ data }: Props) {
    return (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên bài tập, mã lớp..."
                        className="w-full rounded-xl border-none bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <select className="rounded-xl border-none bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-orange-200">
                        {data.statusOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <select className="rounded-xl border-none bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-orange-200">
                        {data.classOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <button className="flex h-[48px] w-[48px] items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-slate-100">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>
        </section>
    );
}