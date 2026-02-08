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

function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f6f4ee',
      },
      text: {
        primary: '#1c1b18',
      },
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
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/method" element={<Method />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App