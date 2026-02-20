import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './i18n'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import Services from './pages/Services.tsx'
import ServiceDetail from './pages/ServiceDetail.tsx'
import About from './pages/About.tsx'
import Method from './pages/Method.tsx'
import Projects from './pages/Projects.tsx'
import Contact from './pages/Contact.tsx'
import './App.css'

function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' || stored === 'light' ? stored : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', themeMode)
    root.classList.toggle('dark', themeMode === 'dark')
    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  const handleToggleTheme = useCallback(() => {
    setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark'))
  }, [])

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      background: {
        default: themeMode === 'dark' ? '#070603' : '#f6f4ee',
      },
      text: {
        primary: themeMode === 'dark' ? '#f1efe7' : '#1c1b18',
      },
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      h1: { fontFamily: '"Playfair Display", serif' },
      h2: { fontFamily: '"Playfair Display", serif' },
      h3: { fontFamily: '"Playfair Display", serif' },
      h4: { fontFamily: '"Playfair Display", serif' },
    },
  }), [themeMode])

  return (
    <LanguageProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              element={(
                <Layout
                  themeMode={themeMode}
                  onToggleTheme={handleToggleTheme}
                />
              )}
            >
              <Route path="/" element={<Home themeMode={themeMode} />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/method" element={<Method themeMode={themeMode} />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects themeMode={themeMode} />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App