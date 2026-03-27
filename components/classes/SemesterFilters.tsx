type SemesterFilter = {
    label: string;
    icon?: string;
    active?: boolean;
};

type Props = {
    items: SemesterFilter[];
};

export function SemesterFilters({ items }: Props) {
    return (
        <div className="mb-8 flex flex-wrap items-center gap-3">
      <span className="mr-2 text-sm font-bold uppercase tracking-wider text-slate-400">
        Học kỳ:
      </span>

            {items.map((item) => (
                <button
                    key={item.label}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        item.active
                            ? "bg-orange-500 text-white"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-orange-500"
                    }`}
                >
                    {item.label}
                    <span className="material-symbols-outlined text-[18px]">
            {item.icon ?? "expand_more"}
          </span>
                </button>
            ))}
        </div>
    );
}