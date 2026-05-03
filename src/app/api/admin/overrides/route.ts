import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionValue,
} from "@/lib/admin-session";
import { getSiteEditorDefaults } from "@/lib/site-editor-defaults";
import type { SiteOverrides } from "@/lib/site-overrides-types";

export const runtime = "nodejs";

async function requireAdmin() {
  const secret = process.env.ADMIN_SECRET;
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionValue(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function readOverridesDisk(): SiteOverrides {
  const filePath = path.join(process.cwd(), "data", "site-overrides.json");
  if (!existsSync(filePath)) return {};
  try {
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as SiteOverrides;
    }
    return {};
  } catch {
    return {};
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({
    overrides: readOverridesDisk(),
    defaults: getSiteEditorDefaults(),
  });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const next =
    body && typeof body === "object" && "overrides" in body
      ? (body as { overrides?: unknown }).overrides
      : body;

  if (!next || typeof next !== "object" || Array.isArray(next)) {
    return NextResponse.json(
      { error: "Expected overrides object" },
      { status: 400 },
    );
  }

  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, "site-overrides.json");
  writeFileSync(
    filePath,
    `${JSON.stringify(next as SiteOverrides, null, 2)}\n`,
    "utf-8",
  );

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
