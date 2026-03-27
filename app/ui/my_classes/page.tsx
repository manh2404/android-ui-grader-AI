import { ClassesTopBar } from "@/components/classes/ClassesTopBar";
import { ClassesHeader } from "@/components/classes/ClassesHeader";
import { SemesterFilters } from "@/components/classes/SemesterFilters";
import { ClassesGrid } from "@/components/classes/ClassesGrid";
import { ClassesFooter } from "@/components/classes/ClassesFooter";

import {
    classesHeaderData,
    semesterFilters,
    teachingClasses,
} from "@/lib/classes-data";

export default function MyClassesPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                <ClassesTopBar />

                <main className="mx-auto w-full max-w-[1200px] flex-1 p-6 lg:p-10">
                    <ClassesHeader data={classesHeaderData} />
                    <SemesterFilters items={semesterFilters} />
                    <ClassesGrid items={teachingClasses} />
                </main>

                <ClassesFooter />
            </div>
        </div>
    );
}