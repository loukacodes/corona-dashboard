import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../common/Button'
import { SingleCountryData } from './corona-country'
import LineChart, {
  confirmedCasesColor,
  deathCasesColor,
  recoveredCasesColor
} from './LineChart'
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
  const storageID = `country-specific-${selectedCountry}`

  const loadData = useCallback(async () => {
    const response = await fetch(
      `https://api.covid19api.com/dayone/country/${selectedCountry}`,
      {}
    )
    const rawData = (await response.json()) as SingleCountryData[]
    setData(rawData)
    localStorage.setItem(storageID, JSON.stringify(rawData))
  }, [selectedCountry, storageID])

  useEffect(() => {
    const storedData = localStorage.getItem(storageID)
    if (storedData !== null) {
      setData(JSON.parse(storedData))
    }
    loadData()
  }, [loadData, selectedCountry, storageID])

  const handleSelectCountry = async (country: SupportedCountries) => {
    setSelectedCountry(country)
    await loadData()
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

  type TypeOfCase = 'confirmed' | 'death' | 'recovered'
  interface CaseLabelProps {
    typeOfCase: TypeOfCase
  }

  const CaseLabel: React.FC<CaseLabelProps> = ({ typeOfCase }) => {
    const backgroundColor =
      (typeOfCase === 'confirmed' && confirmedCasesColor) ||
      (typeOfCase === 'death' && deathCasesColor) ||
      (typeOfCase === 'recovered' && recoveredCasesColor) ||
      'black'

    const circleStyle = {
      width: '10px',
      height: '10px',
      borderRadius: '100%',
      backgroundColor: backgroundColor,
    }
    return (
      <div>
        <div className={styles.labelWrapper}>
          <div style={circleStyle}></div>
          <div className={styles.label}>{typeOfCase} cases</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <h3>Country specific line chart (real data)</h3>
      <CountrySelection />
      <div className={styles.labels}>
        <CaseLabel typeOfCase="confirmed" />
        <CaseLabel typeOfCase="death" />
        <CaseLabel typeOfCase="recovered" />
      </div>
      <div className={styles.body}>{data && <LineChart data={data} />}</div>
    </div>
  )
}

export default LineChartContainer
