import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { rating } from '../../fields/rating'
import richText from '../../fields/richText'
import { slugField } from '../../fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateReferences } from './hooks/revalidateReferences'

export const References: CollectionConfig = {
  slug: 'references',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'rating', 'updatedAt', 'slug'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/references/${doc?.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateReferences],
  },
  fields: [
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'references',
      label: 'Additional References',
      type: 'array',
      required: false,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'location',
              type: 'text',
            },
            {
              name: 'date',
              label: 'Date (Month, Year)',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'monthOnly',
                  displayFormat: 'MMMM yyyy',
                },
              },
            },
          ],
        },
        rating(),
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        richText({
          name: 'review',
          label: 'Review',
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        rating(),
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    richText({
      name: 'review',
      label: 'Review',
    }),
    slugField('title'),
  ],
}
