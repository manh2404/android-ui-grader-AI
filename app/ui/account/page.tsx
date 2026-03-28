import { AccountTopBar } from "@/components/account/AccountTopBar";
import { ProfileHero } from "@/components/account/ProfileHero";
import { NotificationSettings } from "@/components/account/NotificationSettings";
import { CurrentCoursesSection } from "@/components/account/CurrentCoursesSection";
import { SubmissionHistory } from "@/components/account/SubmissionHistory";
import { MobileAccountNav } from "@/components/account/MobileAccountNav";
import {
    currentCourses,
    notificationSettings,
    profile,
    submissionHistory,
} from "@/lib/account-data";

export default function AccountPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[960px] flex-col">

                <main className="flex-1 space-y-8 p-4 md:p-6">
                    <ProfileHero profile={profile} />
                    <NotificationSettings items={notificationSettings} />
                    <CurrentCoursesSection items={currentCourses} />
                    <SubmissionHistory items={submissionHistory} />
                </main>

            </div>
        </div>
    );
}