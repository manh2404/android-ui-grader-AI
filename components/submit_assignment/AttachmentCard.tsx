import type { AssignmentItem } from "@/app/ui/submit_assignment/type/submit_assignment.type";

export function AttachmentCard({ assignment }: { assignment: AssignmentItem | null }) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Tệp đính kèm</h3>
            {assignment?.attachments.length ? (
                <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1 text-sm">
                    {assignment.attachments.map((file) => (
                        <a
                            key={`${file.kind}-${file.url}`}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-words rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                        >
                            {file.originalName}
                            <span className="ml-2 text-xs uppercase text-slate-400">
                                {file.kind}
                            </span>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500">Bài tập này không có file đính kèm.</p>
            )}
        </section>
    );
}
