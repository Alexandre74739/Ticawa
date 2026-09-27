export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api/")) return;

  const session = await getUserSession(event);
  if (!session.user) return;

  const version = await getSessionVersion(session.user.id);
  if (version === undefined || version !== session.secure?.sessionVersion)
    await clearUserSession(event);
});
