type DefaultLimitsData = {
    title: string;
    maxRuntimeMs: number;
    maxMemoryMb: number;
};

type Props = {
    data: DefaultLimitsData;
};

export function DefaultLimitsCard({ data }: Props) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                <span className="material-symbols-outlined text-orange-500">timer</span>
                <h2 className="text-lg font-bold">{data.title}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Thời gian chạy tối đa (ms)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            defaultValue={data.maxRuntimeMs}
                            className="flex-1 rounded-xl border border-slate-200 bg-transparent p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                        />
                        <span className="text-sm font-medium text-slate-400">ms</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Giới hạn thời gian thực thi cho mỗi testcase.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Bộ nhớ tối đa (MB)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            defaultValue={data.maxMemoryMb}
                            className="flex-1 rounded-xl border border-slate-200 bg-transparent p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                        />
                        <span className="text-sm font-medium text-slate-400">MB</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Giới hạn RAM tối đa được phép sử dụng.
                    </p>
                </div>
            </div>
        </section>
    );
}