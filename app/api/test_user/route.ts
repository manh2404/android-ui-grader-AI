import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User.model";

export async function GET() {
    try {
        await connectToDatabase();

        const users = await User.find().lean();

        return NextResponse.json({
            ok: true,
            users,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, message: "Lỗi kết nối database" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        await connectToDatabase();

        const user = await User.create({
            name: "Bùi Mạnh",
            email: "manhb7536@gmail.com",
            role: "admin",
        });

        return NextResponse.json({
            ok: true,
            user,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, message: "Lỗi tạo user" },
            { status: 500 }
        );
    }
}