import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils", "@vite-pwa/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    databaseUrl: "",
  },
  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      titleTemplate: "%s · Ticawa",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=2" },
        { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png?v=2" },
      ],
      meta: [
        { name: "theme-color", content: "#5A67B8" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: "Ticawa" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Ticawa",
      short_name: "Ticawa",
      description: "Perdez votre ticket, jamais vos droits.",
      lang: "fr",
      start_url: "/dashboard",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#E8E7F6",
      theme_color: "#5A67B8",
      icons: [
        { src: "/pwa/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
        { src: "/pwa/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
        {
          src: "/pwa/maskable-512.png?v=2",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ["**/*.{js,css,svg,png,woff2}"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
