import { createClient, type SanityClient } from '@sanity/client'

let client: SanityClient | undefined

/**
 * Read-only Sanity client for published content. Pages are prerendered,
 * so in production this only runs at build time.
 */
export function useSanityClient(): SanityClient {
  if (!client) {
    const { sanity } = useRuntimeConfig().public
    client = createClient({
      projectId: sanity.projectId,
      dataset: sanity.dataset,
      apiVersion: sanity.apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  }
  return client
}
