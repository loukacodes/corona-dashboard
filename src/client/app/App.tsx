import React from 'react'
import CoronaBarChartContainer from '../charts/corona-bar-chart/CoronaBarChartContainer'
import LineChartContainer from '../charts/country-specific-line-chart/LineChartContainer'
import Card from '../common/Card'
import Navbar from '../navbar/Navbar'
import Sidebar from '../sidebar/Sidebar'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.row}>
            <Card extraClassName={styles.racingBarChart}>
              <CoronaBarChartContainer />
            </Card>
            <Card>Under construction</Card>
            <Card>Under construction</Card>
            <Card extraClassName={styles.somethingMore}>Under construction</Card>
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
