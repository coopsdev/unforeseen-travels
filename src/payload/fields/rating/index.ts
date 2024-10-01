import type { Field } from 'payload/types'

import deepMerge from '../../utilities/deepMerge'
import StarRatingField from './component'

type InlineMediaType = (options?: { overrides?: Record<string, unknown> }) => Field

export const rating: InlineMediaType = ({ overrides = {} } = {}) => {
  const defaultField: Field = {
    name: 'rating',
    type: 'number',
    label: 'Rating',
    required: true,
    defaultValue: 5,
    admin: {
      components: {
        Field: StarRatingField,
      },
    },
  }

  // Merge the default field with any overrides
  return deepMerge(defaultField, overrides)
}
