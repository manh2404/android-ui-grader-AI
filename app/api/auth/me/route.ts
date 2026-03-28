import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User.model";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Chưa đăng nhập" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        await connectDB();

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("ME_ERROR:", error);
        return NextResponse.json(
            { message: "Token không hợp lệ hoặc đã hết hạn" },
            { status: 401 }
        );
    }
}