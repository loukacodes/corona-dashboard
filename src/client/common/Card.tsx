import React, { ReactNode } from 'react'
import styles from './Card.module.scss'

interface CardProps {
  children: ReactNode
  extraClassName?: string
}

const Card: React.FC<CardProps> = ({ children, extraClassName }) => {
  return <div className={`${styles.root} ${extraClassName}`}>{children}</div>
}

export default Card
