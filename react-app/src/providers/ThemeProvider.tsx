import { ConfigProvider, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

//create a provider to manage the theme state and provide it to the rest of the app
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light' // Default to dark mode if no preference is set
  })

  // Keep DOM theme attribute synced so CSS variables can switch palettes.
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')

    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#395E66',
            colorTextBase: isDarkMode ? '#e7ecef' : '#172026',
            colorBgBase: isDarkMode ? '#121619' : '#f3f6f7',
            colorBgContainer: isDarkMode ? '#1b2328' : '#ffffff',
            colorBorder: isDarkMode ? '#304049' : '#d2dde1',
            colorLink: isDarkMode ? '#8fc6d1' : '#245f73',
            colorLinkHover: isDarkMode ? '#b4dce4' : '#163d49',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
