export default defineOAuthGoogleEventHandler({
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

    await setUserSession(event, { user: toSessionUser(user) });
    return sendRedirect(event, "/dashboard");
  },

  onError(event) {
    return sendRedirect(event, "/connexion?erreur=google");
  },
});
