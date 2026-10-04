/**
 * Resolves an asset path against the Vite base URL.
 * Ensures relative paths work seamlessly on localhost, network IPs,
 * and subpath hosting environments like GitHub Pages (/my-heaven/).
 */
export function getAssetUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const base = import.meta.env.BASE_URL || "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
