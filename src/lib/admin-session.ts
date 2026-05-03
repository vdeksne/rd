import { createHmac } from "crypto";

const COOKIE = "admin_session";

export { COOKIE as ADMIN_SESSION_COOKIE };

export function createAdminSessionValue(secret: string, ttlMs: number): string {
  const exp = Date.now() + ttlMs;
  const expStr = String(exp);
  const sig = createHmac("sha256", secret).update(expStr).digest("hex");
  return `${expStr}.${sig}`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

export function verifyAdminSessionValue(
  token: string | undefined,
  secret: string | undefined,
): boolean {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const expStr = token.slice(0, dot);
  const sigHex = token.slice(dot + 1).toLowerCase();
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expectedHex = createHmac("sha256", secret).update(expStr).digest("hex");
  return timingSafeEqualHex(sigHex, expectedHex.toLowerCase());
}
