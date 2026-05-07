import type { AnyObj, AssignmentDetail, GradingTab, SidebarStudent } from "@/app/ui/grading_detail/type/grading_detail.type";
import { formatDateTime } from "@/app/ui/grading_detail/type/grading_detail.unit";
import { SidebarConfig } from "./SidebarConfig";
import { StudentListItem } from "./StudentListItem";

type Props = {
    assignment: AssignmentDetail | null;
    students: SidebarStudent[];
    visibleStudents: SidebarStudent[];
    selectedStudentId: string;
    keyword: string;
    tab: GradingTab;
    rubric: AnyObj[];
    loading: boolean;
    onKeywordChange: (keyword: string) => void;
    onTabChange: (tab: GradingTab) => void;
    onSelectStudent: (student: SidebarStudent) => void;
};

export function GradingSidebar({
                                   assignment,
                                   students,
                                   visibleStudents,
                                   selectedStudentId,
                                   keyword,
                                   tab,
                                   rubric,
                                   loading,
                                   onKeywordChange,
                                   onTabChange,
                                   onSelectStudent,
                               }: Props) {
    return (
        <aside className="lg:col-span-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">{assignment?.title || "Danh sách sinh viên"}</h2>
                <p className="mt-1 text-sm text-orange-600">Hạn nộp: {formatDateTime(assignment?.dueAt)}</p>

                <div className="mt-4 flex border-b border-slate-100">
                    <button
                        type="button"
                        onClick={() => onTabChange("list")}
                        className={`flex-1 border-b-2 pb-2 text-sm font-bold uppercase ${
                            tab === "list" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400"
                        }`}
                    >
                        Danh sách ({students.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange("config")}
                        className={`flex-1 border-b-2 pb-2 text-sm font-bold uppercase ${
                            tab === "config" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400"
                        }`}
                    >
                        Cấu hình
                    </button>
                </div>

                {tab === "list" ? (
                    <>
                        <div className="relative mt-4">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                search
                            </span>
                            <input
                                value={keyword}
                                onChange={(e) => onKeywordChange(e.target.value)}
                                placeholder="Tìm kiếm sinh viên..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-300"
                            />
                        </div>

                        <div className="mt-4 flex max-h-[760px] flex-col gap-2 overflow-y-auto pr-1">
                            {loading ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    Đang tải danh sách sinh viên...
                                </div>
                            ) : visibleStudents.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    Không có sinh viên phù hợp.
                                </div>
                            ) : (
                                visibleStudents.map((student) => (
                                    <StudentListItem
                                        key={student.studentId}
                                        student={student}
                                        active={student.studentId === selectedStudentId}
                                        onSelect={() => onSelectStudent(student)}
                                    />
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <SidebarConfig assignment={assignment} rubric={rubric} />
                )}
            </section>
        </aside>
    );
}
