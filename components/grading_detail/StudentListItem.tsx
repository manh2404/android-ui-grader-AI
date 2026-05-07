import type { SidebarStudent } from "@/app/ui/grading_detail/type/grading_detail.type";

type Props = {
    student: SidebarStudent;
    active: boolean;
    onSelect: () => void;
};

export function StudentListItem({ student, active, onSelect }: Props) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                active ? "border-orange-200 bg-orange-50" : "border-transparent hover:bg-slate-50"
            }`}
        >
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    active ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"
                }`}
            >
                <span className="text-sm font-bold">{student.name.slice(0, 2).toUpperCase()}</span>
            </div>

            <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${active ? "font-bold" : "font-semibold"}`}>{student.name}</p>
                <p
                    className={`mt-1 truncate text-xs ${
                        student.missing ? "text-rose-500" : active ? "text-orange-600" : "text-slate-500"
                    }`}
                >
                    {student.studentCode ? `${student.studentCode} • ` : ""}
                    {student.statusText}
                </p>
            </div>

            <div
                className={`text-xl font-bold ${
                    active ? "text-orange-600" : student.missing ? "text-slate-300" : "text-slate-800"
                }`}
            >
                {student.scoreText}
            </div>
        </button>
    );
}
