type PreviewContent = {
    fileName: string;
    title: string;
    intro: string;
    code: string[];
    outro: string;
};

type Props = {
    content: PreviewContent;
};

export function SubmissionPreviewCard({ content }: Props) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">description</span>
                    <h3 className="font-bold">
                        Bài làm: <span className="text-orange-500">{content.fileName}</span>
                    </h3>
                </div>

                <div className="flex gap-2">
                    <button className="rounded-lg p-2 transition hover:bg-slate-200">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                    <button className="rounded-lg p-2 text-orange-500 transition hover:bg-slate-200">
                        <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                </div>
            </div>

            <div className="min-h-[400px] p-8">
                <div className="flex flex-col gap-4">
                    <h4 className="mb-4 border-b pb-2 text-xl font-bold">{content.title}</h4>

                    <p className="leading-relaxed text-slate-700">{content.intro}</p>

                    <div className="rounded-lg border-l-4 border-orange-500 bg-slate-100 p-4 font-mono text-sm">
                        {content.code.map((line) => (
                            <div key={line} className="text-slate-700">
                                {line}
                            </div>
                        ))}
                    </div>

                    <p className="leading-relaxed text-slate-700">{content.outro}</p>
                </div>
            </div>
        </section>
    );
}