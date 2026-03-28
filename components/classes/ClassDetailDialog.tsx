"use client";

import type {
    Classroom,
    ClassroomUser,
} from "@/app/ui/my_classes/type/classroom.type";

type ClassDetailDialogProps = {
    open: boolean;
    classroom: Classroom | null;
    onClose: () => void;
};

function getTeacherInfo(teacher: Classroom["teacherId"]): ClassroomUser | null {
    if (!teacher || typeof teacher === "string") {
        return null;
    }

    return teacher;
}

export function ClassDetailDialog({
                                      open,
                                      classroom,
                                      onClose,
                                  }: ClassDetailDialogProps) {
    if (!open || !classroom) {
        return null;
    }

    const teacher = getTeacherInfo(classroom.teacherId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {classroom.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Mã lớp: {classroom.code}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Học kỳ</p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {classroom.semester || "Chưa có"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Năm học</p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {classroom.academicYear || "Chưa có"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Trạng thái</p>
                        <p className="mt-1 font-semibold capitalize text-slate-900">
                            {classroom.status || "active"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Số sinh viên</p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {classroom.studentIds?.length || 0}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Giảng viên</p>
                    <p className="mt-1 font-semibold text-slate-900">
                        {teacher?.name || "Chưa có"}
                    </p>
                    <p className="text-sm text-slate-500">{teacher?.email || ""}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Mô tả</p>
                    <p className="mt-1 text-slate-700">
                        {classroom.description || "Chưa có mô tả"}
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}