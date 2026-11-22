import { coffee } from './documents/coffee'
import { imageWithAlt } from './objects/imageWithAlt'
import { richText } from './objects/richText'
import { seo } from './objects/seo'
import { aboutPage, coffeeIndexPage, contactPage, homePage } from './singletons/pages'
import { siteSettings } from './singletons/siteSettings'

export const schemaTypes = [
  siteSettings,
  homePage,
  aboutPage,
  coffeeIndexPage,
  contactPage,
  coffee,
  seo,
  imageWithAlt,
  richText,
]

// Singletons use their type name as fixed document ID (see structure/index.ts)
export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage', 'aboutPage', 'coffeeIndexPage', 'contactPage'])
