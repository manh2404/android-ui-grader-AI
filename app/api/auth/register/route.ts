import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User.model";
import { authCookieOptions, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Vui lòng nhập đầy đủ thông tin" },
                { status: 400 }
            );
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json(
                { message: "Email không hợp lệ" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Mật khẩu phải có ít nhất 6 ký tự" },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email đã tồn tại" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = signToken({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
        });

        const response = NextResponse.json(
            {
                message: "Đăng ký thành công",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );

        response.cookies.set("token", token, authCookieOptions);

        return response;
    } catch (error) {
        console.error("REGISTER_ERROR:", error);
        return NextResponse.json(
            { message: "Lỗi server khi đăng ký" },
            { status: 500 }
        );
    }
}