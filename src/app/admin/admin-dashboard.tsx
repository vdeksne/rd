"use client";

import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteEditorDefaults } from "@/lib/site-editor-defaults";
import type { SiteOverrides } from "@/lib/site-overrides-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type ApiLoad = {
  overrides: SiteOverrides;
  defaults: SiteEditorDefaults;
};

function cloneJson<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function bootstrapEditor(initial: ApiLoad) {
  const { overrides, defaults } = initial;
  const navItems =
    overrides.nav?.items?.length === defaults.nav.length
      ? overrides.nav.items!.map((n) => ({ ...n }))
      : defaults.nav.map((n) => ({ ...n }));
  const homeHeroMerged = {
    ...defaults.homeHero,
    ...(overrides.homeHero ?? {}),
  } as Record<string, string>;
  const homeFrameMerged = {
    ...defaults.homeHeroFrame,
    ...(overrides.homeHeroFrame ?? {}),
  };
  const portfolioIdx =
    typeof overrides.portfolioDefaultSlideIndex === "number"
      ? overrides.portfolioDefaultSlideIndex
      : defaults.portfolioDefaultSlideIndex;
  const slidesMerged = overrides.portfolioSlides?.length
    ? cloneJson(overrides.portfolioSlides)
    : cloneJson(defaults.portfolioSlides);
  const artworksMerged = overrides.artworks?.length
    ? cloneJson(overrides.artworks)
    : cloneJson(defaults.artworks);
  const ab = overrides.aboutContent;
  const aboutImgMerged = ab?.imageSrc ?? defaults.aboutContent.imageSrc;
  const aboutSectionsMerged = cloneJson(
    ab?.sections ?? defaults.aboutContent.sections,
  );

  return {
    navItems,
    homeHero: homeHeroMerged,
    homeFrame: homeFrameMerged,
    portfolioIndex: portfolioIdx,
    slides: slidesMerged,
    artworks: artworksMerged,
    aboutImg: aboutImgMerged,
    aboutSections: aboutSectionsMerged,
  };
}

const tabs = [
  ["nav", "Navigation"],
  ["home", "Home hero"],
  ["portfolio", "Portfolio"],
  ["shop", "Curate / shop"],
  ["about", "About"],
] as const;

export function AdminDashboard({ initial }: { initial: ApiLoad }) {
  const router = useRouter();
  const seed = useMemo(() => bootstrapEditor(initial), [initial]);
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("nav");
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [navItems, setNavItems] = useState(seed.navItems);
  const [homeHero, setHomeHero] = useState(seed.homeHero);
  const [homeFrame, setHomeFrame] = useState(seed.homeFrame);
  const [portfolioIndex, setPortfolioIndex] = useState(seed.portfolioIndex);
  const [slides, setSlides] = useState(seed.slides);
  const [artworks, setArtworks] = useState(seed.artworks);
  const [aboutImg, setAboutImg] = useState(seed.aboutImg);
  const [aboutSections, setAboutSections] = useState(seed.aboutSections);

  const buildPayload = useCallback((): SiteOverrides => {
    return {
      nav: { items: navItems.map((n) => ({ ...n })) },
      homeHero: {
        imageSrc: homeHero.imageSrc,
        captionBefore: homeHero.captionBefore,
        captionLinkText: homeHero.captionLinkText,
        captionLinkHref: homeHero.captionLinkHref,
        captionAfter: homeHero.captionAfter,
      },
      homeHeroFrame: {
        widthPx: Number(homeFrame.widthPx),
        heightPx: Number(homeFrame.heightPx),
        topPaddingDesktopPx: Number(homeFrame.topPaddingDesktopPx),
      },
      portfolioDefaultSlideIndex: portfolioIndex,
      portfolioSlides: slides.map((s) => ({
        ...s,
        body: [...s.body],
      })),
      artworks: artworks.map((a) => ({ ...a })),
      aboutContent: {
        imageSrc: aboutImg,
        sections: aboutSections.map((s) => ({
          heading: s.heading,
          paragraphs: [...s.paragraphs],
        })),
      },
    };
  }, [
    navItems,
    homeHero,
    homeFrame,
    portfolioIndex,
    slides,
    artworks,
    aboutImg,
    aboutSections,
  ]);

  async function save() {
    setBusy(true);
    setSavedMsg(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/overrides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: buildPayload() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(
          typeof j.error === "string" ? j.error : `Save failed (${res.status})`,
        );
      }
      setSavedMsg("Saved. Public pages will refresh on next visit.");
      router.refresh();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="type-site-display text-lg font-semibold tracking-[0.08em]">
            Site admin
          </h1>
          <p className="mt-1 text-xs font-light text-neutral-600">
            Edit navigation, hero, portfolio, curate, and about. Uploaded files use
            Vercel Blob when <code className="rounded bg-neutral-100 px-1">BLOB_READ_WRITE_TOKEN</code>{" "}
            is set (production); otherwise they save under{" "}
            <code className="rounded bg-neutral-100 px-1">public/images/admin-uploads/</code>{" "}
            locally. You can always paste an external image URL.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/">View site</Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
            Log out
          </Button>
          <Button type="button" size="sm" disabled={busy} onClick={() => void save()}>
            {busy ? "Saving…" : "Save all"}
          </Button>
        </div>
      </header>

      {savedMsg ? (
        <p className="rounded-md bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
          {savedMsg}
        </p>
      ) : null}
      {saveError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {saveError}
        </p>
      ) : null}

      <nav className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={
              tab === id
                ? "rounded-full bg-black px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white"
                : "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-600 hover:bg-neutral-100"
            }
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "nav" ? (
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            Primary navigation
          </h2>
          <div className="space-y-4">
            {navItems.map((item, i) => (
              <div
                key={i}
                className="grid gap-4 border-b border-neutral-100 pb-4 last:border-0 sm:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`nav-label-${i}`}>Label</Label>
                  <Input
                    id={`nav-label-${i}`}
                    value={item.label}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNavItems((prev) =>
                        prev.map((p, j) => (j === i ? { ...p, label: v } : p)),
                      );
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`nav-href-${i}`}>Path</Label>
                  <Input
                    id={`nav-href-${i}`}
                    value={item.href}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNavItems((prev) =>
                        prev.map((p, j) => (j === i ? { ...p, href: v } : p)),
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "home" ? (
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            Home hero
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminImageUrlField
              id="hero-img"
              label="Hero image URL"
              value={homeHero.imageSrc ?? ""}
              onChange={(url) =>
                setHomeHero((h) => ({ ...h, imageSrc: url }))
              }
            />
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cap-before">Caption — before link</Label>
              <Input
                id="cap-before"
                value={homeHero.captionBefore ?? ""}
                onChange={(e) =>
                  setHomeHero((h) => ({ ...h, captionBefore: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cap-link">Link text</Label>
              <Input
                id="cap-link"
                value={homeHero.captionLinkText ?? ""}
                onChange={(e) =>
                  setHomeHero((h) => ({
                    ...h,
                    captionLinkText: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cap-href">Link URL</Label>
              <Input
                id="cap-href"
                value={homeHero.captionLinkHref ?? ""}
                onChange={(e) =>
                  setHomeHero((h) => ({
                    ...h,
                    captionLinkHref: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cap-after">Caption — after link</Label>
              <Input
                id="cap-after"
                value={homeHero.captionAfter ?? ""}
                onChange={(e) =>
                  setHomeHero((h) => ({ ...h, captionAfter: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="frame-w">Frame width (px)</Label>
              <Input
                id="frame-w"
                type="number"
                value={homeFrame.widthPx ?? ""}
                onChange={(e) =>
                  setHomeFrame((f) => ({
                    ...f,
                    widthPx: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="frame-h">Frame height (px)</Label>
              <Input
                id="frame-h"
                type="number"
                value={homeFrame.heightPx ?? ""}
                onChange={(e) =>
                  setHomeFrame((f) => ({
                    ...f,
                    heightPx: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="frame-top">Desktop top padding (px)</Label>
              <Input
                id="frame-top"
                type="number"
                value={homeFrame.topPaddingDesktopPx ?? ""}
                onChange={(e) =>
                  setHomeFrame((f) => ({
                    ...f,
                    topPaddingDesktopPx: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </section>
      ) : null}

      {tab === "portfolio" ? (
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            Portfolio gallery
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="port-idx">Default slide index (0-based)</Label>
            <Input
              id="port-idx"
              type="number"
              min={0}
              value={portfolioIndex}
              onChange={(e) => setPortfolioIndex(Number(e.target.value))}
            />
          </div>
          <div className="space-y-8">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="space-y-3 border-t border-neutral-100 pt-6 first:border-0 first:pt-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
                  Slide {i + 1} · {slide.id}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`sl-${i}-title`}>Title</Label>
                    <Input
                      id={`sl-${i}-title`}
                      value={slide.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSlides((prev) =>
                          prev.map((s, j) =>
                            j === i ? { ...s, title: v } : s,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`sl-${i}-pid`}>Unsplash photo id</Label>
                    <Input
                      id={`sl-${i}-pid`}
                      placeholder="photo-…"
                      value={slide.photoId ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSlides((prev) =>
                          prev.map((s, j) =>
                            j === i ? { ...s, photoId: v || undefined } : s,
                          ),
                        );
                      }}
                    />
                  </div>
                  <AdminImageUrlField
                    id={`sl-${i}-url`}
                    label="Or full image URL"
                    showPreview={false}
                    value={slide.imageSrc ?? ""}
                    hint="Upload replaces Unsplash id for this slide."
                    onChange={(url) => {
                      const v = url.trim();
                      setSlides((prev) =>
                        prev.map((s, j) =>
                          j === i
                            ? {
                                ...s,
                                imageSrc: v || undefined,
                                photoId: v ? undefined : s.photoId,
                              }
                            : s,
                        ),
                      );
                    }}
                  />
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`sl-${i}-body`}>
                      Body paragraphs (blank line between each)
                    </Label>
                    <textarea
                      id={`sl-${i}-body`}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      value={slide.body.join("\n\n")}
                      onChange={(e) => {
                        const paras = e.target.value
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean);
                        setSlides((prev) =>
                          prev.map((s, j) =>
                            j === i ? { ...s, body: paras } : s,
                          ),
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "shop" ? (
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            Curate artworks
          </h2>
          <p className="text-xs text-neutral-600">
            Slug changes URLs — edit carefully. Price in euros; dimensions in
            inches.
          </p>
          <div className="space-y-10">
            {artworks.map((art, i) => (
              <div
                key={art.slug}
                className="space-y-3 border-t border-neutral-100 pt-6 first:border-0 first:pt-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
                  {art.slug}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`art-${i}-title`}>Title</Label>
                    <Input
                      id={`art-${i}-title`}
                      value={art.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, title: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`art-${i}-sub`}>Subtitle</Label>
                    <Input
                      id={`art-${i}-sub`}
                      value={art.subtitle}
                      onChange={(e) => {
                        const v = e.target.value;
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, subtitle: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-slug`}>Slug</Label>
                    <Input
                      id={`art-${i}-slug`}
                      value={art.slug}
                      onChange={(e) => {
                        const v = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, slug: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-year`}>Year</Label>
                    <Input
                      id={`art-${i}-year`}
                      type="number"
                      value={art.year}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, year: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-price`}>Price (EUR)</Label>
                    <Input
                      id={`art-${i}-price`}
                      type="number"
                      step="0.01"
                      value={art.priceEur}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, priceEur: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-ed`}>Edition total</Label>
                    <Input
                      id={`art-${i}-ed`}
                      type="number"
                      value={art.editionTotal}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, editionTotal: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-avail`}>Available</Label>
                    <Input
                      id={`art-${i}-avail`}
                      type="number"
                      value={art.editionAvailable}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, editionAvailable: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-w`}>Width (in)</Label>
                    <Input
                      id={`art-${i}-w`}
                      type="number"
                      value={art.widthIn}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, widthIn: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`art-${i}-h`}>Height (in)</Label>
                    <Input
                      id={`art-${i}-h`}
                      type="number"
                      value={art.heightIn}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtworks((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, heightIn: v } : a,
                          ),
                        );
                      }}
                    />
                  </div>
                  <AdminImageUrlField
                    id={`art-${i}-img`}
                    label="Image URL"
                    value={art.imageSrc}
                    onChange={(url) => {
                      setArtworks((prev) =>
                        prev.map((a, j) =>
                          j === i ? { ...a, imageSrc: url } : a,
                        ),
                      );
                    }}
                  />
                  <AdminImageUrlField
                    id={`art-${i}-thumb`}
                    label="Thumbnail URL"
                    value={art.thumbSrc}
                    onChange={(url) => {
                      setArtworks((prev) =>
                        prev.map((a, j) =>
                          j === i ? { ...a, thumbSrc: url } : a,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "about" ? (
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            About (Myth)
          </h2>
          <AdminImageUrlField
            id="about-img"
            label="Portrait image URL"
            value={aboutImg}
            onChange={setAboutImg}
          />
          <div className="space-y-8">
            {aboutSections.map((sec, i) => (
              <div key={i} className="space-y-2 border-t border-neutral-100 pt-6 first:border-0 first:pt-0">
                <div className="space-y-1.5">
                  <Label htmlFor={`ab-h-${i}`}>Heading</Label>
                  <Input
                    id={`ab-h-${i}`}
                    value={sec.heading}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAboutSections((prev) =>
                        prev.map((s, j) =>
                          j === i ? { ...s, heading: v } : s,
                        ),
                      );
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`ab-p-${i}`}>
                    Paragraphs (blank line between each)
                  </Label>
                  <textarea
                    id={`ab-p-${i}`}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={sec.paragraphs.join("\n\n")}
                    onChange={(e) => {
                      const paras = e.target.value
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean);
                      setAboutSections((prev) =>
                        prev.map((s, j) =>
                          j === i ? { ...s, paragraphs: paras } : s,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex justify-end border-t border-neutral-200 pt-6">
        <Button type="button" disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}
