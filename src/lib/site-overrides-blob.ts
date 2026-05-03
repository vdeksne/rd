import { BlobNotFoundError, get, put } from "@vercel/blob";
import type { SiteOverrides } from "@/lib/site-overrides-types";

/** Stable pathname in Blob for full site-overrides payload (matches JSON on disk locally). */
export const SITE_OVERRIDES_BLOB_PATH = "site/site-overrides.json";

function parseOverrides(raw: string): SiteOverrides | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as SiteOverrides;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** When token is missing, callers use `data/site-overrides.json` on disk instead. */
export async function fetchSiteOverridesFromBlob(): Promise<SiteOverrides | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return null;
  }

  try {
    const result = await get(SITE_OVERRIDES_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;

    const text = await new Response(result.stream).text();
    const parsed = parseOverrides(text);
    return parsed ?? {};
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    console.error("[site-overrides-blob]", e);
    return null;
  }
}

export async function saveSiteOverridesToBlob(data: SiteOverrides): Promise<void> {
  const body = `${JSON.stringify(data, null, 2)}\n`;
  await put(SITE_OVERRIDES_BLOB_PATH, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
