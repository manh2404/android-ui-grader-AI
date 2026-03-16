import { CourseCard } from "./CourseCard";

type Course = {
    title: string;
    schedule: string;
    progress: number;
    imageUrl: string;
};

type Props = {
    items: Course[];
};

export function CurrentCoursesSection({ items }: Props) {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between px-2">
                <h3 className="text-lg font-bold">Lớp học đang tham gia</h3>
                <button className="text-sm font-semibold text-orange-500">
                    Xem tất cả
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((course) => (
                    <CourseCard key={course.title} course={course} />
                ))}
            </div>
        </section>
    );
}