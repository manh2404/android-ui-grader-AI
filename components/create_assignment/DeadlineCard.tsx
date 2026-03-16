type DeadlineData = {
    allowLateSubmit: boolean;
};

type Props = {
    data: DeadlineData;
};

export function DeadlineCard({ data }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-orange-500">event</span>
                Thời hạn nộp bài
            </h3>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-slate-500">
                        Ngày bắt đầu
                    </label>
                    <input
                        type="datetime-local"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-slate-500">
                        Ngày kết thúc
                    </label>
                    <input
                        type="datetime-local"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                        id="late-submit"
                        type="checkbox"
                        defaultChecked={data.allowLateSubmit}
                        className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="late-submit" className="text-sm">
                        Cho phép nộp muộn (trừ điểm)
                    </label>
                </div>
            </div>
        </section>
    );
}