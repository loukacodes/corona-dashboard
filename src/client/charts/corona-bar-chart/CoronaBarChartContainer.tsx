import React, { useState } from 'react'
import useInterval from '../../hooks/useInterval'
import { CoronaCase } from '../../model/corona-case'
import styles from './CoronaBarChartContainer.module.scss'
import CoronaBarChart from './CoronaBarChart'
import mockCoronaData from './mockCoronaData.json'
import Button from '../../common/Button'

const getRandomIncrement = (num: number) => {
  return Math.floor(num * Math.random())
}

const DAYS_IN_YEAR = 365

function CoronaBarChartContainer() {
  const [iteration, setIteration] = useState(0)
  const [start, setStart] = useState(false)
  const [data, setData] = useState<CoronaCase[]>(mockCoronaData)

  const updateData = () => {
    if (start && iteration < DAYS_IN_YEAR) {
      setData(
        data.map((entry, index) => {
          if (
            index === getRandomIncrement(data.length) &&
            iteration % 10 === 0
          ) {
            return {
              ...entry,
              casePerDay: entry.casePerDay + getRandomIncrement(500),
            }
          }
          return {
            ...entry,
            casePerDay: entry.casePerDay + getRandomIncrement(10),
          }
        })
      )
      setIteration(iteration + 1)
    }
  }

  useInterval(updateData, 100)

  const currentMonth = () => {
    switch (true) {
      case iteration < 30:
        return 'April - 2020'
      case iteration > 30 && iteration <= 60:
        return 'May - 2020'
      case iteration >= 60 && iteration <= 90:
        return 'June - 2020'
      case iteration >= 90 && iteration <= 120:
        return 'July - 2020'
      case iteration >= 120 && iteration <= 150:
        return 'August - 2020'
      case iteration >= 150 && iteration <= 180:
        return 'September - 2020'
      case iteration >= 180 && iteration <= 210:
        return 'October - 2020'
      case iteration >= 210 && iteration <= 240:
        return 'November - 2020'
      case iteration >= 240 && iteration <= 270:
        return 'December - 2020'
      case iteration >= 270 && iteration <= 300:
        return 'January - 2021'
      case iteration >= 300 && iteration <= 330:
        return 'February - 2021'
      case iteration >= 330 && iteration <= 360:
        return 'March - 2021'
      default:
        return ''
    }
  }

  const handleReset = () => {
    setData(mockCoronaData)
    setIteration(0)
    setStart(false)
  }

  const toggleStart = () => {
    setStart(!start)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>Corona cases per day during one year since outbreak</h3>
      </div>
      <div className={styles.body}>
        <CoronaBarChart data={data} currentMonth={currentMonth()} />
      </div>
      <div className={styles.footer}>
        <Button onClick={toggleStart}>
          {start ? 'Stop' : 'Start observing'}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  )
}

export default CoronaBarChartContainer
