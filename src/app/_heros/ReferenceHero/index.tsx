'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'

import { Reference } from '../../../payload/payload-types'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const ReferenceHero: React.FC<{
  reference: Reference
}> = ({ reference }) => {
  const { title, location, review, media, rating } = reference

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

    // Hide the arrow when scrolled
    useEffect(() => {
      const reviewElement = reviewRef.current

      const handleScroll = () => {
        if (reviewElement) {
          // Set threshold for scrollTop > 0 to ensure minor scrolls hide the arrow
          if (reviewElement.scrollTop > 10) {
            setIsOverflowing(false)
          } else {
            setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight)
          }
        }
      }

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
      <div className={classes.body}>
        {/* Add the ref here to detect overflow */}
        <div className={classes.review} ref={reviewRef}>
          <p>{review}</p>
          {/* Conditionally render the scroll down arrow */}
          {isOverflowing && <div className={classes.scrollDownArrow}>↓</div>}
        </div>
        <MediaComponent />
      </div>
    )
  }

  return (
    <div className={classes.content}>
      <Meta />
      <Body />
    </div>
  )
}
