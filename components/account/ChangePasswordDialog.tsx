"use client";

import { useEffect, useState } from "react";
import type { ChangePasswordPayload } from "@/app/ui/account/type/account.types";

type Props = {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (payload: ChangePasswordPayload) => Promise<void>;
};

const initialForm: ChangePasswordPayload = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export function ChangePasswordDialog({ open, loading = false, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<ChangePasswordPayload>(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        setForm(initialForm);
        setError("");
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError("Vui lòng nhập đầy đủ các trường mật khẩu");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (form.currentPassword === form.newPassword) {
            setError("Mật khẩu mới phải khác mật khẩu hiện tại");
            return;
        }

        await onSubmit(form).catch((submitError) => {
            setError(submitError instanceof Error ? submitError.message : "Không thể đổi mật khẩu");
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-xl rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Đổi mật khẩu</h3>
                        <p className="text-sm text-slate-500">Mật khẩu mới sẽ được áp dụng cho lần đăng nhập kế tiếp.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            value={form.currentPassword}
                            onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={form.newPassword}
                            onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                            placeholder="Tối thiểu 6 ký tự"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>

                    {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
