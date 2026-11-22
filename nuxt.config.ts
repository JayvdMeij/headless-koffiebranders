// https://nuxt.com/docs/api/configuration/nuxt-config
import { createClient } from '@sanity/client'

const sanity = {
  projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'ns1gemkd',
  dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
}
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://spaarne-koffiebranders.netlify.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/robots', '@nuxtjs/sitemap'],

  // Shared by the sitemap and robots modules
  site: {
    url: siteUrl,
    name: 'Spaarne Koffiebranders',
    defaultLocale: 'nl',
  },

  sitemap: {
    // Prerendered routes are discovered automatically
    exclude: ['/contact/bedankt', '/niet-gevonden'],
    // The XSL viewer needs script/XSLT permissions the strict CSP does not grant
    xsl: false,
  },

  robots: {
    disallow: ['/contact/bedankt', '/niet-gevonden'],
  },

  css: ['~/assets/css/main.css'],

  // Content site without client-side interactivity: ship zero JavaScript.
  // Navigation, the mobile layout and the Netlify form all work natively.
  features: {
    noScripts: true,
    inlineStyles: true,
  },

  experimental: {
    payloadExtraction: false,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/contact/bedankt', '/niet-gevonden', '/sitemap.xml', '/robots.txt'],
    },
  },

  hooks: {
    // Prerender every coffee detail page, also ones not linked from other pages
    async 'nitro:config'(nitroConfig) {
      const client = createClient({ ...sanity, useCdn: false, perspective: 'published' })
      const slugs = await client.fetch<string[]>(`*[_type == "coffee" && defined(slug.current)].slug.current`)
      nitroConfig.prerender ??= {}
      nitroConfig.prerender.routes = [...(nitroConfig.prerender.routes ?? []), ...slugs.map((slug) => `/koffie/${slug}`)]
    },
  },

  // Fonts are downloaded at build time and served from our own domain
  // (/_nuxt/fonts), with metric-adjusted fallbacks to avoid layout shift.
  fonts: {
    // Our font stacks live in CSS custom properties; inject the metric-adjusted
    // fallbacks there too so the swap from fallback to web font does not shift layout
    processCSSVariables: true,
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
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#f7f1e8' }],
    },
  },
})
