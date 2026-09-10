/** Only the root route uses this function. Blog URLs and assets stay static. */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname !== 'vol.gaoyuze.com') return context.next();
  if (!['GET', 'HEAD'].includes(context.request.method)) {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  url.pathname = '/vol/';
  const response = await context.env.ASSETS.fetch(new Request(url, context.request));
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
