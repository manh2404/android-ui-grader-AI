type ClassesHeaderData = {
    title: string;
    description: string;
};

type Props = {
    data: ClassesHeaderData;
};

export function ClassesHeader({ data }: Props) {
    return (
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                    {data.title}
                </h1>
                <p className="text-base text-slate-500">{data.description}</p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:brightness-110 active:scale-95">
                <span className="material-symbols-outlined">add</span>
                <span>Tạo lớp học mới</span>
            </button>
        </div>
    );
}