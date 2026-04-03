"use client";

import { useEffect, useState } from "react";
import type { CurrentUser, EditProfilePayload } from "@/app/ui/account/type/account.types";

type Props = {
    open: boolean;
    user: CurrentUser | null;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (payload: EditProfilePayload) => Promise<void>;
};

const initialForm: EditProfilePayload = {
    name: "",
    email: "",
    studentCode: "",
    phone: "",
    department: "",
    cohort: "",
    bio: "",
    avatar: "",
};

export function EditProfileDialog({
                                      open,
                                      user,
                                      loading = false,
                                      onClose,
                                      onSubmit,
                                  }: Props) {
    const [form, setForm] = useState<EditProfilePayload>(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open || !user) return;

        setForm({
            name: user.name || "",
            email: user.email || "",
            studentCode: user.studentCode || "",
            phone: user.phone || "",
            department: user.department || "",
            cohort: user.cohort || "",
            bio: user.bio || "",
            avatar: user.avatar || "",
        });

        setError("");
    }, [open, user]);

    if (!open) return null;

    const handleChange = (key: keyof EditProfilePayload, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: key === "studentCode" ? value.toUpperCase() : value,
        }));
    };

    const handleSave = async () => {
        try {
            setError("");

            const payload: EditProfilePayload = {
                name: form.name.trim(),
                email: form.email.trim(),
                studentCode: form.studentCode.trim().toUpperCase(),
                phone: form.phone.trim(),
                department: form.department.trim(),
                cohort: form.cohort.trim(),
                bio: form.bio.trim(),
                avatar: form.avatar.trim(),
            };

            if (!payload.name || !payload.email) {
                setError("Tên và email là bắt buộc");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(payload.email)) {
                setError("Email không hợp lệ");
                return;
            }

            await onSubmit(payload);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Không thể cập nhật hồ sơ"
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa hồ sơ</h3>
                        <p className="text-sm text-slate-500">
                            Cập nhật thông tin hiển thị ở trang tài khoản.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-5 px-6 py-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                            <input
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                                placeholder="example@university.edu.vn"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Mã người dùng / mã sinh viên
                            </label>
                            <input
                                value={form.studentCode}
                                onChange={(e) => handleChange("studentCode", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-orange-400"
                                placeholder="SV001"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                            <input
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                                placeholder="0912345678"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Khoa / bộ môn</label>
                            <input
                                value={form.department}
                                onChange={(e) => handleChange("department", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                                placeholder="Công nghệ thông tin"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Khóa</label>
                            <input
                                value={form.cohort}
                                onChange={(e) => handleChange("cohort", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                                placeholder="Khóa 2021"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">URL ảnh đại diện</label>
                        <input
                            value={form.avatar}
                            onChange={(e) => handleChange("avatar", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                            placeholder="/avatars/default.png hoặc https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Giới thiệu</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                            placeholder="Mô tả ngắn về bạn"
                        />
                    </div>

                    {error && (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}