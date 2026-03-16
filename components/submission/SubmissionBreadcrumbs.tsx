type BreadcrumbItem = {
    label: string;
    active?: boolean;
};

type Props = {
    items: BreadcrumbItem[];
};

export function SubmissionBreadcrumbs({ items }: Props) {
    return (
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            {items.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
          <span className={item.active ? "font-bold text-orange-500" : ""}>
            {item.label}
          </span>

                    {index < items.length - 1 && (
                        <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
                    )}
                </div>
            ))}
        </nav>
    );
}