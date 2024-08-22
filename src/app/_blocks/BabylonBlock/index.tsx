import React from 'react'

import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { BabylonModelType } from '../../_components/Media/BabylonScene'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export type BabylonBlockProps = {
  blockType?: 'babylonBlock'
  blockName?: string
  introContent?: any
  babylonModel: BabylonModelType
}

export const BabylonBlock: React.FC<
  BabylonBlockProps & {
    id?: string
  }
> = ({ id, introContent, babylonModel }) => {
  return (
    <Gutter>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <h3>{}</h3>
      <div className={classes.modelViewContainer}>
        <Media resource={babylonModel.media} />
      </div>
    </Gutter>
  )
}
