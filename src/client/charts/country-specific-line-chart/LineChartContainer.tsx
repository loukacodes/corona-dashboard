import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { SingleCountryData } from './corona-country'
import LineChart from './LineChart'
import styles from './LineChartContainer.module.scss'

const LineChartContainer: React.FC = () => {
  type SupportedCountries = 'vietnam' | 'japan' | 'spain' | 'hungary'
  const [data, setData] = useState<SingleCountryData[]>()
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountries>('vietnam')

  useEffect(() => {
    loadData()
  }, [selectedCountry])

  const loadData = async () => {
    const response = await fetch(
      `https://api.covid19api.com/dayone/country/${selectedCountry}`, {
        // mode: 'no-cors'
      }
    )
    const rawData = (await response.json()) as SingleCountryData[]
    setData(rawData)
  }

  const handleSelectCountry = (event: any) => {
    setSelectedCountry(event.target.value)
    loadData()
  }

  return (
    <div className={styles.root}>
      <h3>Country specific line chart</h3>
      <select value={selectedCountry} onChange={handleSelectCountry}>
        <option value='vietnam'>Vietnam</option>
        <option value='japan'>Japan</option>
        <option value='spain'>Spain</option>
        <option value='hungary'>Hungary</option>
      </select>
      <div className={styles.body}>{data && <LineChart data={data} />}</div>
    </div>
  )
}

export default LineChartContainer
