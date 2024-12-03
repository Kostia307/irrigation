import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ThemeContextProvider from './pages/ThemeContext.jsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useTheme } from '@emotion/react'

function Root() {
  const theme = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <Root />
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
