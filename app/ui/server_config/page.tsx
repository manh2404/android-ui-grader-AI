import { SettingsTopBar } from "@/components/settings/SettingsTopBar";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ApiConnectionCard } from "@/components/settings/ApiConnectionCard";
import { DefaultLimitsCard } from "@/components/settings/DefaultLimitsCard";
import { EmailSettingsCard } from "@/components/settings/EmailSettingsCard";
import { BackupSettingsCard } from "@/components/settings/BackupSettingsCard";
import { SettingsActionBar } from "@/components/settings/SettingsActionBar";

import {
    apiConnectionData,
    backupSettingsData,
    defaultLimitsData,
    emailSettingsData,
    pageInfo,
    sidebarGroups,
    versionInfo,
} from "@/lib/server-config-data";

export default function ServerConfigPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="flex min-h-screen flex-col">


                <div className="flex flex-1 overflow-hidden">
                    <SettingsSidebar groups={sidebarGroups} versionInfo={versionInfo} />

                    <main className="flex-1 overflow-y-auto p-8">
                        <div className="mx-auto max-w-4xl space-y-8">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    {pageInfo.title}
                                </h1>
                                <p className="text-slate-500">{pageInfo.description}</p>
                            </div>

                            <ApiConnectionCard data={apiConnectionData} />
                            <DefaultLimitsCard data={defaultLimitsData} />

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <EmailSettingsCard data={emailSettingsData} />
                                <BackupSettingsCard data={backupSettingsData} />
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}