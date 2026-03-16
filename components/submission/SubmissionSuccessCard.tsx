type SuccessInfo = {
    title: string;
    description: string;
    actionLabel: string;
};

type Props = {
    info: SuccessInfo;
};

export function SubmissionSuccessCard({ info }: Props) {
    return (
        <section className="flex gap-4 rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <span className="material-symbols-outlined">check_circle</span>
            </div>

            <div>
                <h3 className="text-lg font-bold text-green-800">{info.title}</h3>
                <p className="mb-3 text-sm text-green-700">{info.description}</p>

                <button className="flex items-center gap-1 text-sm font-bold text-green-800 hover:underline">
                    <span className="material-symbols-outlined text-sm">download</span>
                    {info.actionLabel}
                </button>
            </div>
        </section>
    );
}