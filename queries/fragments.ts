// Shared GROQ projections. Kept as plain strings so they can be interpolated
// into defineQuery() calls; TypeGen resolves the final query strings.

/** Image with alt text plus the asset data needed for intrinsic sizing (prevents layout shift). */
export const imageFields = /* groq */ `
  alt,
  crop,
  hotspot,
  "asset": asset->{ _id, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
`

export const seoFields = /* groq */ `
  seo{ title, description, ogImage{ crop, hotspot, "asset": asset->{ _id } } }
`

export const richTextFields = /* groq */ `
  ...,
  _type == "imageWithAlt" => { _key, _type, ${imageFields} }
`

export const coffeeCardFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  excerpt,
  origin,
  roastLevel,
  tastingNotes,
  price,
  weight,
  image{ ${imageFields} }
`
