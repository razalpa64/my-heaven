# Her, In Little Moments.

A private, cinematic photo archive — a small world built for one person.
React + TypeScript + Vite, descended from the visual DNA of *The End of October*.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

The site is locked behind a passphrase. Only someone who knows it gets in.

---

## Adding photographs (the only thing you'll do often)

1. Drop the image into `public/photos/`, e.g. `public/photos/julian-001.jpg`
2. Add an entry to `photos` in **`src/data/gallery.json`**:

```json
{
  "id": "julian-001",
  "image": "/photos/julian-001.jpg",
  "title": "That smile",
  "quote": "I don't think you realize what your smile does to my entire day.",
  "caption": "One of my favorite versions of you.",
  "note": "keep this one forever",
  "mood": "tender",
  "chapter": "chapter-2",
  "layout": "auto",
  "featured": true
}
```

That's it. Everything else — composition, pacing, the page it becomes — is automatic.

### Field notes

| field | what it does |
|---|---|
| `quote` | your own words. Leave it out and one is generated (AI if configured, otherwise a hand-written fallback chosen by `mood`). Manual always wins. |
| `mood` | `tender` · `playful` · `quiet` · `admiration` · `golden` · `longing` — steers the generated quote. |
| `layout` | `auto` (recommended — the site measures the photo and chooses a rhythm) or force one: `portrait-editorial`, `cinema`, `floating`, `offset`, `polaroid`, `filmstrip`, `full`. |
| `note` | a tiny handwritten annotation beside the photo. |
| `chapter` | one of the chapter ids. Photos without a chapter appear after the chapters. |
| `accent` | optional color override for this photo's quotation marks & note. |

Portrait and landscape images are detected from the real file and composed
differently. Images are lazy-loaded and never aggressively cropped.

---

## Everything is JSON

All copy, colors, chapters, little things, interludes and music live in
**`src/data/gallery.json`** — components never hardcode content.

- `site` — every sentence on the opening, closing, gate and empty state
- `theme` — the full color system (becomes CSS variables)
- `gallery` — `animation`, `grain`, `pageNumbers`, `flourishes` (the pressed-flower
  decorations slipped between the pages; images live in `public/flourish/`) master switches
- `chapters` — the novel's chapter pages
- `littleThings` — tiny handwritten fragments scattered between chapters
- `interludes` — rare "one more thing" pages (`after` = chapter id)
- `music` — a playlist. Drop `.mp3` files into `public/music/` and list them:

  ```json
  "music": {
    "enabled": true,
    "tracks": [
      { "src": "/music/our-song.mp3", "title": "Our song", "artist": "Artist name" },
      { "src": "/music/another.mp3", "title": "Another one", "artist": "" }
    ]
  }
  ```

  A small record-player control sits in the corner: play/pause, prev/next,
  volume, track counter. Songs auto-advance; a single song loops. It never
  autoplays, and if a listed file hasn't been added yet it says so gently
  instead of breaking.

---

## AI quotes (optional)

Set `VITE_QUOTE_API_URL` in a `.env` file to a serverless endpoint **you** host
(see `server-example/quote.ts`). The endpoint holds the AI key — the browser
bundle never contains a key. Priority is always:

```
manual quote  →  AI-generated quote  →  local fallback
```

If the endpoint is down, nothing breaks; the fallback line appears instead.
The internal creative brief for the AI lives in `src/utils/quotes.ts`
(`QUOTE_SYSTEM_PROMPT`).

---

## Changing the password

The gate compares a salted SHA-256 digest; the phrase itself is nowhere in the
code. To change it:

```bash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('her-little-archive::v1::' + 'YOUR-NEW-PHRASE').digest('hex'))"
```

Paste the output into `DIGEST` in `src/utils/auth.ts`.

See **SECURITY.md** before deploying.
