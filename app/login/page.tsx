import { LoginTopBar } from "@/components/auth/LoginTopBar";
import { LoginHero } from "@/components/auth/LoginHero";
import { LoginFormCard } from "@/components/auth/LoginFormCard";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { MobileLoginNav } from "@/components/auth/MobileLoginNav";

import {
    footerLinks,
    loginFormData,
    loginHeroData,
    topBarData,
} from "@/lib/login-data";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c]">
            <div className="flex min-h-screen flex-col">
                <LoginTopBar data={topBarData} />

                <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
                    <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#4c56af]/5 blur-3xl" />
                    <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#a04100]/5 blur-3xl" />

                    <div className="relative w-full max-w-md space-y-8">
                        <LoginHero data={loginHeroData} />
                        <LoginFormCard data={loginFormData} />
                    </div>
                </main>

                <LoginFooter links={footerLinks} />
                <MobileLoginNav />
            </div>
        </div>
    );
}