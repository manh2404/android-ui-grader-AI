import { SubmissionTopBar } from "@/components/submission/SubmissionTopBar";
import { SubmissionBreadcrumbs } from "@/components/submission/SubmissionBreadcrumbs";
import { AssignmentFormCard } from "@/components/submission/AssignmentFormCard";
import { SubmissionSuccessCard } from "@/components/submission/SubmissionSuccessCard";
import { DeadlineCard } from "@/components/submission/DeadlineCard";
import { InstructionsCard } from "@/components/submission/InstructionsCard";
import { HelpCard } from "@/components/submission/HelpCard";
import { SubmissionFooter } from "@/components/submission/SubmissionFooter";

import {
    assignmentOptions,
    breadcrumbItems,
    courseInfo,
    deadlineInfo,
    instructions,
    successInfo,
} from "@/lib/submission-data";

export default function SubmitAssignmentPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="flex min-h-screen flex-col">
                <SubmissionTopBar />

                <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
                    <SubmissionBreadcrumbs items={breadcrumbItems} />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <AssignmentFormCard
                                courseInfo={courseInfo}
                                assignmentOptions={assignmentOptions}
                            />

                            <SubmissionSuccessCard info={successInfo} />
                        </div>

                        <div className="space-y-6">
                            <DeadlineCard info={deadlineInfo} />
                            <InstructionsCard items={instructions} />
                            <HelpCard />
                        </div>
                    </div>
                </main>

                <SubmissionFooter />
            </div>
        </div>
    );
}