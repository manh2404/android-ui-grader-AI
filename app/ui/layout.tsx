import type { ReactNode } from "react";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";

export default function UiLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
            <AppHeader>{children}</AppHeader>;
        </div>
    );
}