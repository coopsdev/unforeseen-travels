import type { Page } from '../../../payload/payload-types'

export type ReferenceBlockProps = Extract<Page['layout'][0], { blockType: 'referencesBlock' }>
