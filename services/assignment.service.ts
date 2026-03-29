import { assignmentRepository } from "@/repositories/assignment.repository";
import { classroomRepository } from "@/repositories/classroom.repository";
import * as classroomMemberRepo from "@/repositories/classroom-member.repository";
import { submissionRepository } from "@/repositories/submission.repository";
import type {
    CreateAssignmentPayload,
    UpdateAssignmentPayload,
} from "@/validations/assignment.validation";
import type { CurrentUserPayload } from "@/lib/current-user";

type AssignmentAttachment = {
    kind: "resource" | "rubric" | "template";
    originalName: string;
    storedName: string;
    url: string;
    mimeType: string;
    size: number;
};

function toStringId(value: unknown): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "bigint") return String(value);

    if (typeof value === "object" && value !== null) {
        const maybeObject = value as { _id?: unknown; toString?: () => string };

        if ("_id" in maybeObject && maybeObject._id && maybeObject._id !== value) {
            return toStringId(maybeObject._id);
        }

        if (typeof maybeObject.toString === "function") {
            const stringValue = maybeObject.toString();
            if (stringValue && stringValue !== "[object Object]") {
                return stringValue;
            }
        }
    }

    return String(value);
}

function serializeAssignment(item: any) {
    const now = Date.now();
    const dueTime = item?.dueAt ? new Date(item.dueAt).getTime() : 0;
    const rawStatus = item?.status || "published";

    let displayStatus = "published";
    if (rawStatus === "draft") {
        displayStatus = "draft";
    } else if (rawStatus === "closed" || (dueTime > 0 && dueTime < now)) {
        displayStatus = "closed";
    }

    return {
        _id: toStringId(item?._id),
        title: item?.title || "",
        language: item?.language || "",
        description: item?.description || "",
        rubricText: item?.rubricText || "",
        attachments: Array.isArray(item?.attachments) ? item.attachments : [],
        startAt: item?.startAt,
        dueAt: item?.dueAt,
        allowLateSubmit: Boolean(item?.allowLateSubmit),
        allowResubmit: Boolean(item?.allowResubmit),
        latePenaltyPercent: Number(item?.latePenaltyPercent || 0),
        maxScore: Number(item?.maxScore || 10),
        status: rawStatus,
        displayStatus,
        classroom: item?.classroomId
            ? {
                _id: toStringId(item.classroomId?._id || item.classroomId),
                name: item.classroomId?.name || "",
                code: item.classroomId?.code || "",
                semester: item.classroomId?.semester || "",
                academicYear: item.classroomId?.academicYear || "",
            }
            : null,
        teacher: item?.teacherId
            ? {
                _id: toStringId(item.teacherId?._id || item.teacherId),
                name: item.teacherId?.name || "",
                email: item.teacherId?.email || "",
            }
            : null,
        createdAt: item?.createdAt,
        updatedAt: item?.updatedAt,
    };
}

async function getTeacherManagedClassIds(currentUser: CurrentUserPayload) {
    const [ownedClasses, supportedClassIds] = await Promise.all([
        classroomRepository.findAllByTeacherId(currentUser.userId),
        classroomMemberRepo.findClassroomIdsByUserId(currentUser.userId, {
            status: "active",
            roleInClass: "teacher",
        }),
    ]);

    const ids = new Set<string>();

    for (const classroom of ownedClasses) {
        ids.add(toStringId(classroom?._id));
    }

    for (const id of supportedClassIds) {
        ids.add(String(id));
    }

    return Array.from(ids).filter(Boolean);
}

async function ensureTeacherCanManageClass(
    currentUser: CurrentUserPayload,
    classroomId: string
) {
    if (!currentUser?.userId) {
        throw new Error("Bạn chưa đăng nhập");
    }

    if (currentUser.role === "admin") {
        return;
    }

    if (currentUser.role !== "teacher") {
        throw new Error("Bạn không có quyền tạo bài tập");
    }

    const hasPermission = await classroomMemberRepo.isTeacherInClass(
        classroomId,
        currentUser.userId
    );

    if (!hasPermission) {
        throw new Error("Bạn không có quyền tạo bài tập cho lớp này");
    }
}

async function ensureCanManageAssignment(
    currentUser: CurrentUserPayload,
    assignmentId: string
) {
    const assignment = await assignmentRepository.findById(assignmentId);

    if (!assignment) {
        throw new Error("Không tìm thấy bài tập");
    }

    const classroomId = toStringId(assignment.classroomId?._id || assignment.classroomId);

    if (currentUser.role === "admin") {
        return assignment;
    }

    if (currentUser.role !== "teacher") {
        throw new Error("Bạn không có quyền thao tác bài tập này");
    }

    const hasPermission = await classroomMemberRepo.isTeacherInClass(
        classroomId,
        currentUser.userId
    );

    if (!hasPermission) {
        throw new Error("Bạn không có quyền thao tác bài tập này");
    }

    return assignment;
}

export const assignmentService = {
    async createAssignment(
        payload: CreateAssignmentPayload,
        attachments: AssignmentAttachment[],
        currentUser: CurrentUserPayload
    ) {
        const classroom = await classroomRepository.findById(payload.classroomId);

        if (!classroom) {
            throw new Error("Không tìm thấy lớp học");
        }

        await ensureTeacherCanManageClass(currentUser, payload.classroomId);

        const created = await assignmentRepository.create({
            title: payload.title,
            classroomId: payload.classroomId,
            teacherId: currentUser.userId,
            language: payload.language,
            description: payload.description,
            rubricText: payload.rubricText,
            attachments,
            startAt: new Date(payload.startAt),
            dueAt: new Date(payload.dueAt),
            allowLateSubmit: payload.allowLateSubmit,
            allowResubmit: payload.allowResubmit,
            latePenaltyPercent: payload.latePenaltyPercent,
            maxScore: payload.maxScore,
            status: payload.status,
        });

        const populated = await assignmentRepository.findById(toStringId(created._id));
        return serializeAssignment(populated);
    },

    async getAssignments(currentUser: CurrentUserPayload) {
        if (!currentUser?.userId) {
            throw new Error("Bạn chưa đăng nhập");
        }

        let assignments: any[] = [];

        if (currentUser.role === "admin") {
            const classrooms = await classroomRepository.findAll();
            const classroomIds = classrooms.map((item) => toStringId(item?._id)).filter(Boolean);
            assignments = classroomIds.length
                ? await assignmentRepository.findManyByClassroomIds(classroomIds, {
                    includeDraft: true,
                })
                : [];
        } else if (currentUser.role === "teacher") {
            const managedClassIds = await getTeacherManagedClassIds(currentUser);
            assignments = managedClassIds.length
                ? await assignmentRepository.findManyByClassroomIds(managedClassIds, {
                    includeDraft: true,
                })
                : [];
        } else {
            const joinedClassIds = await classroomMemberRepo.findClassroomIdsByUserId(
                currentUser.userId,
                {
                    status: "active",
                }
            );

            assignments = joinedClassIds.length
                ? await assignmentRepository.findManyByClassroomIds(joinedClassIds, {
                    includeDraft: false,
                })
                : [];
        }

        return assignments.map(serializeAssignment);
    },

    async getAssignmentById(id: string, currentUser: CurrentUserPayload) {
        const item = await assignmentRepository.findById(id);

        if (!item) {
            throw new Error("Không tìm thấy bài tập");
        }

        if (currentUser.role === "admin" || currentUser.role === "teacher") {
            return serializeAssignment(item);
        }

        const classroomId = toStringId(item.classroomId?._id || item.classroomId);
        const member = await classroomMemberRepo.findMember(classroomId, currentUser.userId);

        if (!member || member.status !== "active") {
            throw new Error("Bạn không có quyền xem bài tập này");
        }

        return serializeAssignment(item);
    },

    async updateAssignment(
        assignmentId: string,
        payload: UpdateAssignmentPayload,
        attachmentInput: {
            keepExistingAttachmentUrls: string[];
            newAttachments: AssignmentAttachment[];
        },
        currentUser: CurrentUserPayload
    ) {
        const current = await ensureCanManageAssignment(currentUser, assignmentId);

        if (payload.classroomId) {
            const classroom = await classroomRepository.findById(payload.classroomId);
            if (!classroom) {
                throw new Error("Không tìm thấy lớp học");
            }
            await ensureTeacherCanManageClass(currentUser, payload.classroomId);
        }

        const nextStartAt = payload.startAt
            ? new Date(payload.startAt)
            : new Date(String(current.startAt));
        const nextDueAt = payload.dueAt
            ? new Date(payload.dueAt)
            : new Date(String(current.dueAt));

        if (nextDueAt.getTime() <= nextStartAt.getTime()) {
            throw new Error("Hạn nộp phải sau ngày bắt đầu");
        }

        const currentAttachments: AssignmentAttachment[] = Array.isArray(current.attachments)
            ? current.attachments
            : [];

        const keepSet = new Set(attachmentInput.keepExistingAttachmentUrls || []);

        const keptExistingAttachments = currentAttachments.filter((item) =>
            keepSet.has(item.url)
        );

        const removedAttachmentUrls = currentAttachments
            .filter((item) => !keepSet.has(item.url))
            .map((item) => item.url);

        const nextAttachments = [
            ...keptExistingAttachments,
            ...(attachmentInput.newAttachments || []),
        ];

        const updated = await assignmentRepository.updateById(assignmentId, {
            ...(payload.title !== undefined ? { title: payload.title } : {}),
            ...(payload.classroomId !== undefined ? { classroomId: payload.classroomId } : {}),
            ...(payload.language !== undefined ? { language: payload.language } : {}),
            ...(payload.description !== undefined ? { description: payload.description } : {}),
            ...(payload.rubricText !== undefined ? { rubricText: payload.rubricText } : {}),
            ...(payload.startAt !== undefined ? { startAt: nextStartAt } : {}),
            ...(payload.dueAt !== undefined ? { dueAt: nextDueAt } : {}),
            ...(payload.allowLateSubmit !== undefined
                ? { allowLateSubmit: payload.allowLateSubmit }
                : {}),
            ...(payload.allowResubmit !== undefined
                ? { allowResubmit: payload.allowResubmit }
                : {}),
            ...(payload.latePenaltyPercent !== undefined
                ? { latePenaltyPercent: payload.latePenaltyPercent }
                : {}),
            ...(payload.maxScore !== undefined ? { maxScore: payload.maxScore } : {}),
            ...(payload.status !== undefined ? { status: payload.status } : {}),
            attachments: nextAttachments,
        });

        return {
            assignment: serializeAssignment(updated),
            removedAttachmentUrls,
        };
    },

    async deleteAssignment(assignmentId: string, currentUser: CurrentUserPayload) {
        await ensureCanManageAssignment(currentUser, assignmentId);

        const deleted = await assignmentRepository.deleteById(assignmentId);

        if (!deleted) {
            throw new Error("Không tìm thấy bài tập");
        }

        return {
            _id: toStringId(deleted._id),
        };
    },

    async getAvailableAssignments(currentUser: CurrentUserPayload) {
        if (!currentUser?.userId) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const joinedClassIds = await classroomMemberRepo.findClassroomIdsByUserId(
            currentUser.userId,
            {
                status: "active",
            }
        );

        if (!joinedClassIds.length) {
            return [];
        }

        const assignments = await assignmentRepository.findManyByClassroomIds(joinedClassIds, {
            includeDraft: false,
        });

        const serialized = assignments.map(serializeAssignment);
        const assignmentIds = serialized.map((item) => item._id);

        const latestSubmissions = assignmentIds.length
            ? await submissionRepository.findLatestMapForStudent(
                assignmentIds,
                currentUser.userId
            )
            : [];

        const submissionMap = new Map<string, any>();
        for (const submission of latestSubmissions) {
            submissionMap.set(toStringId(submission.assignmentId), {
                _id: toStringId(submission._id),
                attemptNo: Number(submission.attemptNo || 0),
                status: submission.status,
                isLate: Boolean(submission.isLate),
                repositoryUrl: submission.repositoryUrl || "",
                note: submission.note || "",
                files: Array.isArray(submission.files) ? submission.files : [],
                submittedAt: submission.submittedAt,
                createdAt: submission.createdAt,
            });
        }

        return serialized.map((assignment) => ({
            ...assignment,
            latestSubmission: submissionMap.get(assignment._id) || null,
        }));
    },
};