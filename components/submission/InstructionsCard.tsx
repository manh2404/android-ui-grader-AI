type InstructionItem = {
    step: number;
    text: string;
};

type Props = {
    items: InstructionItem[];
};

export function InstructionsCard({ items }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 font-bold">
                <span className="material-symbols-outlined text-orange-500">info</span>
                Hướng dẫn nộp bài
            </h3>

            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.step} className="flex items-start gap-3 text-sm">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">
                            {item.step}
                        </div>

                        <p className="text-slate-600">{item.text}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}