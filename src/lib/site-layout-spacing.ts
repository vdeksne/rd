/** Editorial layout tokens · mirrored to CSS vars on `<html>` (see root layout). */
export type LayoutSpacing = {
  /** Horizontal gutter clamp max (`--gallery-gutter-x`), px */
  mainGutterMaxPx: number;
  /** Main section bottom padding (portfolio, curate, about, cart desktop), px */
  sectionPadBottomPx: number;
  /** Detail layout column gap clamp max (`--gallery-detail-gap`), px */
  detailGapMaxPx: number;
  /** Curate index horizontal gutter floor (`--gallery-gutter-index`), px */
  curateIndexGutterMinPx: number;
  /** Desktop nav rail clamp upper bound (`--site-rail`), rem */
  siteRailMaxRem: number;
  /** Home caption block offset below hero (`--home-caption-mt`), px clamp max */
  homeCaptionBelowMaxPx: number;
  /** Checkout / success shell vertical padding (`--checkout-form-py`) */
  checkoutFormPyMaxPx: number;
  /** Checkout empty-state vertical padding (`--checkout-empty-py`) */
  checkoutEmptyPyMaxPx: number;
  /** Curate grid horizontal gap (`--gallery-grid-gap-x`), px */
  gridGapXPx: number;
  /** Curate grid tight row gap (`--gallery-grid-gap-y-sm`), px */
  gridGapYSmPx: number;
  /** Curate grid wide row gap (`--gallery-grid-gap-y-lg`), px */
  gridGapYLgPx: number;
  /** Legal pages vertical padding (`--legal-page-py`), px */
  legalPagePyPx: number;
};

export const layoutSpacingDefaults: LayoutSpacing = {
  mainGutterMaxPx: 40,
  sectionPadBottomPx: 96,
  detailGapMaxPx: 48,
  curateIndexGutterMinPx: 12,
  siteRailMaxRem: 17.25,
  homeCaptionBelowMaxPx: 12,
  checkoutFormPyMaxPx: 80,
  checkoutEmptyPyMaxPx: 128,
  gridGapXPx: 10,
  gridGapYSmPx: 8,
  gridGapYLgPx: 22,
  legalPagePyPx: 96,
};

/** Merge saved overrides into defaults; ignores non-finite numbers (e.g. null from JSON). */
export function coerceLayoutSpacingInput(
  partial: Partial<LayoutSpacing> | undefined,
): LayoutSpacing {
  const p = partial ?? {};
  const n = (key: keyof LayoutSpacing): number => {
    const v = p[key];
    return typeof v === "number" && Number.isFinite(v)
      ? v
      : layoutSpacingDefaults[key];
  };
  return {
    mainGutterMaxPx: n("mainGutterMaxPx"),
    sectionPadBottomPx: n("sectionPadBottomPx"),
    detailGapMaxPx: n("detailGapMaxPx"),
    curateIndexGutterMinPx: n("curateIndexGutterMinPx"),
    siteRailMaxRem: n("siteRailMaxRem"),
    homeCaptionBelowMaxPx: n("homeCaptionBelowMaxPx"),
    checkoutFormPyMaxPx: n("checkoutFormPyMaxPx"),
    checkoutEmptyPyMaxPx: n("checkoutEmptyPyMaxPx"),
    gridGapXPx: n("gridGapXPx"),
    gridGapYSmPx: n("gridGapYSmPx"),
    gridGapYLgPx: n("gridGapYLgPx"),
    legalPagePyPx: n("legalPagePyPx"),
  };
}
