"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AnyObj = Record<string, any>;

type SidebarStudent = {
    studentId: string;
    name: string;
    studentCode: string;
    submissionId: string | null;
    statusText: string;
    scoreText: string;
    gradeStatus: string;
    missing: boolean;
};

type AssignmentOption = {
    _id: string;
    title: string;
    dueAt?: string;
    classroomName?: string;
};

function asObj(value: unknown): AnyObj {
    return typeof value === "object" && value !== null ? (value as AnyObj) : {};
}

function toText(value: unknown, fallback = "") {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return fallback;
    return String(value);
}

function toNum(value: unknown, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toId(value: unknown): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
        const obj = value as { _id?: unknown; toString?: () => string };
        if (obj._id) return toId(obj._id);
        if (typeof obj.toString === "function") {
            const str = obj.toString();
            if (str && str !== "[object Object]") return str;
        }
    }
    return String(value);
}

function formatDateTime(value?: string | null) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatDate(value?: string | null) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatScore(value?: number | null) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
    const num = Number(value);
    return Number.isInteger(num) ? String(num) : num.toFixed(1);
}

async function requestJson<T = unknown>(url: string, init?: RequestInit) {
    const res = await fetch(url, {
        ...init,
        cache: "no-store",
        headers: {
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...(init?.headers || {}),
        },
    });

    const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        data?: T;
        items?: unknown[];
        user?: unknown;
    };

    if (!res.ok || json.success === false) {
        throw new Error(json.message || "Không thể tải dữ liệu");
    }

    return json;
}

function normalizeAssignment(raw: unknown) {
    const item = asObj(raw);
    const classroom = asObj(item.classroom || item.classroomId);
    return {
        _id: toText(item._id),
        title: toText(item.title, "Bài tập"),
        dueAt: toText(item.dueAt) || undefined,
        maxScore: toNum(item.maxScore, 10),
        description: toText(item.description),
        classroom: classroom._id
            ? {
                _id: toText(classroom._id),
                name: toText(classroom.name),
                code: toText(classroom.code),
            }
            : null,
        rubric: Array.isArray(item.rubric) ? item.rubric : [],
    };
}

function normalizeSubmissions(raw: unknown[]) {
    return raw.map((entry) => {
        const item = asObj(entry);
        const student = asObj(item.student || item.studentId);
        return {
            _id: toText(item._id),
            latest: Boolean(item.latest),
            attemptNo: toNum(item.attemptNo, 1),
            status: toText(item.status, "submitted"),
            gradeStatus: toText(item.gradeStatus, "pending"),
            submittedAt: toText(item.submittedAt) || undefined,
            finalScore:
                item.finalScore === null || item.finalScore === undefined
                    ? null
                    : toNum(item.finalScore, 0),
            student: student._id
                ? {
                    _id: toText(student._id),
                    name: toText(student.name, "Sinh viên"),
                    studentCode: toText(student.studentCode),
                }
                : null,
        };
    });
}

function latestSubmissionMap(list: ReturnType<typeof normalizeSubmissions>) {
    const sorted = [...list].sort((a, b) => {
        if (a.latest && !b.latest) return -1;
        if (!a.latest && b.latest) return 1;
        const t1 = new Date(a.submittedAt || 0).getTime();
        const t2 = new Date(b.submittedAt || 0).getTime();
        if (t1 !== t2) return t2 - t1;
        return b.attemptNo - a.attemptNo;
    });

    const map = new Map<string, (typeof sorted)[number]>();
    for (const item of sorted) {
        const studentId = item.student?._id || "";
        if (!studentId || map.has(studentId)) continue;
        map.set(studentId, item);
    }
    return map;
}

function submissionStatus(submission: ReturnType<typeof normalizeSubmissions>[number] | null) {
    if (!submission) return "Chưa nộp";
    const d = submission.submittedAt ? formatDate(submission.submittedAt) : "--";
    if (submission.gradeStatus === "overridden") return `GV đã duyệt • ${d}`;
    if (submission.gradeStatus === "auto_graded") return `Đã chấm AI • ${d}`;
    if (submission.gradeStatus === "needs_teacher_review") return `Cần duyệt • ${d}`;
    if (submission.status === "late") return `Nộp muộn • ${d}`;
    return "Đã nộp • Đang chờ";
}

function buildSidebar(classItems: unknown[], submissionItems: ReturnType<typeof normalizeSubmissions>) {
    const result: SidebarStudent[] = [];
    const seen = new Set<string>();
    const subMap = latestSubmissionMap(submissionItems);

    for (const memberRaw of classItems) {
        const member = asObj(memberRaw);
        const user = asObj(member.userId || member.user);
        const studentId = toId(user._id);
        if (!studentId) continue;
        if (member.roleInClass === "teacher" || user.role === "teacher") continue;
        if (seen.has(studentId)) continue;

        seen.add(studentId);
        const submission = subMap.get(studentId) || null;

        result.push({
            studentId,
            name: toText(user.name, "Sinh viên"),
            studentCode: toText(user.studentCode),
            submissionId: submission?._id || null,
            statusText: submissionStatus(submission),
            scoreText: submission ? formatScore(submission.finalScore) : "0.0",
            gradeStatus: submission?.gradeStatus || "pending",
            missing: !submission,
        });
    }

    for (const submission of subMap.values()) {
        const studentId = submission.student?._id || "";
        if (!studentId || seen.has(studentId)) continue;
        result.push({
            studentId,
            name: submission.student?.name || "Sinh viên",
            studentCode: submission.student?.studentCode || "",
            submissionId: submission._id,
            statusText: submissionStatus(submission),
            scoreText: formatScore(submission.finalScore),
            gradeStatus: submission.gradeStatus,
            missing: false,
        });
    }

    return result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

function badgeClass(status: string) {
    if (status === "overridden") return "bg-green-50 text-green-700 border-green-200";
    if (status === "auto_graded") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "needs_teacher_review") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "late") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
}

function statusLabel(status: string) {
    if (status === "overridden") return "Giáo viên chốt điểm";
    if (status === "auto_graded") return "Đã chấm AI";
    if (status === "needs_teacher_review") return "Cần duyệt";
    if (status === "late") return "Nộp muộn";
    if (status === "graded") return "Đã chấm";
    if (status === "submitted") return "Đã nộp";
    return "Đang chờ";
}

function isPdf(url?: string, mimeType?: string) {
    return Boolean(url && ((mimeType || "").includes("pdf") || url.toLowerCase().endsWith(".pdf")));
}

export default function GradingDetailPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const assignmentId = searchParams.get("assignmentId") || "";
    const submissionIdParam = searchParams.get("submissionId") || "";
    const studentIdParam = searchParams.get("studentId") || "";

    const [assignment, setAssignment] = useState<any>(null);
    const [assignmentOptions, setAssignmentOptions] = useState<AssignmentOption[]>([]);
    const [students, setStudents] = useState<SidebarStudent[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
    const [detail, setDetail] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [keyword, setKeyword] = useState("");
    const [tab, setTab] = useState<"list" | "config">("list");
    const [manualScore, setManualScore] = useState("");
    const [teacherComment, setTeacherComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [grading, setGrading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const visibleStudents = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return students;
        return students.filter((item) => `${item.name} ${item.studentCode}`.toLowerCase().includes(q));
    }, [keyword, students]);

    const selectedSidebar = useMemo(
        () => students.find((item) => item.studentId === selectedStudentId) || null,
        [students, selectedStudentId]
    );

    const maxScore =
        detail?.assignmentSnapshot?.maxScore ||
        detail?.assignment?.maxScore ||
        assignment?.maxScore ||
        10;
    const rubric = detail?.assignmentSnapshot?.rubric || assignment?.rubric || [];
    const selectedFile = detail?.sourceArchive || detail?.files?.[0] || null;
    async function loadAssignmentOptions() {
        const json = await requestJson(`/api/assignments`);
        const list = Array.isArray(json.data) ? json.data : [];

        const normalized = list
            .map((item) => normalizeAssignment(item))
            .filter((item) => item._id)
            .map((item) => ({
                _id: item._id,
                title: item.title,
                dueAt: item.dueAt,
                classroomName: item.classroom?.name || "",
            }));

        setAssignmentOptions(normalized);
        return normalized;
    }

    function syncUrl(nextAssignmentId: string, nextStudentId?: string | null, nextSubmissionId?: string | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (nextAssignmentId) params.set("assignmentId", nextAssignmentId);
        if (nextStudentId) params.set("studentId", nextStudentId);
        else params.delete("studentId");
        if (nextSubmissionId) params.set("submissionId", nextSubmissionId);
        else params.delete("submissionId");
        router.replace(`${pathname}?${params.toString()}`);
    }

    async function loadDetail(
        nextAssignmentId: string,
        nextStudentId: string,
        nextSubmissionId: string | null,
        updateUrl = false
    ) {
        setSelectedStudentId(nextStudentId);
        setSelectedSubmissionId(nextSubmissionId);

        if (updateUrl) {
            syncUrl(nextAssignmentId, nextStudentId, nextSubmissionId);
        }

        if (!nextSubmissionId) {
            setDetail(null);
            setHistory([]);
            setManualScore("");
            setTeacherComment("");
            return;
        }

        setDetailLoading(true);
        setError("");

        try {
            const [detailJson, historyJson] = await Promise.all([
                requestJson(`/api/submissions/${nextSubmissionId}`),
                requestJson(`/api/submissions/${nextSubmissionId}/history`),
            ]);

            const detailData = asObj(detailJson.data);
            setDetail(detailData);
            setHistory(Array.isArray(historyJson.data) ? historyJson.data : []);
            setManualScore(
                detailData.finalScore !== null && detailData.finalScore !== undefined
                    ? String(detailData.finalScore)
                    : detailData.autoGrade?.score !== null && detailData.autoGrade?.score !== undefined
                        ? String(detailData.autoGrade.score)
                        : ""
            );
            setTeacherComment(toText(detailData.teacherOverride?.comment));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải chi tiết bài nộp");
        } finally {
            setDetailLoading(false);
        }
    }

    async function loadPage(
        nextAssignmentId: string,
        preferSubmissionId?: string | null,
        preferStudentId?: string | null
    ) {
        setLoading(true);
        setError("");

        try {
            const assignmentJson = await requestJson(`/api/assignments/${nextAssignmentId}`);
            const assignmentData = normalizeAssignment(assignmentJson.data);
            setAssignment(assignmentData);

            const [classJson, submissionsJson] = await Promise.all([
                assignmentData.classroom?._id
                    ? requestJson(`/api/classes/${assignmentData.classroom._id}/students?status=active`)
                    : Promise.resolve({ items: [] }),
                requestJson(`/api/submissions?assignmentId=${nextAssignmentId}`),
            ]);

            const submissionList = normalizeSubmissions(
                Array.isArray(submissionsJson.data) ? submissionsJson.data : []
            );
            const sidebar = buildSidebar(Array.isArray(classJson.items) ? classJson.items : [], submissionList);
            setStudents(sidebar);

            const picked =
                sidebar.find((item) => item.submissionId && item.submissionId === preferSubmissionId) ||
                sidebar.find((item) => item.studentId === preferStudentId) ||
                sidebar.find((item) => item.submissionId) ||
                sidebar[0] ||
                null;

            if (picked) {
                await loadDetail(nextAssignmentId, picked.studentId, picked.submissionId, false);
            } else {
                setSelectedStudentId("");
                setSelectedSubmissionId(null);
                setDetail(null);
                setHistory([]);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải trang chấm bài");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const run = async () => {
            try {
                if (!assignmentOptions.length) {
                    await loadAssignmentOptions();
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "Không thể tải danh sách bài tập");
            }

            if (!assignmentId && submissionIdParam) {
                try {
                    setLoading(true);
                    const submissionJson = await requestJson(`/api/submissions/${submissionIdParam}`);
                    const submission = asObj(submissionJson.data);

                    const resolvedAssignmentId = toId(
                        asObj(submission.assignment || submission.assignmentId)._id ||
                        submission.assignmentId
                    );

                    const resolvedStudentId = toId(
                        asObj(submission.student || submission.studentId)._id ||
                        submission.studentId
                    );

                    if (resolvedAssignmentId) {
                        syncUrl(
                            resolvedAssignmentId,
                            resolvedStudentId || null,
                            submissionIdParam
                        );
                    } else {
                        setError("Không xác định được bài tập của bài nộp này.");
                        setLoading(false);
                    }
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Không thể tải chi tiết bài nộp");
                    setLoading(false);
                }
                return;
            }

            if (!assignmentId) {
                try {
                    setLoading(true);
                    const options = assignmentOptions.length
                        ? assignmentOptions
                        : await loadAssignmentOptions();

                    const first = options[0] || null;

                    if (first?._id) {
                        syncUrl(first._id, null, null);
                    } else {
                        setError("Chưa có bài tập nào để chấm.");
                        setLoading(false);
                    }
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Không thể tải danh sách bài tập");
                    setLoading(false);
                }
                return;
            }

            await loadPage(assignmentId, submissionIdParam || null, studentIdParam || null);
        };

        void run();
    }, [assignmentId, submissionIdParam, studentIdParam]);

    async function handleGrade(regenerateAi: boolean) {
        if (!selectedSubmissionId) return;

        setGrading(true);
        setError("");
        setNotice("");

        try {
            const json = await requestJson(`/api/submissions/${selectedSubmissionId}/grade`, {
                method: "POST",
                body: JSON.stringify({ regenerateAi }),
            });

            setNotice(json.message || "Chấm AI thành công");
            await loadPage(assignmentId, selectedSubmissionId, selectedStudentId);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể chấm AI");
        } finally {
            setGrading(false);
        }
    }

    async function handleSave() {
        if (!selectedSubmissionId) return;

        const score = Number(manualScore);

        if (!Number.isFinite(score)) {
            setError("Điểm không hợp lệ.");
            return;
        }

        if (score < 0 || score > maxScore) {
            setError(`Điểm phải từ 0 đến ${maxScore}.`);
            return;
        }

        if (!teacherComment.trim()) {
            setError("Vui lòng nhập nhận xét của giảng viên.");
            return;
        }

        setSaving(true);
        setError("");
        setNotice("");

        try {
            const json = await requestJson(`/api/submissions/${selectedSubmissionId}/override`, {
                method: "POST",
                body: JSON.stringify({
                    score,
                    comment: teacherComment.trim(),
                }),
            });

            setNotice(json.message || "Lưu phản hồi thành công");
            await loadPage(assignmentId, selectedSubmissionId, selectedStudentId);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể lưu điểm thủ công");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/ui/assignment_list" className="hover:text-orange-600">
                                Bài tập
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-slate-700">Chấm bài</span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            {assignment?.title || "Chi tiết chấm bài"}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Lớp: {assignment?.classroom?.name || "--"} • Hạn nộp:{" "}
                            {formatDateTime(assignment?.dueAt)}
                        </p>
                        <div className="mt-4 flex flex-col gap-2 sm:max-w-md">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Chọn bài tập để chấm
                            </label>

                            <select
                                value={assignmentId}
                                onChange={(e) => {
                                    const nextId = e.target.value;
                                    if (!nextId || nextId === assignmentId) return;
                                    syncUrl(nextId, null, null);
                                }}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                            >
                                {assignmentOptions.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.title}
                                        {item.classroomName ? ` • ${item.classroomName}` : ""}
                                        {item.dueAt ? ` • ${formatDate(item.dueAt)}` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => void handleGrade(false)}
                            disabled={!selectedSubmissionId || grading || detailLoading}
                            className="rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Chấm AI
                        </button>

                        <button
                            type="button"
                            onClick={() => void handleGrade(true)}
                            disabled={!selectedSubmissionId || grading || detailLoading}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Chấm lại AI
                        </button>
                    </div>
                </div>

                {(error || notice) && (
                    <div className="mt-4 space-y-2">
                        {error && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}
                        {notice && (
                            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {notice}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <aside className="lg:col-span-4">
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">
                            {assignment?.title || "Danh sách sinh viên"}
                        </h2>
                        <p className="mt-1 text-sm text-orange-600">
                            Hạn nộp: {formatDateTime(assignment?.dueAt)}
                        </p>

                        <div className="mt-4 flex border-b border-slate-100">
                            <button
                                type="button"
                                onClick={() => setTab("list")}
                                className={`flex-1 border-b-2 pb-2 text-sm font-bold uppercase ${
                                    tab === "list"
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-slate-400"
                                }`}
                            >
                                Danh sách ({students.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setTab("config")}
                                className={`flex-1 border-b-2 pb-2 text-sm font-bold uppercase ${
                                    tab === "config"
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-slate-400"
                                }`}
                            >
                                Cấu hình
                            </button>
                        </div>

                        {tab === "list" ? (
                            <>
                                <div className="relative mt-4">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        search
                                    </span>
                                    <input
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="Tìm kiếm sinh viên..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-300"
                                    />
                                </div>

                                <div className="mt-4 flex max-h-[760px] flex-col gap-2 overflow-y-auto pr-1">
                                    {loading ? (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                            Đang tải danh sách sinh viên...
                                        </div>
                                    ) : visibleStudents.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                            Không có sinh viên phù hợp.
                                        </div>
                                    ) : (
                                        visibleStudents.map((student) => {
                                            const active = student.studentId === selectedStudentId;

                                            return (
                                                <button
                                                    key={student.studentId}
                                                    type="button"
                                                    onClick={() =>
                                                        void loadDetail(
                                                            assignmentId,
                                                            student.studentId,
                                                            student.submissionId,
                                                            true
                                                        )
                                                    }
                                                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                                                        active
                                                            ? "border-orange-200 bg-orange-50"
                                                            : "border-transparent hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-full ${
                                                            active
                                                                ? "bg-orange-100 text-orange-600"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        <span className="text-sm font-bold">
                                                            {student.name.slice(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`truncate text-sm ${
                                                                active ? "font-bold" : "font-semibold"
                                                            }`}
                                                        >
                                                            {student.name}
                                                        </p>
                                                        <p
                                                            className={`mt-1 truncate text-xs ${
                                                                student.missing
                                                                    ? "text-rose-500"
                                                                    : active
                                                                        ? "text-orange-600"
                                                                        : "text-slate-500"
                                                            }`}
                                                        >
                                                            {student.studentCode
                                                                ? `${student.studentCode} • `
                                                                : ""}
                                                            {student.statusText}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`text-xl font-bold ${
                                                            active
                                                                ? "text-orange-600"
                                                                : student.missing
                                                                    ? "text-slate-300"
                                                                    : "text-slate-800"
                                                        }`}
                                                    >
                                                        {student.scoreText}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="mt-4 space-y-4">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase text-slate-500">
                                        Thang điểm
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                        {assignment?.maxScore || 10}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase text-slate-500">
                                        Rubric
                                    </p>

                                    <div className="mt-3 space-y-3">
                                        {rubric.length ? (
                                            rubric.map((item: AnyObj, index: number) => (
                                                <div
                                                    key={`${toText(item.code)}-${index}`}
                                                    className="rounded-2xl bg-white p-3"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {toText(item.title, "Tiêu chí")}
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {toText(item.description)}
                                                            </p>
                                                        </div>

                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                            {toNum(item.maxPoints, 0)}đ
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Nguồn chấm:{" "}
                                                        {toText(item.gradingSource, "manual")}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500">Chưa có rubric.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </aside>

                <section className="flex flex-col gap-6 lg:col-span-8">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                            <div>
                                <p className="text-sm text-slate-500">Sinh viên đang chọn</p>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {selectedSidebar?.name || "Chưa chọn"}
                                </h3>
                                {selectedSidebar?.studentCode && (
                                    <p className="text-sm text-slate-500">
                                        {selectedSidebar.studentCode}
                                    </p>
                                )}
                            </div>

                            {selectedSidebar && (
                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                                        detail?.gradeStatus || selectedSidebar.gradeStatus
                                    )}`}
                                >
                                    {statusLabel(detail?.gradeStatus || selectedSidebar.gradeStatus)}
                                </span>
                            )}
                        </div>

                        {loading || detailLoading ? (
                            <div className="px-5 py-20 text-center text-sm text-slate-500">
                                Đang tải bài nộp...
                            </div>
                        ) : !selectedSidebar ? (
                            <div className="px-5 py-20 text-center text-sm text-slate-500">
                                Không có sinh viên để hiển thị.
                            </div>
                        ) : !selectedSubmissionId ? (
                            <div className="px-5 py-16 text-center">
                                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-sm text-slate-500">
                                    Sinh viên này chưa nộp bài.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 p-4 sm:p-5">
                                <div className="overflow-hidden rounded-3xl border border-slate-200">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Bài làm:{" "}
                                                {toText(
                                                    selectedFile?.originalName,
                                                    "Không có file đính kèm"
                                                )}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Lần nộp #{toNum(detail?.attemptNo, 1)} •{" "}
                                                {formatDateTime(detail?.submittedAt)}
                                            </p>
                                        </div>

                                        {selectedFile?.url && (
                                            <a
                                                href={selectedFile.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                            >
                                                <span className="material-symbols-outlined">
                                                    download
                                                </span>
                                            </a>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 p-4">
                                        {selectedFile?.url &&
                                        isPdf(selectedFile.url, selectedFile.mimeType) ? (
                                            <iframe
                                                src={selectedFile.url}
                                                title={toText(selectedFile.originalName)}
                                                className="h-[720px] w-full rounded-2xl bg-white"
                                            />
                                        ) : selectedFile?.url ? (
                                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                                                File này không preview trực tiếp được. Hãy bấm nút tải
                                                xuống để mở.
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                                                Bài nộp này không có file nguồn.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                    <section className="rounded-3xl border border-slate-200 bg-white p-5 xl:col-span-1">
                                        <p className="text-xs font-bold uppercase text-slate-500">
                                            Điểm hiện tại
                                        </p>

                                        <div className="mt-4 flex items-end gap-2">
                                            <span className="text-5xl font-black text-slate-900">
                                                {formatScore(
                                                    detail?.finalScore ?? detail?.autoGrade?.score ?? null
                                                )}
                                            </span>
                                            <span className="pb-1 text-sm text-slate-400">
                                                / {maxScore}
                                            </span>
                                        </div>

                                        <label className="mt-6 block text-sm font-semibold text-slate-700">
                                            Điểm thủ công
                                        </label>
                                        <input
                                            value={manualScore}
                                            onChange={(e) => setManualScore(e.target.value)}
                                            type="number"
                                            min={0}
                                            max={maxScore}
                                            step="0.1"
                                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
                                        />

                                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="flex items-center justify-between">
                                                <span>Điểm AI</span>
                                                <span className="font-semibold text-slate-900">
                                                    {formatScore(detail?.autoGrade?.score)} /{" "}
                                                    {toNum(detail?.autoGrade?.maxScore, maxScore)}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span>Chuẩn hóa</span>
                                                <span className="font-semibold text-slate-900">
                                                    {formatScore(detail?.autoGrade?.normalizedScore)}%
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span>Chấm lúc</span>
                                                <span className="font-semibold text-slate-900">
                                                    {formatDateTime(detail?.autoGrade?.gradedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="rounded-3xl border border-slate-200 bg-white p-5 xl:col-span-2">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Nhận xét AI
                                        </h3>

                                        {!detail?.autoGrade ? (
                                            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                                Bài này chưa được chấm AI.
                                            </div>
                                        ) : (
                                            <div className="mt-4 space-y-4">
                                                {toText(detail?.autoGrade?.aiFeedback?.summary) && (
                                                    <div className="rounded-2xl bg-orange-50 px-4 py-4 text-sm leading-7 text-slate-700">
                                                        {toText(detail?.autoGrade?.aiFeedback?.summary)}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                                                        <p className="text-xs font-bold uppercase text-green-700">
                                                            Điểm mạnh
                                                        </p>
                                                        <ul className="mt-3 space-y-2 text-sm text-green-900">
                                                            {(detail?.autoGrade?.aiFeedback?.strengths ||
                                                                []).length ? (
                                                                detail.autoGrade.aiFeedback.strengths.map(
                                                                    (item: string) => (
                                                                        <li key={item}>• {item}</li>
                                                                    )
                                                                )
                                                            ) : (
                                                                <li>Chưa có nhận xét.</li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                                        <p className="text-xs font-bold uppercase text-blue-700">
                                                            Bước tiếp theo
                                                        </p>
                                                        <ul className="mt-3 space-y-2 text-sm text-blue-900">
                                                            {(detail?.autoGrade?.aiFeedback?.nextSteps ||
                                                                []).length ? (
                                                                detail.autoGrade.aiFeedback.nextSteps.map(
                                                                    (item: string) => (
                                                                        <li key={item}>• {item}</li>
                                                                    )
                                                                )
                                                            ) : (
                                                                <li>Chưa có gợi ý.</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                    <section className="rounded-3xl border border-slate-200 bg-white p-5">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Chi tiết theo tiêu chí
                                        </h3>

                                        <div className="mt-4 space-y-3">
                                            {(detail?.autoGrade?.criterionBreakdown || []).length ? (
                                                detail.autoGrade.criterionBreakdown.map(
                                                    (item: AnyObj, index: number) => (
                                                        <div
                                                            key={`${toText(item.criterionCode)}-${index}`}
                                                            className="rounded-2xl border border-slate-200 p-4"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">
                                                                        {toText(
                                                                            item.title,
                                                                            "Tiêu chí"
                                                                        )}
                                                                    </p>
                                                                    <p className="mt-1 text-xs uppercase text-slate-400">
                                                                        {toText(
                                                                            item.gradingSource,
                                                                            "manual"
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">
                                                                    {formatScore(
                                                                        toNum(item.awardedPoints, 0)
                                                                    )}{" "}
                                                                    /{" "}
                                                                    {formatScore(
                                                                        toNum(item.maxPoints, 0)
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {toText(item.note) && (
                                                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                                                    {toText(item.note)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                                    Chưa có breakdown chấm điểm.
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section className="rounded-3xl border border-slate-200 bg-white p-5">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Phản hồi cuối cùng của giảng viên
                                        </h3>

                                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                            <p>
                                                <span className="font-semibold text-slate-900">
                                                    Repository:
                                                </span>{" "}
                                                {detail?.repositoryUrl ? (
                                                    <a
                                                        href={detail.repositoryUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-orange-600 hover:underline"
                                                    >
                                                        {detail.repositoryUrl}
                                                    </a>
                                                ) : (
                                                    "Không có"
                                                )}
                                            </p>

                                            <p className="mt-3 whitespace-pre-wrap">
                                                <span className="font-semibold text-slate-900">
                                                    Ghi chú sinh viên:
                                                </span>{" "}
                                                {toText(detail?.note, "Không có ghi chú")}
                                            </p>
                                        </div>

                                        <textarea
                                            value={teacherComment}
                                            onChange={(e) => setTeacherComment(e.target.value)}
                                            className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-orange-300"
                                            placeholder="Nhập nhận xét cuối cùng của giảng viên..."
                                        />

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => void handleSave()}
                                                disabled={!selectedSubmissionId || saving || detailLoading}
                                                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {saving ? "Đang lưu..." : "Lưu điểm & phản hồi"}
                                            </button>
                                        </div>
                                    </section>
                                </div>

                                <section className="rounded-3xl border border-slate-200 bg-white p-5">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Lịch sử chấm
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        {history.length ? (
                                            history
                                                .slice()
                                                .reverse()
                                                .map((item: AnyObj, index: number) => (
                                                    <div
                                                        key={`${toText(item.action)}-${toText(
                                                            item.createdAt
                                                        )}-${index}`}
                                                        className="rounded-2xl border border-slate-200 p-4"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                            <div>
                                                                <p className="font-semibold text-slate-900">
                                                                    {toText(item.action)}
                                                                </p>
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    {formatDateTime(
                                                                        toText(item.createdAt)
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                                                {formatScore(item.previousScore)} →{" "}
                                                                {formatScore(item.nextScore)}
                                                            </div>
                                                        </div>

                                                        {toText(item.note) && (
                                                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                                                {toText(item.note)}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                                Chưa có lịch sử chấm.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </section>
                </section>
            </div>
        </div>
    );
}