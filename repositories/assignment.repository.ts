import "@/models/Classroom.model";
import "@/models/User.model";
import Assignment from "@/models/Assignment.model";

export const assignmentRepository = {
    create(data: Record<string, unknown>) {
        return Assignment.create(data);
    },

    findById(id: string) {
        return Assignment.findById(id)
            .populate("classroomId", "name code semester academicYear")
            .populate("teacherId", "name email studentCode");
    },

    findManyByClassroomIds(classroomIds: string[], options?: { includeDraft?: boolean }) {
        const filter: Record<string, unknown> = {
            classroomId: { $in: classroomIds },
        };

        if (!options?.includeDraft) {
            filter.status = { $ne: "draft" };
        }

        return Assignment.find(filter)
            .populate("classroomId", "name code semester academicYear")
            .populate("teacherId", "name email studentCode")
            .sort({ createdAt: -1 });
    },

    findByTeacherId(teacherId: string) {
        return Assignment.find({ teacherId })
            .populate("classroomId", "name code semester academicYear")
            .populate("teacherId", "name email studentCode")
            .sort({ createdAt: -1 });
    },

    updateById(id: string, data: Record<string, unknown>) {
        return Assignment.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("classroomId", "name code semester academicYear")
            .populate("teacherId", "name email studentCode");
    },

    deleteById(id: string) {
        return Assignment.findByIdAndDelete(id);
    },
};