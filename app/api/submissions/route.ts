import { connectDB } from "@/lib/mongodb";
import { submissionController } from "@/controllers/submission.controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
    await connectDB();
    return submissionController.create(request);
}