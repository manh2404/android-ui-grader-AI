import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Thiếu MONGODB_URI trong .env.local");
}

declare global {
    var mongoosePromise: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (!global.mongoosePromise) {
        global.mongoosePromise = mongoose.connect(MONGODB_URI!, {
            bufferCommands: false,
        });
    }

    return global.mongoosePromise;
}