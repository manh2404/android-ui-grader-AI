import { AddClassCard } from "./AddClassCard";
import { ClassCard } from "./ClassCard";

type TeachingClass = {
    title: string;
    classCode: string;
    studentCount: string;
    progress: number;
    gradientClassName: string;
};

type Props = {
    items: TeachingClass[];
};

export function ClassesGrid({ items }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <ClassCard key={item.classCode} item={item} />
            ))}

            <AddClassCard />
        </div>
    );
}