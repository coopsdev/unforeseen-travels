'use client'

import React, { useEffect, useState } from 'react'

import { Reference } from '../../../payload/payload-types'
import { fetchDocs } from '../../_api/fetchDocs'
import { Gutter } from '../../_components/Gutter'
import { ReferenceHero } from '../../_heros/ReferenceHero'
import type { ReferenceBlockProps } from './types'

import classes from './index.module.scss'

export const ReferencesBlock: React.FC<ReferenceBlockProps & { id?: string }> = props => {
  const { id } = props

  const [references, setReferences] = useState<Reference[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch references on mount
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const fetchedReferences = await fetchDocs<Reference>('references')
        setReferences(fetchedReferences)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load references.')
        setIsLoading(false)
      }
    }

    fetchReferences()
  }, [])

  if (isLoading) {
    return <Gutter>Loading...</Gutter>
  }

  if (error) {
    return <Gutter>{error}</Gutter>
  }

  return (
    <div id={`block-${id}`} className={classes.archiveBlock}>
      <Gutter>
        <div className={classes.grid}>
          {references.map((reference, index) => (
            <ReferenceHero key={index} reference={reference} />
          ))}
        </div>
      </Gutter>
    </div>
  )
}
