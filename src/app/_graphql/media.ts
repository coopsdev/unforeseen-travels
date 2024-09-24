export const MEDIA_FIELDS = `
mimeType
filename
width
height
alt
caption
`

export const MEDIA = `media {
  ${MEDIA_FIELDS}
}`

export const INLINE_MEDIA = `inlineMedia {
imageScale
borderRadius
${MEDIA}
}`
