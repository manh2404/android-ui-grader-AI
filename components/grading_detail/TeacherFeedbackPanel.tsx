import type { AnyObj } from "@/app/ui/grading_detail/type/grading_detail.type";
import { toText } from "@/app/ui/grading_detail/type/grading_detail.unit";

type Props = {
    detail: AnyObj | null;
    teacherComment: string;
    saving: boolean;
    detailLoading: boolean;
    selectedSubmissionId: string | null;
    onTeacherCommentChange: (comment: string) => void;
    onSave: () => void;
};

export function TeacherFeedbackPanel({
                                         detail,
                                         teacherComment,
                                         saving,
                                         detailLoading,
                                         selectedSubmissionId,
                                         onTeacherCommentChange,
                                         onSave,
                                     }: Props) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">Phản hồi cuối cùng của giảng viên</h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                    <span className="font-semibold text-slate-900">Repository:</span>{" "}
                    {detail?.repositoryUrl ? (
                        <a href={detail.repositoryUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">
                            {detail.repositoryUrl}
                        </a>
                    ) : (
                        "Không có"
                    )}
                </p>

                <p className="mt-3 whitespace-pre-wrap">
                    <span className="font-semibold text-slate-900">Ghi chú sinh viên:</span>{" "}
                    {toText(detail?.note, "Không có ghi chú")}
                </p>
            </div>

            <textarea
                value={teacherComment}
                onChange={(e) => onTeacherCommentChange(e.target.value)}
                className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-orange-300"
                placeholder="Nhập nhận xét cuối cùng của giảng viên..."
            />

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={!selectedSubmissionId || saving || detailLoading}
                    className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? "Đang lưu..." : "Lưu điểm & phản hồi"}
                </button>
            </div>
        </section>
    );
}
