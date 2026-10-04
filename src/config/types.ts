/* ── The whole site is described by these shapes. Edit src/data/gallery.json, never the components. ── */

export type Mood =
  | "tender"
  | "playful"
  | "quiet"
  | "admiration"
  | "golden"
  | "longing"
  | string;

export type PhotoLayout =
  | "auto"
  | "portrait-editorial" // tall photo beside a column of text
  | "cinema"             // wide, full-width, quiet caption beneath
  | "floating"           // small photo adrift in a large empty field
  | "offset"             // photo pushed off the obvious axis, text pulling against it
  | "polaroid"           // paper-framed, handwritten caption — use sparingly
  | "filmstrip"          // a frame of film, numbered
  | "full";              // full-screen chapter piece

export interface Photo {
  id: string;
  image: string;
  alt?: string;
  title?: string;
  quote?: string;      // manual quote always wins
  caption?: string;
  date?: string;
  location?: string;
  category?: string;
  mood?: Mood;
  note?: string;       // tiny handwritten annotation
  layout?: PhotoLayout;
  featured?: boolean;
  song?: string;
  accent?: string;     // optional accent override, e.g. "burgundy"
  chapter?: string;    // chapter id this photo belongs to
}

export interface Chapter {
  id: string;
  numeral: string;     // "I", "II" …
  title: string;
  subtitle?: string;
  epigraph?: string;   // a small line beneath the chapter title, like a film title card
}

export interface LittleThing {
  text: string;
  type?: "observation" | "memory" | "confession" | string;
}

export interface Interlude {
  /** chapter id after which this moment appears; omit → after the last chapter */
  after?: string;
  whisper?: string;    // e.g. "Wait."
  lines: string[];     // the large quiet lines
  closing?: string;    // the small final line
}

export interface MusicTrack {
  src: string;       // e.g. "/music/our-song.mp3"
  title: string;
  artist?: string;
}

export interface MusicConfig {
  enabled: boolean;
  /** the playlist — add as many songs as you like */
  tracks?: MusicTrack[];
  /** legacy single-track fields, still honored */
  src?: string;
  title?: string;
  artist?: string;
}

export interface SiteConfig {
  eyebrow: string;          // "FOR YOU"
  tagline?: string;         // "a little film, in five chapters"
  title: string[];          // each entry is a line of the big title
  subtitle: string;         // handwritten line under the title
  invitation: string;       // "Come a little closer."
  privacyLine: string;      // "Not a gallery. Just a few pieces of you…"
  signature: string;        // "Razal"
  dedication: string;       // "for my babe."
  closingTitle: string;     // "That's all for now."
  closingSub: string;
  postscript: string;       // "Until the next photograph."
  emptyTitle: string;       // shown when no photographs exist yet
  emptyBody: string;
  emptyHint: string;
}

export interface ThemeConfig {
  background: string;
  paper: string;
  text: string;
  mutedText: string;
  accent: string;
  accentSoft: string;
  border: string;
  gold: string;
  ink: string;
}

export interface GallerySettings {
  animation: boolean;       // master switch for motion
  grain: boolean;           // paper grain overlay
  pageNumbers: boolean;
  flourishes: boolean;      // pressed-flower decorations between the pages
  petals?: boolean;         // slow petal drift in the background
}

export interface GalleryConfig {
  site: SiteConfig;
  theme: ThemeConfig;
  gallery: GallerySettings;
  chapters: Chapter[];
  photos: Photo[];
  littleThings: LittleThing[];
  interludes: Interlude[];
  music: MusicConfig;
}
