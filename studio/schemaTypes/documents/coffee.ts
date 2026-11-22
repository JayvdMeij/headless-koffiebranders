import { defineArrayMember, defineField, defineType } from 'sanity'
import { BasketIcon } from '@sanity/icons/Basket'

export const coffee = defineType({
  name: 'coffee',
  title: 'Coffee',
  type: 'document',
  icon: BasketIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'profile', title: 'Origin & profile' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'content', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short description',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({ name: 'image', type: 'imageWithAlt', group: 'content', validation: (rule) => rule.required() }),
    defineField({ name: 'body', title: 'Story', type: 'richText', group: 'content' }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'origin',
      title: 'Country of origin',
      type: 'string',
      group: 'profile',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'region', type: 'string', group: 'profile' }),
    defineField({
      name: 'process',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          { title: 'Washed', value: 'washed' },
          { title: 'Natural', value: 'natural' },
          { title: 'Honey', value: 'honey' },
          { title: 'Anaerobic', value: 'anaerobic' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'roastLevel',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Medium', value: 'medium' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tastingNotes',
      type: 'array',
      group: 'profile',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.max(5).unique(),
    }),
    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      group: 'profile',
      validation: (rule) => rule.required().positive().precision(2),
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      group: 'profile',
      initialValue: 250,
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', origin: 'origin', roast: 'roastLevel', media: 'image' },
    prepare: ({ title, origin, roast, media }) => ({
      title,
      subtitle: [origin, roast].filter(Boolean).join(' · '),
      media,
    }),
  },
})
