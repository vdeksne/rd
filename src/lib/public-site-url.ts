/**
 * Origin for Stripe `success_url` / `cancel_url` and similar redirects.
 * Prefer proxy headers (`x-forwarded-*`) so the URL matches the site the buyer
 * used even when NEXT_PUBLIC_SITE_URL is wrong or unset (common on previews).
 */
export function publicSiteOriginFromRequest(req: Request): string {
  const trimTrail = (s: string) => s.replace(/\/+$/, "");

  const firstForwarded = (v: string | null): string =>
    trimTrail(v?.split(",")[0]?.trim() ?? "");

  const forwardedProto = firstForwarded(req.headers.get("x-forwarded-proto"));
  const forwardedHost = firstForwarded(req.headers.get("x-forwarded-host"));
  if (forwardedHost.length > 0) {
    const proto = forwardedProto.length > 0 ? forwardedProto : "https";
    return trimTrail(`${proto}://${forwardedHost}`);
  }

  const hostRaw = req.headers.get("host")?.trim();
  if (hostRaw && hostRaw.length > 0) {
    const localhost =
      hostRaw.startsWith("127.0.0.1") ||
      hostRaw === "localhost" ||
      hostRaw.startsWith("localhost:");
    const proto = localhost ? "http" : "https";
    return trimTrail(`${proto}://${hostRaw}`);
  }

  const origin = trimTrail(req.headers.get("origin")?.trim() ?? "");
  if (origin.startsWith("http")) {
    return origin;
  }

  const env = trimTrail(process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");
  if (env.startsWith("http")) {
    return env;
  }

  return "http://localhost:3000";
}
