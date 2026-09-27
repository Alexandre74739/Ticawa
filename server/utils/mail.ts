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

export async function sendPasswordResetMail(user: UserRow, token: string) {
  const siteUrl =
    useRuntimeConfig().siteUrl || (import.meta.dev ? "http://localhost:3000" : "");
  if (!siteUrl) throw new Error("NUXT_SITE_URL manquante");
  const url = new URL("/mot-de-passe", siteUrl);
  url.searchParams.set("token", token);
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
      url.href,
      "",
      `Il est valable ${PASSWORD_RESET_TTL_MINUTES} minutes et ne sert qu'une fois.`,
      "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe actuel reste inchangé.",
      "",
      "Tico, pour l'équipe Ticawa",
    ].join("\n"),
    html: `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#FBF9F5;font-family:Arial,Helvetica,sans-serif;color:#2A2E3A">
    <div style="max-width:480px;margin:0 auto;padding:32px 20px">
      <p style="font-size:22px;font-weight:800;color:#5A67B8;margin:0 0 24px">Ticawa</p>
      <div style="background:#E8E7F6;border-radius:24px;padding:28px 24px">
        <p style="font-size:18px;font-weight:700;margin:0 0 12px">Bonjour ${escapeHtml(user.prenom)},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
          Pour ${action} Ticawa, cliquez sur le bouton ci-dessous.
        </p>
        <a href="${url.href}" style="display:inline-block;background:#5A67B8;color:#FBF9F5;text-decoration:none;font-weight:700;font-size:15px;padding:14px 22px;border-radius:14px">${cta}</a>
        <p style="font-size:13px;line-height:1.6;margin:24px 0 0">
          Ce lien est valable ${PASSWORD_RESET_TTL_MINUTES} minutes et ne sert qu'une fois.
          Si vous n'êtes pas à l'origine de cette demande, ignorez ce message :
          votre mot de passe actuel reste inchangé.
        </p>
      </div>
      <p style="font-size:12px;opacity:.6;margin:20px 0 0">
        Perdez votre ticket, jamais vos droits.
      </p>
    </div>
  </body>
</html>`,
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
