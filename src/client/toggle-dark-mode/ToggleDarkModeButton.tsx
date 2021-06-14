import React from 'react'

interface ToggleDarkModeButtonProps {
  handleChangeTheme: (mode: 'light' | 'dark') => void
}
const ToggleDarkModeButton: React.FC<ToggleDarkModeButtonProps> = ({
  handleChangeTheme,
}) => {
  const enableDarkMode = () => {
      handleChangeTheme('dark')
  }
  const enableLightMode = () => {
      handleChangeTheme('light')
  }

  return (
    <div>
      <button onClick={enableDarkMode}>Dark mode</button>
      <button onClick={enableLightMode}>Light mode</button>
    </div>
  )
}

export default ToggleDarkModeButton
