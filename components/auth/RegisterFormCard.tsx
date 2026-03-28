"use client";

import Link from "next/link";
import { useState } from "react";

type RegisterFormData = {
    title: string;
    description: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    termsTextStart: string;
    termsLink1: string;
    termsTextMiddle: string;
    termsLink2: string;
    termsTextEnd: string;
    submitLabel: string;
    loginText: string;
    loginLabel: string;
};

type Props = {
    data: RegisterFormData;
};
export function RegisterFormCard({ data }: Props) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // tao submid cho register
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim()) {
            setError("Vui lòng nhập họ tên");
            return;
        }

        if (!email.trim()) {
            setError("Vui lòng nhập email");
            return;
        }

        if (!password.trim()) {
            setError("Vui lòng nhập mật khẩu");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (!acceptedTerms) {
            setError("Bạn cần đồng ý điều khoản trước khi đăng ký");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Đăng ký thất bại");
                return;
            }

            window.location.href = "/login";
        } catch (err) {
            setError("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_32px_64px_-12px_rgba(26,28,28,0.08)] md:p-12">
            <div className="mb-10 text-center lg:text-left">
                <h2 className="mb-2 font-headline text-3xl font-bold tracking-tight text-[#1a1c1c]">
                    {data.title}
                </h2>
                <p className="text-sm text-[#5a4136]">{data.description}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                    <label className="ml-1 block font-label text-xs font-semibold text-[#5a4136]">
                        {data.fullNameLabel}
                    </label>

                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#5a4136]/50">
              <span className="material-symbols-outlined text-[20px]">
                person
              </span>
                        </div>

                        <input
                            type="text"
                            placeholder={data.fullNamePlaceholder}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-xl border-none bg-[#e8e8e8] py-4 pl-12 pr-4 text-[#1a1c1c] outline-none transition-all duration-200 placeholder:text-[#5a4136]/40 focus:bg-white focus:ring-2 focus:ring-[#a04100]/20"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="ml-1 block font-label text-xs font-semibold text-[#5a4136]">
                        {data.emailLabel}
                    </label>

                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#5a4136]/50">
              <span className="material-symbols-outlined text-[20px]">
                mail
              </span>
                        </div>

                        <input
                            type="email"
                            placeholder={data.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border-none bg-[#e8e8e8] py-4 pl-12 pr-4 text-[#1a1c1c] outline-none transition-all duration-200 placeholder:text-[#5a4136]/40 focus:bg-white focus:ring-2 focus:ring-[#a04100]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="ml-1 block font-label text-xs font-semibold text-[#5a4136]">
                            {data.passwordLabel}
                        </label>

                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#5a4136]/50">
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
                            </div>

                            <input
                                type="password"
                                placeholder={data.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border-none bg-[#e8e8e8] py-4 pl-12 pr-4 text-[#1a1c1c] outline-none transition-all duration-200 placeholder:text-[#5a4136]/40 focus:bg-white focus:ring-2 focus:ring-[#a04100]/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="ml-1 block font-label text-xs font-semibold text-[#5a4136]">
                            {data.confirmPasswordLabel}
                        </label>

                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#5a4136]/50">
                <span className="material-symbols-outlined text-[20px]">
                  verified_user
                </span>
                            </div>

                            <input
                                type="password"
                                placeholder={data.confirmPasswordPlaceholder}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border-none bg-[#e8e8e8] py-4 pl-12 pr-4 text-[#1a1c1c] outline-none transition-all duration-200 placeholder:text-[#5a4136]/40 focus:bg-white focus:ring-2 focus:ring-[#a04100]/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3 px-1 py-2">
                    <div className="flex h-5 items-center">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-5 w-5 rounded-md border-[#e2bfb0]/20 text-[#a04100] transition-all duration-200 focus:ring-[#a04100]/30"
                        />
                    </div>

                    <label
                        htmlFor="terms"
                        className="cursor-pointer text-sm leading-tight text-[#5a4136]"
                    >
                        {data.termsTextStart}{" "}
                        <span className="font-medium text-[#4c56af]">{data.termsLink1}</span>{" "}
                        {data.termsTextMiddle}{" "}
                        <span className="font-medium text-[#4c56af]">{data.termsLink2}</span>{" "}
                        {data.termsTextEnd}
                    </label>
                </div>
                {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a04100] to-[#ff6b00] py-4 font-headline font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(160,65,0,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Đang tạo tài khoản..." : data.submitLabel}
                    <span className="material-symbols-outlined text-[20px]">
        arrow_forward
    </span>
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-[#5a4136]">
                    {data.loginText}
                    <Link
                        href="/login"
                        className="ml-1 font-semibold text-[#4c56af] hover:underline"
                    >
                        {data.loginLabel}
                    </Link>
                </p>
            </div>
        </div>
    );
}