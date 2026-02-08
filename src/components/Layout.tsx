import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

function Layout() {
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const { language, setLanguage, copy } = useLanguage()

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
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

    return () => {
      gsap.ticker.remove(onTick)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!mainRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.reveal', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })
    }, mainRef)

    return () => ctx.revert()
  }, [location.pathname])

  return (
    <div data-theme="light" className="transition-colors duration-700">
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg)] border-b border-[var(--accent-line)]">
        <div className="nav-shell">
          <Link to="/" className="text-2xl md:text-3xl font-serif tracking-tight uppercase text-[var(--fg)]">Lightlab.</Link>
          <div className="flex items-center gap-10">
            <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              <Link to="/services" className="nav-link">{copy.nav.services}</Link>
              <Link to="/projects" className="nav-link">{copy.nav.projects}</Link>
              <Link to="/case-studies" className="nav-link">{copy.nav.caseStudies}</Link>
              <Link to="/about" className="nav-link">{copy.nav.about}</Link>
              <Link to="/contact" className="nav-link">{copy.nav.contact}</Link>
            </div>
            <div className="lang-toggle hidden md:flex">
              <button
                type="button"
                className={language === 'fr' ? 'active' : ''}
                onClick={() => setLanguage('fr')}
                aria-label="Francais"
              >
                <img src="/flags/fr.svg" alt="Francais" width={20} height={14} />
              </button>
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
                aria-label="English"
              >
                <img src="/flags/gb.svg" alt="English" width={20} height={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main ref={mainRef} className="pt-24">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--accent-line)]">
        <div className="footer-shell">
          <div>
            <p className="text-4xl md:text-5xl font-serif tracking-tight">Lightlab.</p>
            <p className="mt-4 text-sm text-[var(--muted)] max-w-md">
              {copy.footer.summary}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.footer.servicesTitle}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {copy.footer.services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.footer.contactTitle}</p>
            <div className="mt-4 text-sm text-[var(--muted)] space-y-2">
              <p>{copy.footer.email}</p>
              <p>{copy.footer.location}</p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex px-8 py-3 bg-[var(--fg)] text-[var(--bg)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {copy.footer.cta}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
