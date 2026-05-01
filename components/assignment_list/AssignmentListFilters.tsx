"use client";

import type { SelectOption } from "@/app/ui/assignment_list/type/assignment_list.type";

type AssignmentListFiltersProps = {
    keyword: string;
    statusFilter: string;
    classFilter: string;
    classOptions: SelectOption[];
    onKeywordChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onClassFilterChange: (value: string) => void;
};

export default function AssignmentListFilters({
                                                  keyword,
                                                  statusFilter,
                                                  classFilter,
                                                  classOptions,
                                                  onKeywordChange,
                                                  onStatusFilterChange,
                                                  onClassFilterChange,
                                              }: AssignmentListFiltersProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[2fr,1fr,1fr]">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        search
                    </span>
                    <input
                        value={keyword}
                        onChange={(event) => onKeywordChange(event.target.value)}
                        placeholder="Tìm tên bài tập, mô tả, mã lớp..."
                        className="h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đang mở</option>
                    <option value="closed">Đã đóng</option>
                    <option value="draft">Bản nháp</option>
                </select>

                <select
                    value={classFilter}
                    onChange={(event) => onClassFilterChange(event.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                    <option value="all">Tất cả lớp học</option>
                    {classOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
}
