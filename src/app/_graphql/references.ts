import { MEDIA } from './media'

export const REFERENCES = `
  query References($limit: Int, $sort: String) {
    References(limit: $limit, sort: $sort) {
      docs {
        id
        slug
        title
        references {
          location
          date
          endDate
          pets
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
        references {
          location
          date
          endDate
          pets
          rating
          ${MEDIA}
          review
        }
      }
    }
  }
`
