type GradingCriteriaData = {
    unitTestPercent: number;
    enablePlagiarismCheck: boolean;
    enableLimits: boolean;
    maxScore: number;
};

type Props = {
    data: GradingCriteriaData;
};

export function GradingCriteriaCard({ data }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-orange-500">rule</span>
                Tiêu chí chấm điểm
            </h3>

            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                        <span>Chấm điểm Unit Test</span>
                        <span className="font-bold">{data.unitTestPercent}%</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full bg-orange-500"
                            style={{ width: `${data.unitTestPercent}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-slate-400">
              code
            </span>
            Check đạo văn (Plagiarism)
          </span>

                    <div
                        className={`inline-flex h-6 w-11 items-center rounded-full ${
                            data.enablePlagiarismCheck ? "bg-orange-200" : "bg-slate-200"
                        }`}
                    >
            <span
                className={`inline-block h-4 w-4 transform rounded-full ${
                    data.enablePlagiarismCheck
                        ? "translate-x-6 bg-orange-500"
                        : "translate-x-1 bg-slate-400"
                }`}
            />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-slate-400">
              speed
            </span>
            Giới hạn bộ nhớ & thời gian
          </span>

                    <div
                        className={`inline-flex h-6 w-11 items-center rounded-full ${
                            data.enableLimits ? "bg-orange-200" : "bg-slate-200"
                        }`}
                    >
            <span
                className={`inline-block h-4 w-4 transform rounded-full ${
                    data.enableLimits
                        ? "translate-x-6 bg-orange-500"
                        : "translate-x-1 bg-slate-400"
                }`}
            />
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Tổng điểm tối đa
                        </label>
                        <input
                            type="number"
                            defaultValue={data.maxScore}
                            className="h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 text-sm font-bold outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}