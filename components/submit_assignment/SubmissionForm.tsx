import type { AssignmentItem, SubmitAction } from "@/app/ui/submit_assignment/type/submit_assignment.type";
import { getSubmitButtonLabel } from "@/app/ui/submit_assignment/type/submit_assignment.utils";
import { FileUploadBox } from "./FileUploadBox";

export function SubmissionForm({
                                   assignment,
                                   files,
                                   repositoryUrl,
                                   note,
                                   submitting,
                                   canSubmit,
                                   onFilesChange,
                                   onRemoveFile,
                                   onRepositoryUrlChange,
                                   onNoteChange,
                                   onSubmit,
                               }: {
    assignment: AssignmentItem;
    files: File[];
    repositoryUrl: string;
    note: string;
    submitting: boolean;
    canSubmit: boolean;
    onFilesChange: (files: FileList | File[]) => void;
    onRemoveFile: (index: number) => void;
    onRepositoryUrlChange: (value: string) => void;
    onNoteChange: (value: string) => void;
    onSubmit: (action: SubmitAction) => void;
}) {
    return (
        <>
            <FileUploadBox
                files={files}
                onFilesChange={onFilesChange}
                onRemoveFile={onRemoveFile}
            />

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Link GitHub / GitLab
                </label>
                <input
                    value={repositoryUrl}
                    onChange={(event) => onRepositoryUrlChange(event.target.value)}
                    placeholder="https://github.com/username/project"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ghi chú cho giảng viên
                </label>
                <textarea
                    value={note}
                    onChange={(event) => onNoteChange(event.target.value)}
                    placeholder="Ví dụ: em đã bổ sung thêm video demo ở trong repository..."
                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => onSubmit("submit")}
                    disabled={submitting || !canSubmit}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    {getSubmitButtonLabel(assignment, submitting)}
                </button>

                <button
                    type="button"
                    onClick={() => onSubmit("draft")}
                    disabled={submitting || !assignment}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="material-symbols-outlined text-[18px]">draft</span>
                    Lưu nháp
                </button>
            </div>
        </>
    );
}
