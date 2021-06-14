import classNames from 'classnames'
import React from 'react'
import { useState } from 'react'
import CoronaBarChartContainer from '../charts/corona-bar-chart/CoronaBarChartContainer'
import LineChartContainer from '../charts/country-specific-line-chart/LineChartContainer'
import Button from '../common/Button'
import Card from '../common/Card'
import Navbar from '../navbar/Navbar'
import Sidebar from '../sidebar/Sidebar'
import styles from './App.module.scss'

const App = () => {
  const handleClick = () => {
    // eslint-disable-next-line no-restricted-globals
    return (location.href = 'https://github.com/trangtmtran/corona-dashboard')
  }
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light')
  const handleChangeTheme = (mode: 'light' | 'dark') => {
    console.log(mode)
    setCurrentMode(mode)
  }
  return (
    <div
      className={classNames(styles.root, {
        [styles[`theme-${currentMode}`]]: currentMode,
      })}
    >
      <Navbar handleChangeTheme={handleChangeTheme}/>
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.row}>
            <Card extraClassName={styles.racingBarChart}>
              <CoronaBarChartContainer />
            </Card>
            <Card extraClassName={styles.underConstruction}>
              Under construction
            </Card>
            <Card extraClassName={styles.underConstruction}>
              Under construction
            </Card>
            <Card extraClassName={styles.github}>
              <div>Want to see the source code?</div>
              <Button onClick={handleClick}>Go to github repo</Button>
            </Card>
          </div>
          <div className={styles.row}>
            <Card>Under construction</Card>
            <Card extraClassName={styles.lineChart}>
              <LineChartContainer />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
