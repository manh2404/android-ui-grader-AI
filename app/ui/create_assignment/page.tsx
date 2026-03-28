import { AssignmentIntro } from "@/components/create_assignment/AssignmentIntro";
import { BasicInfoCard } from "@/components/create_assignment/BasicInfoCard";
import { TestCasesCard } from "@/components/create_assignment/TestCasesCard";
import { DeadlineCard } from "@/components/create_assignment/DeadlineCard";
import { GradingCriteriaCard } from "@/components/create_assignment/GradingCriteriaCard";
import { HelperTipCard } from "@/components/create_assignment/HelperTipCard";

import {
    basicInfoData,
    deadlineData,
    gradingCriteriaData,
    helperTip,
    introData,
    testCasesData,
} from "@/lib/create-assignment-data";

export default function CreateAssignmentPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="flex min-h-screen flex-col">

                <main className="flex flex-1 justify-center px-4 py-8 md:px-10">
                    <div className="flex max-w-[1000px] flex-1 flex-col gap-8">
                        <AssignmentIntro data={introData} />

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                <BasicInfoCard data={basicInfoData} />
                                <TestCasesCard data={testCasesData} />
                            </div>

                            <div className="flex flex-col gap-6">
                                <DeadlineCard data={deadlineData} />
                                <GradingCriteriaCard data={gradingCriteriaData} />
                                <HelperTipCard text={helperTip} />
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}