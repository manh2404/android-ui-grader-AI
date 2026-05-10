export function FileUploadBox({
                                  files,
                                  onFilesChange,
                                  onRemoveFile,
                              }: {
    files: File[];
    onFilesChange: (files: FileList | File[]) => void;
    onRemoveFile: (index: number) => void;
}) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
                File bài nộp
            </label>
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition hover:border-orange-300 hover:bg-orange-50">
                <span className="material-symbols-outlined mb-2 block text-4xl text-orange-500">
                    cloud_upload
                </span>
                Nhấn để chọn file hoặc kéo thả vào đây
                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                        onFilesChange(event.target.files || []);
                        event.currentTarget.value = "";
                    }}
                />
            </label>

            {files.length ? (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700"
                        >
                            <div className="min-w-0 break-words pr-3">
                                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemoveFile(index)}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                title="Xóa file đã chọn"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    delete
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
