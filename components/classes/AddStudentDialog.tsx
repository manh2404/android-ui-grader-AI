"use client";

import { useEffect, useState } from "react";

type StudentItem = {
    _id: string;
    name: string;
    email: string;
    studentCode?: string;
};

type AddStudentDialogProps = {
    open: boolean;
    classroomId: string;
    onClose: () => void;
    onSuccess: () => Promise<void>;
};

export function AddStudentDialog({
                                     open,
                                     classroomId,
                                     onClose,
                                     onSuccess,
                                 }: AddStudentDialogProps) {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<StudentItem[]>([]);
    const [selected, setSelected] = useState<StudentItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) {
            setKeyword("");
            setResults([]);
            setSelected(null);
            setError("");
            return;
        }

        const query = keyword.trim();

        if (query.length < 1) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `/api/classes/users/search?q=${encodeURIComponent(query)}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const result = await res.json();

                if (!res.ok) {
                    setError(result.message || "Không thể tìm sinh viên");
                    setResults([]);
                    return;
                }

                setResults(result.data || []);
            } catch {
                setError("Có lỗi xảy ra khi tìm sinh viên");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [keyword, open]);

    if (!open) return null;

    const handleAddStudent = async () => {
        if (!selected) {
            setError("Vui lòng chọn một sinh viên");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const res = await fetch(`/api/classes/${classroomId}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: selected._id,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Không thể thêm sinh viên");
                return;
            }

            await onSuccess();
            onClose();
        } catch {
            setError("Có lỗi xảy ra khi thêm sinh viên");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Thêm sinh viên vào lớp
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Tìm theo tên sinh viên hoặc mã sinh viên
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

                <div className="mt-6 space-y-4">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setSelected(null);
                        }}
                        placeholder="Nhập tên hoặc mã sinh viên..."
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                    />

                    <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200">
                        {loading ? (
                            <div className="px-4 py-4 text-sm text-slate-500">
                                Đang tìm sinh viên...
                            </div>
                        ) : results.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-slate-500">
                                Chưa có kết quả phù hợp.
                            </div>
                        ) : (
                            results.map((student) => {
                                const isSelected = selected?._id === student._id;

                                return (
                                    <button
                                        key={student._id}
                                        type="button"
                                        onClick={() => setSelected(student)}
                                        className={`flex w-full items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 text-left last:border-b-0 ${
                                            isSelected
                                                ? "bg-orange-50"
                                                : "hover:bg-slate-50"
                                        }`}
                                    >
                                        <div>
                                            <div className="font-semibold text-slate-900">
                                                {student.name}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {student.email}
                                            </div>
                                            <div className="mt-1 text-xs text-orange-600">
                                                Mã SV: {student.studentCode || "Chưa có"}
                                            </div>
                                        </div>

                                        {isSelected ? (
                                            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                                                Đã chọn
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {error ? (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            onClick={handleAddStudent}
                            disabled={!selected || saving}
                            className="rounded-2xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? "Đang thêm..." : "Thêm sinh viên"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}