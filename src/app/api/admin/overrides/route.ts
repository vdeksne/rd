import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionValue,
} from "@/lib/admin-session";
import { getSiteEditorDefaults } from "@/lib/site-editor-defaults";
import {
  isBlobOverridesConfigured,
  saveSiteOverridesToBlob,
} from "@/lib/site-overrides-blob";
import { resolveSiteOverrides } from "@/lib/site-content";
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

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const overrides = await resolveSiteOverrides();

  return NextResponse.json({
    overrides,
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

  const payload = next as SiteOverrides;
  const json = `${JSON.stringify(payload, null, 2)}\n`;

  if (isBlobOverridesConfigured()) {
    try {
      await saveSiteOverridesToBlob(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Blob write failed";
      console.error("[admin/overrides] blob", e);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } else {
    try {
      const dir = path.join(process.cwd(), "data");
      mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, "site-overrides.json");
      writeFileSync(filePath, json, "utf-8");
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as NodeJS.ErrnoException).code)
          : "";
      const isRoFs = code === "EROFS" || code === "ENOTSUP" || code === "EACCES";
      console.error("[admin/overrides] disk", e);
      return NextResponse.json(
        {
          error: isRoFs
            ? "Read-only filesystem: set BLOB_READ_WRITE_TOKEN (Vercel Blob) to save from production."
            : e instanceof Error
              ? e.message
              : "Could not write overrides",
        },
        { status: 500 },
      );
    }
  }

  /* Pages read overrides via noStore(); refresh root layout + primary routes after save. */
  revalidatePath("/");
  revalidatePath("/", "layout");

  const paths = [
    "/portfolio",
    "/curate",
    "/about",
    "/cart",
    "/checkout",
    "/checkout/success",
    "/legal/terms",
    "/legal/returns",
  ];
  for (const p of paths) {
    revalidatePath(p);
    revalidatePath(p, "layout");
  }

  return NextResponse.json({ ok: true });
}
