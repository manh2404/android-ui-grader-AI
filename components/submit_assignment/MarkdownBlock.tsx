import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownBlock({
                                  content,
                                  variant = "default",
                              }: {
    content?: string;
    variant?: "default" | "rubric";
}) {
    if (!content?.trim()) {
        return <p className="text-sm text-slate-500">Chưa có nội dung.</p>;
    }

    const tableBorder =
        variant === "rubric" ? "border-orange-200" : "border-slate-200";
    const tableHead =
        variant === "rubric" ? "bg-orange-100/70 text-orange-900" : "bg-slate-100 text-slate-900";

    return (
        <div
            className={[
                "max-w-none break-words text-sm leading-7 text-slate-700",
                "[&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900",
                "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900",
                "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900",
                "[&_p]:mb-3 [&_p]:whitespace-pre-wrap",
                "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6",
                "[&_li]:mb-1 [&_li]:break-words",
                "[&_strong]:font-semibold [&_strong]:text-slate-900",
                "[&_code]:break-words [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1.5 [&_code]:py-0.5",
                "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100",
                "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
            ].join(" ")}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <div className={`my-4 overflow-x-auto rounded-xl border ${tableBorder}`}>
                            <table className="min-w-full border-collapse text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className={tableHead}>{children}</thead>,
                    th: ({ children }) => (
                        <th className={`border px-3 py-2 text-left font-semibold ${tableBorder}`}>
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className={`border px-3 py-2 align-top ${tableBorder}`}>
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
