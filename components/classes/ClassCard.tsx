type TeachingClass = {
    title: string;
    classCode: string;
    studentCount: string;
    progress: number;
    gradientClassName: string;
};

type Props = {
    item: TeachingClass;
};

export function ClassCard({ item }: Props) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div
                className={`relative flex h-32 flex-col justify-end p-6 ${item.gradientClassName}`}
            >
                <div className="absolute right-4 top-4 rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-md">
                    <span className="material-symbols-outlined">more_vert</span>
                </div>

                <h3 className="text-xl font-bold leading-tight text-white">
                    {item.title}
                </h3>
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="mb-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">
              fingerprint
            </span>
                        <span className="text-sm font-medium">
              Mã lớp: <span className="text-slate-900">{item.classCode}</span>
            </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">group</span>
                        <span className="text-sm font-medium">
              Sĩ số: <span className="text-slate-900">{item.studentCount}</span>
            </span>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Tiến độ trung bình
            </span>
                        <span className="text-sm font-bold text-orange-500">
              {item.progress}%
            </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${item.progress}%` }}
                        />
                    </div>
                </div>

                <button className="mt-6 w-full rounded-lg border border-orange-200 bg-orange-50 py-2.5 text-sm font-bold text-orange-500 transition-all hover:bg-orange-500 hover:text-white">
                    Chi tiết lớp học
                </button>
            </div>
        </div>
    );
}