type Profile = {
    name: string;
    email: string;
    role: string;
    cohort: string;
    avatarUrl: string;
};

type Props = {
    profile: Profile;
};

export function ProfileHero({ profile }: Props) {
    return (
        <section className="flex flex-col items-center space-y-4 text-center">
            <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-orange-500/20 p-1">
                    <div
                        className="h-full w-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
                    />
                </div>

                <button className="absolute bottom-0 right-0 rounded-full border-2 border-[#f8f6f6] bg-orange-500 p-2 text-white shadow-lg">
          <span className="material-symbols-outlined text-sm">
            photo_camera
          </span>
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-slate-500">{profile.email}</p>

                <div className="mt-2 flex items-center justify-center gap-2">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
            {profile.role}
          </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            {profile.cohort}
          </span>
                </div>
            </div>

            <button className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90">
                <span className="material-symbols-outlined text-sm">edit</span>
                Chỉnh sửa hồ sơ
            </button>
        </section>
    );
}