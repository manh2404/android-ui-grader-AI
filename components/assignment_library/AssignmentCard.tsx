type AssignmentItem = {
    title: string;
    subject: string;
    duration: string;
    status: string;
    statusClassName: string;
    gradientClassName: string;
    icon: string;
    iconColorClassName: string;
    iconBgClassName: string;
    classBadges: string[];
    classText: string;
    createdAt: string;
    actionIcon: string;
};

type Props = {
    item: AssignmentItem;
};

export function AssignmentCard({ item }: Props) {
    return (
        <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-xl">
            <div
                className={`relative flex h-32 items-start justify-between overflow-hidden p-4 ${item.gradientClassName}`}
            >
                <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-8xl">{item.icon}</span>
                </div>

                <span className={`rounded px-2 py-1 text-xs font-bold uppercase tracking-wider ${item.statusClassName}`}>
          {item.status}
        </span>

                <div className={`rounded-lg p-2 shadow-sm backdrop-blur ${item.iconBgClassName}`}>
          <span className={`material-symbols-outlined ${item.iconColorClassName}`}>
            {item.icon === "functions"
                ? "calculate"
                : item.icon === "terminal"
                    ? "code"
                    : "bolt"}
          </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="mb-2 text-lg font-bold leading-tight transition-colors hover:text-orange-500">
                    {item.title}
                </h3>

                <p className="mb-4 text-sm text-slate-500">
                    Môn: {item.subject} • {item.duration}
                </p>

                <div className="mb-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {item.classBadges.map((badge) => (
                            <div
                                key={badge}
                                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold"
                            >
                                {badge}
                            </div>
                        ))}
                    </div>

                    <span className="text-xs text-slate-400">{item.classText}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Ngày tạo
            </span>
                        <span className="text-xs font-medium">{item.createdAt}</span>
                    </div>

                    <div className="flex gap-2">
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-500">
              <span className="material-symbols-outlined text-xl">
                {item.actionIcon}
              </span>
                        </button>

                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-500">
                            <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}