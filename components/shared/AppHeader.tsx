"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppFooter } from "@/components/shared/AppFooter";
import { navItems, isActivePath } from "@/lib/navigation";

export function AppHeader({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
            <AppSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed ? "lg:pl-[92px]" : "lg:pl-[272px]"
                }`}
            >
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 lg:hidden"
                                aria-label="Mở menu"
                            >
                                <span className="material-symbols-outlined">menu</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setCollapsed((prev) => !prev)}
                                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 lg:inline-flex"
                                aria-label="Thu gọn menu"
                            >
                <span className="material-symbols-outlined">
                  {collapsed ? "menu" : "menu_open"}
                </span>
                            </button>
                        </div>

                        <nav className="hidden items-center gap-2 xl:flex">
                            {navItems.map((item) => {
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
                                BM
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