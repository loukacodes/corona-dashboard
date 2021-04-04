import React, { ReactNode } from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  extraClassName?: string
}
const Button: React.FC<ButtonProps> = ({ children, onClick, extraClassName }) => {
  return (
    <button className={`${styles.root} ${extraClassName}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
