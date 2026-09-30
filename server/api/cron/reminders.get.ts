import { timingSafeEqual } from "node:crypto";

// Appelée une fois par jour par Vercel Cron (vercel.json). Vercel envoie
// « Authorization: Bearer <CRON_SECRET> » quand cette variable est définie.
export default defineEventHandler(async (event) => {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    throw createError({ statusCode: 503, message: "CRON_SECRET manquante." });

  const given = Buffer.from(getRequestHeader(event, "authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    throw createError({ statusCode: 401, message: "Non autorisé." });

  const stats = await sendDueReminders();
  console.info("[rappels]", stats);
  return stats;
});
