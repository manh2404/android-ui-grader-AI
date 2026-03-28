import { RegisterHeroPanel } from "@/components/auth/RegisterHeroPanel";
import { RegisterFormCard } from "@/components/auth/RegisterFormCard";
import { RegisterMobileNav } from "@/components/auth/RegisterMobileNav";

import {
    registerFormData,
    registerHeroData,
} from "@/lib/register-data";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c]">
            <main className="flex min-h-screen items-center justify-center p-6 md:p-12">
                <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    <div className="hidden lg:col-span-5 lg:flex">
                        <RegisterHeroPanel data={registerHeroData} />
                    </div>

                    <div className="flex w-full justify-center lg:col-span-7">
                        <RegisterFormCard data={registerFormData} />
                    </div>
                </div>
            </main>

            <RegisterMobileNav />
        </div>
    );
}