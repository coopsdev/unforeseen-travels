import { MEDIA } from './media'

export const REFERENCES = `
  query References {
    References(limit: 500) {
      docs {
        slug
        id
        title
        location
        rating
        ${MEDIA}
        review
        references {
          location
          date
          rating
          ${MEDIA}
          review
        }
      }
    }
  }
`

export const REFERENCE = `
  query Reference($slug: String, $draft: Boolean) {
    References(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        location
        rating
        ${MEDIA}
        review
      }
    }
  }
`
