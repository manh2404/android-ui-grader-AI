type FilterOption = {
    label: string;
    value: string;
};

type FilterData = {
    subjectOptions: FilterOption[];
    classOptions: FilterOption[];
};

type Props = {
    data: FilterData;
};

export function SearchFilterBar({ data }: Props) {
    return (
        <section className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
            <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>

                <input
                    type="text"
                    placeholder="Tìm kiếm tên bài tập, mã bài..."
                    className="w-full rounded-lg border-none bg-[#f8f6f6] py-2.5 pl-10 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-orange-200"
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <select className="rounded-lg border-none bg-[#f8f6f6] px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-200">
                    {data.subjectOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                <select className="rounded-lg border-none bg-[#f8f6f6] px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-200">
                    {data.classOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                <div className="flex rounded-lg bg-[#f8f6f6] p-1">
                    <button className="rounded-md bg-white p-1.5 text-orange-500 shadow-sm">
                        <span className="material-symbols-outlined block">grid_view</span>
                    </button>
                    <button className="rounded-md p-1.5 text-slate-400">
                        <span className="material-symbols-outlined block">view_list</span>
                    </button>
                </div>
            </div>
        </section>
    );
}