import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUp } from 'react-icons/fi'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

function Layout() {
  const mainRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const navLogoRef = useRef<HTMLImageElement>(null)
  const introOverlayRef = useRef<HTMLDivElement>(null)
  const introLogoRef = useRef<HTMLImageElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
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
      const targets = gsap.utils.toArray('.reveal')
      if (!targets.length) return
      gsap.from(targets, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })
    }, mainRef)

    return () => ctx.revert()
  }, [location.pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/') return
    setShowIntro(true)
  }, [location.pathname])

  useLayoutEffect(() => {
    if (!showIntro) return
    const navLogo = navLogoRef.current
    const introLogo = introLogoRef.current
    const overlay = introOverlayRef.current
    if (!navLogo || !introLogo || !overlay) return

    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    const startRect = introLogo.getBoundingClientRect()
    const endRect = navLogo.getBoundingClientRect()
    
    // Calculate center-to-center movement
    const startCenterX = startRect.left + startRect.width / 2
    const startCenterY = startRect.top + startRect.height / 2
    const endCenterX = endRect.left + endRect.width / 2
    const endCenterY = endRect.top + endRect.height / 2
    
    const deltaX = endCenterX - startCenterX
    const deltaY = endCenterY - startCenterY
    const scale = endRect.width / startRect.width

    gsap.set(navLogo, { opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(navLogo, { opacity: 1 })
        setShowIntro(false)
        body.style.overflow = prevOverflow
      },
    })

    tl.set(introLogo, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      clipPath: 'inset(0 100% 0 0)',
      transformOrigin: 'center center',
    })
      .to(introLogo, { duration: 0.7, clipPath: 'inset(0 0% 0 0)', ease: 'power2.out' }, 0)
      .to(introLogo, { duration: 0.9, x: deltaX, y: deltaY, scale, ease: 'power3.inOut' }, 0.8)
      .to(introLogo, { duration: 0.15, opacity: 0, ease: 'power2.out' }, 1.7)
      .to(overlay, { duration: 0.3, opacity: 0, ease: 'power2.out' }, 1.55)

    return () => {
      tl.kill()
      gsap.set(navLogo, { opacity: 1 })
      body.style.overflow = prevOverflow
    }
  }, [showIntro])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('navbar-scrolled')
      } else {
        nav.classList.remove('navbar-scrolled')
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div data-theme="light" className="transition-colors duration-700">
      {showIntro && (
        <div
          ref={introOverlayRef}
          className="fixed inset-0 z-[200] bg-[#f8f7f2] flex items-center justify-center"
        >
          <img
            ref={introLogoRef}
            src="/logo.svg"
            alt="Lightlab"
            className="h-32 sm:h-36 w-auto"
          />
        </div>
      )}
      <nav ref={navRef} id="main-nav" className="fixed top-0 w-full z-[100] transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-5 sm:py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              ref={navLogoRef}
              src="/logo.svg"
              alt="Lightlab"
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 lg:gap-12 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link to="/services" className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:scale-x-0 after:bg-current after:origin-left after:transition-transform hover:after:scale-x-100 transition-opacity">{copy.nav.services}</Link>
            <Link to="/projects" className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:scale-x-0 after:bg-current after:origin-left after:transition-transform hover:after:scale-x-100 transition-opacity">{copy.nav.projects}</Link>
            <Link to="/method" className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:scale-x-0 after:bg-current after:origin-left after:transition-transform hover:after:scale-x-100 transition-opacity">{copy.nav.method}</Link>
            <Link to="/about" className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:scale-x-0 after:bg-current after:origin-left after:transition-transform hover:after:scale-x-100 transition-opacity">{copy.nav.about}</Link>
            <Link to="/contact" className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:scale-x-0 after:bg-current after:origin-left after:transition-transform hover:after:scale-x-100 transition-opacity">{copy.nav.contact}</Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/contact"
              className="hidden sm:block border border-current px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              {copy.nav.cta}
            </Link>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-current text-[10px] uppercase tracking-widest"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[90] bg-[rgba(248,247,242,0.96)] transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="pt-24 px-8 flex flex-col gap-6 text-[14px] uppercase tracking-[0.2em] font-bold">
          <Link to="/services" className="hover:opacity-60 transition-opacity">{copy.nav.services}</Link>
          <Link to="/projects" className="hover:opacity-60 transition-opacity">{copy.nav.projects}</Link>
          <Link to="/method" className="hover:opacity-60 transition-opacity">{copy.nav.method}</Link>
          <Link to="/about" className="hover:opacity-60 transition-opacity">{copy.nav.about}</Link>
          <Link to="/contact" className="hover:opacity-60 transition-opacity">{copy.nav.contact}</Link>
          <Link
            to="/contact"
            className="mt-2 inline-flex border border-current px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-fit"
          >
            {copy.nav.cta}
          </Link>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 z-[110]">
        <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur border border-black/10 shadow-lg p-1">
          <button
            type="button"
            className={`${language === 'fr'
              ? 'bg-black text-white shadow-sm'
              : 'bg-transparent text-black/70 hover:bg-black/5'} rounded-full p-2 transition-all`}
            onClick={() => setLanguage('fr')}
            aria-label="Francais"
          >
            <img src="/flags/fr.svg" alt="FR" className="h-5 w-5" />
          </button>
          <span className="h-4 w-px bg-black/10" />
          <button
            type="button"
            className={`${language === 'en'
              ? 'bg-black text-white shadow-sm'
              : 'bg-transparent text-black/70 hover:bg-black/5'} rounded-full p-2 transition-all`}
            onClick={() => setLanguage('en')}
            aria-label="English"
          >
            <img src="/flags/gb.svg" alt="EN" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`fixed bottom-6 right-6 z-[110] inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 bg-white/90 backdrop-blur shadow-lg transition-all ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <FiArrowUp className="scroll-top-icon text-base" />
      </button>

      <main ref={mainRef} className="pt-0">
        <Outlet />
      </main>

      <footer className="bg-primary/5 py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <div className="mb-8">
                <img
                  src="/logo.svg"
                  alt="Lightlab"
                  className="h-9 sm:h-10 w-auto"
                />
              </div>
              <p className="text-sm opacity-50 max-w-sm leading-relaxed">{copy.footer.summary}</p>
            </div>
            <div className="lg:col-span-3">
              <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-8">{copy.footer.servicesTitle}</span>
              <ul className="space-y-4 text-sm font-medium">
                {copy.footer.services.map((item) => (
                  <li key={item}><Link className="hover:opacity-50 transition-opacity" to="/services">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4">
              <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-8">{copy.footer.contactTitle}</span>
              <div className="space-y-1 mb-12">
                <a className="text-xl font-display hover:opacity-50 transition-opacity" href="mailto:hello@lightlab.dev">{copy.footer.email}</a>
                <p className="text-sm opacity-40">{copy.footer.location}</p>
              </div>
              <Link className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform" to="/contact">
                {copy.footer.cta}
              </Link>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-primary/10 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-30">
            <span>(c) 2024 Lightlab Studio</span>
            <div className="flex gap-8">
              <a className="hover:opacity-100" href="https://www.linkedin.com" target="_blank" rel="noreferrer">Linkedin</a>
              <a className="hover:opacity-100" href="https://x.com" target="_blank" rel="noreferrer">X / Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
