import type { Field } from 'payload/types'

import deepMerge from '../utilities/deepMerge'

type InlineMediaType = (options?: { overrides?: Record<string, unknown> }) => Field

export const inlineMedia: InlineMediaType = ({ overrides = {} } = {}) => {
  const defaultField: Field = {
    name: 'inlineMedia',
    type: 'group',
    admin: {
      condition: (_, siblingData) => siblingData?.useImage === true,
    },
    fields: [
      {
        name: 'imageScale',
        type: 'number',
        required: false,
      },
      {
        name: 'borderRadius',
        type: 'number',
        required: false,
      },
      {
        name: 'media',
        type: 'upload',
        relationTo: 'media',
        required: false,
      },
    ],
  }

  // Merge the default field with any overrides
  return deepMerge(defaultField, overrides)
}
