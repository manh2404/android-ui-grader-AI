type Option = {
    label: string;
    value: string;
};

type BasicInfoData = {
    assignmentNamePlaceholder: string;
    classOptions: Option[];
    languageOptions: Option[];
    descriptionPlaceholder: string;
};

type Props = {
    data: BasicInfoData;
};

export function BasicInfoCard({ data }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-orange-500">info</span>
                Thông tin cơ bản
            </h3>

            <div className="space-y-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Tên bài tập</label>
                    <input
                        type="text"
                        placeholder={data.assignmentNamePlaceholder}
                        className="h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Lớp học</label>
                        <select className="h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                            {data.classOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Ngôn ngữ lập trình</label>
                        <select
                            defaultValue="cpp"
                            className="h-12 w-full rounded-xl border border-slate-300 bg-transparent px-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                            {data.languageOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Mô tả chi tiết</label>
                    <textarea
                        placeholder={data.descriptionPlaceholder}
                        className="min-h-[150px] w-full rounded-xl border border-slate-300 bg-transparent p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>
            </div>
        </section>
    );
}