import React from 'react'

import { Gutter } from '../../_components/Gutter'
import RichText from '../../_components/RichText'
import { IconRow, IconRowProps } from '../IconRow'

import classes from './index.module.scss'

export type IconRowContainerProps = {
  blockType?: 'iconRowContainer'
  blockName?: string
  introContent?: any
  mainHeading?: string
  rows?: IconRowProps[]
}

export const IconRowContainer: React.FC<IconRowContainerProps> = (props: IconRowContainerProps) => {
  const { introContent, mainHeading, rows } = props
  return (
    <div className={classes.iconRowContainer}>
      <Gutter>
        {introContent && (
          <Gutter className={classes.introContent}>
            <RichText content={introContent} />
          </Gutter>
        )}
        <h2>{mainHeading}</h2>
        {rows.map((row, index) => (
          <IconRow key={index} subheading={row.subheading} icons={row.icons} />
        ))}
      </Gutter>
    </div>
  )
}
