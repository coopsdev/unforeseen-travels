import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { useFieldType } from 'payload/components/forms'

import classes from './index.module.scss'

const StarRatingField: React.FC = (props: { path: string }) => {
  const {
    value = 0,
    setValue,
    showError,
    errorMessage,
  } = useFieldType({
    path: props.path,
  })

  const handleRating = (rate: number) => {
    setValue(rate)
  }

  return (
    typeof value === 'number' && (
      <div className={classes.starRatingField}>
        <p>Rating</p>
        <Rating
          onClick={handleRating}
          initialValue={value}
          size={48}
          fillColor="gold"
          emptyColor="lightgray"
          allowFraction
        />
        <span>{value} / 5</span>
        {showError && <div className="error-message">{errorMessage}</div>}
      </div>
    )
  )
}

export default StarRatingField
