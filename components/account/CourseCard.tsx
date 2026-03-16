type Course = {
    title: string;
    schedule: string;
    progress: number;
    imageUrl: string;
};

type Props = {
    course: Course;
};

export function CourseCard({ course }: Props) {
    return (
        <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div
                className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${course.imageUrl}')` }}
            />

            <div className="flex flex-1 flex-col justify-center">
                <h4 className="text-base font-bold leading-snug">{course.title}</h4>

                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <span className="material-symbols-outlined text-xs">
            calendar_today
          </span>
                    {course.schedule}
                </p>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full bg-orange-500"
                        style={{ width: `${course.progress}%` }}
                    />
                </div>

                <p className="mt-1 text-[10px] font-medium uppercase text-slate-400">
                    Tiến độ: {course.progress}%
                </p>
            </div>
        </div>
    );
}