import type { SelectOption } from "@/app/ui/my_results/type/my_results.type";

type ResultsFiltersProps = {
    keyword: string;
    classFilter: string;
    statusFilter: string;
    classOptions: SelectOption[];
    onKeywordChange: (value: string) => void;
    onClassFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
};

export function ResultsFilters({
                                   keyword,
                                   classFilter,
                                   statusFilter,
                                   classOptions,
                                   onKeywordChange,
                                   onClassFilterChange,
                                   onStatusFilterChange,
                               }: ResultsFiltersProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr,1fr,1fr] xl:grid-cols-[2fr,1fr,1fr]">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tìm kiếm bài tập
                    </label>
                    <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
                        <input
                            value={keyword}
                            onChange={(event) => onKeywordChange(event.target.value)}
                            placeholder="Nhập tên bài tập hoặc tên lớp học"
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Lớp học
                    </label>
                    <select
                        value={classFilter}
                        onChange={(event) => onClassFilterChange(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300"
                    >
                        <option value="all">Tất cả lớp học</option>
                        {classOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Trạng thái
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(event) => onStatusFilterChange(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300"
                    >
                        <option value="all">Tất cả</option>
                        <option value="graded">Đã có điểm</option>
                        <option value="pending">Chưa chấm</option>
                        <option value="late">Nộp trễ</option>
                        <option value="submitted">Đã nộp</option>
                    </select>
                </div>
            </div>
        </section>
    );
}
