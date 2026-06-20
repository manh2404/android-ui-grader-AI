"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navItems, isActivePath } from "@/lib/navigation";
import { useMemo, useState } from "react";

type AppSidebarProps = {
    collapsed: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    currentUserRole?: "admin" | "teacher" | "User";
};

export function AppSidebar({
                               collapsed,
                               mobileOpen,
                               onCloseMobile,
                               onMouseEnter,
                               onMouseLeave,
                               currentUserRole,
                           }: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const visibleNavItems = useMemo(() => {
        return navItems.filter((item) => {
            if (
                item.href === "/ui/create_assignment" ||
                item.href === "/ui/server_config" ||
                item.href === "/ui/grading_detail"
            ) {
                return currentUserRole === "teacher" || currentUserRole === "admin";
            }

            return true;
        });
    }, [currentUserRole]);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Đăng xuất thất bại");
                return;
            }

            onCloseMobile?.();
            router.push("/login");
            router.refresh();
        } catch {
            alert("Có lỗi xảy ra khi đăng xuất");
        } finally {
            setLoggingOut(false);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <>
            <div
                onClick={onCloseMobile}
                className={`fixed inset-0 z-[45] bg-slate-900/30 transition-opacity lg:hidden ${
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white shadow-sm transition-[width,transform] duration-300 ease-out will-change-[width]
                ${collapsed ? "lg:w-[92px]" : "lg:w-[272px]"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                w-[272px]`}
            >
                <div className="flex h-20 items-center border-b border-slate-200 px-3">
                    <Link
                        href="/ui/dashboard"
                        className="grid w-full grid-cols-[56px_minmax(0,1fr)] items-center"
                        aria-label="Về trang tổng quan"
                    >
                        <div className="flex h-14 w-14 items-center justify-center">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
                                <span className="material-symbols-outlined">
                                    auto_stories
                                </span>
                            </div>
                        </div>

                        <div
                            className={`min-w-0 overflow-hidden transition-all duration-300 ease-out ${
                                collapsed
                                    ? "max-w-0 translate-x-2 opacity-0"
                                    : "max-w-[180px] translate-x-0 opacity-100"
                            }`}
                        >
                            <p className="truncate text-lg font-bold text-slate-900">
                                AutoGrade
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                Hệ thống quản lý lớp học
                            </p>
                        </div>
                    </Link>
                </div>

                <nav className="space-y-1 p-3">
                    {visibleNavItems.map((item) => {
                        const active = isActivePath(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onCloseMobile}
                                title={collapsed ? item.label : undefined}
                                className={`grid grid-cols-[44px_minmax(0,1fr)] items-center rounded-2xl px-2 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                    active
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                                    <span className="material-symbols-outlined text-[22px]">
                                        {item.icon}
                                    </span>
                                </span>

                                <span
                                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                                        collapsed
                                            ? "max-w-0 translate-x-2 opacity-0"
                                            : "max-w-[180px] translate-x-0 opacity-100"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        title={collapsed ? "Đăng xuất" : undefined}
                        className="mt-3 grid w-full grid-cols-[44px_minmax(0,1fr)] items-center rounded-2xl px-2 py-2.5 text-left text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                            <span className="material-symbols-outlined">
                                logout
                            </span>
                        </span>

                        <span
                            className={`overflow-hidden whitespace-nowrap font-medium transition-all duration-300 ease-out ${
                                collapsed
                                    ? "max-w-0 translate-x-2 opacity-0"
                                    : "max-w-[180px] translate-x-0 opacity-100"
                            }`}
                        >
                            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                        </span>
                    </button>
                </nav>

                {collapsed && (
                    <div className="pointer-events-none absolute left-full top-0 hidden h-full w-6 lg:block" />
                )}
            </aside>
        </>
    );
}