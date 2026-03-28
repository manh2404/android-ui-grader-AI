import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, default: "student" },
    },
    {
        timestamps: true,
        collection: "users",
    }
);

export const User = models.User || model("User", UserSchema);