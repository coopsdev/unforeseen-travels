'use client'

import React from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderSocial: React.FC<{ header: HeaderType }> = ({ header }) => {
  const socialItems = header?.socialIcons || []

  const fetchSocialIcon = (key: string) => {
    if (key === 'github') return faGithub
    throw Error('Unknown icon: ' + key)
  }

  return (
    <div className={classes.socialIcons}>
      {socialItems.map(({ link, faIcon }, i) => {
        return (
          <CMSLink
            className={classes.socialIcon}
            key={i}
            {...link}
            faIcon={fetchSocialIcon(faIcon)}
          />
        )
      })}
    </div>
  )
}
