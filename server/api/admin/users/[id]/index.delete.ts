export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const user = await findSupportUser(getRouterParam(event, "id"));
  await rateLimit(`admin:delete:${admin.id}`, 10, 15 * 60);

  await deleteUser(user.id);
  return { ok: true };
});
