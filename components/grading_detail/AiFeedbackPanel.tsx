import type { AnyObj } from "@/app/ui/grading_detail/type/grading_detail.type";
import { toText } from "@/app/ui/grading_detail/type/grading_detail.unit";

type Props = {
    detail: AnyObj | null;
};

export function AiFeedbackPanel({ detail }: Props) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">Nhận xét AI</h3>

            {!detail?.autoGrade ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Bài này chưa được chấm AI.
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {toText(detail?.autoGrade?.aiFeedback?.summary) && (
                        <div className="rounded-2xl bg-orange-50 px-4 py-4 text-sm leading-7 text-slate-700">
                            {toText(detail?.autoGrade?.aiFeedback?.summary)}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FeedbackList
                            title="Điểm mạnh"
                            emptyText="Chưa có nhận xét."
                            items={detail?.autoGrade?.aiFeedback?.strengths || []}
                            className="border-green-200 bg-green-50 text-green-900"
                            titleClassName="text-green-700"
                        />

                        <FeedbackList
                            title="Bước tiếp theo"
                            emptyText="Chưa có gợi ý."
                            items={detail?.autoGrade?.aiFeedback?.nextSteps || []}
                            className="border-blue-200 bg-blue-50 text-blue-900"
                            titleClassName="text-blue-700"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

type FeedbackListProps = {
    title: string;
    emptyText: string;
    items: string[];
    className: string;
    titleClassName: string;
};

function FeedbackList({ title, emptyText, items, className, titleClassName }: FeedbackListProps) {
    return (
        <div className={`rounded-2xl border p-4 ${className}`}>
            <p className={`text-xs font-bold uppercase ${titleClassName}`}>{title}</p>
            <ul className="mt-3 space-y-2 text-sm">
                {items.length ? items.map((item) => <li key={item}>• {item}</li>) : <li>{emptyText}</li>}
            </ul>
        </div>
    );
}
