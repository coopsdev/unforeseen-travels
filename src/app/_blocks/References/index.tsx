'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { Gutter } from '../../_components/Gutter'
import { REFERENCES } from '../../_graphql/references'
import { ReferenceHero } from '../../_heros/ReferenceHero'

import classes from './index.module.scss'

const calculateExtremeDate = references => {
  if (!references || references.length === 0) return null

  // Flatten all dates from reviews (both date and endDate)
  const dates = references
    .flatMap(ref => [ref.date, ref.endDate].filter(Boolean)) // Remove null/undefined values
    .map(dateString => new Date(dateString)) // Convert to Date objects
    .filter(date => !isNaN(date.getTime())) // Filter out invalid dates

  if (dates.length === 0) return null

  // Return the oldest date for sorting purposes (regardless of the sort order)
  return new Date(Math.min(...dates.map(date => date.getTime())))
}

export const ReferencesBlock: React.FC<{ id?: string; blockType?: 'referencesBlock' }> = ({
  id,
}) => {
  const [references, setReferences] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')

  useEffect(() => {
    const fetchReferences = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const variables = { limit: 500 }
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: REFERENCES,
            variables,
          }),
        })

        const result = await response.json()

        if (result.errors) throw new Error('Failed to fetch references')

        const fetchedReferences = result.data.References.docs.map(reference => ({
          ...reference,
          extremeDate: calculateExtremeDate(reference.references), // Precalculate the extreme date
        }))

        setReferences(fetchedReferences)
      } catch (err) {
        setError('Failed to load references.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferences()
  }, []) // Run only once on mount

  // Sort references based on the selected sort order
  const sortedReferences = useMemo(() => {
    return [...references].sort((a, b) => {
      const aDate = a.extremeDate
      const bDate = b.extremeDate

      if (!aDate && !bDate) return 0
      if (!aDate) return sortOrder === 'ascending' ? 1 : -1
      if (!bDate) return sortOrder === 'ascending' ? -1 : 1

      return sortOrder === 'ascending'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    })
  }, [references, sortOrder])

  if (isLoading) {
    return <Gutter>Loading...</Gutter>
  }

  if (error) {
    return <Gutter>{error}</Gutter>
  }

  return (
    <div id={`block-${id}`} className={classes.archiveBlock}>
      <Gutter>
        <div className={classes.sortSelector}>
          <label htmlFor="sortOrder">Sort by:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'ascending' | 'descending')}
          >
            <option value="ascending">Oldest First</option>
            <option value="descending">Newest First</option>
          </select>
        </div>

        <div className={classes.grid}>
          {sortedReferences.map((reference, index) => (
            <ReferenceHero key={index} reference={reference} />
          ))}
        </div>
      </Gutter>
    </div>
  )
}
