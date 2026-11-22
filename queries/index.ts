import { defineQuery } from 'groq'
import { coffeeCardFields, imageFields, richTextFields, seoFields } from './fragments'

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  tagline,
  address,
  email,
  phone,
  openingHours[]{ _key, days, hours },
  socialLinks[]{ _key, label, url },
  ${seoFields}
}`)

export const HOME_QUERY = defineQuery(`{
  "page": *[_type == "homePage" && _id == "homePage"][0]{
    hero{ heading, text, ctaLabel, image{ ${imageFields} } },
    featuredHeading,
    storyHeading,
    story[]{ ${richTextFields} },
    storyImage{ ${imageFields} },
    ${seoFields}
  },
  "featured": *[_type == "coffee" && featured == true && defined(slug.current)] | order(name asc)[0...3]{ ${coffeeCardFields} }
}`)

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  intro,
  image{ ${imageFields} },
  body[]{ ${richTextFields} },
  ${seoFields}
}`)

export const COFFEE_INDEX_QUERY = defineQuery(`{
  "page": *[_type == "coffeeIndexPage" && _id == "coffeeIndexPage"][0]{ title, intro, ${seoFields} },
  "coffees": *[_type == "coffee" && defined(slug.current)] | order(name asc){ ${coffeeCardFields} }
}`)

export const COFFEE_QUERY = defineQuery(`*[_type == "coffee" && slug.current == $slug][0]{
  ${coffeeCardFields},
  region,
  process,
  body[]{ ${richTextFields} },
  ${seoFields}
}`)

export const COFFEE_SLUGS_QUERY = defineQuery(`*[_type == "coffee" && defined(slug.current)].slug.current`)

export const CONTACT_QUERY = defineQuery(`*[_type == "contactPage" && _id == "contactPage"][0]{
  title,
  intro,
  successTitle,
  successMessage,
  ${seoFields}
}`)
