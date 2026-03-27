type BackupSettingsData = {
    title: string;
    backupFrequency: string;
    cloudProvider: string;
    reconnectLabel: string;
};

type Props = {
    data: BackupSettingsData;
};

export function BackupSettingsCard({ data }: Props) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
        <span className="material-symbols-outlined text-orange-500">
          cloud_sync
        </span>
                <h2 className="font-bold">{data.title}</h2>
            </div>

            <div className="space-y-4 p-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                        Tần suất sao lưu
                    </label>
                    <select className="w-full rounded-lg border border-slate-200 bg-transparent p-2 text-sm focus:ring-orange-100">
                        <option>{data.backupFrequency}</option>
                        <option>Hàng tuần (Chủ nhật)</option>
                        <option>Hàng tháng</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                        Lưu trữ đám mây
                    </label>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                        <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">
                cloud_done
              </span>
                            <span className="text-sm font-medium">{data.cloudProvider}</span>
                        </div>

                        <button className="text-xs font-bold text-orange-500">
                            {data.reconnectLabel}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}