import React, { useEffect, useRef, useState } from 'react'
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

  type FetchStatus = 'pending' | 'success' | 'error' | 'idle'

  const [data, setData] = useState<SingleCountryData[] | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountries>(
    SupportedCountries.Vietnam
  )
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')

  const fetchData = useRef(() => {})

  const fetchDataFromSpecificCountry = (country: SupportedCountries) => {
    return fetch(
      `https://api.covid19api.com/dayone/country/${country}`,
      {}
    )
  }

  fetchData.current = () => {
    setFetchStatus('pending')
    const allowedKeys = ['Confirmed', 'Country', 'Deaths', 'Recovered', 'Date']
    fetchDataFromSpecificCountry(selectedCountry).then((res) => {
      return res.json()
    }).then((rawData: any) => {
      if (rawData === undefined) return
      const data = removeKeys<SingleCountryData>(rawData, allowedKeys)
      setData(data)
      setFetchStatus('success')
    })
  }

  useEffect(() => {
    fetchData.current()
  }, [selectedCountry])

  const handleSelectCountry = (country: SupportedCountries) => {
    setSelectedCountry(country)
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

  const chartClassNames = `${
    fetchStatus === 'pending'
      ? styles.showLoadingIndicator
      : styles.hideLoadingIndicator
  } ${styles.chart}`

  return (
    <div className={styles.root}>
      <h3>Country specific line chart (real data)</h3>
      <CountrySelection />
      <div className={styles.body}>
        {fetchStatus === 'idle' && <div>Select a country to view</div>}
        <div className={chartClassNames}>
          <div className={styles.loadingIndicator}></div>
          {data && <LineChart data={data} />}
        </div>
      </div>
    </div>
  )
}

export default LineChartContainer
