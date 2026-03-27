import { AssignmentsTopBar } from "@/components/assignments/AssignmentsTopBar";
import { AssignmentsHeader } from "@/components/assignments/AssignmentsHeader";
import { AssignmentSearchBar } from "@/components/assignments/AssignmentSearchBar";
import { AssignmentTable } from "@/components/assignments/AssignmentTable";
import { AssignmentPagination } from "@/components/assignments/AssignmentPagination";
import { AssignmentsFooter } from "@/components/assignments/AssignmentsFooter";

import {
    assignmentListHeader,
    assignmentRows,
    assignmentSearchFilters,
    assignmentPagination,
} from "@/lib/assignment-list-data";

export default function AssignmentListPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <div className="flex min-h-screen flex-col">
                <AssignmentsTopBar />

                <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
                    <AssignmentsHeader data={assignmentListHeader} />
                    <AssignmentSearchBar data={assignmentSearchFilters} />
                    <AssignmentTable rows={assignmentRows} />
                    <AssignmentPagination data={assignmentPagination} />
                </main>

                <AssignmentsFooter />
            </div>
        </div>
    );
}