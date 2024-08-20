import type { Block } from 'payload/types'

import richText from '../../fields/richText'
import { IconRow } from '../IconRow'

export const IconRowContainer: Block = {
  slug: 'iconRowContainer',
  fields: [
    richText({
      name: 'introContent',
      label: 'Intro Content',
    }),
    {
      name: 'mainHeading',
      type: 'text',
      required: true,
    },
    {
      name: 'rows',
      type: 'blocks',
      blocks: [IconRow],
    },
  ],
}
