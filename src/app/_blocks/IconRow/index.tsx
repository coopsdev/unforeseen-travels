import React from 'react'
import Image from 'next/image'

import { Media as MediaType } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export type Icon = {
  iconTitle: string
  iconImage: {
    url?: string
    media?: MediaType
  }
}

export type IconRowProps = {
  blockType?: 'iconRow'
  blockName?: string
  introContent?: any
  subheading: string
  icons?: Icon[]
}

export const IconRow: React.FC<IconRowProps> = ({ introContent, subheading, icons }) => {
  return (
    <div className={classes.iconRow}>
      <Gutter>
        {introContent && (
          <Gutter className={classes.introContent}>
            <RichText content={introContent} />
          </Gutter>
        )}
        <h3>{subheading}</h3>
        <div className={classes.iconsContainer}>
          {icons.map((icon, index) => (
            <div key={index} className={classes.icon}>
              <Media resource={icon.iconImage.media ?? icon.iconImage.url} />
              <p>{icon.iconTitle}</p>
            </div>
          ))}
        </div>
      </Gutter>
    </div>
  )
}
