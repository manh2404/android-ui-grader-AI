import type { ResultItem } from "@/app/ui/my_results/type/my_results.type";
import { formatDate, formatScore, gradeStatusLabel } from "@/app/ui/my_results/type/my_results.utils";
import { CriterionBreakdown } from "./CriterionBreakdown";
import { FeedbackListCard } from "./FeedbackListCard";
import { SubmissionInfoCard } from "./SubmissionInfoCard";

type ResultDetailPanelProps = { item: ResultItem | null };

export function ResultDetailPanel({ item }: ResultDetailPanelProps) {
    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
            {!item ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                    Chọn một bài tập ở bên trái để xem chi tiết điểm số và nhận xét.
                </div>
            ) : (
                <div className="space-y-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Chi tiết bài tập</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.assignmentTitle}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.classroomName} • Hạn nộp {formatDate(item.dueAt)}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm cuối cùng</p>
                        <div className="mt-3 flex items-end gap-2">
                            <span className="text-5xl font-black text-slate-900">{formatScore(item.finalScore)}</span>
                            <span className="pb-1 text-sm text-slate-400">/ {item.maxScore}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">Trạng thái: {gradeStatusLabel(item.gradeStatus)}</p>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Nhận xét cuối cùng của giảng viên</p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-orange-950">
                            {item.teacherComment || "Giảng viên chưa để lại phản hồi cuối cùng."}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Tóm tắt AI</p>
                        <p className="mt-3 text-sm leading-7 text-blue-950">
                            {item.aiSummary || "Bài này chưa có phần tóm tắt AI."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        <FeedbackListCard
                            title="Điểm mạnh"
                            items={item.strengths}
                            emptyText="Chưa có nhận xét."
                            className="border-green-200 bg-green-50 text-green-950 [&>p]:text-green-700"
                        />
                        <FeedbackListCard
                            title="Bước tiếp theo"
                            items={item.nextSteps}
                            emptyText="Chưa có gợi ý."
                            className="border-indigo-200 bg-indigo-50 text-indigo-950 [&>p]:text-indigo-700"
                        />
                    </div>

                    <SubmissionInfoCard item={item} />
                    <CriterionBreakdown items={item.criterionBreakdown} />
                </div>
            )}
        </aside>
    );
}
