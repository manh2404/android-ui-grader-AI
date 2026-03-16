import { TopNav } from "@/components/dashboard/TopNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

import {
    stats,
    classScores,
    notifications,
    recentActivities,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <TopNav />

            <div className="mx-auto flex w-full max-w-[1440px]">
                <Sidebar />

                <main className="flex-1 p-4 md:p-6">
                    <DashboardHeader />

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <StatCard key={item.title} {...item} />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <LineChartCard />
                        <BarChartCard items={classScores} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <NotificationsPanel items={notifications} />

                        <div className="xl:col-span-2">
                            <RecentActivityTable items={recentActivities} />
                        </div>
                    </div>
                </main>
            </div>

            <MobileBottomNav />
        </div>
    );
}