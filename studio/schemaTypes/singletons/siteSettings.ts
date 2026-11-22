import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({ name: 'title', title: 'Site name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({
      name: 'address',
      type: 'object',
      fields: [
        defineField({ name: 'street', type: 'string' }),
        defineField({ name: 'postalCode', type: 'string' }),
        defineField({ name: 'city', type: 'string' }),
      ],
    }),
    defineField({ name: 'email', type: 'string', validation: (rule) => rule.email() }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({
      name: 'openingHours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'openingHoursRow',
          fields: [
            defineField({
              name: 'days',
              type: 'string',
              description: 'Shown as written, e.g. Di t/m vr',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'hours',
              type: 'string',
              description: 'e.g. 08:00 - 17:00, or Gesloten',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'days', subtitle: 'hours' } },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'url', type: 'url', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'Default SEO', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
