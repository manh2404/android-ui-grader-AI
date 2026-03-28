"use client";

import { useState, type FormEvent } from "react";
import type { Semester } from "@/app/ui/my_classes/type/classroom.type";

type AddClassPayload = {
    name: string;
    code: string;
    description?: string;
    semester: Semester;
    academicYear: string;
};

type AddClassCardProps = {
    onCreate: (payload: AddClassPayload) => Promise<boolean>;
    loading?: boolean;
};

const DEFAULT_YEAR = "2025-2026";

export function AddClassCard({ onCreate, loading = false }: AddClassCardProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [semester, setSemester] = useState<Semester>("HK1");
    const [academicYear, setAcademicYear] = useState(DEFAULT_YEAR);
    const [error, setError] = useState("");

    const resetForm = () => {
        setName("");
        setCode("");
        setDescription("");
        setSemester("HK1");
        setAcademicYear(DEFAULT_YEAR);
    };

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

        const success = await onCreate({
            name: trimmedName,
            code: trimmedCode,
            description: trimmedDescription || undefined,
            semester,
            academicYear: trimmedAcademicYear,
        });

        if (success) {
            resetForm();
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Thêm lớp học</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                        onChange={(e) => setSemester(e.target.value as Semester)}
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

                {error ? (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-2xl bg-orange-500 px-5 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Đang tạo..." : "Tạo lớp"}
                </button>
            </form>
        </div>
    );
}