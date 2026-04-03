import type { AccountCourseItem } from "@/app/ui/account/type/account.types";

type Props = {
    course: AccountCourseItem;
};

function getCourseBadge(seed: string) {
    const chars = seed.trim().slice(0, 2).toUpperCase() || "CL";
    return chars;
}

export function CourseCard({ course }: Props) {
    return (
        <article className="flex gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-xl font-bold text-white">
                {getCourseBadge(course.code || course.title)}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-base font-bold text-slate-900">{course.title}</h3>

                <p className="mt-1 text-sm text-slate-500">{course.subtitle}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600">{course.code || "Chưa có mã lớp"}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">GV: {course.teacherName || "Chưa cập nhật"}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">SV: {course.studentCount}</span>
                </div>
            </div>
        </article>
    );
}
