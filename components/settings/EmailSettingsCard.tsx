type EmailSettingsData = {
    title: string;
    enabled: boolean;
    smtpServer: string;
    senderEmail: string;
};

type Props = {
    data: EmailSettingsData;
};

export function EmailSettingsCard({ data }: Props) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">mail</span>
                    <h2 className="font-bold">{data.title}</h2>
                </div>

                <label className="relative inline-block h-6 w-10">
                    <input
                        type="checkbox"
                        defaultChecked={data.enabled}
                        className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-orange-500" />
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                </label>
            </div>

            <div className="space-y-4 p-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                        SMTP Server
                    </label>
                    <input
                        type="text"
                        defaultValue={data.smtpServer}
                        className="rounded-lg border border-slate-200 bg-transparent p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                        Email người gửi
                    </label>
                    <input
                        type="email"
                        defaultValue={data.senderEmail}
                        className="rounded-lg border border-slate-200 bg-transparent p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                    />
                </div>
            </div>
        </section>
    );
}