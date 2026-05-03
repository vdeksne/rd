/** Demo catalogue aligned with Figma copy until Supabase-backed products exist. */

export type Artwork = {
  slug: string;
  title: string;
  subtitle: string;
  priceEur: number;
  editionTotal: number;
  editionAvailable: number;
  widthIn: number;
  heightIn: number;
  year: number;
  imageSrc: string;
  thumbSrc: string;
};

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const MOCK_CATALOG_TOTAL = 31;

/** Renamed JPGs under `public/images/mock/rd-catalog-01.jpeg` … `rd-catalog-31.jpeg`. */
function mockCatalogImage(catalogIndex1Based: number): string {
  const i =
    ((Math.floor(catalogIndex1Based) - 1 + MOCK_CATALOG_TOTAL) %
      MOCK_CATALOG_TOTAL) +
    1;
  return `/images/mock/rd-catalog-${String(i).padStart(2, "0")}.jpeg`;
}

export const demoArtworks: Artwork[] = [
  {
    slug: "elle-france-july-2024",
    title: "Elle France — July 2024",
    subtitle: "Editorial studies — Paris",
    priceEur: 1200,
    editionTotal: 15,
    editionAvailable: 4,
    widthIn: 24,
    heightIn: 30,
    year: 2024,
    imageSrc: mockCatalogImage(11),
    thumbSrc: mockCatalogImage(11),
  },
  {
    slug: "tones-platform",
    title: "Tones of Dirt and Bone",
    subtitle: "Platform still — 2015",
    priceEur: 950,
    editionTotal: 20,
    editionAvailable: 7,
    widthIn: 20,
    heightIn: 24,
    year: 2015,
    imageSrc: mockCatalogImage(12),
    thumbSrc: mockCatalogImage(12),
  },
  {
    slug: "night-ferry",
    title: "Night Ferry",
    subtitle: "Latvia — archival pigment",
    priceEur: 1850,
    editionTotal: 10,
    editionAvailable: 2,
    widthIn: 36,
    heightIn: 48,
    year: 2023,
    imageSrc: mockCatalogImage(13),
    thumbSrc: mockCatalogImage(13),
  },
  {
    slug: "silver-gelatin-portrait",
    title: "Portrait — Silver study",
    subtitle: "Studio — Leipzig",
    priceEur: 2200,
    editionTotal: 8,
    editionAvailable: 3,
    widthIn: 18,
    heightIn: 22,
    year: 2022,
    imageSrc: mockCatalogImage(14),
    thumbSrc: mockCatalogImage(14),
  },
  {
    slug: "polaroid-contact-sheet",
    title: "Contact sheet — freight north",
    subtitle: "Polaroid residue — archival box",
    priceEur: 890,
    editionTotal: 25,
    editionAvailable: 11,
    widthIn: 16,
    heightIn: 20,
    year: 2016,
    imageSrc: mockCatalogImage(15),
    thumbSrc: mockCatalogImage(15),
  },
  {
    slug: "cobble-return",
    title: "Return passage",
    subtitle: "Stone drift — Riga periphery",
    priceEur: 1650,
    editionTotal: 12,
    editionAvailable: 5,
    widthIn: 30,
    heightIn: 40,
    year: 2021,
    imageSrc: mockCatalogImage(16),
    thumbSrc: mockCatalogImage(16),
  },
  {
    slug: "forest-corridor-no2",
    title: "Forest corridor II",
    subtitle: "Baltic interior — pigment",
    priceEur: 1420,
    editionTotal: 18,
    editionAvailable: 9,
    widthIn: 22,
    heightIn: 28,
    year: 2020,
    imageSrc: mockCatalogImage(17),
    thumbSrc: mockCatalogImage(17),
  },
  {
    slug: "trail-ledger-no4",
    title: "Trail ledger IV",
    subtitle: "Needle floor — morning frost",
    priceEur: 980,
    editionTotal: 30,
    editionAvailable: 14,
    widthIn: 20,
    heightIn: 26,
    year: 2019,
    imageSrc: mockCatalogImage(18),
    thumbSrc: mockCatalogImage(18),
  },
  {
    slug: "valley-quiet",
    title: "Valley quiet",
    subtitle: "Fog tier — edition proof",
    priceEur: 1750,
    editionTotal: 15,
    editionAvailable: 6,
    widthIn: 28,
    heightIn: 36,
    year: 2023,
    imageSrc: mockCatalogImage(19),
    thumbSrc: mockCatalogImage(19),
  },
  {
    slug: "ridge-document",
    title: "Ridge document",
    subtitle: "Altitude band — silver rag",
    priceEur: 2100,
    editionTotal: 10,
    editionAvailable: 4,
    widthIn: 24,
    heightIn: 32,
    year: 2022,
    imageSrc: mockCatalogImage(20),
    thumbSrc: mockCatalogImage(20),
  },
  {
    slug: "coastal-volume",
    title: "Coastal volume",
    subtitle: "Horizon stack — studio proof",
    priceEur: 1380,
    editionTotal: 20,
    editionAvailable: 8,
    widthIn: 26,
    heightIn: 34,
    year: 2024,
    imageSrc: mockCatalogImage(21),
    thumbSrc: mockCatalogImage(21),
  },
  {
    slug: "atlantic-fold",
    title: "Atlantic fold",
    subtitle: "Surf plane — long exposure study",
    priceEur: 1520,
    editionTotal: 16,
    editionAvailable: 7,
    widthIn: 32,
    heightIn: 42,
    year: 2023,
    imageSrc: mockCatalogImage(22),
    thumbSrc: mockCatalogImage(22),
  },
  {
    slug: "tide-line-study",
    title: "Tide line study",
    subtitle: "Horizon calm — pigment draft",
    priceEur: 1290,
    editionTotal: 22,
    editionAvailable: 10,
    widthIn: 36,
    heightIn: 24,
    year: 2024,
    imageSrc: mockCatalogImage(23),
    thumbSrc: mockCatalogImage(23),
  },
  {
    slug: "upland-grid",
    title: "Upland grid",
    subtitle: "Altitude read — aerial ledger",
    priceEur: 1980,
    editionTotal: 12,
    editionAvailable: 5,
    widthIn: 40,
    heightIn: 40,
    year: 2023,
    imageSrc: mockCatalogImage(24),
    thumbSrc: mockCatalogImage(24),
  },
  {
    slug: "yellow-field-index",
    title: "Yellow field index",
    subtitle: "Bloom plane — spring residue",
    priceEur: 1120,
    editionTotal: 28,
    editionAvailable: 15,
    widthIn: 24,
    heightIn: 30,
    year: 2022,
    imageSrc: mockCatalogImage(25),
    thumbSrc: mockCatalogImage(25),
  },
  {
    slug: "alpine-nocturne",
    title: "Alpine nocturne",
    subtitle: "Last light — ridge cadence",
    priceEur: 1840,
    editionTotal: 14,
    editionAvailable: 6,
    widthIn: 30,
    heightIn: 38,
    year: 2021,
    imageSrc: mockCatalogImage(26),
    thumbSrc: mockCatalogImage(26),
  },
  {
    slug: "salt-flat-diagonal",
    title: "Salt flat diagonal",
    subtitle: "Heat shimmer — edition test",
    priceEur: 1690,
    editionTotal: 18,
    editionAvailable: 9,
    widthIn: 34,
    heightIn: 34,
    year: 2020,
    imageSrc: mockCatalogImage(27),
    thumbSrc: mockCatalogImage(27),
  },
  {
    slug: "river-fork-map",
    title: "River fork map",
    subtitle: "Meander proof — cool palette",
    priceEur: 1590,
    editionTotal: 16,
    editionAvailable: 8,
    widthIn: 38,
    heightIn: 26,
    year: 2023,
    imageSrc: mockCatalogImage(28),
    thumbSrc: mockCatalogImage(28),
  },
  {
    slug: "chromatic-field-v",
    title: "Chromatic field V",
    subtitle: "Gradient residue — studio strip",
    priceEur: 980,
    editionTotal: 40,
    editionAvailable: 22,
    widthIn: 20,
    heightIn: 28,
    year: 2024,
    imageSrc: mockCatalogImage(29),
    thumbSrc: mockCatalogImage(29),
  },
  {
    slug: "spectrum-proof-ii",
    title: "Spectrum proof II",
    subtitle: "Ink drift — calibration sheet",
    priceEur: 920,
    editionTotal: 35,
    editionAvailable: 18,
    widthIn: 18,
    heightIn: 24,
    year: 2024,
    imageSrc: mockCatalogImage(30),
    thumbSrc: mockCatalogImage(30),
  },
  {
    slug: "harbor-stack-no3",
    title: "Harbor stack III",
    subtitle: "Container rhythm — dusk tide",
    priceEur: 1720,
    editionTotal: 11,
    editionAvailable: 4,
    widthIn: 32,
    heightIn: 44,
    year: 2022,
    imageSrc: mockCatalogImage(31),
    thumbSrc: mockCatalogImage(31),
  },
];

export function getArtwork(slug: string) {
  return demoArtworks.find((a) => a.slug === slug) ?? null;
}

export const homeHero = {
  imageSrc: mockCatalogImage(2),
  captionBefore: "Polaroid of Mike Brodie shot by Paul Schiek, from the series: ",
  captionLinkText: "Tones of Dirt and Bone",
  captionLinkHref: "https://www.mike-brodie.com/tones-of-dirt-and-bone",
  captionAfter: ", 2015",
};

/** Figma Home — hero frame “Main → LOOK 5_067.jpg” (112:903); artboard top inset 116px (112:902). */
export const homeHeroFrame = {
  widthPx: 1202,
  heightPx: 793,
  topPaddingDesktopPx: 116,
} as const;

export type PortfolioSlide = {
  id: string;
  /** Unsplash id (`photo-…`); optional when `imageSrc` is set. */
  photoId?: string;
  /** Full URL — overrides Unsplash when set. */
  imageSrc?: string;
  title: string;
  body: string[];
};

/** Resolve slide image URL — supports Unsplash id or absolute `imageSrc` on slide. */
export function portfolioSlideSrc(slideOrPhotoId: PortfolioSlide | string, w = 1600): string {
  if (typeof slideOrPhotoId === "string") return unsplash(slideOrPhotoId, w);
  const slide = slideOrPhotoId;
  if (slide.imageSrc?.trim()) return slide.imageSrc.trim();
  if (!slide.photoId?.trim()) return "";
  return unsplash(slide.photoId.trim(), w);
}

/** Ordered strip left → right; default selection matches former hero (index 4). */
export const portfolioSlides: PortfolioSlide[] = [
  {
    id: "platform-crossing",
    imageSrc: mockCatalogImage(3),
    title: "Platform crossing — Gulf edge",
    body: [
      "Polaroid surfaces bruised by humidity; tape ghosts curl where an envelope refused to stay shut.",
      "This frame stayed in the bottom of a duffel through three departures—crooked horizon, honest shutter lag.",
    ],
  },
  {
    id: "ridge-morning",
    imageSrc: mockCatalogImage(4),
    title: "Blue ridge silence",
    body: [
      "Cold air stacks between elevations until ridgelines read as paper cuts.",
      "Light arrives patient here—you wait with it because there is no schedule beyond the next crest.",
    ],
  },
  {
    id: "forest-slot",
    imageSrc: mockCatalogImage(5),
    title: "Forest aperture",
    body: [
      "Trunks funnel wind into a single audible lane; undergrowth muffles everything else.",
      "The path tightens until photography feels less like witness than intrusion.",
    ],
  },
  {
    id: "trail-return",
    imageSrc: mockCatalogImage(6),
    title: "Trail ledger",
    body: [
      "Needles knit the floor into an unreliable footing—you measure distance by breaths, not miles.",
      "Markers appear arbitrary until you realize memory does the same thing.",
    ],
  },
  {
    id: "juvenile-prosperity",
    imageSrc: mockCatalogImage(7),
    title: "A Period of Juvenile Prosperity (2006–2009)",
    body: [
      "At 17, Mike Brodie hopped his first train near Pensacola, aiming for Mobile—and rode the wrong direction to Jacksonville instead. Days later he rode home, arriving exactly where he started.",
      "That misdirection opened something: years of wandering America by whatever cost nothing—walking, hitchhiking, freight—and pictures made with a camera found stuffed behind a car seat.",
      "The archive became one of the singular documents of American drift; A Period of Juvenile Prosperity drew acclaim in Artforum, The Guardian, The New York Times, The Telegraph, and American Photo, and was shortlisted for the Paris Photo/Aperture First PhotoBook Award.",
    ],
  },
  {
    id: "silver-room",
    imageSrc: mockCatalogImage(8),
    title: "Silver study — interior tension",
    body: [
      "Interior daylight collapses toward a single plane; fabric and skin negotiate the same grain.",
      "Printed small, the frame insists on proximity—you accept contact as part of the contract.",
    ],
  },
  {
    id: "editorial-fold",
    imageSrc: mockCatalogImage(9),
    title: "Editorial fold — garment light",
    body: [
      "Fabric catches sidelight like scaffolding; posture borrows architecture from whatever wall leans behind.",
      "Commission work taught restraint—fewer frames, sharper hinge points between gesture and cut.",
    ],
  },
  {
    id: "polaroid-note",
    imageSrc: mockCatalogImage(10),
    title: "Polaroid residue — notes toward Bone",
    body: [
      "Tape chemistry stains borders before scans ever happen; what survives is evidence of handling.",
      "Caption drafts drift toward the same verbs Brodie used around freight—the verbs that survived longest.",
    ],
  },
];

export const portfolioDefaultSlideIndex = 4;

export const aboutContent = {
  imageSrc: mockCatalogImage(1),
  sections: [
    {
      heading: "About",
      paragraphs: [
        "Raivis Deutschman is a Latvian curator and gallerist building a quiet, editorial-first presence for artists working at the intersection of documentary and contemporary image-making.",
        "This shop is a residue of exhibitions, studio visits, and long-form essays — offered as museum-quality editions with plainly stated materials and dimensions. Each release is intentional: small editions, careful framing notes, and direct contact for acquisition.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Studio & licensing — Riga / Berlin",
        "acquire@raivisdeutschman.com",
        "+371 0000 0000",
      ],
    },
    {
      heading: "Client list",
      paragraphs: [
        "Converse, Sony Music Entertainment, Penguin Books USA, New York Times, Vogue Germany, Elle UK, NEON mag, NYLON, Urban Outfitters, Rice University — reference layout from design; replace with your verifiable list.",
      ],
    },
    {
      heading: "Exhibitions",
      paragraphs: [
        "Collective show — Houston, TX, 2012",
        "Where is your love — NUE Galerie, Paris, 2020",
        "ImageNation — Galerie Le Palais, Paris, 2024",
      ],
    },
  ],
};
