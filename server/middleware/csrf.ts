import type { H3Event } from "h3";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function allowedOrigins(event: H3Event) {
  const { siteUrl, trustedOrigins } = useRuntimeConfig(event);

  return [
    getRequestURL(event).origin,
    ...(siteUrl ? [new URL(siteUrl).origin] : []),
    ...trustedOrigins
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];
}

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api/") || SAFE_METHODS.has(event.method)) return;

  const origin = getRequestHeader(event, "origin");
  if (origin && allowedOrigins(event).includes(origin)) return;

  throw createError({
    statusCode: 403,
    message: "Requête refusée : elle ne vient pas de Ticawa.",
  });
});
