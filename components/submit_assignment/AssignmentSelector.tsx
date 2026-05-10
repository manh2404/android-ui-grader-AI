import type { AssignmentItem } from "@/app/ui/submit_assignment/type/submit_assignment.type";
import { getSubmissionBadge, getSubmissionLabel } from "@/app/ui/submit_assignment/type/submit_assignment.utils";

export function AssignmentSelector({
                                       assignments,
                                       selectedId,
                                       selectedAssignment,
                                       loading,
                                       onSelect,
                                   }: {
    assignments: AssignmentItem[];
    selectedId: string;
    selectedAssignment: AssignmentItem | null;
    loading: boolean;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Chọn bài tập
                </label>
                <select
                    value={selectedId}
                    onChange={(event) => onSelect(event.target.value)}
                    disabled={loading || !assignments.length}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-100"
                >
                    {assignments.length ? (
                        assignments.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.title} {item.classroom ? `- ${item.classroom.code}` : ""}
                            </option>
                        ))
                    ) : (
                        <option value="">Không có bài tập khả dụng</option>
                    )}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Trạng thái hiện tại
                </label>
                <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                    <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getSubmissionBadge(
                            selectedAssignment?.latestSubmission?.status
                        )}`}
                    >
                        {getSubmissionLabel(selectedAssignment?.latestSubmission?.status)}
                    </span>
                </div>
            </div>
        </div>
    );
}
