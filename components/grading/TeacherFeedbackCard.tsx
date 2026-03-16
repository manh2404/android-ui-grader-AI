export function TeacherFeedbackCard() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="mb-2 block text-sm font-bold">
                Phản hồi cuối cùng của Giảng viên
            </label>

            <textarea
                className="min-h-[100px] w-full rounded-xl border-none bg-slate-50 p-4 text-sm outline-none placeholder:italic focus:ring-2 focus:ring-orange-200"
                placeholder="Nhập lời phê tại đây..."
            />

            <div className="mt-4 flex justify-end">
                <button className="rounded-xl bg-orange-500 px-8 py-2 font-bold text-white shadow-lg shadow-orange-200 transition hover:opacity-90">
                    Lưu & Tiếp theo
                </button>
            </div>
        </section>
    );
}