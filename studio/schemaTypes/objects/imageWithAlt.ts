import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen reader users. Required for accessibility.',
      validation: (rule) => rule.required().max(160),
    }),
  ],
})
