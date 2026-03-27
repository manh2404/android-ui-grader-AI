import Link from "next/link";

const navItems = [
    { label: "Trang chủ", href: "#" },
    { label: "Lớp học", href: "/ui/my_classes" },
    { label: "Bài tập", href: "/ui/assignment_list", active: true },
    { label: "Sinh viên", href: "#" },
    { label: "Báo cáo", href: "#" },
];

export function AssignmentsTopBar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-orange-500">
              star
            </span>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            AutoGrade
                        </h2>
                    </div>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm transition-colors ${
                                    item.active
                                        ? "font-semibold text-orange-500"
                                        : "font-semibold text-slate-600 hover:text-orange-500"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-orange-200 bg-orange-100">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYOI1eIaND3h52HwXI4vRRNMHrM5sk58JuV631zsEV4YNc_MA6Z8ILljGApAZ60zP-Gi28KKFjio14eFc_kk4el5ors0SpcIpEfLD8m4iT1Pgv-gdnOv4Ul6dMtjYnCKcJIJlKfh2BP-35FBDJpvTqOKRYdDlzR-_cnxEJBILmxpCe_k0Js5HNVRdWxnU00_bsTD2yMQFYb3xN1LYMmlQLTPuKTyL9HU81UDLHFW1PSEYSJvBolos-JWBT_lw8_cxtt7_Zee0XRahR"
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}