"use client";

import { useEffect, useRef, useState } from "react";
import { Classroom } from "@/app/ui/my_classes/type/classroom.type";

type ClassCardProps = {
    classroom: Classroom;
    onDelete: (id: string) => void;
    onOpenDetail: (classroom: Classroom) => void;
    onEdit: (classroom: Classroom) => void;
    canManageClassUI: boolean;
};

type ClassStatsResponse = {
    activeStudentCount?: number;
    canManageMembers?: boolean;
    message?: string;
};

export function ClassCard({
                              classroom,
                              onDelete,
                              onOpenDetail,
                              onEdit,
                              canManageClassUI,
                          }: ClassCardProps) {
    const fallbackStudentCount =
        classroom.approvedStudentCount ??
        classroom.studentCount ??
        classroom.totalStudents ??
        0;

    const [openMenu, setOpenMenu] = useState(false);
    const [studentCount, setStudentCount] = useState<number>(fallbackStudentCount);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let ignore = false;

        async function loadStudentCount() {
            if (!classroom?._id) {
                if (!ignore) setStudentCount(0);
                return;
            }

            try {
                const res = await fetch(`/api/classes/${classroom._id}/stats`, {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include",
                });

                const result: ClassStatsResponse = await res.json().catch(() => ({}));

                if (!res.ok) {
                    if (!ignore) {
                        setStudentCount(fallbackStudentCount);
                    }
                    return;
                }

                const count = Number(result.activeStudentCount);

                if (!ignore) {
                    setStudentCount(Number.isFinite(count) ? count : 0);
                }
            } catch {
                if (!ignore) {
                    setStudentCount(fallbackStudentCount);
                }
            }
        }

        void loadStudentCount();

        return () => {
            ignore = true;
        };
    }, [
        classroom?._id,
        classroom?.approvedStudentCount,
        classroom?.studentCount,
        classroom?.totalStudents,
        fallbackStudentCount,
    ]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!menuRef.current) return;

            if (!menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpenDetail(classroom)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenDetail(classroom);
                }
            }}
            className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                        {classroom.name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-500">
                        Mã lớp: {classroom.code}
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        {classroom.semester || "HK1"}
                    </span>

                    {canManageClassUI ? (
                        <div
                            ref={menuRef}
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                aria-label="Mở menu quản lý lớp"
                                onClick={() => setOpenMenu((prev) => !prev)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M12 7a1.75 1.75 0 110-3.5A1.75 1.75 0 0112 7zm0 6.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM13.75 19.5a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z" />
                                </svg>
                            </button>

                            {openMenu ? (
                                <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenMenu(false);
                                            onEdit(classroom);
                                        }}
                                        className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Chỉnh sửa
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenMenu(false);
                                            onDelete(classroom._id);
                                        }}
                                        className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        Xóa lớp
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                {classroom.description || "Chưa có mô tả"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {classroom.academicYear || "2025-2026"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {classroom.status || "active"}
                </span>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                    {studentCount} sinh viên
                </span>
            </div>

            <div className="mt-4 text-xs text-slate-400 transition group-hover:text-orange-500">
                Bấm vào thẻ để xem chi tiết
            </div>
        </div>
    );
}