import mongoose, { Schema, model, models } from "mongoose";

const SubmissionFileSchema = new Schema(
    {
        originalName: {
            type: String,
            required: true,
            trim: true,
        },
        storedName: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        mimeType: {
            type: String,
            default: "application/octet-stream",
            trim: true,
        },
        size: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const SubmissionSchema = new Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attemptNo: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["draft", "submitted", "late"],
            default: "submitted",
        },
        isLate: {
            type: Boolean,
            default: false,
        },
        latest: {
            type: Boolean,
            default: true,
        },
        repositoryUrl: {
            type: String,
            default: "",
            trim: true,
        },
        note: {
            type: String,
            default: "",
            trim: true,
        },
        files: {
            type: [SubmissionFileSchema],
            default: [],
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

SubmissionSchema.index({ assignmentId: 1, studentId: 1, latest: 1 });
SubmissionSchema.index({ studentId: 1, submittedAt: -1 });

const Submission =
    models.Submission || model("Submission", SubmissionSchema);

export default Submission;