import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Reference } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { ReferenceHero } from '../../../_heros/ReferenceHero'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Reference({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let reference: Reference | null = null

  try {
    reference = await fetchDoc<Reference>({
      collection: 'references',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!reference) {
    notFound()
  }

  return (
    <React.Fragment>
      <ReferenceHero reference={reference} />
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const references = await fetchDocs<Reference>('references')
    return references?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}
