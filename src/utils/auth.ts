/* ──────────────────────────────────────────────────────────────
   Password gate.

   The password itself never appears in this bundle — only a
   salted SHA-256 digest. Entry is compared via Web Crypto.

   Honest note: a static site can only draw a curtain, not build
   a vault. For true protection, pair this with server-side auth
   at the host (see SECURITY.md). This gate keeps out the casual
   visitor, search engines, and anyone without the phrase.
   ────────────────────────────────────────────────────────────── */

const SALT = "her-little-archive::v1::";
const DIGEST =
  "97cf7450b7c3d90399c6ebf98b9882cae3e489b6f1bc0fa7462c2ea665b4c493";

const SESSION_KEY = "hla-opened";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassphrase(attempt: string): Promise<boolean> {
  const hex = await sha256Hex(SALT + attempt.trim());
  /* constant-time-ish comparison */
  if (hex.length !== DIGEST.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ DIGEST.charCodeAt(i);
  return diff === 0;
}

export function rememberUnlock(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, DIGEST.slice(0, 16));
  } catch {
    /* private browsing — fine, she'll just type it again */
  }
}

export function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === DIGEST.slice(0, 16);
  } catch {
    return false;
  }
}

/** Soft throttle: grows the wait after each failed attempt. */
export function failureDelay(failures: number): number {
  return Math.min(failures * failures * 400, 8000);
}
