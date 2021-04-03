import React from 'react'
import CoronaBarChartContainer from '../charts/corona-bar-chart/CoronaBarChartContainer'
import LineChartContainer from '../charts/country-specific-line-chart/LineChartContainer'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.root}>
      <CoronaBarChartContainer />
      <LineChartContainer />
    </div>
  )
}

export default App
