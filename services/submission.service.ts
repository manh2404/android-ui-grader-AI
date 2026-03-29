import { assignmentRepository } from "@/repositories/assignment.repository";
import * as classroomMemberRepo from "@/repositories/classroom-member.repository";
import { submissionRepository } from "@/repositories/submission.repository";
import type { CreateSubmissionPayload } from "@/validations/submission.validation";
import type { CurrentUserPayload } from "@/lib/current-user";

type SubmissionFile = {
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

export const submissionService = {
    async createSubmission(
        payload: CreateSubmissionPayload,
        files: SubmissionFile[],
        currentUser: CurrentUserPayload
    ) {
        if (!currentUser?.userId) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const assignment = await assignmentRepository.findById(payload.assignmentId);

        if (!assignment) {
            throw new Error("Không tìm thấy bài tập");
        }

        if (assignment.status === "draft") {
            throw new Error("Bài tập này chưa được công bố");
        }

        if (assignment.status === "closed") {
            throw new Error("Bài tập này đã bị đóng, không thể nộp thêm");
        }

        const classroomId = toStringId(assignment.classroomId?._id || assignment.classroomId);
        const teacherId = toStringId(assignment.teacherId?._id || assignment.teacherId);

        if (teacherId === currentUser.userId) {
            throw new Error("Giảng viên không thể nộp bài cho bài tập do mình tạo");
        }

        const member = await classroomMemberRepo.findMember(
            classroomId,
            currentUser.userId
        );

        if (!member || member.status !== "active") {
            throw new Error("Bạn chưa là thành viên hợp lệ của lớp này");
        }

        if (member.roleInClass !== "student") {
            throw new Error("Chỉ sinh viên mới có thể nộp bài tập");
        }

        const hasUpload = files.length > 0;
        const hasRepository = Boolean(payload.repositoryUrl?.trim());

        if (payload.action === "submit" && !hasUpload && !hasRepository) {
            throw new Error("Bạn cần tải file hoặc nhập link repository trước khi nộp");
        }

        const now = new Date();
        const dueAt = new Date(String(assignment.dueAt));
        const isLate = now.getTime() > dueAt.getTime();

        if (isLate && !assignment.allowLateSubmit && payload.action === "submit") {
            throw new Error("Bài tập đã quá hạn và không cho phép nộp muộn");
        }

        const latestSubmission = await submissionRepository.findLatestByAssignmentAndStudent(
            payload.assignmentId,
            currentUser.userId
        );

        if (
            latestSubmission &&
            latestSubmission.status !== "draft" &&
            payload.action === "submit" &&
            !assignment.allowResubmit
        ) {
            throw new Error("Bài tập này không cho phép nộp lại");
        }

        const nextAttemptNo = Number(latestSubmission?.attemptNo || 0) + 1;
        await submissionRepository.markPreviousLatestFalse(
            payload.assignmentId,
            currentUser.userId
        );

        const status =
            payload.action === "draft"
                ? "draft"
                : isLate
                    ? "late"
                    : "submitted";

        const created = await submissionRepository.create({
            assignmentId: payload.assignmentId,
            classroomId,
            studentId: currentUser.userId,
            attemptNo: nextAttemptNo,
            status,
            isLate: payload.action === "submit" ? isLate : false,
            latest: true,
            repositoryUrl: payload.repositoryUrl,
            note: payload.note,
            files,
            submittedAt: now,
        });

        return {
            _id: toStringId(created._id),
            attemptNo: nextAttemptNo,
            status,
            isLate: payload.action === "submit" ? isLate : false,
            repositoryUrl: payload.repositoryUrl,
            note: payload.note,
            files,
            submittedAt: now,
            assignment: {
                _id: toStringId(assignment._id),
                title: assignment.title,
                dueAt: assignment.dueAt,
                allowResubmit: Boolean(assignment.allowResubmit),
                allowLateSubmit: Boolean(assignment.allowLateSubmit),
                latePenaltyPercent: Number(assignment.latePenaltyPercent || 0),
            },
        };
    },
};