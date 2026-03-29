import mongoose, { Schema, model, models } from "mongoose";

const AssignmentAttachmentSchema = new Schema(
    {
        kind: {
            type: String,
            enum: ["resource", "rubric", "template"],
            default: "resource",
        },
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

const AssignmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom",
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        language: {
            type: String,
            default: "cpp",
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        rubricText: {
            type: String,
            default: "",
            trim: true,
        },
        attachments: {
            type: [AssignmentAttachmentSchema],
            default: [],
        },
        startAt: {
            type: Date,
            required: true,
        },
        dueAt: {
            type: Date,
            required: true,
        },
        allowLateSubmit: {
            type: Boolean,
            default: false,
        },
        allowResubmit: {
            type: Boolean,
            default: false,
        },
        latePenaltyPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        maxScore: {
            type: Number,
            default: 10,
            min: 0,
        },
        status: {
            type: String,
            enum: ["draft", "published", "closed"],
            default: "published",
        },
    },
    {
        timestamps: true,
    }
);

AssignmentSchema.index({ classroomId: 1, status: 1, dueAt: 1 });
AssignmentSchema.index({ teacherId: 1, createdAt: -1 });

const Assignment =
    models.Assignment || model("Assignment", AssignmentSchema);

export default Assignment;