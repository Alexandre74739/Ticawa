import tailwindcss from "@tailwindcss/vite";

// Nuxt injecte des scripts inline (payload, config) : 'unsafe-inline' reste
// nécessaire, mais tout chargement depuis un autre domaine est bloqué.
const csp = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' : moteur OCR (WebAssembly), sans autoriser eval().
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "worker-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(self), microphone=(), geolocation=()",
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils", "@vite-pwa/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    databaseUrl: "",
    brevoApiKey: "",
    mailFromEmail: "",
    mailFromName: "Ticawa",
    // Obligatoire en prod (liens des mails) ; localhost en dev si vide.
    siteUrl: "",
    trustedOrigins: "",
    session: { sessionHeader: false, cookie: { maxAge: 60 * 60 * 24 * 90 } },
  },
  routeRules: {
    "/**": { headers: securityHeaders },
  },
  // CSP et HSTS en prod seulement : le serveur de dev (HMR) n'est pas en HTTPS.
  $production: {
    routeRules: {
      "/**": {
        headers: {
          ...securityHeaders,
          "Content-Security-Policy": csp,
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        },
      },
    },
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
    client: { periodicSyncForUpdates: 3600 },
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
      globIgnores: ["ocr/**"],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith("/ocr/"),
          handler: "CacheFirst",
          options: {
            cacheName: "ocr",
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 180 },
          },
        },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
