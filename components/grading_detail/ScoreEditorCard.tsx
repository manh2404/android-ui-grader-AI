import type { AnyObj } from "@/app/ui/grading_detail/type/grading_detail.type";
import { formatDateTime, formatScore, toNum } from "@/app/ui/grading_detail/type/grading_detail.unit";

type Props = {
    detail: AnyObj | null;
    maxScore: number;
    manualScore: string;
    onManualScoreChange: (score: string) => void;
};

export function ScoreEditorCard({ detail, maxScore, manualScore, onManualScoreChange }: Props) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 xl:col-span-1">
            <p className="text-xs font-bold uppercase text-slate-500">Điểm hiện tại</p>

            <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-black text-slate-900">
                    {formatScore(detail?.finalScore ?? detail?.autoGrade?.score ?? null)}
                </span>
                <span className="pb-1 text-sm text-slate-400">/ {maxScore}</span>
            </div>

            <label className="mt-6 block text-sm font-semibold text-slate-700">Điểm thủ công</label>
            <input
                value={manualScore}
                onChange={(e) => onManualScoreChange(e.target.value)}
                type="number"
                min={0}
                max={maxScore}
                step="0.1"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
            />

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                    <span>Điểm AI</span>
                    <span className="font-semibold text-slate-900">
                        {formatScore(detail?.autoGrade?.score)} / {toNum(detail?.autoGrade?.maxScore, maxScore)}
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span>Chuẩn hóa</span>
                    <span className="font-semibold text-slate-900">
                        {formatScore(detail?.autoGrade?.normalizedScore)}%
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span>Chấm lúc</span>
                    <span className="font-semibold text-slate-900">
                        {formatDateTime(detail?.autoGrade?.gradedAt)}
                    </span>
                </div>
            </div>
        </section>
    );
}
