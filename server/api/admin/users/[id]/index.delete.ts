export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const user = await findSupportUser(getRouterParam(event, "id"));
  await rateLimit(`admin:delete:${admin.id}`, 10, 15 * 60);

  // Noté avant la suppression : l'email du compte doit encore exister.
  await logAdminAction(admin.id, "user.delete", user.id);
  await deleteUser(user.id);
  return { ok: true };
});
