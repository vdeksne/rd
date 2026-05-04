"use client";

import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { portfolioSlideSrc } from "@/lib/demo-content";
import type { SiteEditorDefaults } from "@/lib/site-editor-defaults";
import { coerceLayoutSpacingInput } from "@/lib/site-layout-spacing";
import type { SiteOverrides } from "@/lib/site-overrides-types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { useCallback, useMemo, useState } from "react";

/** Plain text field so values can be cleared while typing; commits on blur. */
function AdminSpacingInput({
  id,
  committed,
  onCommit,
  inputMode = "numeric",
}: {
  id: string;
  committed: number;
  onCommit: (n: number) => void;
  inputMode?: "numeric" | "decimal";
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display =
    draft !== null ? draft : Number.isFinite(committed) ? String(committed) : "";

  return (
    <Input
      id={id}
      type="text"
      autoComplete="off"
      inputMode={inputMode}
      className="h-8 w-17 text-right text-[13px] tabular-nums"
      value={display}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() =>
        setDraft(Number.isFinite(committed) ? String(committed) : "")
      }
      onBlur={() => {
        if (draft === null) return;
        const raw = draft.trim();
        flushSync(() => {
          setDraft(null);
          if (raw === "") return;
          const n = Number(raw);
          if (!Number.isFinite(n)) return;
          onCommit(n);
        });
      }}
    />
  );
}

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
  const layoutSpacingMerged = coerceLayoutSpacingInput(overrides.layoutSpacing);

  return {
    navItems,
    homeHero: homeHeroMerged,
    homeFrame: homeFrameMerged,
    portfolioIndex: portfolioIdx,
    slides: slidesMerged,
    artworks: artworksMerged,
    aboutImg: aboutImgMerged,
    aboutSections: aboutSectionsMerged,
    layoutSpacing: layoutSpacingMerged,
  };
}

const tabs = [
  ["home", "Home hero"],
  ["portfolio", "Portfolio"],
  ["shop", "Curate / shop"],
  ["about", "About"],
  ["spacing", "Spacing"],
] as const;

const adminTextarea =
  "flex min-h-[120px] w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-[13px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:border-neutral-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 disabled:cursor-not-allowed disabled:opacity-50";

export function AdminDashboard({ initial }: { initial: ApiLoad }) {
  const router = useRouter();
  const seed = useMemo(() => bootstrapEditor(initial), [initial]);
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("home");
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [homeHero, setHomeHero] = useState(seed.homeHero);
  const [homeFrame, setHomeFrame] = useState(seed.homeFrame);
  const [portfolioIndex, setPortfolioIndex] = useState(seed.portfolioIndex);
  const [slides, setSlides] = useState(seed.slides);
  const [artworks, setArtworks] = useState(seed.artworks);
  const [aboutImg, setAboutImg] = useState(seed.aboutImg);
  const [aboutSections, setAboutSections] = useState(seed.aboutSections);
  const [layoutSpacing, setLayoutSpacing] = useState(seed.layoutSpacing);

  const buildPayload = useCallback((): SiteOverrides => {
    return {
      nav: { items: seed.navItems.map((n) => ({ ...n })) },
      homeHero: {
        imageSrc: homeHero.imageSrc,
        ...(homeHero.imageSrcMobile?.trim()
          ? { imageSrcMobile: homeHero.imageSrcMobile.trim() }
          : {}),
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
      layoutSpacing: {
        mainGutterMaxPx: Number(layoutSpacing.mainGutterMaxPx),
        sectionPadBottomPx: Number(layoutSpacing.sectionPadBottomPx),
        detailGapMaxPx: Number(layoutSpacing.detailGapMaxPx),
        curateIndexGutterMinPx: Number(layoutSpacing.curateIndexGutterMinPx),
        siteRailMaxRem: Number(layoutSpacing.siteRailMaxRem),
        homeCaptionBelowMaxPx: Number(layoutSpacing.homeCaptionBelowMaxPx),
        checkoutFormPyMaxPx: Number(layoutSpacing.checkoutFormPyMaxPx),
        checkoutEmptyPyMaxPx: Number(layoutSpacing.checkoutEmptyPyMaxPx),
        gridGapXPx: Number(layoutSpacing.gridGapXPx),
        gridGapYSmPx: Number(layoutSpacing.gridGapYSmPx),
        gridGapYLgPx: Number(layoutSpacing.gridGapYLgPx),
        legalPagePyPx: Number(layoutSpacing.legalPagePyPx),
        railInsetTopMaxPx: Number(layoutSpacing.railInsetTopMaxPx),
        railLogoToNavGapMaxPx: Number(layoutSpacing.railLogoToNavGapMaxPx),
        railPaddingXPx: Number(layoutSpacing.railPaddingXPx),
        railPaddingBottomPx: Number(layoutSpacing.railPaddingBottomPx),
        railNavLinkGapPx: Number(layoutSpacing.railNavLinkGapPx),
      },
    };
  }, [
    seed,
    homeHero,
    homeFrame,
    portfolioIndex,
    slides,
    artworks,
    aboutImg,
    aboutSections,
    layoutSpacing,
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
    <div className="admin-scope space-y-10 pb-16">
      <header className="sticky top-0 z-20 -mx-5 border-b border-neutral-100 bg-white/90 px-5 py-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Content
            </p>
            <h1 className="text-2xl font-light tracking-tight text-neutral-900">
              Site editor
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 lg:pt-8">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              asChild
            >
              <Link href="/">View site</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              onClick={() => void logout()}
            >
              Log out
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-lg bg-neutral-900 px-5 font-normal text-white shadow-none hover:bg-neutral-800"
              disabled={busy}
              onClick={() => void save()}
            >
              {busy ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-neutral-100 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "shrink-0 border-b-2 border-transparent px-3 py-2.5 text-[13px] font-medium transition-colors",
                tab === id
                  ? "border-neutral-900 text-neutral-900"
                  : "text-neutral-400 hover:border-neutral-200 hover:text-neutral-700",
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {savedMsg ? (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-700">
          {savedMsg}
        </p>
      ) : null}
      {saveError ? (
        <p className="rounded-lg border border-red-100 bg-red-50/90 px-4 py-3 text-[13px] text-red-800">
          {saveError}
        </p>
      ) : null}

      {tab === "home" ? (
        <section className="space-y-10">
          <h2 className="text-[15px] font-medium text-neutral-900">Home hero</h2>
          <AdminImageUrlField
            id="hero-img"
            previewSize="hero"
            label="Hero image (desktop)"
            value={homeHero.imageSrc ?? ""}
            onChange={(url) =>
              setHomeHero((h) => ({ ...h, imageSrc: url }))
            }
          />
          <AdminImageUrlField
            id="hero-img-mobile"
            label="Hero image (mobile)"
            allowClear
            hint="Optional. Upload a separate image for narrow screens, or remove to use the desktop image."
            value={homeHero.imageSrcMobile ?? ""}
            onChange={(url) =>
              setHomeHero((h) => ({ ...h, imageSrcMobile: url }))
            }
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cap-before">Caption (before link)</Label>
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
              <Label htmlFor="cap-after">Caption (after link)</Label>
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
          </div>
        </section>
      ) : null}

      {tab === "spacing" ? (
        <section className="max-w-xs space-y-3">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Gutter max</span>
            <AdminSpacingInput
              id="sp-gutter-max"
              committed={layoutSpacing.mainGutterMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, mainGutterMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Hero top · desktop</span>
            <AdminSpacingInput
              id="sp-hero-top"
              committed={Number(homeFrame.topPaddingDesktopPx)}
              onCommit={(n) =>
                setHomeFrame((f) => ({ ...f, topPaddingDesktopPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Page bottom</span>
            <AdminSpacingInput
              id="sp-section-pad"
              committed={layoutSpacing.sectionPadBottomPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, sectionPadBottomPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Home caption gap</span>
            <AdminSpacingInput
              id="sp-caption-mt"
              committed={layoutSpacing.homeCaptionBelowMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, homeCaptionBelowMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Artwork gap</span>
            <AdminSpacingInput
              id="sp-detail-gap"
              committed={layoutSpacing.detailGapMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, detailGapMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Shop edge</span>
            <AdminSpacingInput
              id="sp-index-gutter"
              committed={layoutSpacing.curateIndexGutterMinPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, curateIndexGutterMinPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Shop grid · columns</span>
            <AdminSpacingInput
              id="sp-grid-x"
              committed={layoutSpacing.gridGapXPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, gridGapXPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Shop grid · row tight</span>
            <AdminSpacingInput
              id="sp-grid-ys"
              committed={layoutSpacing.gridGapYSmPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, gridGapYSmPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Shop grid · row wide</span>
            <AdminSpacingInput
              id="sp-grid-yl"
              committed={layoutSpacing.gridGapYLgPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, gridGapYLgPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail max · rem</span>
            <AdminSpacingInput
              id="sp-rail-max"
              inputMode="decimal"
              committed={layoutSpacing.siteRailMaxRem}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, siteRailMaxRem: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail · top max</span>
            <AdminSpacingInput
              id="sp-rail-pt-max"
              committed={layoutSpacing.railInsetTopMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, railInsetTopMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail · logo→nav</span>
            <AdminSpacingInput
              id="sp-rail-logo-nav"
              committed={layoutSpacing.railLogoToNavGapMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, railLogoToNavGapMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail · horizontal</span>
            <AdminSpacingInput
              id="sp-rail-pad-x"
              committed={layoutSpacing.railPaddingXPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, railPaddingXPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail · bottom</span>
            <AdminSpacingInput
              id="sp-rail-pad-bottom"
              committed={layoutSpacing.railPaddingBottomPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, railPaddingBottomPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Rail · link gap</span>
            <AdminSpacingInput
              id="sp-rail-nav-gap"
              committed={layoutSpacing.railNavLinkGapPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, railNavLinkGapPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Checkout pad</span>
            <AdminSpacingInput
              id="sp-checkout-py"
              committed={layoutSpacing.checkoutFormPyMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, checkoutFormPyMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Checkout · empty cart</span>
            <AdminSpacingInput
              id="sp-checkout-empty-py"
              committed={layoutSpacing.checkoutEmptyPyMaxPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, checkoutEmptyPyMaxPx: n }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[13px] text-neutral-600">Legal · vertical</span>
            <AdminSpacingInput
              id="sp-legal-py"
              committed={layoutSpacing.legalPagePyPx}
              onCommit={(n) =>
                setLayoutSpacing((s) => ({ ...s, legalPagePyPx: n }))
              }
            />
          </div>
        </section>
      ) : null}

      {tab === "portfolio" ? (
        <section className="space-y-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[15px] font-medium text-neutral-900">
              Portfolio gallery
            </h2>
          </div>
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="port-idx">Default slide index (0-based)</Label>
            <Input
              id="port-idx"
              type="number"
              min={0}
              value={portfolioIndex}
              onChange={(e) => setPortfolioIndex(Number(e.target.value))}
            />
          </div>
          <div className="space-y-16">
            {slides.map((slide, i) => {
              const slidePreviewSrc = portfolioSlideSrc(slide, 720);
              return (
              <div
                key={slide.id}
                className="space-y-6 border-t border-neutral-100 pt-12 first:border-0 first:pt-0"
              >
                <p className="text-[12px] font-medium text-neutral-400">
                  Slide {i + 1}{" "}
                  <span className="font-mono text-[11px] text-neutral-400">
                    {slide.id}
                  </span>
                </p>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
                  <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/6">
                    {slidePreviewSrc ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
                        <img
                          src={slidePreviewSrc}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </>
                    ) : (
                      <div className="flex h-full min-h-[140px] items-center justify-center px-4 text-center text-[13px] text-neutral-400">
                        Add an image URL or upload to preview this slide.
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="sm:col-span-2">
                  <AdminImageUrlField
                    id={`sl-${i}-url`}
                    label="Image"
                    showPreview={false}
                    allowClear
                    value={slide.imageSrc ?? ""}
                    hint="Upload an image file. Remove to clear this slide’s image."
                    onChange={(url) => {
                      const v = url.trim();
                      setSlides((prev) =>
                        prev.map((s, j) =>
                          j === i
                            ? {
                                ...s,
                                imageSrc: v || undefined,
                                photoId: undefined,
                              }
                            : s,
                        ),
                      );
                    }}
                  />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`sl-${i}-body`}>
                      Body paragraphs
                    </Label>
                    <textarea
                      id={`sl-${i}-body`}
                      className={adminTextarea}
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
              </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {tab === "shop" ? (
        <section className="space-y-12">
          <div>
            <h2 className="text-[15px] font-medium text-neutral-900">
              Curate artworks
            </h2>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-neutral-500">
              Slug sets the URL. Price is EUR; dimensions are inches. Image and
              thumbnail each get a live preview below the fields.
            </p>
          </div>
          <div className="space-y-16">
            {artworks.map((art, i) => (
              <div
                key={art.slug}
                className="space-y-8 border-t border-neutral-100 pt-12 first:border-0 first:pt-0"
              >
                <p className="font-mono text-[12px] text-neutral-400">
                  {art.slug}
                </p>
                <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
                  <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/6 lg:max-w-[220px]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
                    <img
                      src={art.imageSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="space-y-1.5 sm:col-span-2">
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
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
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
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "about" ? (
        <section className="space-y-10">
          <h2 className="text-[15px] font-medium text-neutral-900">
            About (Myth)
          </h2>
          <AdminImageUrlField
            id="about-img"
            label="Portrait image"
            value={aboutImg}
            onChange={setAboutImg}
          />
          <div className="space-y-12">
            {aboutSections.map((sec, i) => (
              <div key={i} className="space-y-4 border-t border-neutral-100 pt-10 first:border-0 first:pt-0">
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
                    Paragraphs 
                  </Label>
                  <textarea
                    id={`ab-p-${i}`}
                    className={cn(adminTextarea, "min-h-[100px]")}
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

      <div className="flex justify-end border-t border-neutral-100 pt-10">
        <Button
          type="button"
          className="rounded-lg bg-neutral-900 px-8 font-normal text-white shadow-none hover:bg-neutral-800"
          disabled={busy}
          onClick={() => void save()}
        >
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
