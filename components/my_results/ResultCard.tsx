import type { ResultItem } from "@/app/ui/my_results/type/my_results.type";
import { formatDate, formatDateTime, formatScore, gradeStatusClass, gradeStatusLabel } from "@/app/ui/my_results/type/my_results.utils";

type ResultCardProps = {
    item: ResultItem;
    active: boolean;
    isTeacherView: boolean;
    onSelect: (id: string) => void;
};

export function ResultCard({ item, active, isTeacherView, onSelect }: ResultCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(item._id)}
            className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${
                active
                    ? "border-orange-300 bg-orange-50/40"
                    : "border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50"
            }`}
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        {item.classroomCode ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {item.classroomCode}
              </span>
                        ) : null}

                        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${gradeStatusClass(item.gradeStatus)}`}>
              {gradeStatusLabel(item.gradeStatus)}
            </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-slate-900">{item.assignmentTitle}</h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {item.classroomName} • Hạn nộp: {formatDate(item.dueAt)} • Nộp lần {item.attemptNo}
                    </p>

                    {isTeacherView ? (
                        <p className="mt-2 text-sm font-medium text-slate-700">
                            Sinh viên: {item.studentName}{item.studentCode ? ` • ${item.studentCode}` : ""}
                        </p>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Nhận xét AI</p>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-blue-900">
                                {item.aiSummary || "Chưa có nhận xét AI cho bài tập này."}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Nhận xét giảng viên</p>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-orange-900">
                                {item.teacherComment || "Giảng viên chưa để lại nhận xét cuối cùng."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-w-[170px] flex-row items-center justify-between gap-4 border-t border-slate-200 pt-4 lg:flex-col lg:items-end lg:justify-start lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <div className="text-left lg:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm hiện tại</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                            {formatScore(item.finalScore)}
                            <span className="text-sm font-medium text-slate-400"> / {item.maxScore}</span>
                        </p>
                    </div>

                    <div className="text-xs text-slate-500 lg:text-right">
                        <p>Nộp lúc: {formatDateTime(item.submittedAt)}</p>
                    </div>
                </div>
            </div>
        </button>
    );
}
