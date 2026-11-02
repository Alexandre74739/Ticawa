// Pages légales exclues : elles sont en noindex.
const PAGES = ["/", "/inscription", "/connexion"];

export default defineEventHandler((event) => {
  const origin = siteOrigin(event);
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...PAGES.map((path) => `  <url><loc>${origin}${path}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
});
