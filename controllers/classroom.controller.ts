import {NextRequest, NextResponse} from "next/server";
import { classroomService } from "@/services/classroom.service";
import { createClassroomSchema, updateClassroomSchema } from "@/validations/classroom.schema";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentUserFromCookie } from "@/lib/current-user";

export const classroomController = {
    async getAll() {
        try {
            const data = await classroomService.getAllClasses();

            return NextResponse.json(
                {
                    ok: true,
                    data,
                },
                { status: 200 }
            );
        } catch (error) {
            console.error("classroomController.getAll error:", error);

            return NextResponse.json(
                {
                    ok: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Không thể lấy danh sách lớp học",
                },
                { status: 500 }
            );
        }
    },


    async getById(id: string) {
        try {
            const data = await classroomService.getClassById(id);
            return successResponse(data, "Lấy chi tiết lớp học thành công");
        } catch (error: any) {
            return errorResponse(error.message || "Không thể lấy chi tiết lớp học", 404);
        }
    },

    async create(req: NextRequest) {
        try {
            const currentUser = await getCurrentUserFromCookie();

            if (!currentUser) {
                return errorResponse("Bạn chưa đăng nhập", 401);
            }

            const body = await req.json();
            const parsed = createClassroomSchema.safeParse(body);

            if (!parsed.success) {
                return errorResponse(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ", 400);
            }

            const data = await classroomService.createClass(parsed.data, currentUser);

            return successResponse(data, "Tạo lớp học thành công", 201);
        } catch (error: any) {
            return errorResponse(error.message || "Không thể tạo lớp học", 500);
        }
    },

    async update(req: NextRequest, id: string) {
        try {
            const currentUser = await getCurrentUserFromCookie();

            if (!currentUser) {
                return errorResponse("Bạn chưa đăng nhập", 401);
            }

            const body = await req.json();
            const parsed = updateClassroomSchema.safeParse(body);

            if (!parsed.success) {
                return errorResponse(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ", 400);
            }

            const data = await classroomService.updateClass(id, parsed.data, currentUser);

            return successResponse(data, "Cập nhật lớp học thành công");
        } catch (error: any) {
            return errorResponse(error.message || "Không thể cập nhật lớp học", 500);
        }
    },

    async remove(id: string) {
        try {
            const currentUser = await getCurrentUserFromCookie();

            if (!currentUser) {
                return errorResponse("Bạn chưa đăng nhập", 401);
            }

            await classroomService.deleteClass(id, currentUser);

            return successResponse(null, "Xóa lớp học thành công");
        } catch (error: any) {
            return errorResponse(error.message || "Không thể xóa lớp học", 500);
        }
    },
};