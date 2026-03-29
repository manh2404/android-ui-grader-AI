import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export type CurrentUserPayload = {
    userId: string;
    email: string;
    role: string;
    studentCode?: string;
};

function parseCookieToken(cookieHeader?: string | null) {
    if (!cookieHeader) return null;

    const tokenPair = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("token="));

    if (!tokenPair) return null;

    return decodeURIComponent(tokenPair.slice("token=".length));
}

function verifyTokenSafe(token?: string | null): CurrentUserPayload | null {
    if (!token) return null;

    try {
        return verifyToken(token) as CurrentUserPayload;
    } catch {
        return null;
    }
}

export async function getCurrentUserFromCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return verifyTokenSafe(token);
}

export function getCurrentUserFromRequest(request: Request) {
    const cookieToken = parseCookieToken(request.headers.get("cookie"));
    const cookieUser = verifyTokenSafe(cookieToken);

    if (cookieUser?.userId) {
        return cookieUser;
    }

    const actorId = request.headers.get("x-user-id");

    if (!actorId) {
        return null;
    }

    return {
        userId: actorId,
        email: request.headers.get("x-user-email") || "",
        role: request.headers.get("x-user-role") || "",
        studentCode: request.headers.get("x-student-code") || undefined,
    };
}

export class UnauthorizedError extends Error {
    statusCode = 401;

    constructor(message = "Bạn chưa đăng nhập") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export function getActorIdFromRequest(request: Request) {
    const currentUser = getCurrentUserFromRequest(request);

    if (!currentUser?.userId) {
        throw new UnauthorizedError("Bạn chưa đăng nhập");
    }

    return currentUser.userId;
}