import type { Block, Field } from 'payload/types'

import { inlineMedia } from '../../fields/inlineMedia'
import { invertBackground } from '../../fields/invertBackground'
import link from '../../fields/link'
import richText from '../../fields/richText'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        value: 'oneThird',
        label: 'One Third',
      },
      {
        value: 'half',
        label: 'Half',
      },
      {
        value: 'twoThirds',
        label: 'Two Thirds',
      },
      {
        value: 'full',
        label: 'Full',
      },
    ],
  },
  {
    name: 'useImage',
    type: 'checkbox',
    defaultValue: false,
  },
  inlineMedia({
    overrides: {
      admin: {
        condition: (_, siblingData) => siblingData?.useImage === true,
      },
    },
  }),
  richText({
    admin: {
      condition: (_, siblingData) => siblingData?.useImage === false,
    },
    required: false,
  }),
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  fields: [
    invertBackground,
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
