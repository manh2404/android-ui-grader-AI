"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type CurrentUser = {
    _id?: string;
    role?: "admin" | "teacher" | "User";
};

type AssignmentItem = {
    _id: string;
    title: string;
    description: string;
    dueAt?: string;
    startAt?: string;
    status: "draft" | "published" | "closed";
    displayStatus: "draft" | "published" | "closed";
    maxScore: number;
    allowLateSubmit: boolean;
    allowResubmit: boolean;
    latePenaltyPercent: number;
    language: string;
    rubricText?: string;
    classroom: {
        _id: string;
        name: string;
        code: string;
    } | null;
    teacher?: {
        _id: string;
        name: string;
        email: string;
    } | null;
    attachments: Array<{
        url: string;
        originalName: string;
        kind: string;
    }>;
    createdAt?: string;
};

type ApiResult<T> = {
    success: boolean;
    message?: string;
    data?: T;
    user?: CurrentUser;
};

type EditFormState = {
    title: string;
    description: string;
    rubricText: string;
    startAt: string;
    dueAt: string;
    maxScore: string;
    language: string;
    allowLateSubmit: boolean;
    allowResubmit: boolean;
    latePenaltyPercent: string;
    status: "draft" | "published" | "closed";
};

function formatDate(value?: string) {
    if (!value) return "--/--/----";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--/--/----";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatDateTimeInput(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
}

function getStatusLabel(status: AssignmentItem["displayStatus"]) {
    if (status === "draft") return "Bản nháp";
    if (status === "closed") return "Đã đóng";
    return "Đang mở";
}

function getStatusClasses(status: AssignmentItem["displayStatus"]) {
    if (status === "draft") {
        return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "closed") {
        return "bg-slate-100 text-slate-700 border-slate-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
}

function Dialog({
                    open,
                    title,
                    onClose,
                    children,
                    maxWidth = "max-w-3xl",
                }: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4">
            <div className={`w-full ${maxWidth} rounded-3xl bg-white shadow-2xl`}>
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

function EditAttachmentSection({
                                   title,
                                   existingFiles,
                                   newFiles,
                                   onPickFiles,
                                   onRemoveExisting,
                                   onRemoveNew,
                               }: {
    title: string;
    existingFiles: Array<{
        url: string;
        originalName: string;
        kind: string;
    }>;
    newFiles: File[];
    onPickFiles: (files: File[]) => void;
    onRemoveExisting: (url: string) => void;
    onRemoveNew: (index: number) => void;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{title}</p>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Chọn file
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                            const nextFiles = Array.from(event.target.files || []);
                            onPickFiles(nextFiles);
                            event.currentTarget.value = "";
                        }}
                    />
                </label>
            </div>

            {!existingFiles.length && !newFiles.length ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    Chưa có file nào.
                </div>
            ) : (
                <div className="space-y-2">
                    {existingFiles.map((file) => (
                        <div
                            key={file.url}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-slate-800">{file.originalName}</p>
                                <p className="text-xs text-slate-400">Đang có</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveExisting(file.url)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                title="Xóa file"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    ))}

                    {newFiles.map((file, index) => (
                        <div
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-slate-800">{file.name}</p>
                                <p className="text-xs text-orange-500">File mới</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveNew(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-100"
                                title="Xóa file mới"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default function AssignmentListPage() {
    const [items, setItems] = useState<AssignmentItem[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");

    const [detailItem, setDetailItem] = useState<AssignmentItem | null>(null);
    const [editItem, setEditItem] = useState<AssignmentItem | null>(null);
    const [editForm, setEditForm] = useState<EditFormState>({
        title: "",
        description: "",
        rubricText: "",
        startAt: "",
        dueAt: "",
        maxScore: "10",
        language: "cpp",
        allowLateSubmit: false,
        allowResubmit: false,
        latePenaltyPercent: "0",
        status: "published",
    });

    const [menuOpenId, setMenuOpenId] = useState("");
    const menuWrapRef = useRef<HTMLDivElement | null>(null);

    const canManage = currentUser?.role === "teacher" || currentUser?.role === "admin";

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError("");

            const [userRes, assignmentsRes] = await Promise.all([
                fetch("/api/auth/me", { cache: "no-store" }),
                fetch("/api/assignments", { cache: "no-store" }),
            ]);

            const userJson: ApiResult<CurrentUser> = await userRes.json();
            const result: ApiResult<AssignmentItem[]> = await assignmentsRes.json();

            if (userRes.ok) {
                setCurrentUser(userJson.user || null);
            }

            if (!assignmentsRes.ok) {
                throw new Error(result.message || "Không tải được danh sách bài tập");
            }

            setItems(result.data || []);
        } catch (fetchError) {
            setError(
                fetchError instanceof Error
                    ? fetchError.message
                    : "Không tải được danh sách bài tập"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchAssignments();
    }, []);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!menuWrapRef.current) return;
            if (!menuWrapRef.current.contains(event.target as Node)) {
                setMenuOpenId("");
            }
        };

        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const classOptions = useMemo(() => {
        const map = new Map<string, string>();
        for (const item of items) {
            if (item.classroom?._id) {
                map.set(item.classroom._id, `${item.classroom.name} (${item.classroom.code})`);
            }
        }

        return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    }, [items]);

    const filteredItems = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return items.filter((item) => {
            const matchKeyword = normalizedKeyword
                ? [item.title, item.description, item.classroom?.name, item.classroom?.code]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(normalizedKeyword))
                : true;

            const matchStatus =
                statusFilter === "all" ? true : item.displayStatus === statusFilter;
            const matchClass = classFilter === "all" ? true : item.classroom?._id === classFilter;

            return matchKeyword && matchStatus && matchClass;
        });
    }, [classFilter, items, keyword, statusFilter]);

    const openDetail = async (id: string) => {
        try {
            const res = await fetch(`/api/assignments/${id}`, { cache: "no-store" });
            const json: ApiResult<AssignmentItem> = await res.json();
            if (!res.ok) throw new Error(json.message || "Không lấy được chi tiết bài tập");
            setDetailItem(json.data || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không lấy được chi tiết bài tập");
        }
    };

    const openEdit = (item: AssignmentItem) => {
        setEditItem(item);
        setEditExistingAttachments(item.attachments || []);
        setEditResourceFiles([]);
        setEditRubricFiles([]);
        setEditTemplateFiles([]);

        setEditForm({
            title: item.title || "",
            description: item.description || "",
            rubricText: item.rubricText || "",
            startAt: formatDateTimeInput(item.startAt || item.createdAt),
            dueAt: formatDateTimeInput(item.dueAt),
            maxScore: String(item.maxScore || 10),
            language: item.language || "cpp",
            allowLateSubmit: Boolean(item.allowLateSubmit),
            allowResubmit: Boolean(item.allowResubmit),
            latePenaltyPercent: String(item.latePenaltyPercent || 0),
            status: item.status || "published",
        });
    };
    const appendFiles = (
        setter: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
        return (files: File[]) => {
            setter((prev) => [...prev, ...files]);
        };
    };

    const removeExistingAttachment = (url: string) => {
        setEditExistingAttachments((prev) => prev.filter((item) => item.url !== url));
    };

    const removeNewFile = (
        setter: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
        return (index: number) => {
            setter((prev) => prev.filter((_, i) => i !== index));
        };
    };

    const handleUpdate = async () => {
        if (!editItem) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.set("title", editForm.title);
            formData.set("description", editForm.description);
            formData.set("rubricText", editForm.rubricText);
            formData.set("startAt", new Date(editForm.startAt).toISOString());
            formData.set("dueAt", new Date(editForm.dueAt).toISOString());
            formData.set("maxScore", editForm.maxScore);
            formData.set("language", editForm.language);
            formData.set("allowLateSubmit", String(editForm.allowLateSubmit));
            formData.set("allowResubmit", String(editForm.allowResubmit));
            formData.set("latePenaltyPercent", editForm.latePenaltyPercent);
            formData.set("status", editForm.status);

            for (const item of editExistingAttachments) {
                formData.append("keepExistingAttachmentUrls", item.url);
            }

            for (const file of editResourceFiles) {
                formData.append("resourceFiles", file);
            }

            for (const file of editRubricFiles) {
                formData.append("rubricFiles", file);
            }

            for (const file of editTemplateFiles) {
                formData.append("templateFiles", file);
            }

            const res = await fetch(`/api/assignments/${editItem._id}`, {
                method: "PUT",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Cập nhật bài tập thất bại");
            }

            setSuccess("Đã cập nhật bài tập thành công");
            setEditItem(null);
            setEditExistingAttachments([]);
            setEditResourceFiles([]);
            setEditRubricFiles([]);
            setEditTemplateFiles([]);
            await fetchAssignments();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Cập nhật bài tập thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Bạn có chắc muốn xóa bài tập này?");
        if (!ok) return;

        try {
            setDeletingId(id);
            setError("");
            setSuccess("");

            const res = await fetch(`/api/assignments/${id}`, {
                method: "DELETE",
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Xóa bài tập thất bại");
            }

            setSuccess("Đã xóa bài tập thành công");
            if (detailItem?._id === id) {
                setDetailItem(null);
            }
            await fetchAssignments();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xóa bài tập thất bại");
        } finally {
            setDeletingId("");
        }
    };

    const [editExistingAttachments, setEditExistingAttachments] = useState<
        AssignmentItem["attachments"]
    >([]);
    const [editResourceFiles, setEditResourceFiles] = useState<File[]>([]);
    const [editRubricFiles, setEditRubricFiles] = useState<File[]>([]);
    const [editTemplateFiles, setEditTemplateFiles] = useState<File[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        Danh sách bài tập
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Click vào bài tập để xem chi tiết, sửa hoặc xóa bài tập.
                    </p>
                </div>

                {canManage ? (
                    <Link
                        href="/ui/create_assignment"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tạo bài tập mới
                    </Link>
                ) : null}
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            ) : null}

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[2fr,1fr,1fr]">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            search
                        </span>
                        <input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Tìm tên bài tập, mô tả, mã lớp..."
                            className="h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="h-12 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="published">Đang mở</option>
                        <option value="closed">Đã đóng</option>
                        <option value="draft">Bản nháp</option>
                    </select>

                    <select
                        value={classFilter}
                        onChange={(event) => setClassFilter(event.target.value)}
                        className="h-12 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    >
                        <option value="all">Tất cả lớp học</option>
                        {classOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="max-h-[520px] overflow-auto">
                    <table className="w-full min-w-[1040px]">
                        <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-5 py-4">Bài tập</th>
                            <th className="px-5 py-4">Lớp</th>
                            <th className="px-5 py-4">Ngày giao</th>
                            <th className="px-5 py-4">Hạn nộp</th>
                            <th className="px-5 py-4">Điểm tối đa</th>
                            <th className="px-5 py-4">Tệp đính kèm</th>
                            <th className="px-5 py-4">Trạng thái</th>
                            {canManage ? <th className="px-5 py-4 text-right">Thao tác</th> : null}
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={canManage ? 8 : 7}
                                    className="px-5 py-10 text-center text-slate-500"
                                >
                                    Đang tải danh sách bài tập...
                                </td>
                            </tr>
                        ) : filteredItems.length ? (
                            filteredItems.map((item) => (
                                <tr
                                    key={item._id}
                                    className="align-top transition hover:bg-slate-50"
                                >
                                    <td
                                        className="cursor-pointer px-5 py-4"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        <div className="space-y-1">
                                            <p className="font-semibold text-slate-900">{item.title}</p>
                                            <p className="max-w-md text-sm text-slate-500 line-clamp-2">
                                                {item.description || "Chưa có mô tả"}
                                            </p>
                                        </div>
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4 text-sm text-slate-600"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        {item.classroom ? (
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {item.classroom.name}
                                                </p>
                                                <p>{item.classroom.code}</p>
                                            </div>
                                        ) : (
                                            "--"
                                        )}
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4 text-sm text-slate-600"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        {formatDate(item.startAt || item.createdAt)}
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4 text-sm text-slate-600"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        {formatDate(item.dueAt)}
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4 text-sm font-medium text-slate-700"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        {item.maxScore}
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4 text-sm text-slate-600"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                        {item.attachments.length ? (
                                            <div className="space-y-2">
                                                {item.attachments.slice(0, 2).map((file) => (
                                                    <a
                                                        key={`${item._id}-${file.url}`}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block text-orange-600 hover:underline"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {file.originalName}
                                                    </a>
                                                ))}
                                                {item.attachments.length > 2 ? (
                                                    <p className="text-xs text-slate-400">
                                                        +{item.attachments.length - 2} file khác
                                                    </p>
                                                ) : null}
                                            </div>
                                        ) : (
                                            "Không có"
                                        )}
                                    </td>
                                    <td
                                        className="cursor-pointer px-5 py-4"
                                        onClick={() => void openDetail(item._id)}
                                    >
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusClasses(
                                                    item.displayStatus
                                                )}`}
                                            >
                                                {getStatusLabel(item.displayStatus)}
                                            </span>
                                    </td>

                                    {canManage ? (
                                        <td className="px-5 py-4 text-right">
                                            <div
                                                className="relative inline-block"
                                                ref={menuOpenId === item._id ? menuWrapRef : null}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMenuOpenId((prev) =>
                                                            prev === item._id ? "" : item._id
                                                        )
                                                    }
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                >
                                                        <span className="material-symbols-outlined">
                                                            more_vert
                                                        </span>
                                                </button>

                                                {menuOpenId === item._id ? (
                                                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuOpenId("");
                                                                void openDetail(item._id);
                                                            }}
                                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                        >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    visibility
                                                                </span>
                                                            Xem chi tiết
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuOpenId("");
                                                                openEdit(item);
                                                            }}
                                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                        >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    edit
                                                                </span>
                                                            Sửa
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuOpenId("");
                                                                void handleDelete(item._id);
                                                            }}
                                                            disabled={deletingId === item._id}
                                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                        >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    delete
                                                                </span>
                                                            {deletingId === item._id ? "Đang xóa..." : "Xóa"}
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    ) : null}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={canManage ? 8 : 7}
                                    className="px-5 py-10 text-center text-slate-500"
                                >
                                    Chưa có bài tập nào khớp bộ lọc hiện tại.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Dialog
                open={Boolean(detailItem)}
                title="Chi tiết bài tập"
                onClose={() => setDetailItem(null)}
                maxWidth="max-w-4xl"
            >
                {detailItem ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Tên bài tập</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {detailItem.title}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Lớp học</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {detailItem.classroom?.name} ({detailItem.classroom?.code})
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Ngày giao</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {formatDate(detailItem.startAt || detailItem.createdAt)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Hạn nộp</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {formatDate(detailItem.dueAt)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Điểm tối đa</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {detailItem.maxScore}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Trạng thái</p>
                                <span
                                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusClasses(
                                        detailItem.displayStatus
                                    )}`}
                                >
                                    {getStatusLabel(detailItem.displayStatus)}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="mb-2 font-semibold text-slate-900">Mô tả đề bài</p>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {detailItem.description || "Chưa có mô tả"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                            <p className="mb-2 font-semibold text-orange-700">Rubric / thang điểm</p>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {detailItem.rubricText || "Chưa có rubric"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="mb-3 font-semibold text-slate-900">File đính kèm</p>
                            {detailItem.attachments.length ? (
                                <div className="space-y-3">
                                    {detailItem.attachments.map((file) => (
                                        <a
                                            key={file.url}
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block rounded-2xl bg-slate-50 px-4 py-3 text-orange-600 hover:underline"
                                        >
                                            {file.originalName}
                                            <span className="ml-2 text-xs uppercase text-slate-400">
                                                {file.kind}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Không có file đính kèm</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </Dialog>

            <Dialog
                open={Boolean(editItem)}
                title="Sửa bài tập"
                onClose={() => setEditItem(null)}
                maxWidth="max-w-3xl"
            >
                {editItem ? (
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Tên bài tập
                            </label>
                            <input
                                value={editForm.title}
                                onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                                }
                                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Mô tả
                            </label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="min-h-[130px] w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Rubric
                            </label>
                            <textarea
                                value={editForm.rubricText}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        rubricText: e.target.value,
                                    }))
                                }
                                className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editForm.startAt}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            startAt: e.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Hạn nộp
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editForm.dueAt}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            dueAt: e.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Điểm tối đa
                                </label>
                                <input
                                    type="number"
                                    value={editForm.maxScore}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            maxScore: e.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ngôn ngữ
                                </label>
                                <input
                                    value={editForm.language}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            language: e.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phạt nộp trễ (%)
                                </label>
                                <input
                                    type="number"
                                    value={editForm.latePenaltyPercent}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            latePenaltyPercent: e.target.value,
                                        }))
                                    }
                                    disabled={!editForm.allowLateSubmit}
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Trạng thái
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            status: e.target.value as EditFormState["status"],
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                >
                                    <option value="draft">Bản nháp</option>
                                    <option value="published">Đang mở</option>
                                    <option value="closed">Đã đóng</option>
                                </select>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={editForm.allowLateSubmit}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        allowLateSubmit: e.target.checked,
                                    }))
                                }
                            />
                            <span className="text-sm text-slate-700">Cho phép nộp trễ</span>
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={editForm.allowResubmit}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        allowResubmit: e.target.checked,
                                    }))
                                }
                            />
                            <span className="text-sm text-slate-700">Cho phép nộp lại</span>
                        </label>
                        <div className="space-y-4">
                            <EditAttachmentSection
                                title="File đính kèm đề bài"
                                existingFiles={editExistingAttachments.filter((item) => item.kind === "resource")}
                                newFiles={editResourceFiles}
                                onPickFiles={appendFiles(setEditResourceFiles)}
                                onRemoveExisting={removeExistingAttachment}
                                onRemoveNew={removeNewFile(setEditResourceFiles)}
                            />

                            <EditAttachmentSection
                                title="File rubric / thang điểm"
                                existingFiles={editExistingAttachments.filter((item) => item.kind === "rubric")}
                                newFiles={editRubricFiles}
                                onPickFiles={appendFiles(setEditRubricFiles)}
                                onRemoveExisting={removeExistingAttachment}
                                onRemoveNew={removeNewFile(setEditRubricFiles)}
                            />

                            <EditAttachmentSection
                                title="Template / test case / starter code"
                                existingFiles={editExistingAttachments.filter((item) => item.kind === "template")}
                                newFiles={editTemplateFiles}
                                onPickFiles={appendFiles(setEditTemplateFiles)}
                                onRemoveExisting={removeExistingAttachment}
                                onRemoveNew={removeNewFile(setEditTemplateFiles)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditItem(null)}
                                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleUpdate()}
                                disabled={saving}
                                className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-70"
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                ) : null}
            </Dialog>
        </div>
    );
}