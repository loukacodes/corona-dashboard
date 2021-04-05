import classNames from 'classnames'
import React, { ReactNode } from 'react'

import styles from './Avatar.module.scss'

interface AvatarProps {
  children: ReactNode
  extraClassName?: string
}

const Avatar: React.FC<AvatarProps> = ({ children, extraClassName }) => {
  return (
    <div className={classNames(styles.circleStyle, extraClassName)}>
      {children}
    </div>
  )
}

export default Avatar
