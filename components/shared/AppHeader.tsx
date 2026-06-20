"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppFooter } from "@/components/shared/AppFooter";
import { navItems, isActivePath } from "@/lib/navigation";

type CurrentUser = {
    _id?: string;
    name?: string;
    role?: "admin" | "teacher" | "User";
};

export function AppHeader({ children }: { children: ReactNode }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [topMenuExpanded, setTopMenuExpanded] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    const pathname = usePathname();

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                if (!res.ok) return;

                const json = await res.json();
                setCurrentUser(json.user || null);
            } catch {}
        };

        void loadMe();
    }, []);

    const visibleNavItems = useMemo(() => {
        const role = currentUser?.role;

        return navItems.filter((item) => {
            if (
                item.href === "/ui/create_assignment" ||
                item.href === "/ui/server_config" ||
                item.href === "/ui/grading_detail"
            ) {
                return role === "teacher" || role === "admin";
            }

            return true;
        });
    }, [currentUser?.role]);

    return (
        <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
            <AppSidebar
                collapsed={!sidebarExpanded}
                mobileOpen={false}
                onCloseMobile={() => setSidebarExpanded(false)}
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                currentUserRole={currentUser?.role}
            />

            <div className="min-h-screen transition-all duration-300 lg:pl-[92px]">
                <header
                    onMouseEnter={() => setTopMenuExpanded(true)}
                    onMouseLeave={() => setTopMenuExpanded(false)}
                    className={`sticky top-0 z-30 overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ${
                        topMenuExpanded ? "h-20" : "h-8"
                    }`}
                >
                    {!topMenuExpanded && (
                        <div className="h-4 w-full cursor-pointer bg-white/95">
                            <div className="mx-auto h-full max-w-7xl border-b border-slate-100" />
                        </div>
                    )}

                    <div
                        className={`flex h-20 items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
                            topMenuExpanded
                                ? "translate-y-0 opacity-100"
                                : "pointer-events-none -translate-y-4 opacity-0"
                        }`}
                    >
                        <div className="hidden w-2 lg:block" />

                        <nav className="hidden items-center gap-2 xl:flex">
                            {visibleNavItems.map((item) => {
                                const active = isActivePath(pathname, item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                            active
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 md:inline-flex"
                            >
                                <span className="material-symbols-outlined mr-2 text-[18px]">
                                    search
                                </span>
                                Tìm kiếm
                            </button>

                            <Link
                                href="/ui/account"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600"
                                aria-label="Tài khoản"
                            >
                                {currentUser?.name?.slice(0, 2).toUpperCase() || "BM"}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>

                <AppFooter />
            </div>
        </div>
    );
}