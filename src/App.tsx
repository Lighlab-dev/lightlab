import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const bentoCards = [
  { title: 'Identity', copy: 'Visual systems for visionary brands.', span: 'md:col-span-1' },
  { title: 'Engineering', copy: 'High-performance headless commerce.', span: 'md:col-span-2' },
  { title: 'Motion', copy: 'Interactive storytelling through code.', span: 'md:col-span-2' },
  { title: 'Scale', copy: 'Data-driven growth architectures.', span: 'md:col-span-1' },
]

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }
    const storedTheme = localStorage.getItem('theme')
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'dark'
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const funnelRef = useRef<HTMLElement>(null)

  const toggleTheme = () => {
    // We toggle the theme state
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')

    // Aesthetic Bonus: Flash animation on toggle
    gsap.fromTo('body',
      { filter: 'brightness(1.5)' },
      { filter: 'brightness(1)', duration: 1, ease: 'power2.out' }
    )
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (!storedTheme) {
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [prefersDark])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme,
      background: {
        default: theme === 'dark' ? '#0b0b0c' : '#f6f4ee',
      },
      text: {
        primary: theme === 'dark' ? '#f4f1ea' : '#1c1b18',
      },
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      h1: { fontFamily: '"Playfair Display", serif' },
      h2: { fontFamily: '"Playfair Display", serif' },
      h3: { fontFamily: '"Playfair Display", serif' },
      h4: { fontFamily: '"Playfair Display", serif' },
    },
  }), [theme])

  useLayoutEffect(() => {
    // 1. Smooth Scroll Setup (Fixes the "jumpy" problem)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const onLenisScroll = () => ScrollTrigger.update()
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    lenis.on('scroll', onLenisScroll)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // 2. Hero Reveal
      gsap.from('.hero-word', {
        yPercent: 110,
        rotateZ: 2,
        duration: 1.8,
        stagger: 0.15,
        ease: 'power4.out',
      })

      // 3. Sticky Stack Logic (Improved pinning)
      const cards = gsap.utils.toArray('.funnel-card') as HTMLElement[]
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 8%',
          pin: true,
          pinSpacing: false,
          endTrigger: funnelRef.current,
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            // Cards scale down slightly as they get covered
            const scale = 1 - (self.progress * 0.05)
            gsap.set(card, { scale: scale })
          }
        })
      })

      // 4. Subtle Parallax for Bento (keep visible if triggers fail)
      ScrollTrigger.batch('.bento-item', {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out' }
          )
        },
        once: true,
      })

      ScrollTrigger.refresh()
    }, wrapperRef)

    return () => {
      ctx.revert()
      gsap.ticker.remove(onTick)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div ref={wrapperRef} data-theme={theme} className="transition-colors duration-700">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-5 bg-[var(--bg)] border-b border-[var(--accent-line)]">
        <span className="text-2xl md:text-3xl font-serif tracking-tight uppercase text-[var(--fg)]">Lightlab.</span>
        <div className="flex items-center gap-10">
          <button 
            onClick={toggleTheme} 
            className="group relative flex items-center gap-3 overflow-hidden border border-[var(--accent-line)] px-5 py-2 rounded-full transition-all hover:border-[var(--fg)]"
          >
            <div className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-orange-400' : 'bg-indigo-400'} animate-pulse`} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--fg)]">
              {theme === 'dark' ? 'Lights On' : 'Lights Off'}
            </span>
          </button>
        </div>
      </nav>

      <main className="pt-24">
        {/* HERO */}
        <section className="min-h-[70vh] flex flex-col justify-end pb-16 px-6 md:px-10">
          <div className="w-full">
            <h1 className="text-[12vw] md:text-[9vw] font-serif leading-[0.8] tracking-tight uppercase">
              <div className="overflow-hidden"><span className="block hero-word">Luminous</span></div>
              <div className="overflow-hidden"><span className="block hero-word italic">Systems.</span></div>
            </h1>
            <div className="flex flex-col md:flex-row justify-between items-start mt-10 pt-8 border-t border-[var(--accent-line)]">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)] mb-4 md:mb-0">Studio ©2026</p>
              <p className="max-w-2xl text-xl md:text-2xl font-light leading-relaxed text-[var(--fg)]">
                We design and deploy digital flagships that outperform the market through <span className="italic">aesthetic authority</span> and technical precision.
              </p>
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="py-24 px-6 bento-grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
            {bentoCards.map((card, i) => (
              <div key={i} className={`bento-item bg-[var(--card-bg)] p-8 md:p-10 min-h-[360px] flex flex-col justify-between group rounded-2xl ${card.span}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">Cap. 0{i+1}</span>
                  <div className="w-9 h-9 border border-[var(--accent-line)] rounded-full flex items-center justify-center group-hover:border-[var(--fg)]">
                    <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-serif mb-4 leading-none tracking-tight italic">{card.title}</h3>
                  <p className="text-sm text-[var(--muted)] max-w-xs group-hover:text-[var(--fg)] transition-colors leading-loose">{card.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STICKY CARDS */}
        <section ref={funnelRef} className="px-6 pb-[12vh]">
          <div className="mb-20">
             <h2 className="text-[7vw] md:text-[5vw] font-serif uppercase tracking-tight opacity-20 text-center italic">The Method</h2>
          </div>
          <div className="flex flex-col gap-[8vh]">
            {['Architecture', 'Interface', 'Deployment'].map((step, i) => (
              <div 
                key={i} 
                className="funnel-card min-h-[60vh] bg-[var(--card-bg)] border border-[var(--accent-line)] rounded-[36px] p-10 md:p-16 flex flex-col justify-between"
              >
                <span className="text-7xl md:text-8xl font-serif opacity-5">0{i+1}</span>
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                  <h4 className="text-[10vw] md:text-[7vw] font-serif leading-none tracking-tight">{step}</h4>
                  <p className="max-w-xs text-sm text-[var(--muted)] pb-4 leading-relaxed">
                    A rigorous process ensuring that every pixel serves a purpose and every line of code drives performance.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="min-h-[50vh] py-24 flex flex-col items-center justify-center border-t border-[var(--accent-line)]">
        <p className="text-[14vw] md:text-[10vw] font-serif opacity-10 tracking-tight select-none">LIGHTLAB</p>
        <button className="mt-4 px-10 py-4 bg-[var(--fg)] text-[var(--bg)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
          Start a Project
        </button>
      </footer>
      </div>
    </ThemeProvider>
  )
}

export default App