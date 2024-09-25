import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { useFieldType } from 'payload/components/forms'

const StarRatingField: React.FC = (props: { path: string }) => {
  const {
    value = 0,
    setValue,
    showError,
    errorMessage,
  } = useFieldType({
    path: props.path,
  })

  // Handle rating click
  const handleRating = (rate: number) => {
    setValue(rate)
  }

  return (
    typeof value === 'number' && (
      <div className="star-rating-field">
        <Rating
          onClick={handleRating}
          initialValue={value}
          size={40}
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
