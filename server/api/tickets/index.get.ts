export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { q, page, status } = getQuery(event);

  const search = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const current = Math.min(Math.max(Math.floor(Number(page)) || 1, 1), 10_000);
  const state = status === "active" || status === "expired" ? status : null;
  return listTickets(user.id, search, current, state);
});
