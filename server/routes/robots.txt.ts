// Pages privées (connexion requise) et API : rien à indexer.
const PRIVATE = ["/api/", "/auth/", "/dashboard", "/compte", "/parametres"];

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return [
    "User-agent: *",
    ...PRIVATE.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${siteOrigin(event)}/sitemap.xml`,
    "",
  ].join("\n");
});
