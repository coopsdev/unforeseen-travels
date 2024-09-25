import React, { Fragment } from 'react'
import { Rating } from 'react-simple-star-rating'

import { Reference } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const ReferenceHero: React.FC<{
  reference: Reference
}> = ({ reference }) => {
  const { id, title, location, review, media, rating } = reference

  return (
    <div className={classes.content}>
      <h1 className={classes.title}>{title}</h1>
      <div className={classes.infoBar}>
        <h5 className={classes.location}>{location}</h5>
        <Rating
          className={classes.rating}
          initialValue={rating}
          fillColor="gold"
          emptyColor="lightgray"
          allowFraction
          allowHover={false}
          size={25}
        />
      </div>
      <div className={classes.body}>
        <p className={classes.review}>{review}</p>
        <div className={classes.media}>
          <div className={classes.mediaWrapper}>
            {!media && <div className={classes.placeholder}>No image</div>}
            {media && typeof media !== 'string' && (
              <Media imgClassName={classes.image} resource={media} fill />
            )}
          </div>
          {media && typeof media !== 'string' && typeof media !== 'number' && media?.caption && (
            <RichText content={media.caption} className={classes.caption} />
          )}
        </div>
      </div>
    </div>
  )
}
