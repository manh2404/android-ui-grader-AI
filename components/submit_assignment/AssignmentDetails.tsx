import type { AssignmentItem } from "@/app/ui/submit_assignment/type/submit_assignment.type";
import { MarkdownBlock } from "./MarkdownBlock";

export function AssignmentDetails({ assignment }: { assignment: AssignmentItem }) {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    {assignment.title}
                </h2>
                <p className="mt-1 text-slate-500">
                    {assignment.classroom
                        ? `${assignment.classroom.name} (${assignment.classroom.code})`
                        : "Chưa có thông tin lớp học"}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                    Mô tả bài tập
                </p>
                <MarkdownBlock content={assignment.description} />
            </div>

            {assignment.rubricText ? (
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                    <p className="mb-3 font-semibold text-orange-700">
                        Rubric / thang điểm
                    </p>
                    <MarkdownBlock content={assignment.rubricText} variant="rubric" />
                </div>
            ) : null}
        </>
    );
}
