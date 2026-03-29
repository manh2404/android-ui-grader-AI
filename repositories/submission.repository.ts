import "@/models/Assignment.model";
import "@/models/Classroom.model";
import "@/models/User.model";
import Submission from "@/models/Submission.model";

export const submissionRepository = {
    async markPreviousLatestFalse(assignmentId: string, studentId: string) {
        await Submission.updateMany(
            {
                assignmentId,
                studentId,
                latest: true,
            },
            {
                $set: { latest: false },
            }
        );
    },

    create(data: Record<string, unknown>) {
        return Submission.create(data);
    },

    findLatestByAssignmentAndStudent(assignmentId: string, studentId: string) {
        return Submission.findOne({
            assignmentId,
            studentId,
            latest: true,
        })
            .populate("studentId", "name email studentCode")
            .sort({ submittedAt: -1 });
    },

    findLatestMapForStudent(assignmentIds: string[], studentId: string) {
        return Submission.find({
            assignmentId: { $in: assignmentIds },
            studentId,
            latest: true,
        })
            .populate("studentId", "name email studentCode")
            .sort({ submittedAt: -1 });
    },
};