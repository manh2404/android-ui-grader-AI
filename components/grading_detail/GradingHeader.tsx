import Link from "next/link";
import type { AssignmentDetail, AssignmentOption } from "@/app/ui/grading_detail/type/grading_detail.type";
import { formatDate, formatDateTime } from "@/app/ui/grading_detail/type/grading_detail.unit";
import { AlertMessages } from "./AlertMessages";

type Props = {
    assignment: AssignmentDetail | null;
    assignmentId: string;
    assignmentOptions: AssignmentOption[];
    selectedSubmissionId: string | null;
    grading: boolean;
    detailLoading: boolean;
    error: string;
    notice: string;
    onChangeAssignment: (assignmentId: string) => void;
    onGrade: (regenerateAi: boolean) => void;
};

export function GradingHeader({
                                  assignment,
                                  assignmentId,
                                  assignmentOptions,
                                  selectedSubmissionId,
                                  grading,
                                  detailLoading,
                                  error,
                                  notice,
                                  onChangeAssignment,
                                  onGrade,
                              }: Props) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/ui/assignment_list" className="hover:text-orange-600">
                            Bài tập
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-slate-700">Chấm bài</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        {assignment?.title || "Chi tiết chấm bài"}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Lớp: {assignment?.classroom?.name || "--"} • Hạn nộp: {formatDateTime(assignment?.dueAt)}
                    </p>

                    <div className="mt-4 flex flex-col gap-2 sm:max-w-md">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Chọn bài tập để chấm
                        </label>

                        <select
                            value={assignmentId}
                            onChange={(e) => onChangeAssignment(e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                        >
                            {assignmentOptions.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.title}
                                    {item.classroomName ? ` • ${item.classroomName}` : ""}
                                    {item.dueAt ? ` • ${formatDate(item.dueAt)}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onGrade(false)}
                        disabled={!selectedSubmissionId || grading || detailLoading}
                        className="rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Chấm AI
                    </button>

                    <button
                        type="button"
                        onClick={() => onGrade(true)}
                        disabled={!selectedSubmissionId || grading || detailLoading}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Chấm lại AI
                    </button>
                </div>
            </div>

            <AlertMessages error={error} notice={notice} />
        </section>
    );
}
