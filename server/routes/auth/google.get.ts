const REDIRECT_COOKIE = "ticawa_auth_redirect";

const oauth = defineOAuthGoogleEventHandler({
  config: { scope: ["openid", "email", "profile"] },

  async onSuccess(event, { user: google }) {
    const email = String(google.email ?? "").toLowerCase();
    if (!google.sub || !email || !google.email_verified)
      return sendRedirect(event, "/connexion?erreur=google");

    let user = await findUserByGoogleId(google.sub);

    if (!user) {
      const existing = await findUserByEmail(email);
      user = existing
        ? await linkGoogleAccount(existing.id, google.sub)
        : await createUser({
            email,
            prenom: google.given_name || google.name || email.split("@")[0],
            nom: google.family_name || null,
            googleId: google.sub,
          });
    }

    await startSession(event, user);

    const redirect = getCookie(event, REDIRECT_COOKIE);
    deleteCookie(event, REDIRECT_COOKIE, { path: "/" });
    return sendRedirect(event, isSafeRedirect(redirect) ? redirect : "/dashboard");
  },

  onError(event) {
    return sendRedirect(event, "/connexion?erreur=google");
  },
});

export default defineEventHandler((event) => {
  const { redirect } = getQuery(event);
  if (isSafeRedirect(redirect))
    setCookie(event, REDIRECT_COOKIE, redirect, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
  return oauth(event);
});
