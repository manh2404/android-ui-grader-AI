import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { classroomService } from "@/services/classroom.service";

type RouteContext = {
    params: Promise<{ id: string; studentId: string }>;
};

async function getCurrentUserFromRequest(_req?: NextRequest) {
    return {
        userId: "temp-admin-id",
        role: "admin",
    };
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        await connectDB();

        const { id, studentId } = await context.params;
        const currentUser = await getCurrentUserFromRequest(req);

        const data = await classroomService.removeStudentFromClass(
            id,
            studentId,
            currentUser
        );

        return NextResponse.json(
            {
                success: true,
                data,
                message: "Xóa sinh viên khỏi lớp thành công",
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
                        : "Không thể xóa sinh viên khỏi lớp",
            },
            { status: 500 }
        );
    }
}