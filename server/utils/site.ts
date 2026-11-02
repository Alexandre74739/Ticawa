import type { H3Event } from "h3";

// URL publique du site (SEO) : NUXT_SITE_URL ou ticawa.vercel.app par défaut.
export function siteOrigin(event: H3Event) {
  return new URL(useRuntimeConfig(event).public.siteUrl).origin;
}
