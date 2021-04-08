import React from 'react'
import styles from './LoadingCircle.module.scss'

const LoadingCircle: React.FC = () => (
  <div className={styles.loadingCircle}>
    <svg
      className={styles.loading}
      x="0px"
      y="0px"
      viewBox="0 0 150 150"
    >
      <circle className={styles.loadingCircle} cx="75" cy="75" r="60" />
    </svg>
  </div>
)

export default LoadingCircle
