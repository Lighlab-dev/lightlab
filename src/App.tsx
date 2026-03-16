import { useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './i18n'
import { ThemeProvider, useTheme } from './theme'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import Services from './pages/Services.tsx'
import ServiceDetail from './pages/ServiceDetail.tsx'
import About from './pages/About.tsx'
import Method from './pages/Method.tsx'
import Projects from './pages/Projects.tsx'
import Contact from './pages/Contact.tsx'
import './App.css'

function AppRoutes() {
  const { themeMode } = useTheme()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home themeMode={themeMode} />} />
        <Route path="/services" element={<Services themeMode={themeMode} />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/method" element={<Method themeMode={themeMode} />} />
        <Route path="/about" element={<About themeMode={themeMode} />} />
        <Route path="/projects" element={<Projects themeMode={themeMode} />} />
        <Route path="/contact" element={<Contact themeMode={themeMode} />} />
      </Route>
    </Routes>
  )
}

function App() {
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
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
    <ThemeProvider>
      <LanguageProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MuiThemeProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
