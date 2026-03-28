import Link from "next/link";
import { navItems } from "@/lib/navigation";

export function AppFooter() {
    return (
        <footer className="mt-10 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p className="font-semibold text-slate-900">AutoGrade</p>
                    <p>Header và footer dùng chung cho toàn bộ hệ thống.</p>
                </div>

                <nav className="flex flex-wrap gap-4">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="hover:text-orange-500">
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}