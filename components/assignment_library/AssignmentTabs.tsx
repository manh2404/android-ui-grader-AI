type TabItem = {
    label: string;
    active?: boolean;
};

type Props = {
    items: TabItem[];
};

export function AssignmentTabs({ items }: Props) {
    return (
        <div className="mb-8 flex overflow-x-auto whitespace-nowrap border-b border-slate-200">
            {items.map((item) => (
                <button
                    key={item.label}
                    className={`px-6 py-3 text-sm ${
                        item.active
                            ? "border-b-2 border-orange-500 font-bold text-orange-500"
                            : "border-b-2 border-transparent font-semibold text-slate-500 hover:text-slate-700"
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}