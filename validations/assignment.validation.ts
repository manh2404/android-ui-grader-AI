import { z } from "zod";

const isoDate = z
    .string()
    .trim()
    .min(1, "Ngày giờ không được để trống")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Ngày giờ không hợp lệ",
    });

const assignmentBaseSchema = z.object({
    title: z.string().trim().min(3, "Tên bài tập phải có ít nhất 3 ký tự"),
    classroomId: z.string().trim().min(1, "Vui lòng chọn lớp học"),
    language: z.string().trim().default("cpp"),
    description: z.string().trim().min(3, "Mô tả bài tập quá ngắn"),
    rubricText: z.string().trim().optional().default(""),
    startAt: isoDate,
    dueAt: isoDate,
    allowLateSubmit: z.boolean().default(false),
    allowResubmit: z.boolean().default(false),
    latePenaltyPercent: z.number().min(0).max(100).default(0),
    maxScore: z.number().min(0.5, "Điểm tối đa phải lớn hơn 0").default(10),
    status: z.enum(["draft", "published"]).default("published"),
});

export const createAssignmentSchema = assignmentBaseSchema.refine(
    (data) => new Date(data.dueAt).getTime() > new Date(data.startAt).getTime(),
    {
        message: "Hạn nộp phải sau ngày bắt đầu",
        path: ["dueAt"],
    }
);

export const updateAssignmentSchema = assignmentBaseSchema
    .partial()
    .extend({
        status: z.enum(["draft", "published", "closed"]).optional(),
    })
    .refine(
        (data) => {
            if (data.startAt && data.dueAt) {
                return new Date(data.dueAt).getTime() > new Date(data.startAt).getTime();
            }
            return true;
        },
        {
            message: "Hạn nộp phải sau ngày bắt đầu",
            path: ["dueAt"],
        }
    );

export type CreateAssignmentPayload = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentPayload = z.infer<typeof updateAssignmentSchema>;

export function parseBoolean(value: FormDataEntryValue | null) {
    return String(value ?? "false") === "true";
}

export function parseNumber(
    value: FormDataEntryValue | null,
    fallback: number
) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function extractAssignmentPayload(formData: FormData) {
    return createAssignmentSchema.parse({
        title: String(formData.get("title") ?? ""),
        classroomId: String(formData.get("classroomId") ?? ""),
        language: String(formData.get("language") ?? "cpp"),
        description: String(formData.get("description") ?? ""),
        rubricText: String(formData.get("rubricText") ?? ""),
        startAt: String(formData.get("startAt") ?? ""),
        dueAt: String(formData.get("dueAt") ?? ""),
        allowLateSubmit: parseBoolean(formData.get("allowLateSubmit")),
        allowResubmit: parseBoolean(formData.get("allowResubmit")),
        latePenaltyPercent: parseNumber(formData.get("latePenaltyPercent"), 0),
        maxScore: parseNumber(formData.get("maxScore"), 10),
        status: String(formData.get("status") ?? "published"),
    });
}

export function extractAssignmentUpdatePayload(formData: FormData) {
    return updateAssignmentSchema.parse({
        title: formData.get("title") ? String(formData.get("title")) : undefined,
        classroomId: formData.get("classroomId")
            ? String(formData.get("classroomId"))
            : undefined,
        language: formData.get("language") ? String(formData.get("language")) : undefined,
        description: formData.get("description")
            ? String(formData.get("description"))
            : undefined,
        rubricText: formData.get("rubricText")
            ? String(formData.get("rubricText"))
            : undefined,
        startAt: formData.get("startAt") ? String(formData.get("startAt")) : undefined,
        dueAt: formData.get("dueAt") ? String(formData.get("dueAt")) : undefined,
        allowLateSubmit:
            formData.get("allowLateSubmit") !== null
                ? parseBoolean(formData.get("allowLateSubmit"))
                : undefined,
        allowResubmit:
            formData.get("allowResubmit") !== null
                ? parseBoolean(formData.get("allowResubmit"))
                : undefined,
        latePenaltyPercent:
            formData.get("latePenaltyPercent") !== null
                ? parseNumber(formData.get("latePenaltyPercent"), 0)
                : undefined,
        maxScore:
            formData.get("maxScore") !== null
                ? parseNumber(formData.get("maxScore"), 10)
                : undefined,
        status: formData.get("status") ? String(formData.get("status")) : undefined,
    });
}