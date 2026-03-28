import { connectDB } from "@/lib/mongodb";
import { classroomController } from "@/controllers/classroom.controller";
import { NextRequest } from "next/server";

export async function GET() {
    await connectDB();
    return classroomController.getAll();
}

export async function POST(req: NextRequest) {
    await connectDB();
    return classroomController.create(req);
}