import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

export default function ThemeAdmin({ children }) {
  const themeMode = createTheme({
    typography: { fontFamily: 'Inter', color: 'black' },
    palette: {
      cam: {
        main: '#fc7c27',
        contrastText: 'white',
      },
      den: {
        main: 'rgba(0, 0, 0, 0.87)',
        contrastText: 'white',
      },
      error: {
        main: '#FF3333',
        contrastText: 'white',
      },
    },
  })
  return <ThemeProvider theme={themeMode}>{children}</ThemeProvider>
}
