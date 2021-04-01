import React from 'react'
import CoronaBarChartContainer from '../charts/corona-bar-chart/CoronaBarChartContainer'
import styles from './App.module.scss'


function App() {
  return (
    <div className={styles.root}>
      <CoronaBarChartContainer />
    </div>
  )
}

export default App
