import { useLayoutEffect, useRef, useMemo, memo, useState, createContext, useContext, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  MagneticButton,
  TextReveal,
  SplitText,
  CinematicImage,
  ANIMATION,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

type Theme = 'dark' | 'light'
type Copy = ReturnType<typeof useLanguage>['copy']

interface ThemeContextValue { theme: Theme }
const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' })

interface HomeProps { themeMode: Theme }

// Light mode palette (used as plain strings for clarity)
// bg:       #eeeae0  (warm parchment)
// card:     #ffffff  (pure white elevated)
// ink:      #18160f  (warm near-black)
// stone:    #56514a  (secondary body)
// muted:    #8c8780  (labels, captions)
// border:   #d9d5ca  (visible warm separator)
// faint:    #ece8dd  (subtle card bg)

const LT = {
  bg:       'bg-[#eeeae0]',
  text:     'text-[#18160f]',
  stone:    'text-[#56514a]',
  muted:    'text-[#8c8780]',
  border:   'border-[#d9d5ca]',
  divideX:  'divide-[#d9d5ca]',
  cardBg:   'bg-white',
  faint:    'bg-[#e8e4d9]',
  watermark:'text-[#d0ccbf]',
}

const DK = {
  bg:       'bg-[#080807]',
  text:     'text-white',
  stone:    'text-white/50',
  muted:    'text-white/25',
  border:   'border-white/[0.07]',
  divideX:  'divide-white/[0.06]',
  cardBg:   'bg-white/[0.03]',
  faint:    'bg-white/[0.015]',
  watermark:'text-white/[0.025]',
}

//  Image constants 
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
  services: [
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=85',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=85',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85',
  ],
  method: [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=700&q=80',
  ],
}

//  Service Row (accordion) 
interface ServiceRowItem { title: string; copy: string; result?: string }
interface ServiceRowProps { item: ServiceRowItem; index: number; copy: Copy; isArabic: boolean }

const ServiceRow = memo(({ item, index, copy, isArabic }: ServiceRowProps) => {
  const [open, setOpen] = useState(false)
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  return (
    <div
      className={`group cursor-pointer transition-colors duration-300 border-b
        ${isDark
          ? 'border-white/[0.07] hover:border-white/20'
          : 'border-[#d9d5ca] hover:border-[#56514a]'}`}
      onClick={() => setOpen(v => !v)}
    >
      {/* Header */}
      <div className={`flex items-center justify-between py-8 md:py-10 gap-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-6 md:gap-10 min-w-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] font-mono tracking-[0.35em] tabular-nums shrink-0
            ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>
            0{index + 1}
          </span>
          <h3 className={`text-2xl md:text-3xl lg:text-4xl font-display font-light leading-none truncate transition-colors duration-300
            ${isDark ? 'text-white/85 group-hover:text-white' : 'text-[#18160f] group-hover:text-black'}`}>
            {item.title}
          </h3>
        </div>

        <div className={`flex items-center gap-4 shrink-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {item.result && (
            <span className={`hidden md:block text-[10px] font-semibold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border
              ${isDark ? 'border-white/10 text-white/35' : 'border-[#d9d5ca] text-[#56514a] bg-white'}`}>
              {item.result}
            </span>
          )}
          <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500
            ${open ? 'rotate-45' : 'rotate-0'}
            ${isDark ? 'border-white/15 group-hover:border-white/30' : 'border-[#d9d5ca] bg-white group-hover:border-[#18160f]'}`}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="5.5" y1="0" x2="5.5" y2="11" strokeWidth="1"
                stroke={isDark ? 'rgba(255,255,255,0.6)' : '#56514a'}/>
              <line x1="0" y1="5.5" x2="11" y2="5.5" strokeWidth="1"
                stroke={isDark ? 'rgba(255,255,255,0.6)' : '#56514a'}/>
            </svg>
          </div>
        </div>
      </div>

      {/* Accordion panel */}
      <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden
        ${open ? 'grid-rows-[1fr] pb-12' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden min-h-0">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 pt-2 ${isArabic ? 'text-right' : ''}`}>
            <div>
              <p className={`text-base leading-relaxed font-light mb-8 max-w-md
                ${isDark ? 'text-white/50' : 'text-[#56514a]'}`}>
                {item.copy}
              </p>
              <MagneticButton href="#contact" variant="outline" isDark={isDark}
                className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase ${isArabic ? 'flex-row-reverse' : ''}`}>
                {copy.home.servicesCta}
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1 4h12M8 1l3 3-3 3" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MagneticButton>
            </div>
            <div className={`aspect-[16/9] overflow-hidden rounded-xl shadow-sm
              ${isDark ? 'bg-white/5' : 'bg-[#e8e4d9]'}`}>
              <CinematicImage src={IMAGES.services[index]} alt={item.title} className="w-full h-full"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

//  Process step card 
interface ProcessStepProps { title: string; copy: string; number: string; isDark: boolean; isArabic: boolean }

const ProcessStep = memo(({ title, copy, number, isDark, isArabic }: ProcessStepProps) => {
  return (
    <div className={`group relative h-full flex flex-col pt-10 border-t
      ${isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'}
      ${isArabic ? 'text-right' : ''}`}>
      <span className={`block text-[10px] font-mono tracking-[0.4em] uppercase mb-6
        ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>{number}</span>
      <h4 className={`text-xl md:text-2xl font-display font-light mb-4 transition-colors duration-300
        ${isDark ? 'text-white/85 group-hover:text-white' : 'text-[#18160f] group-hover:text-black'}`}>{title}</h4>
      <p className={`flex-1 text-sm leading-relaxed font-light
        ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>{copy}</p>
      <div className={`absolute -top-3 ${isArabic ? 'left-0' : 'right-0'} text-[90px] font-display font-bold leading-none select-none pointer-events-none
        ${isDark ? 'text-white/[0.025]' : 'text-[#d0ccbf]'}`}>
        {number.split('/')[0].trim()}
      </div>
    </div>
  )
})

//  Stat Card 
interface StatCardProps { label: string; value: string; isDark: boolean }

const StatCard = memo(({ label, value, isDark }: StatCardProps) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center text-center px-8 py-10 group rounded-2xl transition-all duration-300
      ${isDark ? 'hover:bg-white/[0.03]' : 'bg-white shadow-sm hover:shadow-md border border-[#e8e4d9]'}`}>
      <div className={`text-[10px] uppercase tracking-[0.4em] font-bold mb-4
        ${isDark ? 'text-white/28' : 'text-[#8c8780]'}`}>{label}</div>
      <div className={`text-6xl md:text-7xl font-display font-light transition-transform duration-500 group-hover:scale-105
        ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>{value}</div>
    </div>
  )
})

//  Testimonial Card 
interface TestimonialCardProps { quote: string; name: string; role: string; isDark: boolean; isArabic: boolean }

const TestimonialCard = memo(({ quote, name, role, isDark, isArabic }: TestimonialCardProps) => {
  return (
    <div className={`h-full flex flex-col p-8 md:p-10 rounded-2xl border transition-all duration-500
      ${isDark
        ? 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
        : 'border-[#e8e4d9] bg-white shadow-sm hover:shadow-md'}
      ${isArabic ? 'text-right' : ''}`}>
      <div className={`text-5xl font-display leading-none mb-6
        ${isDark ? 'text-white/12' : 'text-[#d0ccbf]'}`}>&ldquo;</div>
      <p className={`flex-1 text-base md:text-lg font-light leading-relaxed mb-8
        ${isDark ? 'text-white/65' : 'text-[#18160f]'}`}>{quote}</p>
      <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold
          ${isDark ? 'border-white/18 bg-white/5 text-white/50' : 'border-[#d9d5ca] bg-[#eeeae0] text-[#56514a]'}`}>{name[0]}</div>
        <div>
          <div className={`text-sm font-semibold tracking-wide
            ${isDark ? 'text-white/75' : 'text-[#18160f]'}`}>{name}</div>
          <div className={`text-[11px] font-light
            ${isDark ? 'text-white/30' : 'text-[#8c8780]'}`}>{role}</div>
        </div>
      </div>
    </div>
  )
})

//  Lazy section reveal 
interface LazySectionProps { children: ReactNode; className?: string; id?: string }

const LazySection = memo(({ children, className = '', id }: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.02 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={`will-change-[opacity,transform] transition-[opacity,transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  )
})

//  Home 
function Home({ themeMode }: HomeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)

  useLayoutEffect(() => {
    let rafId: number
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(total > 0 ? window.scrollY / total : 0)
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafId) }
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.45, ease: ANIMATION.ease.luxury })
        .from('.hero-line', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: ANIMATION.ease.luxury }, '-=0.18')
        .from('.hero-body', { y: 16, opacity: 0, duration: 0.45, ease: ANIMATION.ease.smooth }, '-=0.32')
        .from('.hero-cta', { y: 12, opacity: 0, duration: 0.38, ease: ANIMATION.ease.smooth }, '-=0.24')
        .from('.hero-image-wrap', { scale: 1.04, opacity: 0, duration: 0.9, ease: ANIMATION.ease.luxury }, '-=0.8')

      gsap.to('.hero-image-wrap', {
        yPercent: 10, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.9 }
      })
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  const isDark = themeMode === 'dark'
  const P = isDark ? DK : LT

  const dir = useMemo(() => ({
    text: isArabic ? 'text-right' : 'text-left',
    flex: isArabic ? 'flex-row-reverse' : 'flex-row',
  }), [isArabic])

  const testimonials: Array<{ quote: string; name: string; role: string }> =
    (copy.home as Record<string, unknown>).testimonials as Array<{ quote: string; name: string; role: string }> ?? []

  return (
    <ThemeContext.Provider value={{ theme: themeMode }}>
      <div
        ref={wrapperRef}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${P.bg} ${P.text}`}
      >
        {/* Scroll progress */}
        <div
          className={`fixed top-0 h-[1.5px] z-[100] transition-none
            ${isArabic ? 'right-0' : 'left-0'}
            ${isDark ? 'bg-white/50' : 'bg-[#18160f]'}`}
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* ambient bg removed for perf */}

        {/* ---------------- HERO ---------------- */}

        <section ref={heroRef} className="relative min-h-screen flex items-end">
          <div className="absolute inset-0">
            <CinematicImage src={IMAGES.hero} alt="Hero" className="w-full h-full" priority />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className={`relative z-10 max-w-6xl px-8 pb-28 ${dir.text}`}>
            <h1 className="font-display font-light leading-[0.9] text-[clamp(3.5rem,8vw,8rem)] text-white mb-10">
              <span className="hero-line block">{copy.home.heroTitle1}</span>
              <span className="hero-line block italic text-white/70">
                {copy.home.heroTitle2}
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-lg mb-10">
              {copy.home.heroCopy}
            </p>

            <MagneticButton
              href="#contact"
              variant="primary"
              isDark
              className="px-10 py-4 rounded-full text-[12px] tracking-[0.25em] uppercase font-bold"
            >
              {copy.home.ctaButton}
            </MagneticButton>
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          {/*  TICKER  */}
          <LazySection>
            <div className={`py-6 border-y overflow-hidden ${P.border}`}>
              <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className={`text-[10px] font-bold tracking-[0.45em] uppercase shrink-0 ${P.muted}`}>
                    AI Automation &nbsp;&nbsp; Engineering &nbsp;&nbsp; Media Buying &nbsp;&nbsp; Revenue Scaling &nbsp;&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </LazySection>

          {/*  IMPACT STATS  */}
          <LazySection>
            <section className={`py-24 border-b ${P.border}`}>
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch`}>
                {copy.home.impactStats.map((stat, i) => (
                  <StatCard key={i} label={stat.label} value={stat.value} isDark={isDark} />
                ))}
              </div>
            </section>
          </LazySection>

          {/*  ABOUT  */}
          <LazySection>
          <section className={`py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end border-b ${P.border} ${dir.text}`}>
            <div>
              <TextReveal>
                <span className={`text-[11px] font-bold tracking-[0.4em] uppercase block mb-8 ${P.muted}`}>
                  {copy.home.expertiseLabel}
                </span>
              </TextReveal>
              <SplitText
                text={copy.home.expertiseTitle}
                className={`text-5xl md:text-6xl lg:text-7xl font-display font-light leading-none overflow-visible
                  ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                type="words"
              />
            </div>
            <TextReveal delay={0.15}>
              <p className={`text-base md:text-lg leading-relaxed font-light max-w-lg ${P.stone}`}>
                {copy.home.expertiseCopy}
              </p>
            </TextReveal>
          </section>
          </LazySection>

          {/*  CLARITY / PHILOSOPHY  */}
          <LazySection>
          <section className="pb-32">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch ${dir.text}`}>
              {copy.home.clarity.map((item, index) => (
                <div
                  key={item.title}
                  className={`group relative h-full flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 cursor-default
                    ${isDark
                      ? 'border-white/[0.07] bg-white/[0.025] hover:border-white/[0.18] hover:bg-white/[0.045] hover:-translate-y-1'
                      : 'bg-white border-[#e8e4d9] shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
                >
                  {/* Top accent bar */}
                  <div className={`h-[2px] w-full shrink-0 transition-all duration-500
                    ${isDark
                      ? 'bg-gradient-to-r from-white/5 via-white/20 to-white/5 group-hover:via-white/40'
                      : 'bg-gradient-to-r from-[#d9d5ca] via-[#18160f]/30 to-[#d9d5ca] group-hover:via-[#18160f]/60'}`}
                  />

                  <div className="flex flex-col flex-1 p-8 md:p-10">
                    {/* Index + eyebrow row */}
                    <div className={`flex items-center justify-between mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-[9px] font-bold tracking-[0.4em] uppercase
                        ${P.muted}`}>{item.title}</span>
                      <span className={`text-[11px] font-mono tabular-nums
                        ${isDark ? 'text-white/15' : 'text-[#c8c4b8]'}`}>0{index + 1}</span>
                    </div>

                    {/* Headline */}
                    <h4 className={`text-2xl md:text-[1.6rem] font-display font-light leading-snug mb-5 transition-colors duration-300
                      ${isDark ? 'text-white/85 group-hover:text-white' : 'text-[#18160f]'}`}>
                      {item.lead}
                    </h4>

                    {/* Divider line that expands on hover */}
                    <div className={`w-8 h-px mb-6 transition-all duration-500 group-hover:w-14
                      ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />

                    {/* Body */}
                    <p className={`flex-1 text-sm leading-relaxed font-light mb-8
                      ${isDark ? 'text-white/42 group-hover:text-white/58' : 'text-[#56514a]'}`}>
                      {item.copy}
                    </p>

                    {/* Bottom arrow */}
                    <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300
                      ${isDark ? 'text-white/20 group-hover:text-white/55' : 'text-[#8c8780] group-hover:text-[#18160f]'}
                      ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span>{isArabic ? 'اكتشف' : 'Explore'}</span>
                      <svg
                        width="16" height="9" viewBox="0 0 16 9" fill="none"
                        className={`transition-transform duration-500 ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}
                      >
                        <path d="M1 4.5h14M9 1.5l4 3-4 3" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </LazySection>

          {/*  SERVICES  */}
          <LazySection>
          <section className={`pt-4 pb-10 border-t ${P.border}`}>
            <div className={`flex items-end justify-between gap-8 mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={dir.text}>
                <TextReveal>
                  <span className={`text-[11px] font-bold tracking-[0.4em] uppercase block mb-6 ${P.muted}`}>{copy.home.coreLabel}</span>
                </TextReveal>
                <SplitText
                  text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                  className={`text-4xl md:text-5xl lg:text-6xl font-display font-light leading-tight overflow-visible
                    ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                  type="words"
                />
              </div>
            </div>
            <div className={`border-t ${P.border}`}>
              {copy.home.serviceTracks.map((item, index) => (
                <ServiceRow key={item.title} item={item} index={index} copy={copy} isArabic={isArabic} />
              ))}
            </div>
          </section>
          </LazySection>

          {/*  METHOD  */}
          <LazySection>
          <section className={`py-32 border-t ${P.border}`}>
            <div className={`mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-end ${dir.text}`}>
              <div>
                <TextReveal>
                  <span className={`text-[11px] font-bold tracking-[0.4em] uppercase block mb-8 ${P.muted}`}>{copy.home.methodTitle}</span>
                </TextReveal>
                <SplitText
                  text={copy.home.methodSteps.join('  ')}
                  className={`text-4xl md:text-5xl lg:text-6xl font-display font-light leading-snug overflow-visible
                    ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                  type="words"
                />
              </div>
              <TextReveal delay={0.15}>
                <p className={`text-base font-light leading-relaxed max-w-md ${P.stone}`}>{copy.home.methodCopy}</p>
              </TextReveal>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
              {copy.home.methodCards.map((item, index) => (
                <ProcessStep key={item.title} title={item.title} copy={item.copy}
                  number={`0${index + 1} / ${copy.home.methodCards.length}`} isDark={isDark} isArabic={isArabic} />
              ))}
            </div>

            {/* Image strip */}
            <div className="grid grid-cols-3 gap-4">
              {IMAGES.method.map((src, i) => (
                <div key={i} className={`overflow-hidden rounded-xl aspect-[4/3] ${isDark ? 'bg-white/5' : 'bg-[#e8e4d9] shadow-sm'}`}>
                  <CinematicImage src={src} alt={`Method step ${i + 1}`} className="w-full h-full" />
                </div>
              ))}
            </div>
          </section>
          </LazySection>

          {/*  TESTIMONIALS  */}
          {testimonials.length > 0 && (
            <LazySection>
            <section className={`py-32 border-t ${P.border} ${dir.text}`}>
              <TextReveal>
                <span className={`text-[11px] font-bold tracking-[0.4em] uppercase block mb-16 ${P.muted}`}>
                  {(copy.home as Record<string, unknown>).testimonialsTitle as string ?? 'Proof of Work'}
                </span>
              </TextReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {testimonials.slice(0, 2).map((t, i) => (
                  <TestimonialCard key={i} quote={t.quote} name={t.name} role={t.role} isDark={isDark} isArabic={isArabic} />
                ))}
              </div>
            </section>
            </LazySection>
          )}

          {/*  CTA 
               Light mode: inverted dark card for maximum contrast & drama
               Dark mode: subtle glass card as before
          */}
          <LazySection id="contact" className="scroll-mt-28">
          <section
            className={`min-h-[680px] flex flex-col justify-center relative overflow-hidden rounded-3xl mb-24 transition-colors duration-700
              ${isDark
                ? 'bg-white/[0.025] border border-white/[0.07]'
                : 'bg-[#18160f] text-white'}`}
          >
            {/* Blurred orbs */}
            <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none
              ${isDark ? 'bg-white/[0.025]' : 'bg-white/[0.04]'}`} />
            <div className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none
              ${isDark ? 'bg-white/[0.02]' : 'bg-white/[0.03]'}`} />

          <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 py-20">
              <TextReveal>
                <span className={`text-[11px] font-bold tracking-[0.4em] uppercase block mb-10
                  ${isDark ? 'text-white/28' : 'text-white/45'}`}>
                  {copy.home.ctaLabel}
                </span>
              </TextReveal>

              <SplitText
                text={copy.home.ctaTitle}
                className="text-6xl md:text-8xl lg:text-[8.5rem] font-display font-light leading-[0.92] mb-10 overflow-visible text-white/90"
                type="words"
                delay={0.1}
              />

              <TextReveal delay={0.25}>
                <p className="text-base md:text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto text-white/50">
                  {copy.home.ctaCopy}
                </p>
              </TextReveal>

              {/* Availability badge */}
              <TextReveal delay={0.3}>
                <div className={`inline-flex items-center gap-3 mb-12 px-5 py-2.5 rounded-full border border-white/[0.12] text-white/40 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400/70 animate-pulse shrink-0" />
                  <span className="text-[10px] font-bold tracking-[0.28em] uppercase">
                    {copy.home.ctaMeta}: {copy.home.ctaMetaValue}
                  </span>
                </div>
              </TextReveal>

              {/* Always use light-themed button inside the dark CTA card */}
              <MagneticButton href="mailto:hello@lightlab.dev" isDark={true} variant="primary"
                className={`inline-flex items-center gap-4 px-12 py-5 rounded-full text-[12px] font-bold tracking-[0.25em] uppercase ${isArabic ? 'flex-row-reverse' : ''}`}>
                {copy.home.ctaButton}
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1 4.5h14M9 1l4 3.5L9 8" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MagneticButton>
            </div>

            {/* BG wordmark */}
            <div className="absolute inset-x-0 bottom-0 h-[9vw] overflow-hidden pointer-events-none flex items-start justify-center">
              <span className={`text-[18vw] font-display font-bold leading-none whitespace-nowrap
                ${isDark ? 'text-white/[0.022]' : 'text-white/[0.04]'}`}>LIGHTLAB</span>
            </div>
          </section>
          </LazySection>

        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .animate-marquee { animation: marquee 42s linear infinite; }
        `}</style>
      </div>
    </ThemeContext.Provider>
  )
}

export default Home
