import Link from "next/link";

const navItems = [
    { label: "Bảng điều khiển", href: "#" },
    { label: "Kho bài tập", href: "/assignment-library", active: true },
    { label: "Lớp học", href: "#" },
    { label: "Báo cáo", href: "#" },
];

export function AssignmentLibraryTopBar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md lg:px-20">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-500 p-1.5 text-white">
                        <span className="material-symbols-outlined text-2xl">auto_stories</span>
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-orange-500">
                        AutoGrade
                    </h1>
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`pb-1 text-sm transition-colors ${
                                item.active
                                    ? "border-b-2 border-orange-500 font-bold text-orange-500"
                                    : "font-semibold text-slate-600 hover:text-orange-500"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    <div className="h-8 w-8 overflow-hidden rounded-full border border-orange-200 bg-orange-100">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcGTlAPTaNKWVwrOonjtgr3h7QXftfeGeBj8oGvtQx4DI78Gvo8EB4OF8ZfbmymmQInLkQMYIxGRc9DdcpshWsj3BqW62zyy6AR3m4DygILAniNeaZsLuiqOin6odMr3o0pNkh2Xwpu9qDc27R4Ux7xRap-VYmkAnYYReI7CgJHQ3-uq2Z6aBjyr5TMISKObGJokiShU8SDLZEMVFLgtAzM1I9nHoE91ZsMETwFtJXZvhxq0SacuYZV6t1qj4IHmzp5Bg7xYtE93R5"
                            alt="Teacher avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}