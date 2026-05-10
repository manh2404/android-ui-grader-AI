import type { AssignmentItem } from "@/app/ui/submit_assignment/type/submit_assignment.type";
import { formatDateTime, getSubmissionLabel } from "@/app/ui/submit_assignment/type/submit_assignment.utils";

export function LatestSubmissionCard({ assignment }: { assignment: AssignmentItem | null }) {
    const latestSubmission = assignment?.latestSubmission;

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Lần nộp gần nhất</h3>
            {latestSubmission ? (
                <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-slate-500">Lần nộp</p>
                        <p className="font-semibold text-slate-900">
                            #{latestSubmission.attemptNo}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-slate-500">Thời gian</p>
                        <p className="font-semibold text-slate-900">
                            {formatDateTime(latestSubmission.submittedAt)}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-slate-500">Trạng thái</p>
                        <p className="font-semibold text-slate-900">
                            {getSubmissionLabel(latestSubmission.status)}
                        </p>
                    </div>
                    {latestSubmission.repositoryUrl ? (
                        <a
                            href={latestSubmission.repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-words rounded-2xl bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                        >
                            {latestSubmission.repositoryUrl}
                        </a>
                    ) : null}
                    {latestSubmission.files.length ? (
                        <div className="space-y-2">
                            {latestSubmission.files.map((file) => (
                                <a
                                    key={file.url}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block break-words rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                >
                                    {file.originalName}
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : (
                <p className="text-sm text-slate-500">Bạn chưa có lần nộp nào cho bài tập này.</p>
            )}
        </section>
    );
}
