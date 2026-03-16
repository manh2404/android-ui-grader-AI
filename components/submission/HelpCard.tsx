export function HelpCard() {
    return (
        <section className="rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h3 className="mb-2 font-bold">Gặp khó khăn?</h3>

            <p className="mb-4 text-sm text-slate-600">
                Liên hệ trợ giảng để được hỗ trợ kỹ thuật kịp thời.
            </p>

            <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-xl border border-orange-500 bg-white px-4 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
                <span className="material-symbols-outlined text-sm">forum</span>
                Nhắn tin hỗ trợ
            </a>
        </section>
    );
}