import type { AnyObj, AssignmentDetail } from "@/app/ui/grading_detail/type/grading_detail.type";
import { toNum, toText } from "@/app/ui/grading_detail/type/grading_detail.unit";

type Props = {
    assignment: AssignmentDetail | null;
    rubric: AnyObj[];
};

export function SidebarConfig({ assignment, rubric }: Props) {
    return (
        <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Thang điểm</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{assignment?.maxScore || 10}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Rubric</p>

                <div className="mt-3 space-y-3">
                    {rubric.length ? (
                        rubric.map((item: AnyObj, index: number) => (
                            <div key={`${toText(item.code)}-${index}`} className="rounded-2xl bg-white p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{toText(item.title, "Tiêu chí")}</p>
                                        <p className="mt-1 text-sm text-slate-500">{toText(item.description)}</p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        {toNum(item.maxPoints, 0)}đ
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Nguồn chấm: {toText(item.gradingSource, "manual")}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">Chưa có rubric.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
