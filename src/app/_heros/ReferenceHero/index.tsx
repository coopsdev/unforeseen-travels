'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { debounce } from 'lodash'

import { Media as MediaType, Reference } from '../../../payload/payload-types'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

interface InfoBarProps {
  location?: string
  rating: number
  date?: string
  endDate?: string
  pets?: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const InfoBar = React.memo((props: InfoBarProps) => {
  const { location, rating, date, endDate, pets } = props

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }
    if (startDate) {
      return formatDate(startDate)
    }
    return ''
  }

  return (
    <div className={classes.infoBar}>
      <div className={classes.row}>
        <div className={classes.infoBarLeft}>
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
        {pets && (
          <h5 className={classes.pets}>
            <span className={classes.petsPrefix}>Pets:</span> {pets}
          </h5>
        )}
        {date && <h5 className={classes.date}>{formatDateRange(date, endDate)}</h5>}
      </div>
    </div>
  )
})

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

  const checkOverflow = () => {
    const reviewElement = reviewRef.current
    if (reviewElement) {
      setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight)
    }
  }

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
  }, [handleScroll])

  return (
    <div className={`${classes.body} ${isLandscape ? '' : classes.portraitBody}`}>
      <div className={classes.review} ref={reviewRef}>
        <RichText className={classes.reviewText} content={review} />
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

  useEffect(() => {
    if (containerRef.current && references.length > 1) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [references])

  const RenderInfoBar = () => <InfoBar {...references[0]} />

  return (
    <div className={classes.referenceHero}>
      <h1 className={classes.title}>{title}</h1>

      {references.length > 1 && (
        <>
          <div className={classes.bridge} style={{ height: `${containerHeight}px` }}></div>
          <div className={classes.references} ref={containerRef}>
            {references.map((ref, index) => (
              <div
                key={index}
                className={`${classes.referenceContainer} ${
                  index !== references.length - 1 ? classes.multiReference : ''
                }`}
              >
                <div className={classes.referenceContent}>
                  <RenderInfoBar />
                  <Body review={ref.review} media={ref.media} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {references.length === 1 && (
        <div className={classes.referenceContainer}>
          <RenderInfoBar />
          <Body review={references[0].review} media={references[0].media} />
        </div>
      )}
    </div>
  )
}
