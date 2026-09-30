export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { q, page } = getQuery(event);

  const search = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const current = Math.min(Math.max(Math.floor(Number(page)) || 1, 1), 10_000);
  return listUsers(search, current);
});
