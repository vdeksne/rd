import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = "Raivis Deutschman — Fine Art";

const W_H = 75 / 30;

/**
 * WhatsApp/Telegram need large preview images (~1200×630). We rasterise `logo.svg`
 * via `next/og` (Satori) onto a canvas.
 */
export async function generateShareOgImage(): Promise<ImageResponse> {
  const logoPath = join(process.cwd(), "public", "images", "logo.svg");
  const svg = await readFile(logoPath, "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;

  const logoH = 240;
  const logoW = Math.round(logoH * W_H);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori / next/og */}
        <img alt="" src={src} width={logoW} height={logoH} />
      </div>
    ),
    { ...OG_SIZE },
  );
}
