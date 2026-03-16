type UploadedFile = {
    name: string;
};

type TestCasesData = {
    uploadedFiles: UploadedFile[];
};

type Props = {
    data: TestCasesData;
};

export function TestCasesCard({ data }: Props) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
        <span className="material-symbols-outlined text-orange-500">
          terminal
        </span>
                Bộ kiểm thử (Test Cases)
            </h3>

            <div className="flex flex-col gap-4">
                <div className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-orange-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 transition group-hover:scale-110">
                        <span className="material-symbols-outlined">upload_file</span>
                    </div>

                    <div className="text-center">
                        <p className="font-bold">Tải lên Test Cases (.zip)</p>
                        <p className="text-xs text-slate-500">
                            Kéo thả hoặc nhấn để chọn tệp (Tối đa 50MB)
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {data.uploadedFiles.map((file) => (
                        <div
                            key={file.name}
                            className="flex items-center justify-between rounded-lg bg-slate-100 p-3"
                        >
                            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500">
                  description
                </span>
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>

                            <button className="text-slate-400 transition hover:text-red-500">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))}
                </div>

                <button className="flex items-center justify-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-bold text-orange-500 transition hover:bg-orange-50">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm Test Case thủ công
                </button>
            </div>
        </section>
    );
}