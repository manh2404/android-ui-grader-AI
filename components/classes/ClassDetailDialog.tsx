"use client";

import { useMemo, useState } from "react";
import type {
    Classroom,
    ClassroomUser,
} from "@/app/ui/my_classes/type/classroom.type";
import { AddStudentDialog } from "./AddStudentDialog";

type ClassDetailDialogProps = {
    open: boolean;
    classroom: Classroom | null;
    onClose: () => void;
    onStudentAdded: () => Promise<void>;
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
                                      onStudentAdded,
                                  }: ClassDetailDialogProps) {
    const [openAddStudent, setOpenAddStudent] = useState(false);
    const [removingId, setRemovingId] = useState<string>("");
    const [removeError, setRemoveError] = useState("");

    const teacher = getTeacherInfo(classroom?.teacherId);

    const students = useMemo(() => {
        if (!classroom?.studentIds) return [];

        return classroom.studentIds.filter(
            (item): item is ClassroomUser =>
                typeof item === "object" && item !== null
        );
    }, [classroom]);

    if (!open || !classroom) {
        return null;
    }

    const handleAfterAddStudent = async () => {
        await onStudentAdded();
        setOpenAddStudent(false);
        onClose();
    };

    const handleRemoveStudent = async (studentId?: string) => {
        if (!studentId) return;

        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa sinh viên này khỏi lớp?"
        );
        if (!confirmed) return;

        try {
            setRemovingId(studentId);
            setRemoveError("");

            const res = await fetch(
                `/api/classes/${classroom._id}/students/${studentId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await res.json();

            if (!res.ok) {
                setRemoveError(
                    result.message || "Không thể xóa sinh viên khỏi lớp"
                );
                return;
            }

            await onStudentAdded();
        } catch {
            setRemoveError("Có lỗi xảy ra khi xóa sinh viên");
        } finally {
            setRemovingId("");
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
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
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Danh sách sinh viên
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                    Tìm theo tên hoặc mã sinh viên để thêm vào lớp
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenAddStudent(true)}
                                className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                            >
                                + Thêm sinh viên
                            </button>
                        </div>

                        {removeError ? (
                            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                {removeError}
                            </div>
                        ) : null}

                        <div className="mt-4 max-h-[320px] overflow-y-auto pr-1">
                            <div className="space-y-3">
                                {students.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-slate-500">
                                        Lớp này chưa có sinh viên nào.
                                    </div>
                                ) : (
                                    students.map((student, index) => (
                                        <div
                                            key={student._id || index}
                                            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3"
                                        >
                                            <div>
                                                <div className="font-semibold text-slate-900">
                                                    {student.name || "Chưa có tên"}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {student.email || "Chưa có email"}
                                                </div>
                                                <div className="mt-1 text-xs text-orange-600">
                                                    Mã SV: {student.studentCode || "Chưa có"}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveStudent(student._id)
                                                }
                                                disabled={
                                                    !student._id ||
                                                    removingId === student._id
                                                }
                                                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {removingId === student._id
                                                    ? "Đang xóa..."
                                                    : "Xóa"}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
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

            <AddStudentDialog
                open={openAddStudent}
                classroomId={classroom._id}
                onClose={() => setOpenAddStudent(false)}
                onSuccess={handleAfterAddStudent}
            />
        </>
    );
}