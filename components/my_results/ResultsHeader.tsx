import type { CurrentUser } from "@/app/ui/my_results/type/my_results.type";

type ResultsHeaderProps = { currentUser: CurrentUser | null };

export function ResultsHeader({ currentUser }: ResultsHeaderProps) {
    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr] lg:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-orange-500">
                        Kết quả học tập
                    </p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
                        Điểm số và nhận xét bài tập của bạn
                    </h1>
                </div>

                <div className="rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white shadow-sm">
                            {currentUser?.name?.slice(0, 2)?.toUpperCase() || "SV"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xl font-bold text-slate-900">
                                {currentUser?.name || "Chưa có tên"}
                            </p>
                            <p className="mt-2 text-sm font-medium uppercase tracking-[0.11em] text-orange-500">
                                Mã sinh viên
                            </p>
                            <p className="mt-1 break-all text-base font-semibold text-slate-700">
                                {currentUser?.studentCode || "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
