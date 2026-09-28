export async function sendMail(mail: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const { brevoApiKey, mailFromEmail, mailFromName } = useRuntimeConfig();
  if (!brevoApiKey) throw new Error("NUXT_BREVO_API_KEY manquante");
  if (!mailFromEmail) throw new Error("NUXT_MAIL_FROM_EMAIL manquante");

  try {
    await $fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoApiKey, accept: "application/json" },
      body: {
        sender: { email: mailFromEmail, name: mailFromName },
        to: [{ email: mail.to }],
        subject: mail.subject,
        htmlContent: mail.html,
        textContent: mail.text,
      },
    });
  } catch (error) {
    const message =
      (error as { data?: { message?: string } }).data?.message ??
      (error as Error).message;
    throw new Error(`Brevo : ${message}`);
  }
}

function siteUrl() {
  const url =
    useRuntimeConfig().siteUrl || (import.meta.dev ? "http://localhost:3000" : "");
  if (!url) throw new Error("NUXT_SITE_URL manquante");
  return url;
}

function link(path: string, token?: string) {
  const url = new URL(path, siteUrl());
  if (token) url.searchParams.set("token", token);
  return url.href;
}

const HEADING = 'style="font-size:18px;font-weight:700;margin:0 0 12px"';
const BODY = 'style="font-size:15px;line-height:1.6;margin:0 0 24px"';
const NOTE = 'style="font-size:13px;line-height:1.6;margin:24px 0 0"';
const BUTTON =
  'style="display:inline-block;background:#5A67B8;color:#FBF9F5;text-decoration:none;font-weight:700;font-size:15px;padding:14px 22px;border-radius:14px"';

function shell(inner: string) {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#FBF9F5;font-family:Arial,Helvetica,sans-serif;color:#2A2E3A">
    <div style="max-width:480px;margin:0 auto;padding:32px 20px">
      <p style="font-size:22px;font-weight:800;color:#5A67B8;margin:0 0 24px">Ticawa</p>
      <div style="background:#E8E7F6;border-radius:24px;padding:28px 24px">
${inner}
      </div>
      <p style="font-size:12px;opacity:.6;margin:20px 0 0">
        Perdez votre ticket, jamais vos droits.
      </p>
    </div>
  </body>
</html>`;
}

export async function sendRegistrationMail(
  pending: PendingRegistration,
  token: string,
) {
  const url = link("/inscription", token);

  await sendMail({
    to: pending.email,
    subject: "Confirmez votre adresse pour créer votre espace",
    text: [
      `Bonjour ${pending.prenom},`,
      "",
      "Pour terminer la création de votre espace Ticawa, ouvrez ce lien :",
      url,
      "",
      `Il est valable ${REGISTRATION_TTL_MINUTES} minutes.`,
      "Tant qu'il n'est pas ouvert, aucun compte n'existe à cette adresse.",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : il n'y aura rien à supprimer.",
      "",
      "Tico, pour l'équipe Ticawa",
    ].join("\n"),
    html: shell(`
        <p ${HEADING}>Bonjour ${escapeHtml(pending.prenom)},</p>
        <p ${BODY}>
          Il ne manque qu'un clic pour ouvrir votre espace Ticawa.
        </p>
        <a href="${url}" ${BUTTON}>Confirmer mon adresse</a>
        <p ${NOTE}>
          Ce lien est valable ${REGISTRATION_TTL_MINUTES} minutes. Tant qu'il n'est
          pas ouvert, aucun compte n'existe à cette adresse. Si vous n'êtes pas à
          l'origine de cette demande, ignorez ce message : il n'y aura rien à
          supprimer.
        </p>`),
  });
}

export async function sendAccountExistsMail(user: UserRow) {
  const google = Boolean(user.google_id);
  const how = google
    ? "vous connecter avec Google"
    : "vous connecter avec votre mot de passe";
  const url = link("/connexion");
  const forgotten = link("/mot-de-passe");

  await sendMail({
    to: user.email,
    subject: "Vous avez déjà un espace Ticawa",
    text: [
      `Bonjour ${user.prenom},`,
      "",
      "Une inscription vient d'être tentée avec votre adresse, mais vous avez déjà un espace Ticawa.",
      `Pour y accéder, il vous suffit de ${how} :`,
      url,
      "",
      google
        ? "Vous pouvez aussi ajouter un mot de passe depuis votre compte."
        : `Mot de passe oublié ? ${forgotten}`,
      "",
      "Si cette tentative ne vient pas de vous, il n'y a rien à faire : votre compte n'a pas bougé.",
      "",
      "Tico, pour l'équipe Ticawa",
    ].join("\n"),
    html: shell(`
        <p ${HEADING}>Bonjour ${escapeHtml(user.prenom)},</p>
        <p ${BODY}>
          Une inscription vient d'être tentée avec votre adresse, mais vous avez
          déjà un espace Ticawa. Pour y accéder, il suffit de ${how}.
        </p>
        <a href="${url}" ${BUTTON}>Me connecter</a>
        <p ${NOTE}>
          ${
            google
              ? "Vous pouvez aussi ajouter un mot de passe depuis votre compte."
              : `Mot de passe oublié ? <a href="${forgotten}" style="color:#5A67B8">Demandez un lien</a>.`
          }
          Si cette tentative ne vient pas de vous, il n'y a rien à faire : votre
          compte n'a pas bougé.
        </p>`),
  });
}

export async function sendPasswordResetMail(user: UserRow, token: string) {
  const url = link("/mot-de-passe", token);
  const action = user.password_hash
    ? "changer votre mot de passe"
    : "définir un mot de passe";
  const cta = action.charAt(0).toUpperCase() + action.slice(1);

  await sendMail({
    to: user.email,
    subject: `Votre lien pour ${action}`,
    text: [
      `Bonjour ${user.prenom},`,
      "",
      `Pour ${action} Ticawa, ouvrez ce lien :`,
      url,
      "",
      `Il est valable ${PASSWORD_RESET_TTL_MINUTES} minutes et ne sert qu'une fois.`,
      "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe actuel reste inchangé.",
      "",
      "Tico, pour l'équipe Ticawa",
    ].join("\n"),
    html: shell(`
        <p ${HEADING}>Bonjour ${escapeHtml(user.prenom)},</p>
        <p ${BODY}>
          Pour ${action} Ticawa, cliquez sur le bouton ci-dessous.
        </p>
        <a href="${url}" ${BUTTON}>${cta}</a>
        <p ${NOTE}>
          Ce lien est valable ${PASSWORD_RESET_TTL_MINUTES} minutes et ne sert qu'une fois.
          Si vous n'êtes pas à l'origine de cette demande, ignorez ce message :
          votre mot de passe actuel reste inchangé.
        </p>`),
  });
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]!);
}
