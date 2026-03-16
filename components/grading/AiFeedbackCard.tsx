type Feedback = {
    strengths: string[];
    weaknesses: string[];
    conclusion: string;
};

type Props = {
    feedback: Feedback;
};

export function AiFeedbackCard({ feedback }: Props) {
    return (
        <section className="relative overflow-hidden rounded-xl border-2 border-orange-100 bg-orange-50/60 p-6">
            <div className="absolute -right-4 -top-4 opacity-10">
        <span className="material-symbols-outlined text-[120px] text-orange-500">
          auto_awesome
        </span>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-orange-500">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Nhận xét từ AI</h3>
                </div>

                <div>
                    <div className="mb-1 flex items-center gap-2 text-green-600">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span className="text-xs font-bold uppercase">Ưu điểm</span>
                    </div>

                    <ul className="list-inside list-disc pl-2 text-sm leading-relaxed text-slate-600">
                        {feedback.strengths.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="mb-1 flex items-center gap-2 text-orange-600">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span className="text-xs font-bold uppercase">Hạn chế</span>
                    </div>

                    <ul className="list-inside list-disc pl-2 text-sm leading-relaxed text-slate-600">
                        {feedback.weaknesses.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-orange-100 pt-2">
                    <p className="text-xs italic text-slate-500">"{feedback.conclusion}"</p>
                </div>
            </div>
        </section>
    );
}