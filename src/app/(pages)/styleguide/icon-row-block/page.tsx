import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { IconRow } from '../../../../app/_blocks/IconRow'
import { Gutter } from '../../../_components/Gutter'
import { VerticalPadding } from '../../../_components/VerticalPadding'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

// Example data for IconRow
const exampleIconRow = {
  blockType: 'iconRow' as 'iconRow',
  blockName: 'Icon Row',
  introContent: [],
  subheading: 'Example Subheading',
  icons: [
    {
      iconTitle: 'Icon 1',
      media: {
        url: '/path/to/icon1.jpg',
        alt: 'Icon 1',
        id: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
    },
    {
      iconTitle: 'Icon 2',
      media: {
        url: '/path/to/icon2.jpg',
        alt: 'Icon 2',
        id: 1,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
    },
  ],
}

export default function IconRowStyleguide() {
  return (
    <Gutter>
      <VerticalPadding bottom="large" top="none">
        <h1>Icon Row Example</h1>
        <IconRow {...exampleIconRow} />
        <Link href="/styleguide">Back to Styleguide</Link>
      </VerticalPadding>
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Icon Row Styleguide',
  description: 'Showcasing the Icon Row component.',
  openGraph: mergeOpenGraph({
    title: 'Icon Row Styleguide',
    url: '/styleguide/icon-row',
  }),
}
