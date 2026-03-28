"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, isActivePath } from "@/lib/navigation";

type AppSidebarProps = {
    collapsed: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
};

export function AppSidebar({
                               collapsed,
                               mobileOpen,
                               onCloseMobile,
                           }: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            <div
                onClick={onCloseMobile}
                className={`fixed inset-0 z-[45] bg-slate-900/30 transition-opacity lg:hidden ${
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300
        ${collapsed ? "lg:w-[92px]" : "lg:w-[272px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-[272px]`}
            >
                <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
                    <Link
                        href="/ui/dashboard"
                        className="flex min-w-0 items-center gap-3"
                        aria-label="Về trang tổng quan"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
                            <span className="material-symbols-outlined">auto_stories</span>
                        </div>

                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="truncate text-lg font-bold text-slate-900">
                                    AutoGrade
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    Hệ thống quản lý lớp học
                                </p>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="space-y-1 p-3">
                    {navItems.map((item) => {
                        const active = isActivePath(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onCloseMobile}
                                title={collapsed ? item.label : undefined}
                                className={`flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition ${
                                    active
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                } ${collapsed ? "justify-center" : "gap-3"}`}
                            >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>

                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}