export function SettingsActionBar() {
    return (
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-4">
            <button className="rounded-xl border border-slate-200 px-6 py-2.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                Hủy bỏ
            </button>

            <button className="rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:opacity-90 active:scale-95">
                Lưu thay đổi
            </button>
        </div>
    );
}