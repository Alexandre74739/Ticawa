export default defineEventHandler(async (event) => {
  const { cronSecret } = useRuntimeConfig(event);
  if (!cronSecret) throw createError({ statusCode: 503, message: "NUXT_CRON_SECRET manquante." });

  const given = getRequestHeader(event, "authorization") ?? "";
  const expected = `Bearer ${cronSecret}`;
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff) throw createError({ statusCode: 401, message: "Non autorisé." });

  return sendDueReminders();
});
