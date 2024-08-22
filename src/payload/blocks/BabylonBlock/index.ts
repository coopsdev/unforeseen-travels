import type { Block } from 'payload/types'

import richText from '../../fields/richText'

export const BabylonBlock: Block = {
  slug: 'babylonBlock',
  fields: [
    richText({
      name: 'introContent',
      label: 'Intro Content',
      required: false,
    }),
    {
      name: 'babylonModel',
      type: 'group',
      fields: [
        {
          name: 'modelName',
          type: 'text',
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
