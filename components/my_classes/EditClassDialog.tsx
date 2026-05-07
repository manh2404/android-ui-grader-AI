"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Classroom } from "@/app/ui/my_classes/type/classroom.type";

type UpdateClassPayload = {
    name: string;
    code: string;
    description?: string;
    semester: "HK1" | "HK2" | "HK3";
    academicYear: string;
    status: "active" | "archived";
};

type EditClassDialogProps = {
    open: boolean;
    classroom: Classroom | null;
    onClose: () => void;
    onSubmit: (id: string, payload: UpdateClassPayload) => Promise<boolean>;
};

export function EditClassDialog({
                                    open,
                                    classroom,
                                    onClose,
                                    onSubmit,
                                }: EditClassDialogProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [semester, setSemester] = useState<"HK1" | "HK2" | "HK3">("HK1");
    const [academicYear, setAcademicYear] = useState("2025-2026");
    const [status, setStatus] = useState<"active" | "archived">("active");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!classroom) return;

        setName(classroom.name || "");
        setCode(classroom.code || "");
        setDescription(classroom.description || "");
        setSemester(classroom.semester || "HK1");
        setAcademicYear(classroom.academicYear || "2025-2026");
        setStatus(classroom.status || "active");
        setError("");
    }, [classroom]);

    if (!open || !classroom) return null;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const trimmedName = name.trim();
        const trimmedCode = code.trim().toUpperCase();
        const trimmedDescription = description.trim();
        const trimmedAcademicYear = academicYear.trim();

        if (!trimmedName) {
            setError("Vui lòng nhập tên lớp");
            return;
        }

        if (!trimmedCode) {
            setError("Vui lòng nhập mã lớp");
            return;
        }

        if (!trimmedAcademicYear) {
            setError("Vui lòng nhập năm học");
            return;
        }

        try {
            setSaving(true);

            const success = await onSubmit(classroom._id, {
                name: trimmedName,
                code: trimmedCode,
                description: trimmedDescription,
                semester,
                academicYear: trimmedAcademicYear,
                status,
            });

            if (success) {
                onClose();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Chỉnh sửa lớp học
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Cập nhật thông tin lớp: {classroom.name}
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

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên lớp"
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                    />

                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Mã lớp"
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 uppercase outline-none focus:border-orange-300"
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả lớp"
                        className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <select
                            value={semester}
                            onChange={(e) =>
                                setSemester(e.target.value as "HK1" | "HK2" | "HK3")
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                        >
                            <option value="HK1">Học kỳ 1</option>
                            <option value="HK2">Học kỳ 2</option>
                            <option value="HK3">Học kỳ 3</option>
                        </select>

                        <input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            placeholder="Năm học"
                            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as "active" | "archived")
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                    >
                        <option value="active">Đang hoạt động</option>
                        <option value="archived">Lưu trữ</option>
                    </select>

                    {error ? (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}