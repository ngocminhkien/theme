const loopbackHosts = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Returns the independent Admin application URL when it is safe to render.
 * It deliberately never maps to a storefront `/admin` route because no such
 * route exists. Production requires an explicit HTTPS, non-loopback origin.
 */
export function getAdminPortalUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  const candidate = configured || (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '');
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const isLoopback = loopbackHosts.has(url.hostname.toLowerCase());
    if (process.env.NODE_ENV === 'production' && (url.protocol !== 'https:' || isLoopback)) return null;
    if (process.env.NODE_ENV !== 'production' && !['http:', 'https:'].includes(url.protocol)) return null;
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}
