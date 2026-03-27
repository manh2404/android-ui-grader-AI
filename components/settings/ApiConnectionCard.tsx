type ApiConnectionData = {
    title: string;
    serverUrl: string;
    apiKey: string;
};

type Props = {
    data: ApiConnectionData;
};

export function ApiConnectionCard({ data }: Props) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                <span className="material-symbols-outlined text-orange-500">api</span>
                <h2 className="text-lg font-bold">{data.title}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        URL Server Chấm bài
                    </label>
                    <input
                        type="text"
                        defaultValue={data.serverUrl}
                        className="rounded-xl border border-slate-200 bg-transparent p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">API Key</label>
                    <div className="relative">
                        <input
                            type="password"
                            defaultValue={data.apiKey}
                            className="w-full rounded-xl border border-slate-200 bg-transparent p-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500">
              <span className="material-symbols-outlined text-[20px]">
                visibility
              </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}