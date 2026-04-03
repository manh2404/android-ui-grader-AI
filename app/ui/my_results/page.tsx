"use client";

import { useEffect, useMemo, useState } from "react";

type CurrentUser = {
    _id?: string;
    name?: string;
    role?: "admin" | "teacher" | "User";
    studentCode?: string;
};

type AnyObject = Record<string, any>;

type ScoreCriterion = {
    title: string;
    gradingSource: string;
    awardedPoints: number;
    maxPoints: number;
    note: string;
};

type ResultItem = {
    _id: string;
    assignmentId: string;
    assignmentTitle: string;
    classroomName: string;
    classroomCode: string;

    studentId: string;
    studentName: string;
    studentCode: string;

    dueAt?: string;
    submittedAt?: string;
    attemptNo: number;
    submissionStatus: string;
    gradeStatus: string;
    finalScore: number | null;
    maxScore: number;
    repositoryUrl: string;
    studentNote: string;
    teacherComment: string;
    aiSummary: string;
    strengths: string[];
    nextSteps: string[];
    criterionBreakdown: ScoreCriterion[];
};

function asObject(value: unknown): AnyObject {
    return typeof value === "object" && value !== null ? (value as AnyObject) : {};
}

function toText(value: unknown, fallback = "") {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return fallback;
    return String(value);
}

function toNumberValue(value: unknown, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDateTime(value?: string) {
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

function formatDate(value?: string) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatScore(value: number | null | undefined) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "--";
    }

    const numberValue = Number(value);
    return Number.isInteger(numberValue)
        ? String(numberValue)
        : numberValue.toFixed(1);
}

function gradeStatusLabel(status: string) {
    if (status === "overridden") return "Giảng viên đã chốt";
    if (status === "auto_graded") return "AI đã chấm";
    if (status === "needs_teacher_review") return "Chờ giảng viên duyệt";
    if (status === "graded") return "Đã chấm";
    return "Chưa chấm";
}

function gradeStatusClass(status: string) {
    if (status === "overridden") {
        return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "auto_graded") {
        return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "needs_teacher_review") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-700";
}
function normalizeResult(raw: unknown): ResultItem {
    const item = asObject(raw);
    const assignment = asObject(item.assignmentId || item.assignment);
    const classroom = asObject(item.classroomId || item.classroom);
    const student = asObject(item.studentId || item.student);
    const autoGrade = asObject(item.autoGrade);
    const aiFeedback = asObject(autoGrade.aiFeedback);
    const teacherOverride = asObject(item.teacherOverride);

    return {
        _id: toText(item._id),
        assignmentId: toText(assignment._id || item.assignmentId),
        assignmentTitle: toText(assignment.title, "Bài tập chưa đặt tên"),
        classroomName: toText(classroom.name, "Chưa có lớp"),
        classroomCode: toText(classroom.code),

        studentId: toText(student._id || item.studentId),
        studentName: toText(student.name, "Sinh viên"),
        studentCode: toText(student.studentCode),

        dueAt: toText(assignment.dueAt) || undefined,
        submittedAt: toText(item.submittedAt) || undefined,
        attemptNo: toNumberValue(item.attemptNo, 1),
        submissionStatus: toText(item.status, "submitted"),
        gradeStatus: toText(item.gradeStatus, "pending"),
        finalScore:
            item.finalScore === null || item.finalScore === undefined
                ? autoGrade.score === null || autoGrade.score === undefined
                    ? null
                    : toNumberValue(autoGrade.score, 0)
                : toNumberValue(item.finalScore, 0),
        maxScore: toNumberValue(assignment.maxScore || autoGrade.maxScore, 10),
        repositoryUrl: toText(item.repositoryUrl),
        studentNote: toText(item.note),
        teacherComment: toText(teacherOverride.comment),
        aiSummary: toText(aiFeedback.summary),
        strengths: Array.isArray(aiFeedback.strengths)
            ? aiFeedback.strengths.map((entry: unknown) => toText(entry)).filter(Boolean)
            : [],
        nextSteps: Array.isArray(aiFeedback.nextSteps)
            ? aiFeedback.nextSteps.map((entry: unknown) => toText(entry)).filter(Boolean)
            : [],
        criterionBreakdown: Array.isArray(autoGrade.criterionBreakdown)
            ? autoGrade.criterionBreakdown.map((criterion: unknown) => {
                const entry = asObject(criterion);
                return {
                    title: toText(entry.title, "Tiêu chí"),
                    gradingSource: toText(entry.gradingSource, "manual"),
                    awardedPoints: toNumberValue(entry.awardedPoints, 0),
                    maxPoints: toNumberValue(entry.maxPoints, 0),
                    note: toText(entry.note),
                };
            })
            : [],
    };
}

function pickLatestByAssignment(items: ResultItem[]) {
    const sorted = [...items].sort((a, b) => {
        const timeA = new Date(a.submittedAt || 0).getTime();
        const timeB = new Date(b.submittedAt || 0).getTime();

        if (timeA !== timeB) {
            return timeB - timeA;
        }

        return b.attemptNo - a.attemptNo;
    });

    const unique = new Map<string, ResultItem>();

    for (const item of sorted) {
        if (!item.assignmentId) {
            unique.set(item._id, item);
            continue;
        }

        if (!unique.has(item.assignmentId)) {
            unique.set(item.assignmentId, item);
        }
    }

    return Array.from(unique.values());
}

export default function MyResultsPage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [items, setItems] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedId, setSelectedId] = useState("");
    const isStudentView = currentUser?.role === "User";
    const isTeacherView =
        currentUser?.role === "teacher" || currentUser?.role === "admin";

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const userRes = await fetch("/api/auth/me", { cache: "no-store" });
                const userJson = await userRes.json().catch(() => ({}));

                if (!userRes.ok) {
                    throw new Error(userJson.message || "Bạn chưa đăng nhập");
                }

                const user = (userJson.user || null) as CurrentUser | null;
                setCurrentUser(user);

                if (user?.role !== "User") {
                    setItems([]);
                    setSelectedId("");
                    return;
                }

                const submissionsRes = await fetch("/api/submissions", { cache: "no-store" });
                const submissionsJson = await submissionsRes.json().catch(() => ({}));

                if (!submissionsRes.ok) {
                    throw new Error(
                        submissionsJson.message || "Không tải được kết quả bài tập"
                    );
                }

                const normalized = Array.isArray(submissionsJson.data)
                    ? submissionsJson.data.map((entry: unknown) => normalizeResult(entry))
                    : [];

                const latestOnly = pickLatestByAssignment(normalized);
                setItems(latestOnly);

                if (latestOnly.length) {
                    setSelectedId(latestOnly[0]._id);
                }
            } catch (fetchError) {
                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : "Không tải được kết quả bài tập"
                );
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const classOptions = useMemo(() => {
        const map = new Map<string, string>();

        for (const item of items) {
            const key = item.classroomCode || item.classroomName;
            const label = item.classroomCode
                ? `${item.classroomName} (${item.classroomCode})`
                : item.classroomName;

            if (key) {
                map.set(key, label);
            }
        }

        return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    }, [items]);

    const filteredItems = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return items.filter((item) => {
            const matchKeyword =
                !normalizedKeyword ||
                `${item.assignmentTitle} ${item.classroomName} ${item.classroomCode}`
                    .toLowerCase()
                    .includes(normalizedKeyword);

            const classKey = item.classroomCode || item.classroomName;
            const matchClass = classFilter === "all" || classKey === classFilter;

            const isGraded =
                item.finalScore !== null ||
                item.gradeStatus === "auto_graded" ||
                item.gradeStatus === "overridden" ||
                item.gradeStatus === "graded";

            const matchStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "graded"
                        ? isGraded
                        : statusFilter === "pending"
                            ? !isGraded
                            : statusFilter === item.submissionStatus;

            return matchKeyword && matchClass && matchStatus;
        });
    }, [items, keyword, classFilter, statusFilter]);

    useEffect(() => {
        if (!filteredItems.length) {
            setSelectedId("");
            return;
        }

        setSelectedId((previous) => {
            if (filteredItems.some((item) => item._id === previous)) {
                return previous;
            }

            return filteredItems[0]._id;
        });
    }, [filteredItems]);

    const selectedItem = useMemo(() => {
        return filteredItems.find((item) => item._id === selectedId) || null;
    }, [filteredItems, selectedId]);

    const gradedCount = filteredItems.filter(
        (item) =>
            item.finalScore !== null ||
            item.gradeStatus === "auto_graded" ||
            item.gradeStatus === "overridden"
    ).length;

    const scores = filteredItems
        .map((item) => item.finalScore)
        .filter((value): value is number => value !== null && value !== undefined);

    const averageScore =
        scores.length > 0
            ? (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1)
            : "--";

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                Đang tải kết quả học tập...
            </div>
        );
    }

    if (currentUser?.role && currentUser.role !== "User" && currentUser.role !== "admin" && currentUser.role !== "teacher") {
        return (
            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
                <h1 className="text-xl font-bold">Trang này dành cho sinh viên</h1>
                <p className="mt-2 text-sm leading-6">
                    Bạn đang đăng nhập bằng tài khoản giảng viên hoặc quản trị viên, vì vậy trang
                    kết quả cá nhân của sinh viên sẽ không hiển thị ở đây.
                </p>
            </section>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-orange-500">
                            Kết quả học tập
                        </p>

                        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
                            Điểm số và nhận xét bài tập của bạn
                        </h1>
                    </div>

                    <div className="rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white shadow-sm">
                                {currentUser?.name?.slice(0, 2)?.toUpperCase() || "SV"}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xl font-bold text-slate-900">
                                    {currentUser?.name || "Chưa có tên"}
                                </p>

                                <p className="mt-2 text-sm font-medium uppercase tracking-[0.11em] text-orange-500">
                                    Mã sinh viên
                                </p>

                                <p className="mt-1 break-all text-base font-semibold text-slate-700">
                                    {currentUser?.studentCode || "Chưa cập nhật"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Tổng số bài hiển thị</p>
                    <p className="mt-3 text-3xl font-black text-slate-900">{filteredItems.length}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Bài đã có điểm</p>
                    <p className="mt-3 text-3xl font-black text-slate-900">{gradedCount}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Điểm trung bình</p>
                    <p className="mt-3 text-3xl font-black text-slate-900">{averageScore}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Bài có nhận xét giảng viên</p>
                    <p className="mt-3 text-3xl font-black text-slate-900">
                        {filteredItems.filter((item) => item.teacherComment).length}
                    </p>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr,1fr,1fr] xl:grid-cols-[2fr,1fr,1fr]">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Tìm kiếm bài tập
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Nhập tên bài tập hoặc tên lớp học"
                                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Lớp học
                        </label>
                        <select
                            value={classFilter}
                            onChange={(event) => setClassFilter(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300"
                        >
                            <option value="all">Tất cả lớp học</option>
                            {classOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Trạng thái
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300"
                        >
                            <option value="all">Tất cả</option>
                            <option value="graded">Đã có điểm</option>
                            <option value="pending">Chưa chấm</option>
                            <option value="late">Nộp trễ</option>
                            <option value="submitted">Đã nộp</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.4fr,0.95fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div
                        className="space-y-4 overflow-y-auto pr-2"
                        style={{ maxHeight: "560px", scrollbarGutter: "stable" }}
                    >
                        {filteredItems.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
                                Chưa có bài tập nào phù hợp với bộ lọc hiện tại.
                            </div>
                        ) : (
                            filteredItems.map((item) => {
                                const active = item._id === selectedId;

                                return (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => setSelectedId(item._id)}
                                        className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${
                                            active
                                                ? "border-orange-300 bg-orange-50/40"
                                                : "border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {item.classroomCode ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        {item.classroomCode}
                      </span>
                                                    ) : null}

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${gradeStatusClass(
                                                            item.gradeStatus
                                                        )}`}
                                                    >
                      {gradeStatusLabel(item.gradeStatus)}
                    </span>
                                                </div>

                                                <h2 className="mt-3 text-lg font-bold text-slate-900">
                                                    {item.assignmentTitle}
                                                </h2>

                                                <p className="mt-2 text-sm text-slate-500">
                                                    {item.classroomName} • Hạn nộp: {formatDate(item.dueAt)} • Nộp lần{" "}
                                                    {item.attemptNo}
                                                </p>

                                                {isTeacherView ? (
                                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                                        Sinh viên: {item.studentName}
                                                        {item.studentCode ? ` • ${item.studentCode}` : ""}
                                                    </p>
                                                ) : null}

                                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                                        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                                                            Nhận xét AI
                                                        </p>
                                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-blue-900">
                                                            {item.aiSummary || "Chưa có nhận xét AI cho bài tập này."}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                                                        <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                                                            Nhận xét giảng viên
                                                        </p>
                                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-orange-900">
                                                            {item.teacherComment || "Giảng viên chưa để lại nhận xét cuối cùng."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex min-w-[170px] flex-row items-center justify-between gap-4 border-t border-slate-200 pt-4 lg:flex-col lg:items-end lg:justify-start lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                                                <div className="text-left lg:text-right">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Điểm hiện tại
                                                    </p>
                                                    <p className="mt-2 text-3xl font-black text-slate-900">
                                                        {formatScore(item.finalScore)}
                                                        <span className="text-sm font-medium text-slate-400">
                        {" "}
                                                            / {item.maxScore}
                      </span>
                                                    </p>
                                                </div>

                                                <div className="text-xs text-slate-500 lg:text-right">
                                                    <p>Nộp lúc: {formatDateTime(item.submittedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
                    {!selectedItem ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            Chọn một bài tập ở bên trái để xem chi tiết điểm số và nhận xét.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                                    Chi tiết bài tập
                                </p>
                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {selectedItem.assignmentTitle}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {selectedItem.classroomName} • Hạn nộp {formatDate(selectedItem.dueAt)}
                                </p>
                            </div>

                            <div className="rounded-3xl bg-slate-50 p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Điểm cuối cùng
                                </p>
                                <div className="mt-3 flex items-end gap-2">
                  <span className="text-5xl font-black text-slate-900">
                    {formatScore(selectedItem.finalScore)}
                  </span>
                                    <span className="pb-1 text-sm text-slate-400">
                    / {selectedItem.maxScore}
                  </span>
                                </div>
                                <p className="mt-3 text-sm text-slate-500">
                                    Trạng thái: {gradeStatusLabel(selectedItem.gradeStatus)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                                    Nhận xét cuối cùng của giảng viên
                                </p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-orange-950">
                                    {selectedItem.teacherComment || "Giảng viên chưa để lại phản hồi cuối cùng."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                                    Tóm tắt AI
                                </p>
                                <p className="mt-3 text-sm leading-7 text-blue-950">
                                    {selectedItem.aiSummary || "Bài này chưa có phần tóm tắt AI."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                                        Điểm mạnh
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6 text-green-950">
                                        {selectedItem.strengths.length ? (
                                            selectedItem.strengths.map((entry) => <li key={entry}>• {entry}</li>)
                                        ) : (
                                            <li>Chưa có nhận xét.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                                        Bước tiếp theo
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6 text-indigo-950">
                                        {selectedItem.nextSteps.length ? (
                                            selectedItem.nextSteps.map((entry) => <li key={entry}>• {entry}</li>)
                                        ) : (
                                            <li>Chưa có gợi ý.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Thông tin bài nộp
                                </p>
                                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                                    <p>
                                        <span className="font-semibold text-slate-900">Thời gian nộp:</span>{" "}
                                        {formatDateTime(selectedItem.submittedAt)}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-900">Ghi chú của bạn:</span>{" "}
                                        {selectedItem.studentNote || "Không có ghi chú"}
                                    </p>
                                    <p className="break-all">
                                        <span className="font-semibold text-slate-900">Repository:</span>{" "}
                                        {selectedItem.repositoryUrl ? (
                                            <a
                                                href={selectedItem.repositoryUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-orange-600 hover:underline"
                                            >
                                                {selectedItem.repositoryUrl}
                                            </a>
                                        ) : (
                                            "Không có"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900">Chi tiết theo tiêu chí</p>
                                <div className="mt-3 space-y-3">
                                    {selectedItem.criterionBreakdown.length ? (
                                        selectedItem.criterionBreakdown.map((criterion, index) => (
                                            <div
                                                key={`${criterion.title}-${index}`}
                                                className="rounded-2xl border border-slate-200 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{criterion.title}</p>
                                                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                                            {criterion.gradingSource}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">
                                                        {formatScore(criterion.awardedPoints)} /{" "}
                                                        {formatScore(criterion.maxPoints)}
                                                    </div>
                                                </div>

                                                {criterion.note ? (
                                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                                        {criterion.note}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                            Chưa có breakdown chi tiết theo tiêu chí.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}