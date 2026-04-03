import type { CurrentUser } from "@/app/ui/account/type/account.types";

type Props = {
    user: CurrentUser;
    onEditProfile: () => void;
    onChangePassword: () => void;
};

function getRoleLabel(role?: CurrentUser["role"]) {
    if (role === "teacher") return "Giảng viên";
    if (role === "admin") return "Quản trị viên";
    return "Sinh viên";
}

function getAvatarFallback(name?: string) {
    const trimmed = String(name || "BM").trim();
    const words = trimmed.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
        return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
    }

    return trimmed.slice(0, 2).toUpperCase();
}

export function ProfileHero({ user, onEditProfile, onChangePassword }: Props) {
    const avatarFallback = getAvatarFallback(user.name);

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-5 text-center">
                <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-orange-200 bg-orange-50 p-1">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-3xl font-bold text-white">
                                {avatarFallback}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onEditProfile}
                        className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-white shadow-lg transition hover:scale-105"
                        aria-label="Chỉnh sửa hồ sơ"
                    >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{user.name}</h1>
                    <p className="mt-1 text-sm text-slate-500 sm:text-base">{user.email}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                            {getRoleLabel(user.role)}
                        </span>

                        {!!user.cohort && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {user.cohort}
                            </span>
                        )}

                        {!!user.studentCode && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {user.studentCode}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid w-full gap-3 sm:max-w-3xl sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Số điện thoại</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{user.phone || "Chưa cập nhật"}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Khoa / Bộ môn</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{user.department || "Chưa cập nhật"}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Giới thiệu</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">{user.bio || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row">
                    <button
                        type="button"
                        onClick={onEditProfile}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Chỉnh sửa hồ sơ
                    </button>

                    <button
                        type="button"
                        onClick={onChangePassword}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </section>
    );
}
