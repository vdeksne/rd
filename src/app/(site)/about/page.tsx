import Image from "next/image";
import { getMergedAboutContent } from "@/lib/site-content";

/**
 * About — editorial typography via `.type-gallery-*`; portrait column capped by
 * `--gallery-about-portrait-max`.
 */
export default async function AboutPage() {
  const aboutContent = await getMergedAboutContent();
  return (
    <main className="relative min-h-screen bg-white pb-[var(--gallery-section-pad-bottom)] max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <div className="mx-auto flex w-full max-w-[var(--gallery-max-about)] flex-col-reverse gap-[clamp(1.75rem,5vw,3rem)] px-[var(--gallery-gutter-x)] lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(2rem,5vw,2.75rem)]">
        <article className="type-gallery-prose w-full max-w-[41.5625rem] space-y-[clamp(2rem,5vw,2.5rem)] text-neutral-950 not-italic lg:min-w-0 lg:max-w-none lg:flex-1">
          {aboutContent.sections.map((block) => {
            const isExhibitions = block.heading === "Exhibitions";
            return (
              <section
                key={block.heading}
                className="flex flex-col gap-[clamp(0.5rem,2vw,0.625rem)]"
              >
                <h2 className="type-gallery-section-label text-neutral-950">
                  {block.heading}:
                </h2>
                <div
                  className={
                    isExhibitions
                      ? "flex flex-col gap-0 font-light normal-case leading-[1.875rem] text-neutral-950"
                      : "flex flex-col gap-[clamp(1rem,3vw,1.125rem)] font-light normal-case leading-[1.62] text-neutral-950"
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
        <div className="relative mx-auto aspect-square w-full max-w-[var(--gallery-about-portrait-max)] shrink-0 overflow-hidden bg-neutral-100 lg:mx-0">
          <Image
            src={aboutContent.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) min(494px, 40vw), 100vw"
          />
        </div>
      </div>
    </main>
  );
}
