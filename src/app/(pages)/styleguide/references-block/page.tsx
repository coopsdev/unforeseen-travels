import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { ReferencesBlock } from '../../../_blocks/References'
import { Gutter } from '../../../_components/Gutter'
import { VerticalPadding } from '../../../_components/VerticalPadding'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

export default async function ReferencesBlockPage() {
  return (
    <Fragment>
      <Gutter>
        <p>
          <Link href="/styleguide">Styleguide</Link>
          {' / '}
          <span>References Block</span>
        </p>
        <h1>References Block</h1>
      </Gutter>
      <VerticalPadding bottom="large" top="none">
        <ReferencesBlock blockType="referencesBlock" />
      </VerticalPadding>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'References Block',
  description: 'Styleguide for the References Block',
  openGraph: mergeOpenGraph({
    title: 'References Block',
    url: '/styleguide/references-block',
  }),
}
