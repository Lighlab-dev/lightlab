import { useEffect, useMemo } from 'react'
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

const THEME_MODE = 'dark' as const

function App() {
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', THEME_MODE)
    root.classList.add('dark')
    localStorage.setItem('theme', THEME_MODE)
  }, [])

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: THEME_MODE,
      background: { default: '#090909' },
      text: { primary: '#f1efe7' },
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      h1: { fontFamily: '"Playfair Display", serif' },
      h2: { fontFamily: '"Playfair Display", serif' },
      h3: { fontFamily: '"Playfair Display", serif' },
      h4: { fontFamily: '"Playfair Display", serif' },
    },
  }), [])

  return (
    <LanguageProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home themeMode={THEME_MODE} />} />
              <Route path="/services" element={<Services themeMode={THEME_MODE} />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/method" element={<Method themeMode={THEME_MODE} />} />
              <Route path="/about" element={<About themeMode={THEME_MODE} />} />
              <Route path="/projects" element={<Projects themeMode={THEME_MODE} />} />
              <Route path="/contact" element={<Contact themeMode={THEME_MODE} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App