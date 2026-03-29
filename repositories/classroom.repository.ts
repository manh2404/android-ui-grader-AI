import "@/models/User.model";
import Classroom from "@/models/Classroom.model";

type Semester = "HK1" | "HK2" | "HK3";
type ClassroomStatus = "active" | "archived";

type CreateClassroomData = {
    name: string;
    code: string;
    description?: string;
    teacherId: string;
    semester: Semester;
    academicYear: string;
    status?: ClassroomStatus;
};

export const classroomRepository = {
    findAll() {
        return Classroom.find()
            .populate("teacherId", "name email studentCode")
            .populate("studentIds", "name email studentCode")
            .sort({ createdAt: -1 });
    },

    findById(id: string) {
        return Classroom.findById(id)
            .populate("teacherId", "name email studentCode")
            .populate("studentIds", "name email studentCode");
    },

    findByCode(code: string) {
        return Classroom.findOne({ code: code.trim().toUpperCase() });
    },

    create(data: CreateClassroomData) {
        return Classroom.create({
            ...data,
            code: data.code.trim().toUpperCase(),
            description: data.description || "",
            status: data.status || "active",
        });
    },

    updateById(id: string, data: Record<string, unknown>) {
        return Classroom.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("teacherId", "name email studentCode")
            .populate("studentIds", "name email studentCode");
    },

    addStudentToClass(id: string, studentId: string) {
        return Classroom.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    studentIds: studentId,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("teacherId", "name email studentCode")
            .populate("studentIds", "name email studentCode");
    },
    removeStudentFromClass(id: string, studentId: string) {
        return Classroom.findByIdAndUpdate(
            id,
            {
                $pull: {
                    studentIds: studentId,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("teacherId", "name email studentCode")
            .populate("studentIds", "name email studentCode");
    },

    deleteById(id: string) {
        return Classroom.findByIdAndDelete(id);
    },
};