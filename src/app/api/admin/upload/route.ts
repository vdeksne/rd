import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionValue,
} from "@/lib/admin-session";
import { getBlobReadWriteToken } from "@/lib/site-overrides-blob";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

async function requireAdmin(): Promise<Response | null> {
  const secret = process.env.ADMIN_SECRET;
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionValue(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request): Promise<Response> {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Expected file field" }, { status: 400 });
  }

  const mime = file.type.trim().toLowerCase();
  const ext = MIME_EXT[mime];
  if (!ext) {
    return NextResponse.json(
      {
        error: "Unsupported type. Use JPEG, PNG, WebP, or GIF.",
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File too large (max ${Math.round(MAX_BYTES / (1024 * 1024))} MB)`,
      },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const base = `admin/${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;

  const blobToken = getBlobReadWriteToken();
  if (blobToken) {
    try {
      const blob = await put(base, buf, {
        access: "public",
        contentType: mime,
        token: blobToken,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Blob upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  try {
    const relativeDir = path.join("public", "images", "admin-uploads");
    const diskDir = path.join(process.cwd(), relativeDir);
    const diskName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
    const diskPath = path.join(diskDir, diskName);
    await mkdir(diskDir, { recursive: true });
    await writeFile(diskPath, buf);
    return NextResponse.json({ url: `/images/admin-uploads/${diskName}` });
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e ? String((e as NodeJS.ErrnoException).code) : "";
    const isRoFs = code === "EROFS" || code === "ENOTSUP" || code === "EACCES";
    return NextResponse.json(
      {
        error: isRoFs
          ? "This host has a read-only filesystem. In Vercel → Storage, create a Blob store and link it (sets BLOB_READ_WRITE_TOKEN), then redeploy."
          : e instanceof Error
            ? e.message
            : "Could not save file",
      },
      { status: 500 },
    );
  }
}
