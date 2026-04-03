import { CourseCard } from "./CourseCard";
import type { AccountCourseItem } from "@/app/ui/account/type/account.types";

type Props = {
    items: AccountCourseItem[];
};

export function CurrentCoursesSection({ items }: Props) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Lớp học đang tham gia</h2>
                    <p className="text-sm text-slate-500">Danh sách lớp của tài khoản hiện tại.</p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                    {items.length} lớp
                </span>
            </div>

            {!items.length ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                    Tài khoản này chưa có lớp học nào để hiển thị.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {items.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            )}
        </section>
    );
}
