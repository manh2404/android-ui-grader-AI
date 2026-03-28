import { ReportTopBar } from "@/components/report/ReportTopBar";
import { ReportPageHeader } from "@/components/report/ReportPageHeader";
import { ReportStatsGrid } from "@/components/report/ReportStatsGrid";
import { ScoreDistributionCard } from "@/components/report/ScoreDistributionCard";
import { CompletionByGradeCard } from "@/components/report/CompletionByGradeCard";
import { StudentHighlightList } from "@/components/report/StudentHighlightList";
import { AttentionStudentList } from "@/components/report/AttentionStudentList";
import { ReportFooter } from "@/components/report/ReportFooter";

import {
    completionByGrade,
    highlightStudents,
    pageHeaderData,
    scoreDistribution,
    stats,
    warningStudents,
} from "@/lib/report-data";

export default function LearningReportPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <ReportPageHeader data={pageHeaderData} />

                <ReportStatsGrid items={stats} />

                <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <ScoreDistributionCard data={scoreDistribution} />
                    <CompletionByGradeCard items={completionByGrade} />
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <StudentHighlightList items={highlightStudents} />
                    <AttentionStudentList items={warningStudents} />
                </div>
            </main>

        </div>
    );
}
