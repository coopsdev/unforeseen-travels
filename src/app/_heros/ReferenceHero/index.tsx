'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { debounce } from 'lodash'

import { Media as MediaType, Reference } from '../../../payload/payload-types'
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
      readonly={true}
      size={25}
    />
  </div>
))

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

const Body: React.FC<{ media: MediaType | number; review: any }> = ({ media, review }) => {
  const isMedia = media && typeof media !== 'number'
  const isLandscape = isMedia && media?.width > media?.height
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

export const ReferenceHero: React.FC<{ reference: Reference }> = ({
  reference: { title, references },
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  // Calculate height of the reference section to adjust the bridge length
  useEffect(() => {
    if (containerRef.current && references.length > 1) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [references])

  return (
    <div className={classes.referenceHero}>
      <h1 className={classes.title}>{title}</h1>

      {/* Conditionally render the references and bridge only if more than one reference */}
      {references.length > 1 && (
        <>
          <div className={classes.bridge} style={{ height: `${containerHeight}px` }}></div>
          <div className={`${classes.references} ${classes.multiReference}`} ref={containerRef}>
            {references.map((ref, index) => (
              <div key={index} className={classes.referenceContainer}>
                <div className={classes.referenceContent}>
                  <InfoBar location={ref.location} rating={ref.rating} />
                  <Body review={ref.review} media={ref.media} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* If only one reference, no bridge or special alignment */}
      {references.length === 1 && (
        <div className={classes.referenceContainer}>
          <InfoBar location={references[0].location} rating={references[0].rating} />
          <Body review={references[0].review} media={references[0].media} />
        </div>
      )}
    </div>
  )
}
