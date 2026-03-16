import { GradingTopBar } from "@/components/grading/GradingTopBar";
import { AssignmentSidebar } from "@/components/grading/AssignmentSidebar";
import { SubmissionPreviewCard } from "@/components/grading/SubmissionPreviewCard";
import { ScoreSummaryCard } from "@/components/grading/ScoreSummaryCard";
import { AiFeedbackCard } from "@/components/grading/AiFeedbackCard";
import { TeacherFeedbackCard } from "@/components/grading/TeacherFeedbackCard";
import { GradingFooter } from "@/components/grading/GradingFooter";

import {
    aiFeedback,
    assignmentInfo,
    previewContent,
    scoreSummary,
    students,
} from "@/lib/grading-data";

export default function GradingDetailPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <GradingTopBar />

                <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-12">
                    <aside className="lg:col-span-4">
                        <AssignmentSidebar info={assignmentInfo} students={students} />
                    </aside>

                    <section className="flex flex-col gap-6 lg:col-span-8">
                        <SubmissionPreviewCard content={previewContent} />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <ScoreSummaryCard score={scoreSummary} />
                            <div className="md:col-span-2">
                                <AiFeedbackCard feedback={aiFeedback} />
                            </div>
                        </div>

                        <TeacherFeedbackCard />
                    </section>
                </main>

                <GradingFooter />
            </div>
        </div>
    );
}