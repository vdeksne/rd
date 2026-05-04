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

/** Same as @vercel/blob `get()` — fourth `_`-segment in `vercel_blob_rw_{storeId}_…`. */
function storeIdFromBlobReadWriteToken(token: string): string | undefined {
  const [, , , storeId = ""] = token.split("_");
  return storeId || undefined;
}

/**
 * Public blobs are readable without `Authorization` (browser-style). The SDK `get()` path sends
 * Bearer to `*.public.blob.vercel-storage.com`, which can return 400 while `put()` via api/blob
 * still succeeds — so we fetch the public URL directly first.
 */
async function fetchPublicSiteOverridesBody(
  pathname: string,
  storeId: string,
): Promise<Response> {
  const url = `https://${storeId}.public.blob.vercel-storage.com/${pathname}`;
  return fetch(url, { cache: "no-store" });
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

  const storeId = storeIdFromBlobReadWriteToken(token);

  if (storeId) {
    try {
      const res = await fetchPublicSiteOverridesBody(
        SITE_OVERRIDES_BLOB_PATH,
        storeId,
      );
      if (res.status === 404) {
        return {};
      }
      if (res.ok) {
        const text = await res.text();
        const parsed = parseOverrides(text);
        return parsed ?? {};
      }
      console.warn(
        "[site-overrides-blob] public URL read status",
        res.status,
        res.statusText,
      );
    } catch (e) {
      console.warn("[site-overrides-blob] public URL read failed, trying SDK", e);
    }
  }

  try {
    const result = await get(SITE_OVERRIDES_BLOB_PATH, {
      access: "public",
      token,
    });

    if (result === null) {
      return {};
    }

    if (result.statusCode !== 200 || !result.stream) {
      console.warn(
        "[site-overrides-blob] unexpected SDK GET response:",
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
