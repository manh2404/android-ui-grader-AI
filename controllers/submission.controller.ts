import { ZodError } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentUserFromCookie } from "@/lib/current-user";
import { saveFilesToLocal } from "@/lib/upload-local";
import { submissionService } from "@/services/submission.service";
import { extractSubmissionPayload } from "@/validations/submission.validation";

function resolveError(error: unknown) {
    if (error instanceof ZodError) {
        return {
            status: 400,
            message: error.issues[0]?.message || "Dữ liệu không hợp lệ",
        };
    }

    const message = error instanceof Error ? error.message : "Không thể xử lý yêu cầu";

    if (message.includes("chưa đăng nhập")) return { status: 401, message };
    if (message.includes("không có quyền")) return { status: 403, message };
    if (message.includes("Không tìm thấy")) return { status: 404, message };

    return { status: 400, message };
}

export const submissionController = {
    async create(request: Request) {
        try {
            const currentUser = await getCurrentUserFromCookie();

            if (!currentUser) {
                return errorResponse("Bạn chưa đăng nhập", 401);
            }

            const formData = await request.formData();
            const payload = extractSubmissionPayload(formData);

            const files = formData
                .getAll("submissionFiles")
                .filter((item): item is File => item instanceof File && item.size > 0);

            const savedFiles = await saveFilesToLocal(files, "submissions");
            const created = await submissionService.createSubmission(
                payload,
                savedFiles,
                currentUser
            );

            return successResponse(created, "Nộp bài thành công", 201);
        } catch (error) {
            const resolved = resolveError(error);
            return errorResponse(resolved.message, resolved.status);
        }
    },
};