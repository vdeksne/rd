import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = "Raivis Deutschman — Fine Art";

/**
 * WhatsApp/Telegram require link-preview images roughly ≥300×200px; favicon-sized logos are ignored.
 * This route composes logo.png onto a full OG canvas (~1200×630).
 */
export async function generateShareOgImage(): Promise<ImageResponse> {
  const logoPath = join(process.cwd(), "public", "images", "logo.png");
  const buf = await readFile(logoPath);
  const src = `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1a14",
        }}
      >
        <img
          alt=""
          src={src}
          width={630}
          height={252}
        />
      </div>
    ),
    { ...OG_SIZE },
  );
}
