"use client";

import {useState} from "react";
import {SocialLoginButtons} from "./SocialLoginButtons";
import Link from "next/link";
import {useRouter} from "next/navigation";


type SocialProvider = {
    label: string;
    iconUrl: string;
};

type LoginFormData = {
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberLabel: string;
    forgotPasswordLabel: string;
    submitLabel: string;
    dividerLabel: string;
    signupText: string;
    signupLabel: string;
    socialProviders: SocialProvider[];
};

type Props = {
    data: LoginFormData;
};

export function LoginFormCard({data}: Props) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // tạo hàm submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Vui lòng nhập email và mật khẩu");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    remember,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Đăng nhập thất bại");
                return;
            }

            router.push("/ui/dashboard");
            router.refresh();
        } catch (error) {
            setError("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div
                className="rounded-3xl border border-[#e2bfb0]/10 bg-white p-8 shadow-[0_32px_64px_-12px_rgba(26,28,28,0.08)] sm:p-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#4c56af]">
                            {data.emailLabel}
                        </label>

                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span
                    className="material-symbols-outlined text-[#8e7164] transition-colors group-focus-within:text-[#a04100]">
                  person
                </span>
                            </div>

                            <input
                                type="email"
                                placeholder={data.emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border-none bg-[#e8e8e8] py-3.5 pl-11 pr-4 text-[#1a1c1c] ring-2 ring-transparent transition-all duration-200 placeholder:text-[#8e7164]/60 focus:bg-white focus:ring-[#a04100]/20 focus:ring-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#4c56af]">
                            {data.passwordLabel}
                        </label>

                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span
                    className="material-symbols-outlined text-[#8e7164] transition-colors group-focus-within:text-[#a04100]">
                  lock
                </span>
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={data.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border-none bg-[#e8e8e8] py-3.5 pl-11 pr-12 text-[#1a1c1c] ring-2 ring-transparent transition-all duration-200 placeholder:text-[#8e7164]/60 focus:bg-white focus:ring-[#a04100]/20 focus:ring-2"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8e7164] transition-colors hover:text-[#a04100]"
                            >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                className="h-5 w-5 cursor-pointer rounded border-[#e2bfb0] text-[#a04100] focus:ring-[#a04100]/20"
                            />
                            <span className="ml-3 text-sm text-[#5a4136]">
                {data.rememberLabel}
              </span>
                        </label>

                        <button
                            type="button"
                            className="text-sm font-semibold text-[#a04100] transition-colors hover:text-[#ff6b00]"
                        >
                            {data.forgotPasswordLabel}
                        </button>
                    </div>
                    {error && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl border border-transparent bg-gradient-to-r from-[#a04100] to-[#ff6b00] px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Đang đăng nhập..." : data.submitLabel}
                    </button>
                </form>

                <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e2bfb0]/20"/>
                    </div>

                    <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-medium text-[#5a4136]">
              {data.dividerLabel}
            </span>
                    </div>
                </div>

                <SocialLoginButtons providers={data.socialProviders}/>
            </div>

            <p className="text-center text-[#5a4136]">
                {data.signupText}
                <Link
                    href="/register"
                    className="ml-1 font-bold text-[#4c56af] transition-colors hover:text-[#27308a]"
                >
                    {data.signupLabel}
                </Link>
            </p>
        </>
    );
}