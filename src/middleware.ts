import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

function hexFromSigBuf(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyAdminSessionEdge(
  token: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const expStr = token.slice(0, dot);
  const sigHex = token.slice(dot + 1).toLowerCase();
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(expStr));
  const expectedHex = hexFromSigBuf(sigBuf);
  return timingSafeEqualHex(sigHex, expectedHex.toLowerCase());
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login" || path.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin/logout")) {
    return NextResponse.next();
  }

  if (
    !path.startsWith("/admin") &&
    !path.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET;
  const token = request.cookies.get("admin_session")?.value;
  const ok = await verifyAdminSessionEdge(token, secret);
  if (!ok) {
    if (path.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
