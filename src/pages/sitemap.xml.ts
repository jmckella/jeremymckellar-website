import posts from '../data/posts.json';
export function GET() {
  const paths = ['/', '/thoughts/', ...posts.map(post => `/thoughts/${post.slug}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>https://jeremymckellar.com${path}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
