import { classroomRepository } from "@/repositories/classroom.repository";
import * as classroomMemberRepo from "@/repositories/classroom-member.repository";

type Semester = "HK1" | "HK2" | "HK3";

type CurrentUser = {
    userId: string;
    role: string;
};

type CreateClassPayload = {
    name: string;
    code: string;
    description?: string;
    semester: Semester;
    academicYear: string;
};

function toStringId(value: unknown): string {
    if (!value) return "";

    if (typeof value === "string") return value;

    if (
        typeof value === "number" ||
        typeof value === "bigint" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (typeof value === "object" && value !== null) {
        const obj = value as { _id?: unknown; toString?: () => string };

        if ("_id" in obj && obj._id && obj._id !== value) {
            return toStringId(obj._id);
        }

        if (typeof obj.toString === "function") {
            const stringified = obj.toString();

            if (stringified && stringified !== "[object Object]") {
                return stringified;
            }
        }
    }

    return String(value);
}

function ensureCanManageClass(currentUser: CurrentUser, teacherId: unknown) {
    if (currentUser.role === "admin") return;

    if (currentUser.role !== "teacher") {
        throw new Error("Bạn không có quyền thực hiện thao tác này");
    }

    const ownerId = toStringId(teacherId);

    if (ownerId && ownerId !== currentUser.userId) {
        throw new Error("Bạn chỉ có thể thao tác trên lớp học của mình");
    }
}

function mergeUniqueById<T extends { _id?: unknown; createdAt?: unknown }>(
    ...groups: T[][]
) {
    const map = new Map<string, T>();

    for (const items of groups) {
        for (const item of items) {
            map.set(String(item._id), item);
        }
    }

    return Array.from(map.values()).sort((a, b) => {
        const timeA = a.createdAt ? new Date(String(a.createdAt)).getTime() : 0;
        const timeB = b.createdAt ? new Date(String(b.createdAt)).getTime() : 0;
        return timeB - timeA;
    });
}

export const classroomService = {
    async getAllClasses(currentUser: CurrentUser) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        if (currentUser.role === "admin") {
            return classroomRepository.findAll();
        }

        if (currentUser.role === "teacher") {
            const [ownedClasses, supportedClassIds] = await Promise.all([
                classroomRepository.findAllByTeacherId(currentUser.userId),
                classroomMemberRepo.findClassroomIdsByUserId(currentUser.userId, {
                    status: "active",
                    roleInClass: "teacher",
                }),
            ]);

            const supportedClasses = supportedClassIds.length
                ? await classroomRepository.findAllByIds(supportedClassIds)
                : [];

            return mergeUniqueById(ownedClasses, supportedClasses);
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

        return classroomRepository.findAllByIds(joinedClassIds);
    },

    async getClassById(id: string) {
        const classroom = await classroomRepository.findById(id);

        if (!classroom) {
            throw new Error("Không tìm thấy lớp học");
        }

        return classroom;
    },

    async createClass(data: CreateClassPayload, currentUser: CurrentUser) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        if (!["admin", "teacher"].includes(currentUser.role)) {
            throw new Error("Bạn không có quyền tạo lớp học");
        }

        const normalizedCode = data.code.trim().toUpperCase();
        const existing = await classroomRepository.findByCode(normalizedCode);

        if (existing) {
            throw new Error("Mã lớp đã tồn tại");
        }

        return classroomRepository.create({
            name: data.name.trim(),
            code: normalizedCode,
            description: data.description?.trim() || "",
            semester: data.semester,
            academicYear: data.academicYear.trim(),
            teacherId: currentUser.userId,
            status: "active",
        });
    },

    async updateClass(
        id: string,
        data: Record<string, unknown>,
        currentUser: CurrentUser
    ) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const existing = await classroomRepository.findById(id);

        if (!existing) {
            throw new Error("Không tìm thấy lớp học");
        }

        ensureCanManageClass(currentUser, existing.teacherId);

        const nextData: Record<string, unknown> = { ...data };

        if (typeof nextData.code === "string") {
            const normalizedCode = nextData.code.trim().toUpperCase();
            const duplicate = await classroomRepository.findByCode(normalizedCode);

            if (duplicate && String(duplicate._id) !== String(existing._id)) {
                throw new Error("Mã lớp đã tồn tại");
            }

            nextData.code = normalizedCode;
        }

        if (typeof nextData.name === "string") {
            nextData.name = nextData.name.trim();
        }

        if (typeof nextData.description === "string") {
            nextData.description = nextData.description.trim();
        }

        if (typeof nextData.academicYear === "string") {
            nextData.academicYear = nextData.academicYear.trim();
        }

        const updated = await classroomRepository.updateById(id, nextData);

        if (!updated) {
            throw new Error("Cập nhật lớp học thất bại");
        }

        return updated;
    },

    async deleteClass(id: string, currentUser: CurrentUser) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const existing = await classroomRepository.findById(id);

        if (!existing) {
            throw new Error("Không tìm thấy lớp học");
        }

        ensureCanManageClass(currentUser, existing.teacherId);

        await Promise.all([
            classroomRepository.deleteById(id),
            classroomMemberRepo.deleteManyByClassroomId(id),
        ]);

        return true;
    },
};