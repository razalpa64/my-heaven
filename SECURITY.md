# Security notes

## What the built-in gate does

- The passphrase is verified as a **salted SHA-256 digest** via Web Crypto —
  the phrase never appears in the source or the built bundle (verified in CI of
  this build: `grep -ri` over `dist/` finds nothing).
- Comparison is constant-time-ish; failed attempts are **throttled**
  (quadratic back-off).
- Unlock state lives in `sessionStorage` only — closing the tab relocks it.
- `noindex, nofollow` meta + `robots.txt` keep the site out of search engines.
- `referrer: no-referrer` so the URL never leaks through outbound clicks.
- No analytics, no social embeds, no third-party scripts (fonts only).
- No API keys anywhere in frontend code. AI quotes go through an endpoint you
  host; the key lives there.

## What a static site cannot do — be honest about this

Client-side protection is a **curtain, not a vault**. A determined person with
devtools could read the JS bundle and fetch images in `public/photos/` directly
if they guess the URLs. The gate reliably stops casual visitors, crawlers, and
anyone without the phrase — but if the photographs are truly sensitive, add a
server-side layer:

### Recommended: protect it at the host

**Vercel** — simplest options:
- *Deployment Protection → Password Protection* (dashboard, one switch), or
- an Edge Middleware (`middleware.ts`) that checks a cookie and returns 401
  with `WWW-Authenticate: Basic` otherwise. The password check then happens
  on the server and even image URLs are protected.

**Netlify** — `_headers` + Basic-Auth via `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Basic-Auth = "julian:YOUR-PASSWORD"
```

**Nginx** — classic `auth_basic` with an `htpasswd` file.

### Also sensible

- Serve over HTTPS only (Vercel/Netlify default).
- Keep the repository **private** on GitHub — the photos live in it.
- Don't share the deployed URL publicly; the site deliberately has no
  share buttons, social links or public profile surface.
- If you add the AI quote endpoint, rate-limit it and restrict CORS to
  your site's origin.
