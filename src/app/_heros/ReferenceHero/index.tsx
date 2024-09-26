import React from 'react'
import { Rating } from 'react-simple-star-rating'

import { Reference } from '../../../payload/payload-types'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const ReferenceHero: React.FC<{
  reference: Reference
}> = ({ reference }) => {
  const { id, title, location, review, media, rating } = reference

  const InfoBar = () => (
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
  )

  const Meta = () => (
    <>
      <h1 className={classes.title}>{title}</h1>
      <InfoBar />
    </>
  )

  const MediaComponent = () => {
    if (!media || typeof media === 'number') return <div>Media is undefined</div>
    const isLandscape = media?.width > media?.height

    return (
      <div className={classes.media}>
        <div className={classes.mediaWrapper}>
          {!media && <div className={classes.placeholder}>No image</div>}
          {media && typeof media !== 'string' && (
            <Media
              imgClassName={`${classes.image} ${isLandscape ? classes.landscape : ''}`}
              resource={media}
              fill
            />
          )}
        </div>
        {media && typeof media !== 'string' && typeof media !== 'number' && media?.caption && (
          <RichText content={media.caption} className={classes.caption} />
        )}
      </div>
    )
  }

  const Body = () => (
    <div className={classes.body}>
      <p className={classes.review}>{review}</p>
      <MediaComponent />
    </div>
  )

  return (
    <div className={classes.content}>
      <Meta />
      <Body />
    </div>
  )
}
