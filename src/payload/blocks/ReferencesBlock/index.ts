import type { Block } from 'payload/types'

import { invertBackground } from '../../fields/invertBackground'

export const ReferencesBlock: Block = {
  slug: 'referencesBlock',
  fields: [invertBackground],
}
