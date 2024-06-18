'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      light: '#fff177',
      main: '#ffec3e',
      dark: '#e5d437',
      contrastText: '#12',
    },
    secondary: {
      light: '#3b3b3b',
      main: '#262626',
      dark: '#18181b',
      contrastText: '#fff',
    },
  },
})

export default theme
