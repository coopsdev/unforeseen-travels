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
  const { title, location, review, media, rating } = reference
  const isMedia = media && typeof media !== 'number'
  const isLandscape = isMedia && media?.width > media?.height

  // Body component now tracks its own review ref and handles its own overflow detection
  const Body = () => {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const reviewRef = useRef<HTMLDivElement>(null)

    // Check if the review content is overflowing
    useEffect(() => {
      const checkOverflow = () => {
        const reviewElement = reviewRef.current
        if (reviewElement) {
          setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight)
        }
      }

      checkOverflow()

      // Optionally, listen to window resize to re-check overflow when the viewport changes
      window.addEventListener('resize', checkOverflow)

      return () => {
        window.removeEventListener('resize', checkOverflow)
      }
    }, [])

    // Debounced scroll handler
    useEffect(() => {
      const reviewElement = reviewRef.current

      const handleScroll = debounce(() => {
        if (reviewElement) {
          // Set threshold for scrollTop > 10 to ensure minor scrolls hide the arrow
          if (reviewElement.scrollTop > 10) {
            setIsOverflowing(false)
          } else {
            setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight)
          }
        }
      }, 100) // Debounce for 100ms

      if (reviewElement) {
        reviewElement.addEventListener('scroll', handleScroll)
      }

      return () => {
        if (reviewElement) {
          reviewElement.removeEventListener('scroll', handleScroll)
        }
      }
    }, [])

    return (
      <div className={`${classes.body} ${isLandscape ? '' : classes.portraitBody}`}>
        <div className={classes.review} ref={reviewRef}>
          <p>{review}</p>
          {/* Conditionally render the scroll down arrow */}
          {isOverflowing && <div className={classes.scrollDownArrow}>↓</div>}
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
