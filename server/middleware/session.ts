const RENEW_AFTER = 24 * 60 * 60 * 1000;

function needsSession(path: string) {
  const pathname = path.split("?")[0]!;
  if (pathname.startsWith("/api/")) return true;
  return !pathname.startsWith("/_") && !/\.[a-z0-9]+$/i.test(pathname);
}

export default defineEventHandler(async (event) => {
  if (!needsSession(event.path)) return;
  const { session: config } = useRuntimeConfig(event);
  // Sans cookie, getUserSession en créerait un : inutile pour un visiteur.
  if (!getCookie(event, config.name)) return;

  const { user, secure } = await getUserSession(event);
  if (!user) return;

  const version = await getSessionVersion(user.id);
  const age = secure?.issuedAt ? Date.now() - secure.issuedAt : undefined;
  const expired = age !== undefined && age > config.cookie.maxAge * 1000;

  if (version === undefined || version !== secure?.sessionVersion || expired) {
    await endSession(event);
    return;
  }

  if (age === undefined || age > RENEW_AFTER)
    await replaceUserSession(event, {
      user,
      secure: { sessionVersion: version, issuedAt: Date.now() },
    });
});
