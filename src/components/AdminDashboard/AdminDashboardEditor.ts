import type { SiteEditorDefaults } from "@/lib/site-editor-defaults";
import { coerceLayoutSpacingInput } from "@/lib/site-layout-spacing";
import type { SiteOverrides } from "@/lib/site-overrides-types";

export type ApiLoad = {
  overrides: SiteOverrides;
  defaults: SiteEditorDefaults;
};

function cloneJson<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export function bootstrapEditor(initial: ApiLoad) {
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

export type EditorBootstrap = ReturnType<typeof bootstrapEditor>;

export type EditorState = Omit<EditorBootstrap, "navItems">;

export function editorInitialState(seed: EditorBootstrap): EditorState {
  const { navItems: _n, ...editor } = seed;
  return editor;
}

export type EditorAction =
  | { type: "homeHero"; fn: (h: EditorState["homeHero"]) => EditorState["homeHero"] }
  | { type: "homeFrame"; fn: (f: EditorState["homeFrame"]) => EditorState["homeFrame"] }
  | { type: "portfolioIndex"; value: number }
  | { type: "slides"; fn: (s: EditorState["slides"]) => EditorState["slides"] }
  | { type: "artworks"; fn: (a: EditorState["artworks"]) => EditorState["artworks"] }
  | { type: "aboutImg"; value: string }
  | {
      type: "aboutSections";
      fn: (x: EditorState["aboutSections"]) => EditorState["aboutSections"];
    }
  | {
      type: "layoutSpacing";
      fn: (x: EditorState["layoutSpacing"]) => EditorState["layoutSpacing"];
    };

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "homeHero":
      return { ...state, homeHero: action.fn(state.homeHero) };
    case "homeFrame":
      return { ...state, homeFrame: action.fn(state.homeFrame) };
    case "portfolioIndex":
      return { ...state, portfolioIndex: action.value };
    case "slides":
      return { ...state, slides: action.fn(state.slides) };
    case "artworks":
      return { ...state, artworks: action.fn(state.artworks) };
    case "aboutImg":
      return { ...state, aboutImg: action.value };
    case "aboutSections":
      return { ...state, aboutSections: action.fn(state.aboutSections) };
    case "layoutSpacing":
      return { ...state, layoutSpacing: action.fn(state.layoutSpacing) };
    default:
      return state;
  }
}

export function buildOverridesPayload(
  seed: EditorBootstrap,
  editor: EditorState,
): SiteOverrides {
  const {
    homeHero,
    homeFrame,
    portfolioIndex,
    slides,
    artworks,
    aboutImg,
    aboutSections,
    layoutSpacing,
  } = editor;

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
}
