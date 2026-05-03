import Image from "next/image";
import { getMergedAboutContent } from "@/lib/site-content";

/**
 * About (Myth) — typography aligned to Figma Raivis_WebDev node 112:1638:
 * Neue Haas Grotesk Display Pro 75 Bold labels, 45 Light body @ 12px / 1px tracking;
 * exhibitions list @ 30px line-height.
 */
export default async function AboutPage() {
  const aboutContent = await getMergedAboutContent();
  return (
    <main className="relative min-h-screen bg-white pb-24 max-lg:pt-0 lg:pt-[116px]">
      <div className="mx-auto flex w-full max-w-[1226px] flex-col-reverse gap-8 px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-[43px]">
        <article className="type-site-display w-full max-w-[665px] space-y-[37px] text-[12px] tracking-[1px] text-black not-italic lg:min-w-0 lg:max-w-none lg:flex-1">
          {aboutContent.sections.map((block) => {
            const isExhibitions = block.heading === "Exhibitions";
            return (
              <section
                key={block.heading}
                className="flex flex-col gap-[10px]"
              >
                <h2 className="text-[12px] font-bold leading-[18px] text-black">
                  {block.heading}:
                </h2>
                <div
                  className={
                    isExhibitions
                      ? "flex flex-col gap-0 font-light normal-case leading-[30px] text-black"
                      : "flex flex-col gap-[18px] font-light normal-case leading-[18px] text-black"
                  }
                >
                  {block.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            );
          })}
        </article>
        <div className="relative mx-auto aspect-square w-full max-w-[494px] shrink-0 overflow-hidden bg-neutral-100 lg:mx-0">
          <Image
            src={aboutContent.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="494px"
          />
        </div>
      </div>
    </main>
  );
}
