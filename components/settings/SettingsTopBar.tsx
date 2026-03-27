export function SettingsTopBar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                    <span className="material-symbols-outlined">auto_stories</span>
                </div>

                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    AutoGrade Admin
                </h2>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
                <label className="hidden h-10 min-w-40 max-w-64 flex-col md:flex">
                    <div className="flex h-full w-full items-stretch rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-center rounded-l-xl pl-4 text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>

                        <input
                            placeholder="Tìm kiếm cài đặt..."
                            className="h-full w-full flex-1 border-none bg-transparent px-4 text-sm font-normal placeholder:text-slate-400 focus:ring-0"
                        />
                    </div>
                </label>

                <div className="flex gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-orange-50">
            <span className="material-symbols-outlined text-slate-600">
              notifications
            </span>
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-orange-50">
            <span className="material-symbols-outlined text-slate-600">
              account_circle
            </span>
                    </button>
                </div>

                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500 bg-slate-200">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB38q4iLexYaoT-99IQlbFNFbDr5z5ixnf8EaJYQcgmetbt1dFA_2r0rOJe0XOXmGirNxKPMOU5Qk-qAQqydoFlecrkJTdsWFNMlKScsTixbI1a6ZVVTayCf3YD51qZRQ_1b3_WWDv0OpogTa2l1vdeOgOzaulX-fDwZ-n43tltJY6OZlduAIIrcDvvSc72-hlkTbVpQaWjsNlRW_VZ6xlbwXycOCVxrT9l8lWaBtC8h-xuOdMa9wHHRix2KSML7KzXQooP_W502i2n"
                        alt="Admin avatar"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}