import Link from "next/link";

const navItems = [
    { label: "Trang chủ", href: "#" },
    { label: "Lớp học", href: "/ui/my_classes", active: true },
    { label: "Bài tập", href: "#" },
    { label: "Sinh viên", href: "#" },
    { label: "Báo cáo", href: "#" },
];

export function ClassesTopBar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-orange-500">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                            <span className="material-symbols-outlined">auto_stories</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">
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
                    <label className="hidden items-center rounded-xl border border-transparent bg-slate-100 px-3 py-1.5 transition-all focus-within:border-orange-500 sm:flex">
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              search
            </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp học..."
                            className="w-48 border-none bg-transparent text-sm placeholder:text-slate-400 focus:ring-0"
                        />
                    </label>

                    <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-orange-500 bg-orange-100">
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