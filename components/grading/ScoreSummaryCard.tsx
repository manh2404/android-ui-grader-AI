type ScoreSummary = {
    value: string;
    total: string;
};

type Props = {
    score: ScoreSummary;
};

export function ScoreSummaryCard({ score }: Props) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Điểm trung bình AI
            </p>

            <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                    <circle
                        className="text-slate-100"
                        cx="64"
                        cy="64"
                        r="58"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                    />
                    <circle
                        className="text-orange-500"
                        cx="64"
                        cy="64"
                        r="58"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="364.4"
                        strokeDashoffset="54.6"
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900">{score.value}</span>
                    <span className="text-xs text-slate-400">/ {score.total}</span>
                </div>
            </div>

            <button className="w-full rounded-lg bg-slate-100 py-2 text-sm font-bold transition hover:bg-orange-500 hover:text-white">
                Sửa điểm thủ công
            </button>
        </section>
    );
}