export function AddClassCard() {
    return (
        <div className="group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/50 transition-all hover:border-orange-500/50 hover:bg-orange-50">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-all group-hover:scale-110 group-hover:text-orange-500">
                <span className="material-symbols-outlined text-4xl">add</span>
            </div>

            <p className="font-bold text-slate-600">Thêm lớp học mới</p>
            <p className="text-sm text-slate-400">Bắt đầu một khóa học mới</p>
        </div>
    );
}