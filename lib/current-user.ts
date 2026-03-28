import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUserFromCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            role: string;
        };

        return payload;
    } catch {
        return null;
    }
}