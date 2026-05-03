import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionValue,
} from "@/lib/admin-session";

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
      { error: `File too large (max ${Math.round(MAX_BYTES / (1024 * 1024))} MB)` },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const base = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const relativeDir = path.join("public", "images", "admin-uploads");
  const diskDir = path.join(process.cwd(), relativeDir);
  const diskPath = path.join(diskDir, base);

  await mkdir(diskDir, { recursive: true });
  await writeFile(diskPath, buf);

  const publicUrl = `/images/admin-uploads/${base}`;
  return NextResponse.json({ url: publicUrl });
}
