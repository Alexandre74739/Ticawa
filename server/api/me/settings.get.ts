export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  return toSettings(await findUserSettings(user.id));
});
