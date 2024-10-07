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
    defaultColumns: ['updatedAt', 'slug'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'references',
      label: 'Reviews',
      type: 'array',
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'location',
              type: 'text',
            },
            {
              name: 'pets',
              label: 'Pets',
              required: false,
              type: 'text',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'date',
              label: 'Begin Date',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'monthOnly',
                  displayFormat: 'MMMM yyyy',
                },
              },
            },
            {
              name: 'endDate',
              label: 'End Date (optional for multi-month sits)',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'monthOnly',
                  displayFormat: 'MMMM yyyy',
                },
                condition: (_, siblingData) => {
                  const dateValue = siblingData?.date
                  return dateValue && !isNaN(Date.parse(dateValue))
                },
              },
            },
            rating(),
          ],
        },
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
    slugField('title', {
      hidden: true,
    }),
  ],
}
