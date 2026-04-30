"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SettingsSidebarGroup } from "@/lib/server-config-data";

type VersionInfo = {
    version: string;
    updatedAt: string;
};

type Props = {
    groups: SettingsSidebarGroup[];
    versionInfo: VersionInfo;
};

function isItemActive(pathname: string, href?: string, matchMode: "exact" | "prefix" = "exact") {
    if (!href || href === "#") return false;
    if (matchMode === "prefix") {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href;
}

export function SettingsSidebar({ groups, versionInfo }: Props) {
    const pathname = usePathname();

    return (
        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm h-fit self-start">
            {groups.map((group) => (
                <div key={group.title}>
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {group.title}
                    </h3>

                    <nav className="flex flex-col gap-1">
                        {group.items.map((item) => {
                            const active = isItemActive(pathname, item.href, item.matchMode);
                            const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                                active
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-500"
                            }`;

                            if (item.href && item.href !== "#") {
                                return (
                                    <Link key={item.label} href={item.href} className={className}>
                                        <span className="material-symbols-outlined text-[22px]">
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                );
                            }

                            return (
                                <span key={item.label} className={className}>
                                    <span className="material-symbols-outlined text-[22px]">
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </span>
                            );
                        })}
                    </nav>
                </div>
            ))}

            <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="mb-1 text-xs font-bold text-orange-500">
                    Phiên bản {versionInfo.version}
                </p>
                <p className="text-[10px] text-slate-500">{versionInfo.updatedAt}</p>
            </div>
        </aside>
    );
}
