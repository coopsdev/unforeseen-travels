import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = props => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, richText, link, size, useImage, inlineMedia } = col

            if (useImage && !inlineMedia) return <div>Improper image config...</div>

            const { imageScale, borderRadius, media } = inlineMedia

            return (
              <div key={index} className={[classes.column, classes[`column--${size}`]].join(' ')}>
                <RichText content={richText} />
                {useImage && (
                  <>
                    <div
                      className={classes.columnImageContainer}
                      style={{
                        width: `${imageScale}%`,
                        borderRadius: `${borderRadius ?? 0}%`,
                      }}
                    >
                      <Media resource={media} />
                    </div>
                  </>
                )}
                {enableLink && <CMSLink className={classes.link} {...link} />}
              </div>
            )
          })}
      </div>
    </Gutter>
  )
}
