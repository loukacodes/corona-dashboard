import React from 'react'
import Avatar from '../common/Avatar'
import ToggleDarkModeButton from '../toggle-dark-mode/ToggleDarkModeButton'
import styles from './Navbar.module.scss'

interface NavbarProps {
  handleChangeTheme: (mode: 'light' | 'dark') => void
}
const Navbar: React.FC<NavbarProps> = ({ handleChangeTheme }) => {
  return (
    <nav className={styles.root}>
      <div className={styles.leftSide}>dashboard</div>
      <ToggleDarkModeButton handleChangeTheme={handleChangeTheme}/>
      <div className={styles.rightSide}>
        <Avatar>TT</Avatar>
      </div>
    </nav>
  )
}

export default Navbar
