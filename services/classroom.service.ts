import User from "@/models/User.model";
import { classroomRepository } from "@/repositories/classroom.repository";

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

function getOwnerId(value: unknown): string | null {
    if (!value) return null;
    if (typeof value === "string") return value;

    if (typeof value === "object" && value !== null && "_id" in value) {
        const teacher = value as { _id?: string };
        return teacher._id || null;
    }

    return null;
}

function ensureCanManageClass(currentUser: CurrentUser, teacherId: unknown) {
    if (currentUser.role === "admin") return;

    if (currentUser.role !== "teacher") {
        throw new Error("Bạn không có quyền thực hiện thao tác này");
    }

    const ownerId = getOwnerId(teacherId);

    if (ownerId && ownerId !== currentUser.userId) {
        throw new Error("Bạn chỉ có thể thao tác trên lớp học của mình");
    }
}

export const classroomService = {
    async getAllClasses() {
        return classroomRepository.findAll();
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

    async addStudentToClass(
        classId: string,
        studentId: string,
        currentUser: CurrentUser
    ) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const classroom = await classroomRepository.findById(classId);

        if (!classroom) {
            throw new Error("Không tìm thấy lớp học");
        }

        ensureCanManageClass(currentUser, classroom.teacherId);

        const student = await User.findById(studentId);

        if (!student) {
            throw new Error("Không tìm thấy sinh viên");
        }

        if (student.role !== "User") {
            throw new Error("Người được chọn không phải sinh viên");
        }

        const updated = await classroomRepository.addStudentToClass(classId, studentId);

        if (!updated) {
            throw new Error("Không thể thêm sinh viên vào lớp");
        }

        return updated;
    },

    async removeStudentFromClass(
        classId: string,
        studentId: string,
        currentUser: CurrentUser
    ) {
        if (!currentUser) {
            throw new Error("Bạn chưa đăng nhập");
        }

        const classroom = await classroomRepository.findById(classId);

        if (!classroom) {
            throw new Error("Không tìm thấy lớp học");
        }

        ensureCanManageClass(currentUser, classroom.teacherId);

        const student = await User.findById(studentId);

        if (!student) {
            throw new Error("Không tìm thấy sinh viên");
        }

        const updated = await classroomRepository.removeStudentFromClass(
            classId,
            studentId
        );

        if (!updated) {
            throw new Error("Không thể xóa sinh viên khỏi lớp");
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

        await classroomRepository.deleteById(id);

        return true;
    },
};