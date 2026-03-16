type DeadlineInfo = {
    title: string;
    timeLeft: string;
    deadlineText: string;
    progress: number;
};

type Props = {
    info: DeadlineInfo;
};

export function DeadlineCard({ info }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-orange-500">
          timer
        </span>
                <h3 className="font-bold">{info.title}</h3>
            </div>

            <div className="mb-2 text-3xl font-black tracking-tight text-slate-900">
                {info.timeLeft}
            </div>

            <p className="text-sm text-slate-500">{info.deadlineText}</p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full bg-orange-500"
                    style={{ width: `${info.progress}%` }}
                />
            </div>
        </section>
    );
}