import React, { Fragment } from 'react'

import { BabylonScene } from './BabylonScene'
import { Image } from './Image'
import { Props } from './types'
import { Video } from './Video'

export const Media: React.FC<Props> = props => {
  const { className, resource, htmlElement = 'div' } = props

  const isMedia = (resource: unknown): resource is Record<string, any> =>
    typeof resource === 'object' && resource !== null

  const isVideo = (): boolean => isMedia(resource) && resource.mimeType?.includes('video')
  const isImage = (): boolean => isMedia(resource) && resource.mimeType?.includes('image')
  const isModel = (): boolean =>
    isMedia(resource) &&
    (resource.mimeType?.includes('model') || resource.mimeType?.includes('octet-stream'))

  const Tag = (htmlElement as any) || Fragment

  const MediaRenderer = () => {
    if (isImage()) return <Image {...props} />
    else if (isModel()) return <BabylonScene {...props} />
    else if (isVideo()) return <Video {...props} />
    return (
      <div>
        <p>Unsupported Media Format</p>
        <p>isMedia: {isMedia(resource) ? 'true' : 'false'}</p>
        <p>mimeType: {isMedia(resource) && resource.mimeType ? resource.mimeType : 'Unset'}</p>
      </div>
    )
  }

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      <MediaRenderer />
    </Tag>
  )
}
