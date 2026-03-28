"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, isActivePath } from "@/lib/navigation";

const sidebarItems = navItems.filter((item) =>
    [
        "/ui/dashboard",
        "/ui/my_classes",
        "/ui/assignment_list",
        "/ui/learning_reports",
        "/ui/server_config",
    ].includes(item.href)
);

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
            <div className="flex flex-col gap-2">
                {sidebarItems.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                active
                                    ? "bg-orange-50 font-bold text-orange-600"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}