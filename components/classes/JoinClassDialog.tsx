"use client";

import { useState } from "react";

type JoinClassDialogProps = {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => Promise<void> | void;
};

export function JoinClassDialog({
                                    open,
                                    onClose,
                                    onSuccess,
                                }: JoinClassDialogProps) {
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    if (!open) return null;

    const handleJoinClass = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const res = await fetch("/api/classes/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    joinCode,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Không thể tham gia lớp");
                return;
            }

            setMessage(result.message || "Đã gửi yêu cầu tham gia lớp");
            setJoinCode("");
            await onSuccess?.();
        } catch {
            setError("Có lỗi xảy ra khi tham gia lớp");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Tham gia lớp học
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Nhập mã lớp để gửi yêu cầu tham gia
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

                <div className="space-y-4">
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="Ví dụ: CTDL01"
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
                    />

                    {error ? (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}

                    {message ? (
                        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                            {message}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Đóng
                        </button>

                        <button
                            type="button"
                            onClick={handleJoinClass}
                            disabled={!joinCode.trim() || loading}
                            className="rounded-2xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}