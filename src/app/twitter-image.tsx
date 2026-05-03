import {
  generateShareOgImage,
  OG_ALT,
  OG_SIZE,
} from "@/lib/generate-share-og";

export const runtime = "nodejs";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return generateShareOgImage();
}
