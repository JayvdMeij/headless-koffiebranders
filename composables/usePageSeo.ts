import { SETTINGS_QUERY } from '~/queries'

interface SeoInput {
  title: string
  description?: string | null
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: { asset: { _id: string } | null } | null
  } | null
  /** Fallback sharing image (e.g. the coffee photo) when no explicit OG image is set. */
  imageId?: string | null
  noindex?: boolean
}

/**
 * Sets title, meta description, canonical URL, Open Graph and Twitter tags.
 * Falls back to the default SEO from site settings.
 */
export async function usePageSeo(input: SeoInput) {
  // Resolve composables before the first await: the Nuxt context is lost after it
  const nuxtApp = useNuxtApp()
  const { siteUrl } = useRuntimeConfig().public
  const route = useRoute()
  const img = useImage()
  const settings = await useSanityQuery('settings', SETTINGS_QUERY)

  const siteName = settings.value.title
  const path = route.path === '/' ? '' : route.path.replace(/\/$/, '')
  const url = `${siteUrl}${path}`

  const pageTitle = input.seo?.title || input.title
  const title = pageTitle.includes(siteName) ? pageTitle : `${pageTitle} | ${siteName}`
  const description = input.seo?.description || input.description || settings.value.seo?.description || ''

  const imageId = input.seo?.ogImage?.asset?._id || input.imageId || settings.value.seo?.ogImage?.asset?._id
  const ogImage = imageId ? croppedImageUrl(img, imageId, 1200, 630) : undefined

  nuxtApp.runWithContext(() => {
    useHead({
      title,
      link: [{ rel: 'canonical', href: url }],
    })
    useSeoMeta({
      description,
      ogTitle: pageTitle,
      ogDescription: description,
      ogType: 'website',
      ogUrl: url,
      ogSiteName: siteName,
      ogLocale: 'nl_NL',
      ogImage: ogImage ? { url: ogImage, width: 1200, height: 630, alt: pageTitle, type: 'image/jpeg' } : undefined,
      twitterCard: 'summary_large_image',
      twitterTitle: pageTitle,
      twitterDescription: description,
      twitterImage: ogImage,
      robots: input.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    })
  })

  return { url, siteName, settings }
}

/** Adds a JSON-LD block. Data blocks are not executed, so they need no CSP script hash. */
export function useJsonLd(data: Record<string, unknown>) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...data }) }],
  })
}
