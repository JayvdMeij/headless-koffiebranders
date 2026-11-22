import type { useImage } from '#imports'
import type { SETTINGS_QUERY_RESULT } from '~/types/sanity.types'

type Settings = NonNullable<SETTINGS_QUERY_RESULT>
type ImageBuilder = ReturnType<typeof useImage>

/**
 * Exact-size JPEG crop from the Sanity CDN, for Open Graph and structured data.
 * `fit: cover` maps to Sanity's fit=crop; the provider's typings omit it.
 */
export function croppedImageUrl(img: ImageBuilder, assetId: string, width: number, height: number) {
  return img(assetId, { width, height, fit: 'cover', format: 'jpg', quality: 80 } as Parameters<ImageBuilder>[1])
}

/** schema.org CafeOrCoffeeShop for the shop and tasting room. */
export function localBusinessSchema(settings: Settings, url: string, img: ImageBuilder) {
  const imageId = settings.seo?.ogImage?.asset?._id
  return {
    '@type': 'CafeOrCoffeeShop',
    '@id': `${url}#business`,
    name: settings.title,
    description: settings.seo?.description ?? settings.tagline ?? undefined,
    url,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    image: imageId ? croppedImageUrl(img, imageId, 1200, 630) : undefined,
    servesCuisine: 'Koffie',
    priceRange: '€€',
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address.street ?? undefined,
          postalCode: settings.address.postalCode ?? undefined,
          addressLocality: settings.address.city ?? undefined,
          addressCountry: 'NL',
        }
      : undefined,
    sameAs: settings.socialLinks?.map((link) => link.url),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
