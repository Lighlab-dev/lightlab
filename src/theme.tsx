import { createContext, useContext, useState, useEffect } from 'react'

type ThemeMode = 'dark' | 'light'

interface ThemeCtx {
  themeMode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeCtx>({ themeMode: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', themeMode)
    root.classList.toggle('dark', themeMode === 'dark')
    document.body.style.backgroundColor = themeMode === 'dark' ? '#090909' : '#EDE8DF'
    document.body.style.color = themeMode === 'dark' ? '#ffffff' : '#0F0F0F'
    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  const toggleTheme = () => setThemeMode(m => m === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
