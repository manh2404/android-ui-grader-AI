import { formatScore } from "@/app/ui/dashboard/type/dashboard.utils";

export function SubmissionTooltip({
                                      active,
                                      payload,
                                      label,
                                  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">
                {payload[0].value} lượt nộp
            </p>
        </div>
    );
}

export function ScoreTooltip({
                                 active,
                                 payload,
                                 label,
                             }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-orange-600">
                Điểm trung bình: {formatScore(payload[0].value)}/10
            </p>
        </div>
    );
}
