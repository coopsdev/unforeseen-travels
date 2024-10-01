import React from 'react'

import { Page } from '../../../payload/payload-types'
import { CMSLink } from '../../_components/Link'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const HighImpactHero: React.FC<Page['hero']> = ({ richText, media, links }) => {
  if (typeof media === 'number') return <div>Failed to render image...</div>

  return (
    <div
      className={classes.hero}
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_URL}/media/${media.filename})`,
      }}
    >
      <div className={classes.content}>
        <RichText content={richText} />
        {Array.isArray(links) && links.length > 0 && (
          <ul className={classes.links}>
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
        <div className={classes.scrollDownArrow}>↓</div>
      </div>
    </div>
  )
}
