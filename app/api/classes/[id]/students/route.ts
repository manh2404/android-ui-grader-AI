import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { classroomService } from "@/services/classroom.service";

type RouteContext = {
    params: Promise<{ id: string; }>;
};

async function getCurrentUserFromRequest(_req?: NextRequest) {
    // Tạm thời để test nhanh.
    // Sau này thay bằng session/token thật của bạn.
    return {
        userId: "temp-admin-id",
        role: "admin",
    };
}

export async function POST(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();

        const { id } = await context.params;
        const body = await req.json();
        const studentId = String(body.studentId || "").trim();

        if (!studentId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Thiếu studentId",
                },
                { status: 400 }
            );
        }

        const currentUser = await getCurrentUserFromRequest(req);
        const data = await classroomService.addStudentToClass(
            id,
            studentId,
            currentUser
        );

        return NextResponse.json(
            {
                success: true,
                data,
                message: "Thêm sinh viên thành công",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể thêm sinh viên",
            },
            { status: 500 }
        );
    }
}