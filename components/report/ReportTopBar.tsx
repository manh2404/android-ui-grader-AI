import Link from "next/link";

const navItems = [
    { label: "Báo cáo", href: "/learning-report", active: true },
    { label: "Lớp học", href: "#" },
    { label: "Học sinh", href: "#" },
    { label: "Cấu hình", href: "#" },
];

export function ReportTopBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
                            EduAnalytics
                        </h2>
                        <p className="text-xs text-slate-500">Hệ thống quản lý học tập</p>
                    </div>
                </div>

                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-sm transition-colors ${
                                item.active
                                    ? "font-semibold text-orange-500"
                                    : "font-medium text-slate-600 hover:text-orange-500"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/80 text-orange-500 transition hover:bg-orange-200">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>

                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-100 bg-slate-200">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnRpf_vjbGOUegoZzl7TXspyD9f-hRrxO4RtfrblEf7W3H3jFEqgaCfcb29gX3SQ3L-a_3t6LsamyatzBoypyZcyFNR2hwZULc-XH0gqFcefavULgmH4TGVDOUZof9Dp8TyjqrazBD6_rLo4yJlt5FIlhWVmGP1ekXNkF5EW8EE1j0HpCzdOZrT_qRpnXPyMNmm_5GUvoYywSoiSyEqVoZmVWHrNx3msAOCC_5bOAQaEdbwtFr5d3AL0BBI_TaKFnsQ06a3DhkClTN"
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}