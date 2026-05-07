type ClassesHeaderProps = {
    total: number;
    onAdd?: () => void;
    onJoin?: () => void;
};

export function ClassesHeader({ total, onAdd, onJoin }: ClassesHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                    Lớp học của tôi
                </h1>
                <p className="text-base text-slate-500">
                    Bạn hiện có {total} lớp học.
                </p>
            </div>

            {onAdd || onJoin ? (
                <div className="flex flex-wrap items-center gap-3">
                    {onJoin ? (
                        <button
                            type="button"
                            onClick={onJoin}
                            className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-3 font-bold text-orange-600 transition-all hover:bg-orange-100"
                        >
                            Tham gia bằng mã lớp
                        </button>
                    ) : null}

                    {onAdd ? (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:brightness-110 active:scale-95"
                        >
                            <span>+</span>
                            <span>Tạo lớp học mới</span>
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}