// https://nuxt.com/docs/api/configuration/nuxt-config
const sanity = {
  projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'ns1gemkd',
  dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
}
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://spaarne-koffiebranders.netlify.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  // Fonts are downloaded at build time and served from our own domain
  // (/_fonts), with metric-adjusted fallbacks to avoid layout shift.
  fonts: {
    defaults: {
      subsets: ['latin'],
      styles: ['normal'],
      formats: ['woff2'],
    },
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 600], global: true, preload: { weights: [400] } },
      { name: 'Fraunces', provider: 'google', weights: [600], global: true, preload: true },
    ],
  },

  runtimeConfig: {
    public: {
      sanity,
      siteUrl,
    },
  },

  image: {
    provider: 'sanity',
    sanity: { projectId: sanity.projectId, dataset: sanity.dataset },
    // Mobile-first breakpoints used to build srcset
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1600 },
    quality: 75,
  },

  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: { exclude: ['../studio/**'] },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'nl' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
})
