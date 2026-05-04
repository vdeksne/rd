import { BlobNotFoundError, get, put } from "@vercel/blob";
import type { SiteOverrides } from "@/lib/site-overrides-types";

/** Stable pathname in Blob for full site-overrides payload (matches JSON on disk locally). */
export const SITE_OVERRIDES_BLOB_PATH = "site/site-overrides.json";

export function getBlobReadWriteToken(): string | undefined {
  let t = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";
  /* Env UI / .env sometimes stores quoted secrets */
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t || undefined;
}

function blobToken(): string | undefined {
  return getBlobReadWriteToken();
}

/** Production / Blob-linked deployments: overrides come from Blob, not `data/site-overrides.json`. */
export function isBlobOverridesConfigured(): boolean {
  return blobToken() !== undefined;
}

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

/**
 * Reads overrides when `BLOB_READ_WRITE_TOKEN` exists.
 *
 * Important: callers must **not** fall back to the committed repo JSON on Blob errors — that JSON
 * is only for local/disabled-Blob setups; otherwise admins “save successfully” while the live site
 * keeps showing stale data from Git.
 *
 * `@returns`
 * - `null` → no Blob token configured (use `data/site-overrides.json`).
 * - `SiteOverrides` from Blob (`{}` until the first PUT).
 *
 * Throws on Blob transport errors after logging (so deployments surface misconfig/auth issues).
 */
export async function readSiteOverridesFromBlobIfConfigured(): Promise<SiteOverrides | null> {
  const token = blobToken();
  if (!token) return null;

  try {
    /* Default CDN fetch — useCache:false adds ?cache=0 which can 400 on public blobs in some cases */
    const result = await get(SITE_OVERRIDES_BLOB_PATH, {
      access: "public",
      token,
    });

    /* SDK returns `null` for HTTP 404. */
    if (result === null) {
      return {};
    }

    if (result.statusCode !== 200 || !result.stream) {
      console.warn(
        "[site-overrides-blob] unexpected GET response:",
        result?.statusCode,
      );
      return {};
    }

    const text = await new Response(result.stream).text();
    const parsed = parseOverrides(text);
    return parsed ?? {};
  } catch (e) {
    if (e instanceof BlobNotFoundError) {
      return {};
    }
    console.error("[site-overrides-blob] read failed", e);
    throw e;
  }
}

export async function saveSiteOverridesToBlob(data: SiteOverrides): Promise<void> {
  const token = blobToken();
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }

  const body = `${JSON.stringify(data, null, 2)}\n`;
  await put(SITE_OVERRIDES_BLOB_PATH, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    token,
  });
}
