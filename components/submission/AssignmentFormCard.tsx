type CourseInfo = {
    title: string;
    subtitle: string;
};

type AssignmentOption = {
    value: string;
    label: string;
    selected?: boolean;
};

type Props = {
    courseInfo: CourseInfo;
    assignmentOptions: AssignmentOption[];
};

export function AssignmentFormCard({
                                       courseInfo,
                                       assignmentOptions,
                                   }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-1 text-2xl font-bold">{courseInfo.title}</h1>
            <p className="mb-6 text-slate-500">{courseInfo.subtitle}</p>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">
                        Chọn bài tập cần nộp
                    </label>

                    <div className="relative">
                        <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-4 pr-10 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                            {assignmentOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    defaultValue={item.selected ? item.value : undefined}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              expand_more
            </span>
                    </div>
                </div>

                <div className="flex gap-6 border-b border-slate-200">
                    <button className="border-b-2 border-orange-500 pb-3 text-sm font-bold text-orange-500">
                        Tải lên tệp tin
                    </button>

                    <button className="border-b-2 border-transparent pb-3 text-sm font-medium text-slate-500 hover:text-orange-500">
                        Dán link mã nguồn
                    </button>
                </div>

                <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 transition hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-orange-500">
              cloud_upload
            </span>

                        <p className="mb-1 font-bold text-slate-900">
                            Nhấp để tải tệp lên hoặc kéo thả
                        </p>

                        <p className="text-sm text-slate-500">
                            Tối đa 50MB. Hỗ trợ định dạng .zip, .rar, .pdf
                        </p>

                        <input type="file" className="hidden" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">
                        Link GitHub / GitLab (Tùy chọn)
                    </label>

                    <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              link
            </span>

                        <input
                            type="text"
                            placeholder="https://github.com/username/project"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pl-10 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600">
                        <span className="material-symbols-outlined">send</span>
                        Nộp bài tập ngay
                    </button>

                    <button className="rounded-xl border border-slate-200 px-8 py-4 font-bold transition hover:bg-slate-50">
                        Lưu nháp
                    </button>
                </div>
            </div>
        </section>
    );
}