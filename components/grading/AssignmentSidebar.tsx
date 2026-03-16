type AssignmentInfo = {
    title: string;
    deadline: string;
    totalStudents: number;
};

type StudentItem = {
    name: string;
    status: string;
    score: string;
    active?: boolean;
    avatarUrl?: string;
    missing?: boolean;
};

type Props = {
    info: AssignmentInfo;
    students: StudentItem[];
};

export function AssignmentSidebar({ info, students }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold">{info.title}</h2>

                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {info.deadline}
                    </div>
                </div>

                <div className="mt-4 flex border-b border-slate-100">
                    <button className="flex-1 border-b-2 border-orange-500 pb-2 text-sm font-bold uppercase tracking-wider text-orange-500">
                        Danh sách ({info.totalStudents})
                    </button>
                    <button className="flex-1 border-b-2 border-transparent pb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                        Cấu hình
                    </button>
                </div>

                <div className="relative mt-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sinh viên..."
                        className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                <div className="mt-4 flex max-h-[500px] flex-col gap-1 overflow-y-auto pr-2">
                    {students.map((student) => (
                        <div
                            key={student.name}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                student.active
                                    ? "border-orange-200 bg-orange-50"
                                    : "border-transparent hover:bg-slate-50"
                            } ${student.missing ? "opacity-60" : ""}`}
                        >
                            {student.avatarUrl ? (
                                <div
                                    className={`h-10 w-10 rounded-full bg-cover bg-center ${
                                        student.active ? "border-2 border-orange-500" : "border border-slate-200"
                                    }`}
                                    style={{ backgroundImage: `url('${student.avatarUrl}')` }}
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`truncate text-sm ${
                                        student.active ? "font-bold" : "font-medium"
                                    }`}
                                >
                                    {student.name}
                                </p>
                                <p
                                    className={`text-[10px] ${
                                        student.active
                                            ? "font-medium text-orange-500"
                                            : student.missing
                                                ? "text-red-500"
                                                : "text-slate-500"
                                    }`}
                                >
                                    {student.status}
                                </p>
                            </div>

                            <div
                                className={`font-bold ${
                                    student.active
                                        ? "text-orange-500"
                                        : student.missing
                                            ? "text-slate-400"
                                            : "text-slate-700"
                                }`}
                            >
                                {student.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}