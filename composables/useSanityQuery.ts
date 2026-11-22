import type { QueryParams } from '@sanity/client'

/**
 * Fetches a GROQ query through useAsyncData. The result type is inferred from
 * TypeGen's client overloads (types/sanity.types.ts).
 *
 * Throws a 404 when the document does not exist, so missing slugs and
 * unpublished singletons render the error page instead of an empty page.
 */
export async function useSanityQuery<const Q extends string>(key: string, query: Q, params: QueryParams = {}) {
  const client = useSanityClient()
  const { data, error } = await useAsyncData(key, () => client.fetch(query, params))

  if (error.value) {
    throw createError({ statusCode: 500, statusMessage: 'Content kon niet worden geladen', fatal: true })
  }
  if (data.value === null || data.value === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden', fatal: true })
  }
  return data as Ref<NonNullable<typeof data.value>>
}
