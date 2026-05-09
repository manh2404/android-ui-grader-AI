import type { ResultItem } from "@/app/ui/my_results/type/my_results.type";
import { formatDateTime } from "@/app/ui/my_results/type/my_results.utils";

type SubmissionInfoCardProps = { item: ResultItem };

export function SubmissionInfoCard({ item }: SubmissionInfoCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Thông tin bài nộp</p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <p>
                    <span className="font-semibold text-slate-900">Thời gian nộp:</span> {formatDateTime(item.submittedAt)}
                </p>
                <p>
                    <span className="font-semibold text-slate-900">Ghi chú của bạn:</span> {item.studentNote || "Không có ghi chú"}
                </p>
                <p className="break-all">
                    <span className="font-semibold text-slate-900">Repository:</span>{" "}
                    {item.repositoryUrl ? (
                        <a href={item.repositoryUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">
                            {item.repositoryUrl}
                        </a>
                    ) : (
                        "Không có"
                    )}
                </p>
            </div>
        </div>
    );
}
