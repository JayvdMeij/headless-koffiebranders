import { defineField, defineType } from 'sanity'
import { SearchIcon } from '@sanity/icons/Search'

export const seo = defineType({
  name: 'seo',
  title: 'SEO & sharing',
  type: 'object',
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Falls back to the page title. Aim for 50-60 characters.',
      validation: (rule) => rule.max(60).warning('Longer titles are truncated in search results'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep it under 160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image',
      type: 'image',
      description: 'Shown when the page is shared. Cropped to 1200 x 630.',
      options: { hotspot: true },
    }),
  ],
})
