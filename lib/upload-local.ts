import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export type UploadedFileMeta = {
    originalName: string;
    storedName: string;
    url: string;
    mimeType: string;
    size: number;
};

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function saveSingleFile(file: File, folder: string) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name || "") || "";
    const baseName = path.basename(file.name || "file", extension);
    const safeBaseName = sanitizeFileName(baseName) || "file";
    const storedName = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}${extension}`;

    const relativeDir = path.join("uploads", folder);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    const absolutePath = path.join(absoluteDir, storedName);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, buffer);

    return {
        originalName: file.name,
        storedName,
        url: `/${relativeDir.replace(/\\/g, "/")}/${storedName}`,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
    } satisfies UploadedFileMeta;
}

export async function saveFilesToLocal(
    files: File[],
    folder: string
): Promise<UploadedFileMeta[]> {
    const validFiles = files.filter((file) => file && file.size > 0);

    const results: UploadedFileMeta[] = [];
    for (const file of validFiles) {
        results.push(await saveSingleFile(file, folder));
    }

    return results;
}

export async function deleteLocalFilesByUrls(urls: string[]) {
    for (const url of urls) {
        if (!url || !url.startsWith("/uploads/")) continue;

        const relativePath = url.replace(/^\//, "");
        const absolutePath = path.join(process.cwd(), "public", relativePath);

        try {
            await unlink(absolutePath);
        } catch {
            // bỏ qua nếu file không tồn tại hoặc xóa lỗi
        }
    }
}