import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { BabylonBlock } from '../../../_blocks/BabylonBlock'
import { Gutter } from '../../../_components/Gutter'
import { VerticalPadding } from '../../../_components/VerticalPadding'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

const exampleModel = {
  blockType: 'babylonBlock' as 'babylonBlock',
  blockName: 'Babylon Block',
  introContent: [],
  babylonModel: {
    modelName: 'Example',
    media: {
      url: '/path/to/model.glb',
      alt: '3D Model',
      id: 0,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    },
    mimeType: 'model/gltf-binary' as 'model/gltf-binary',
  },
}

export default function BabylonBlockStyleguide() {
  return (
    <Gutter>
      <VerticalPadding bottom="large" top="none">
        <h1>Babylon Block Example</h1>
        <BabylonBlock {...exampleModel} />
        <Link href="/styleguide">Back to Styleguide</Link>
      </VerticalPadding>
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Babylon Block Styleguide',
  description: 'Showcasing the Babylon Block component.',
  openGraph: mergeOpenGraph({
    title: 'Babylon Block Styleguide',
    url: '/styleguide/babylon-block',
  }),
}
