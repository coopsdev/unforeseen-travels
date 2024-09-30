'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { debounce } from 'lodash'

import { Reference } from '../../../payload/payload-types'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

// Memoized InfoBar component
const InfoBar = React.memo(({ location, rating }: { location: string; rating: number }) => (
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
))

// Memoized Meta component
const Meta = React.memo(
  ({ title, location, rating }: { title: string; location: string; rating: number }) => (
    <>
      <h1 className={classes.title}>{title}</h1>
      <InfoBar location={location} rating={rating} />
    </>
  ),
)

// Memoized MediaComponent
const MediaComponent = React.memo(
  ({ media, isLandscape }: { media: any; isLandscape: boolean }) => {
    if (!media) return <div>Media is undefined</div>

    return (
      <div className={classes.media}>
        {!media && <div className={classes.placeholder}>No image</div>}
        {media && typeof media !== 'string' && (
          <Media
            imgClassName={`${classes.image} ${isLandscape ? classes.landscape : classes.portrait}`}
            resource={media}
            fill
          />
        )}
      </div>
    )
  },
)

export const ReferenceHero: React.FC<{ reference: Reference }> = ({ reference }) => {
  const { title, location, review, media, richText, rating } = reference
  const isMedia = media && typeof media !== 'number'
  const isLandscape = isMedia && media?.width > media?.height

  const Body = () => {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [isBottomReached, setIsBottomReached] = useState(false)
    const reviewRef = useRef<HTMLDivElement>(null)

    // Function to check if content is overflowing
    const checkOverflow = () => {
      const reviewElement = reviewRef.current
      if (reviewElement) {
        setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight)
      }
    }

    // Debounced scroll handler to hide arrow when scrolling down
    const handleScroll = debounce(() => {
      const reviewElement = reviewRef.current
      if (reviewElement) {
        const isAtBottom =
          reviewElement.scrollTop + reviewElement.clientHeight >= reviewElement.scrollHeight
        setIsBottomReached(isAtBottom)
        setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight && !isAtBottom)
      }
    }, 100)

    useEffect(() => {
      const reviewElement = reviewRef.current
      if (!reviewElement) return

      checkOverflow() // Initial check

      reviewElement.addEventListener('scroll', handleScroll)

      window.addEventListener('resize', checkOverflow) // Recheck on window resize

      return () => {
        if (reviewElement) {
          reviewElement.removeEventListener('scroll', handleScroll)
        }
        window.removeEventListener('resize', checkOverflow)
      }
    }, [])

    return (
      <div className={`${classes.body} ${isLandscape ? '' : classes.portraitBody}`}>
        <div className={classes.review} ref={reviewRef}>
          <RichText className={classes.reviewText} content={review} />
          {/* Conditionally render the scroll down arrow if content overflows and not at the bottom */}
          {isOverflowing && !isBottomReached && <div className={classes.scrollDownArrow}>↓</div>}
        </div>
        <MediaComponent media={media} isLandscape={isLandscape} />
      </div>
    )
  }

  return (
    <div className={classes.content}>
      <Meta title={title} location={location} rating={rating} />
      <Body />
    </div>
  )
}
