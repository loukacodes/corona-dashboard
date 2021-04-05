import React from 'react'
import Avatar from '../common/Avatar'
import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <nav className={styles.root}>
      <div className={styles.leftSide}>dashboard</div>
      <div className={styles.rightSide}>
        <Avatar>TT</Avatar>
      </div>
    </nav>
  )
}

export default Navbar
