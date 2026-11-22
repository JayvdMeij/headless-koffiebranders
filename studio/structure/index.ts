import type { ComponentType } from 'react'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'
import { HomeIcon } from '@sanity/icons/Home'
import { UsersIcon } from '@sanity/icons/Users'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { BasketIcon } from '@sanity/icons/Basket'

// Each singleton is locked to a fixed document ID equal to its type name
const singleton = (S: StructureBuilder, type: string, title: string, icon: ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
      S.divider(),
      singleton(S, 'homePage', 'Home', HomeIcon),
      singleton(S, 'aboutPage', 'Over ons', UsersIcon),
      singleton(S, 'coffeeIndexPage', 'Koffie (overview)', BasketIcon),
      singleton(S, 'contactPage', 'Contact', EnvelopeIcon),
      S.divider(),
      S.documentTypeListItem('coffee').title('Coffees'),
    ])
