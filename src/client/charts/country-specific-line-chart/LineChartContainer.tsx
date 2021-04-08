import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../common/Button'
import { removeKeys } from '../../helpers/removeKeys'
import { SingleCountryData } from './corona-country'
import LineChart from './LineChart'
import styles from './LineChartContainer.module.scss'

const LineChartContainer: React.FC = () => {
  enum SupportedCountries {
    Vietnam = 'vietnam',
    Japan = 'japan',
    Spain = 'spain',
  }

  const [data, setData] = useState<SingleCountryData[] | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountries>(
    SupportedCountries.Vietnam
  )

  const loadData = useCallback(async (selectedCountry) => {
    const allowedKeys = ['Confirmed', 'Country', 'Deaths', 'Recovered', 'Date']
    const response = await fetch(
      `https://api.covid19api.com/dayone/country/${selectedCountry}`,
      {}
    )
    const rawData = await response.json()
    const data = removeKeys<SingleCountryData>(rawData, allowedKeys)
    setData(data)
    setSelectedCountry(selectedCountry)
  }, [])

  useEffect(() => {
    loadData(selectedCountry)
  }, [loadData, selectedCountry])

  const handleSelectCountry = (country: SupportedCountries) => {
    loadData(country)
  }

  const CountrySelection = () => {
    return (
      <div className={styles.radioButtonGroup}>
        {Object.values(SupportedCountries).map((country) => {
          const isSelected = country === selectedCountry
          return (
            <Button
              extraClassName={`${styles.country} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() => handleSelectCountry(country)}
              key={country}
            >
              {country}
            </Button>
          )
        })}
        <div className={`${styles.slider} ${styles[selectedCountry]}`}></div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <h3>Country specific line chart (real data)</h3>
      <CountrySelection />
      <div className={styles.body}>
        {data && <LineChart data={data} />}
      </div>
    </div>
  )
}

export default LineChartContainer
