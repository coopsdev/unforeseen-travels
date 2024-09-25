import {
  ARCHIVE_BLOCK,
  BABYLON_BLOCK,
  CALL_TO_ACTION,
  CONTENT,
  ICON_ROW,
  ICON_ROW_CONTAINER,
  MEDIA_BLOCK,
  REFERENCES_BLOCK,
} from './blocks'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

export const PAGES = `
  query Pages {
    Pages(limit: 300)  {
      docs {
        slug
      }
    }
  }
`

export const PAGE = `
  query Page($slug: String, $draft: Boolean) {
    Pages(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${ICON_ROW}
          ${ICON_ROW_CONTAINER}
          ${BABYLON_BLOCK}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
          ${REFERENCES_BLOCK}
        }
        ${META}
      }
    }
  }
`
