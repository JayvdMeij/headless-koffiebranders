import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons/Home'
import { UsersIcon } from '@sanity/icons/Users'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { BasketIcon } from '@sanity/icons/Basket'

const titleField = defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() })
const introField = defineField({ name: 'intro', type: 'text', rows: 3 })
const seoField = defineField({ name: 'seo', type: 'seo' })

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'hero',
      type: 'object',
      validation: (rule) => rule.required(),
      fields: [
        defineField({ name: 'heading', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'text', type: 'text', rows: 3 }),
        defineField({ name: 'image', type: 'imageWithAlt', validation: (rule) => rule.required() }),
        defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
      ],
    }),
    defineField({ name: 'featuredHeading', title: 'Featured coffees heading', type: 'string' }),
    defineField({ name: 'storyHeading', type: 'string' }),
    defineField({ name: 'story', type: 'richText' }),
    defineField({ name: 'storyImage', type: 'imageWithAlt' }),
    seoField,
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: UsersIcon,
  fields: [titleField, introField, defineField({ name: 'image', type: 'imageWithAlt' }), defineField({ name: 'body', type: 'richText' }), seoField],
  preview: { select: { title: 'title' } },
})

export const coffeeIndexPage = defineType({
  name: 'coffeeIndexPage',
  title: 'Coffee overview page',
  type: 'document',
  icon: BasketIcon,
  fields: [titleField, introField, seoField],
  preview: { select: { title: 'title' } },
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    titleField,
    introField,
    defineField({ name: 'successTitle', title: 'Thank-you page title', type: 'string' }),
    defineField({ name: 'successMessage', title: 'Thank-you page message', type: 'text', rows: 2 }),
    seoField,
  ],
  preview: { select: { title: 'title' } },
})
