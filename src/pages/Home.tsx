import {
  useLayoutEffect,
  useRef,
  useMemo,
  memo,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from 'react'
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

// ─── Palette tokens ─────────────────────────────────────────────────────────
const LT = {
  bg:        'bg-[#eeeae0]',
  text:      'text-[#18160f]',
  stone:     'text-[#56514a]',
  muted:     'text-[#8c8780]',
  border:    'border-[#d9d5ca]',
  divideX:   'divide-[#d9d5ca]',
  cardBg:    'bg-white',
  faint:     'bg-[#e8e4d9]',
  watermark: 'text-[#d0ccbf]',
}

const DK = {
  bg:        'bg-[#080807]',
  text:      'text-white',
  stone:     'text-white/50',
  muted:     'text-white/25',
  border:    'border-white/[0.07]',
  divideX:   'divide-white/[0.06]',
  cardBg:    'bg-white/[0.03]',
  faint:     'bg-white/[0.015]',
  watermark: 'text-white/[0.025]',
}

// ─── Image constants ─────────────────────────────────────────────────────────
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

// ─── LazySection (intersection-observer reveal) ──────────────────────────────
interface LazySectionProps { children: ReactNode; className?: string; id?: string }

const LazySection = memo(({ children, className = '', id }: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.02, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={`will-change-[opacity,transform]
        transition-[opacity,transform] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}`}
    >
      {children}
    </div>
  )
})
LazySection.displayName = 'LazySection'

// ─── ServiceRow (editorial accordion) ────────────────────────────────────────
interface ServiceRowItem { title: string; copy: string; result?: string }
interface ServiceRowProps {
  item: ServiceRowItem
  index: number
  copy: Copy
  isArabic: boolean
}

const ServiceRow = memo(({ item, index, copy, isArabic }: ServiceRowProps) => {
  const [open, setOpen] = useState(false)
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  const stepLabels = ['01 ── AI Automation', '02 ── Engineering', '03 ── Media Buying']

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v) }
      }}
      className={`group cursor-pointer select-none border-b transition-all duration-500
        ${isDark
          ? 'border-white/[0.06] hover:border-white/[0.16]'
          : 'border-[#d9d5ca] hover:border-[#18160f]/30'}`}
      onClick={() => setOpen(v => !v)}
    >
      {/* ── Row header ── */}
      <div className={`flex items-center justify-between py-8 md:py-10 gap-6
        ${isArabic ? 'flex-row-reverse' : ''}`}>

        <div className={`flex items-baseline gap-7 md:gap-12 min-w-0 flex-1
          ${isArabic ? 'flex-row-reverse' : ''}`}>
          {/* Dominant index */}
          <span className={`font-display text-[2.5rem] md:text-[3.5rem] font-light leading-none tabular-nums shrink-0
            transition-all duration-500
            ${open
              ? (isDark ? 'text-white/70' : 'text-[#18160f]/70')
              : (isDark ? 'text-white/10 group-hover:text-white/30' : 'text-[#18160f]/10 group-hover:text-[#18160f]/30')}`}>
            0{index + 1}
          </span>

          <div className="min-w-0 flex-1">
            {/* Horizontal step label */}
            <span className={`block text-[9px] font-mono tracking-[0.38em] uppercase mb-2
              transition-opacity duration-300
              ${isDark ? 'text-white/20 group-hover:text-white/40' : 'text-[#8c8780] group-hover:text-[#56514a]'}`}>
              {stepLabels[index] ?? `0${index + 1}`}
            </span>
            {/* Service title */}
            <h3 className={`text-3xl md:text-4xl lg:text-[2.8rem] font-display font-light
              leading-[1.04] transition-all duration-400
              ${isDark
                ? 'text-white/70 group-hover:text-white'
                : 'text-[#18160f]/75 group-hover:text-[#18160f]'}`}>
              {item.title}
            </h3>
          </div>
        </div>

        <div className={`flex items-center gap-3 md:gap-5 shrink-0
          ${isArabic ? 'flex-row-reverse' : ''}`}>
          {/* Result badge */}
          {item.result && (
            <span className={`hidden md:inline-flex items-center
              text-[9px] font-bold tracking-[0.28em] uppercase
              px-4 py-2 rounded-full border transition-all duration-400
              ${isDark
                ? 'border-white/[0.07] text-white/25 group-hover:border-white/[0.20] group-hover:text-white/55'
                : 'border-[#d9d5ca] text-[#8c8780] bg-white/80 group-hover:border-[#56514a]/40 group-hover:text-[#56514a]'}`}>
              {item.result}
            </span>
          )}

          {/* Toggle icon */}
          <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${open ? 'rotate-45' : 'rotate-0'}
            ${isDark
              ? 'border-white/[0.10] group-hover:border-white/[0.30] group-hover:bg-white/[0.06]'
              : 'border-[#d9d5ca] bg-white/90 group-hover:border-[#18160f]/30 group-hover:shadow-md'}`}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <line x1="5.5" y1="0" x2="5.5" y2="11" strokeWidth="1.1"
                stroke={isDark ? 'rgba(255,255,255,0.50)' : '#56514a'}/>
              <line x1="0" y1="5.5" x2="11" y2="5.5" strokeWidth="1.1"
                stroke={isDark ? 'rgba(255,255,255,0.50)' : '#56514a'}/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Accordion panel ── */}
      <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden
        ${open ? 'grid-rows-[1fr] pb-14' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden min-h-0">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pt-3
            ${isArabic ? 'text-right' : ''}`}>
            <div className="flex flex-col justify-between">
              <p className={`text-base leading-[1.82] font-light mb-10 max-w-[420px]
                ${isDark ? 'text-white/44' : 'text-[#56514a]'}`}>
                {item.copy}
              </p>
              <MagneticButton
                href="#contact"
                variant="outline"
                isDark={isDark}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full
                  text-[10px] font-bold tracking-[0.24em] uppercase self-start
                  ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                {copy.home.servicesCta}
                <svg width="14" height="7" viewBox="0 0 14 7" fill="none"
                  className={`transition-transform duration-300 group-hover:translate-x-1
                    ${isArabic ? 'scale-x-[-1]' : ''}`}>
                  <path d="M1 3.5h12M8 1l4 2.5L8 6"
                    strokeWidth="1.2" stroke="currentColor"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MagneticButton>
            </div>

            <div className={`aspect-[16/10] overflow-hidden rounded-2xl
              ${isDark
                ? 'bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'
                : 'bg-[#e8e4d9] shadow-[0_2px_16px_rgba(0,0,0,0.07)]'}`}>
              <CinematicImage
                src={IMAGES.services[index % IMAGES.services.length]}
                alt={item.title}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
ServiceRow.displayName = 'ServiceRow'

// ─── ProcessStep ─────────────────────────────────────────────────────────────
interface ProcessStepProps {
  title: string
  copy: string
  number: string
  label: string
  isDark: boolean
  isArabic: boolean
}

const ProcessStep = memo(({ title, copy, number, label, isDark, isArabic }: ProcessStepProps) => {
  const numericLabel = number.split('/')[0].trim()

  return (
    <div className={`group relative flex flex-col pt-8 pb-2 border-t overflow-hidden
      transition-colors duration-400
      ${isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'}
      ${isArabic ? 'text-right' : ''}`}>

      {/* Horizontal index line */}
      <div className={`flex items-center gap-4 mb-7 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <span className={`text-[9px] font-mono tracking-[0.42em] uppercase
          ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
          {label}
        </span>
        <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.06]' : 'bg-[#d9d5ca]'}`} />
      </div>

      {/* Title */}
      <h4 className={`text-2xl md:text-[1.6rem] font-display font-light mb-5
        transition-colors duration-300
        ${isDark ? 'text-white/75 group-hover:text-white' : 'text-[#18160f]'}`}>
        {title}
      </h4>

      {/* Expanding divider */}
      <div className={`h-px mb-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        w-6 group-hover:w-12
        ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`}
      />

      {/* Body */}
      <p className={`flex-1 text-sm leading-[1.80] font-light
        ${isDark ? 'text-white/35 group-hover:text-white/55' : 'text-[#56514a]'}`}>
        {copy}
      </p>

      {/* Giant watermark numeral */}
      <div aria-hidden="true"
        className={`absolute -bottom-6 ${isArabic ? '-left-2' : '-right-2'}
          text-[110px] font-display font-bold leading-none
          select-none pointer-events-none opacity-40 group-hover:opacity-70
          transition-opacity duration-500
          ${isDark ? 'text-white/[0.025]' : 'text-[#d0ccbf]'}`}>
        {numericLabel}
      </div>
    </div>
  )
})
ProcessStep.displayName = 'ProcessStep'

// ─── ClarityCard (editorial vertical-accent style) ───────────────────────────
interface ClarityCardProps {
  title: string
  lead: string
  copy: string
  index: number
  isDark: boolean
  isArabic: boolean
  P: typeof LT | typeof DK
}

const ClarityCard = memo(({ title, lead, copy, index, isDark, isArabic, P }: ClarityCardProps) => (
  <div className={`group relative flex flex-col overflow-hidden
    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
    hover:-translate-y-2
    ${isDark
      ? 'bg-white/[0.025] border border-white/[0.07] hover:border-white/[0.18] hover:shadow-2xl hover:shadow-black/60'
      : 'bg-white border border-[#e8e4d9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:shadow-black/10'}
    rounded-2xl cursor-default`}>

    {/* Left vertical accent line */}
    <div className={`absolute top-0 ${isArabic ? 'right-0' : 'left-0'} w-[2px] h-full
      transition-all duration-500
      ${isDark
        ? 'bg-gradient-to-b from-white/30 via-white/10 to-transparent group-hover:from-white/60 group-hover:via-white/25'
        : 'bg-gradient-to-b from-[#18160f]/30 via-[#18160f]/10 to-transparent group-hover:from-[#18160f]/55 group-hover:via-[#18160f]/20'}`}
    />

    <div className={`flex flex-col flex-1 px-9 md:px-10 pt-9 pb-10 ${isArabic ? 'text-right' : ''}`}>
      {/* Eyebrow + index */}
      <div className={`flex items-center justify-between mb-7
        ${isArabic ? 'flex-row-reverse' : ''}`}>
        <span className={`text-[9px] font-bold tracking-[0.44em] uppercase ${P.muted}`}>
          {title}
        </span>
        <span className={`text-[10px] font-mono tabular-nums
          ${isDark ? 'text-white/10' : 'text-[#c8c4b8]'}`}>
          0{index + 1}
        </span>
      </div>

      {/* Lead headline */}
      <h4 className={`text-[1.45rem] md:text-2xl font-display font-light leading-[1.22] mb-5
        transition-colors duration-300
        ${isDark ? 'text-white/80 group-hover:text-white' : 'text-[#18160f]'}`}>
        {lead}
      </h4>

      {/* Expanding rule */}
      <div className={`h-px mb-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        w-6 group-hover:w-14
        ${isDark ? 'bg-white/14' : 'bg-[#c8c4b8]'}`}
      />

      {/* Body copy */}
      <p className={`flex-1 text-[13.5px] leading-[1.82] font-light mb-9
        transition-colors duration-300
        ${isDark ? 'text-white/38 group-hover:text-white/58' : 'text-[#56514a]'}`}>
        {copy}
      </p>

      {/* Explore link */}
      <div className={`flex items-center gap-2.5 text-[9px] font-bold tracking-[0.34em] uppercase
        transition-all duration-300
        ${isDark ? 'text-white/16 group-hover:text-white/55' : 'text-[#8c8780] group-hover:text-[#18160f]'}
        ${isArabic ? 'flex-row-reverse' : ''}`}>
        <span>{isArabic ? 'اكتشف' : 'Explore'}</span>
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"
          className={`transition-transform duration-500
            ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
          <path d="M1 4h14M9 1.5l4 2.5-4 2.5"
            strokeWidth="1.2" stroke="currentColor"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>

    {/* Giant number watermark */}
    <div aria-hidden="true"
      className={`absolute bottom-0 ${isArabic ? 'left-0' : 'right-0'}
        text-[140px] font-display font-bold leading-[0.75]
        select-none pointer-events-none
        transition-opacity duration-500 opacity-100
        ${isDark ? 'text-white/[0.025]' : 'text-[#d0ccbf]'}`}>
      0{index + 1}
    </div>
  </div>
))
ClarityCard.displayName = 'ClarityCard'

// ─── TestimonialCard (editorial quote layout) ─────────────────────────────────
interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  isDark: boolean
  isArabic: boolean
}

const TestimonialCard = memo(({ quote, name, role, isDark, isArabic }: TestimonialCardProps) => (
  <div className={`relative flex flex-col p-10 md:p-12 overflow-hidden
    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${isDark
      ? 'border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.04]'
      : 'border border-[#e8e4d9] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)]'}
    rounded-2xl ${isArabic ? 'text-right' : ''}`}>

    {/* Giant editorial quote mark */}
    <div aria-hidden="true"
      className={`absolute -top-4 ${isArabic ? 'right-6' : 'left-6'}
        font-display text-[120px] leading-none select-none pointer-events-none
        ${isDark ? 'text-white/[0.06]' : 'text-[#d0ccbf]'}`}>
      &ldquo;
    </div>

    {/* Quote body */}
    <p className={`relative z-10 flex-1 text-xl font-light leading-[1.70] mb-10 mt-8
      ${isDark ? 'text-white/65' : 'text-[#18160f]'}`}>
      {quote}
    </p>

    {/* Thin divider */}
    <div className={`h-px mb-8 ${isDark ? 'bg-white/[0.08]' : 'bg-[#d9d5ca]'}`} />

    {/* Attribution */}
    <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
      <div className={`w-11 h-11 rounded-full border flex items-center justify-center
        text-[12px] font-bold shrink-0
        ${isDark
          ? 'border-white/[0.14] bg-white/[0.06] text-white/50'
          : 'border-[#d9d5ca] bg-[#eeeae0] text-[#56514a]'}`}>
        {name[0]}
      </div>
      <div className={`h-6 w-px ${isDark ? 'bg-white/[0.10]' : 'bg-[#d9d5ca]'}`} />
      <div>
        <div className={`text-[13px] font-semibold tracking-wide
          ${isDark ? 'text-white/72' : 'text-[#18160f]'}`}>
          {name}
        </div>
        <div className={`text-[11px] font-light mt-0.5
          ${isDark ? 'text-white/28' : 'text-[#8c8780]'}`}>
          {role}
        </div>
      </div>
    </div>
  </div>
))
TestimonialCard.displayName = 'TestimonialCard'

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ themeMode }: HomeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLElement>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)

  // ── Scroll-progress bar ──
  useLayoutEffect(() => {
    let rafId: number
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(total > 0 ? window.scrollY / total : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  // ── Hero GSAP entrance + parallax ──
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.12 })
      tl.from('.hero-line',       { y: 22, opacity: 0, duration: 0.75, stagger: 0.09, ease: ANIMATION.ease.luxury })
        .from('.hero-body',       { y: 18, opacity: 0, duration: 0.48, ease: ANIMATION.ease.smooth }, '-=0.34')
        .from('.hero-meta',       { y: 10, opacity: 0, duration: 0.36, ease: ANIMATION.ease.smooth }, '-=0.28')
        .from('.hero-cta',        { y: 12, opacity: 0, duration: 0.40, ease: ANIMATION.ease.smooth }, '-=0.22')
        .from('.hero-image-wrap', { scale: 1.05, opacity: 0, duration: 1.0, ease: ANIMATION.ease.luxury }, '-=0.9')

      if (heroRef.current) {
        gsap.to('.hero-image-wrap', {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.85,
          },
        })
      }
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
    ((copy.home as Record<string, unknown>).testimonials as Array<{ quote: string; name: string; role: string }>) ?? []

  const methodStepLabels = ['01 ── Architecture', '02 ── Interface', '03 ── Deployment']

  return (
    <ThemeContext.Provider value={{ theme: themeMode }}>
      <div
        ref={wrapperRef}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${P.bg} ${P.text}`}
      >
        {/* ── Scroll-progress line ── */}
        <div
          aria-hidden="true"
          className={`fixed top-0 h-[1.5px] z-[100] transition-none will-change-[width]
            ${isArabic ? 'right-0' : 'left-0'}
            ${isDark ? 'bg-white/50' : 'bg-[#18160f]/75'}`}
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* ════════════════════ HERO ════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-end">
          {/* Full-bleed image + layered scrim */}
          <div className="hero-image-wrap absolute inset-0">
            <CinematicImage src={IMAGES.hero} alt="" className="w-full h-full" priority />
            {/* Dramatic cinematic gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/42 to-black/12" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/28 via-transparent to-transparent" />
          </div>

          {/* Studio badge — top right */}
          <div className="hero-meta absolute top-8 right-8 md:right-14 z-10">
            <span className={`text-[8px] font-mono tracking-[0.42em] uppercase text-white/30
              border border-white/[0.12] px-3.5 py-2 rounded-full backdrop-blur-sm
              ${isArabic ? 'text-right' : ''}`}>
              Est. 2024 · AI &amp; Digital Studio
            </span>
          </div>

          {/* Hero content */}
          <div className={`relative z-10 w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20
            pb-24 md:pb-36 ${dir.text}`}>

            {/* Hero headlines — monumental typography */}
            <h1 className="font-display font-light leading-[0.88]
              text-[clamp(4rem,9vw,9rem)] text-white mb-10 md:mb-12">
              <span className="hero-line block">{copy.home.heroTitle1}</span>
              <span className="hero-line block italic text-white/55">
                {copy.home.heroTitle2}
              </span>
            </h1>

            {/* Sub-copy */}
            <p className={`hero-body text-base md:text-lg text-white/58 max-w-[32rem]
              leading-[1.76] font-light mb-12 md:mb-14 ${isArabic ? 'mr-0 ml-auto lg:ml-0' : ''}`}>
              {copy.home.heroCopy}
            </p>

            {/* CTA row */}
            <div className={`hero-cta flex flex-wrap gap-5 items-center
              ${isArabic ? 'flex-row-reverse' : ''}`}>
              <MagneticButton
                href="#contact"
                variant="primary"
                isDark
                className={`inline-flex items-center gap-4 px-10 py-4.5 rounded-full
                  text-[11px] tracking-[0.28em] uppercase font-bold
                  ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                {copy.home.ctaButton}
                <svg width="15" height="8" viewBox="0 0 15 8" fill="none" aria-hidden="true"
                  className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1 4h13M8.5 1l4 3-4 3"
                    strokeWidth="1.3" stroke="currentColor"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MagneticButton>

              {/* Scroll indicator with animated pulse line */}
              <div className={`hidden sm:flex items-center gap-3.5
                ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="relative w-px h-10 overflow-hidden">
                  <span className="absolute inset-0 bg-white/20" />
                  <span className="absolute left-0 right-0 h-4 bg-white/60 animate-scroll-pulse" />
                </div>
                <span className="text-[9px] font-bold tracking-[0.42em] uppercase text-white/28">
                  {copy.home.scrollLabel}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ INNER CONTENT SHELL ════════════ */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">

          {/* ── Ticker / Marquee Strip ── */}
          <LazySection>
            <div className={`py-4 border-y overflow-hidden ${P.border}`}>
              <div className="flex gap-0 animate-marquee whitespace-nowrap" aria-hidden="true">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className={`inline-flex items-center gap-5 ${P.muted}`}>
                    <span className="text-[8.5px] font-bold tracking-[0.52em] uppercase shrink-0">
                      AI Automation
                    </span>
                    <span className="text-[10px] opacity-40">·</span>
                    <span className="text-[8.5px] font-bold tracking-[0.52em] uppercase shrink-0">
                      Engineering
                    </span>
                    <span className="text-[10px] opacity-40">·</span>
                    <span className="text-[8.5px] font-bold tracking-[0.52em] uppercase shrink-0">
                      Media Buying
                    </span>
                    <span className="text-[10px] opacity-40">·</span>
                    <span className="text-[8.5px] font-bold tracking-[0.52em] uppercase shrink-0">
                      Revenue Scaling
                    </span>
                    <span className="text-[10px] opacity-40 mr-8">·</span>
                  </span>
                ))}
              </div>
            </div>
          </LazySection>

          {/* ── Impact Stats — full-width dramatic bar ── */}
          <LazySection>
            <section className={`py-20 md:py-28 border-b ${P.border}`} aria-label="Impact statistics">
              <div className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x
                ${P.divideX} ${isDark ? 'divide-white/[0.06]' : 'divide-[#d9d5ca]'}`}>
                {copy.home.impactStats.map((stat, i) => (
                  <div key={i} className={`flex flex-col gap-4 px-0 sm:px-12 first:pl-0 last:pr-0
                    py-10 sm:py-0 ${isArabic ? 'text-right' : ''}`}>
                    {/* Thin rule above label */}
                    <div className={`h-px w-10 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
                    <span className={`text-[9px] font-bold tracking-[0.44em] uppercase ${P.muted}`}>
                      {stat.label}
                    </span>
                    {/* Monumental number */}
                    <div className={`font-display font-light leading-[0.9]
                      text-[5rem] md:text-[7rem] lg:text-[8rem]
                      transition-opacity duration-700
                      ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </LazySection>

          {/* ── About / Expertise — asymmetric 2-col ── */}
          <LazySection>
            <section
              className={`py-28 md:py-40 grid grid-cols-1 lg:grid-cols-[1fr_0.72fr]
                gap-14 md:gap-24 items-end border-b ${P.border} ${dir.text}`}
              aria-label="Our expertise"
            >
              <div>
                <TextReveal>
                  <div className="mb-8">
                    <span className={`text-[10px] font-bold tracking-[0.46em] uppercase block mb-4 ${P.muted}`}>
                      {copy.home.expertiseLabel}
                    </span>
                    {/* Elegant horizontal rule below eyebrow */}
                    <div className={`h-px w-16 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
                  </div>
                </TextReveal>
                <SplitText
                  text={copy.home.expertiseTitle}
                  className={`text-5xl md:text-6xl lg:text-[4.5rem] font-display font-light
                    leading-[1.03] overflow-visible
                    ${isDark ? 'text-white/92' : 'text-[#18160f]'}`}
                  type="words"
                />
              </div>
              <TextReveal delay={0.18}>
                <p className={`text-lg leading-[1.80] font-light max-w-xl ${P.stone}`}>
                  {copy.home.expertiseCopy}
                </p>
              </TextReveal>
            </section>
          </LazySection>

          {/* ── Clarity / Philosophy Cards ── */}
          <LazySection>
            <section className="pb-28 md:pb-40" aria-label="Our philosophy">
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch ${dir.text}`}>
                {copy.home.clarity.map((item, index) => (
                  <ClarityCard
                    key={item.title}
                    title={item.title}
                    lead={item.lead}
                    copy={item.copy}
                    index={index}
                    isDark={isDark}
                    isArabic={isArabic}
                    P={P}
                  />
                ))}
              </div>
            </section>
          </LazySection>

          {/* ── Services ── */}
          <LazySection>
            <section className={`pt-4 pb-12 border-t ${P.border}`} aria-label="Core services">
              {/* Section header */}
              <div className={`flex items-end justify-between gap-8 mb-12 mt-8
                ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={dir.text}>
                  <TextReveal>
                    <div className="mb-6">
                      <span className={`text-[10px] font-bold tracking-[0.46em] uppercase block mb-4 ${P.muted}`}>
                        {copy.home.coreLabel}
                      </span>
                      <div className={`h-px w-14 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
                    </div>
                  </TextReveal>
                  <SplitText
                    text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                    className={`text-4xl md:text-5xl lg:text-[3.75rem] font-display font-light
                      leading-[1.08] overflow-visible
                      ${isDark ? 'text-white/92' : 'text-[#18160f]'}`}
                    type="words"
                  />
                </div>
              </div>

              {/* Service accordion rows */}
              <div className={`border-t ${P.border}`}>
                {copy.home.serviceTracks.map((item, index) => (
                  <ServiceRow
                    key={item.title}
                    item={item}
                    index={index}
                    copy={copy}
                    isArabic={isArabic}
                  />
                ))}
              </div>
            </section>
          </LazySection>

          {/* ── Method ── */}
          <LazySection>
            <section className={`py-32 md:py-44 border-t ${P.border}`} aria-label="Our method">
              {/* Method header — full-width label + 2-col below */}
              <div className={`mb-16 md:mb-24 ${dir.text}`}>
                <TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-12 ${P.muted}`}>
                    {copy.home.methodTitle}
                  </span>
                </TextReveal>
                <div className={`grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-12 md:gap-20 items-end`}>
                  <SplitText
                    text={copy.home.methodSteps.join('  ·  ')}
                    className={`text-4xl md:text-5xl lg:text-[3.5rem] font-display font-light
                      leading-[1.15] overflow-visible
                      ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                    type="words"
                  />
                  <TextReveal delay={0.18}>
                    <p className={`text-base font-light leading-[1.80] max-w-md ${P.stone}`}>
                      {copy.home.methodCopy}
                    </p>
                  </TextReveal>
                </div>
              </div>

              {/* Step cards with large horizontal indices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-28 items-stretch">
                {copy.home.methodCards.map((item, index) => (
                  <ProcessStep
                    key={item.title}
                    title={item.title}
                    copy={item.copy}
                    number={`0${index + 1}`}
                    label={methodStepLabels[index] ?? `0${index + 1}`}
                    isDark={isDark}
                    isArabic={isArabic}
                  />
                ))}
              </div>

              {/* Method image strip — slightly offset, parallax feel */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {IMAGES.method.map((src, i) => (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-2xl aspect-[4/3]
                      transition-transform duration-700
                      ${i === 1 ? 'translate-y-6' : ''}
                      ${isDark
                        ? 'bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'bg-[#e8e4d9] shadow-[0_2px_12px_rgba(0,0,0,0.07)]'}`}>
                    <CinematicImage src={src} alt={`Method step ${i + 1}`} className="w-full h-full" />
                  </div>
                ))}
              </div>
            </section>
          </LazySection>

          {/* ── Testimonials ── */}
          {testimonials.length > 0 && (
            <LazySection>
              <section
                className={`py-28 md:py-40 border-t ${P.border} ${dir.text}`}
                aria-label="Client testimonials"
              >
                <TextReveal>
                  <div className="mb-16 md:mb-20">
                    <span className={`text-[10px] font-bold tracking-[0.46em] uppercase block mb-4 ${P.muted}`}>
                      {copy.home.testimonialsTitle}
                    </span>
                    <div className={`h-px w-14 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
                  </div>
                </TextReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
                  {testimonials.slice(0, 2).map((t, i) => (
                    <TestimonialCard
                      key={i}
                      quote={t.quote}
                      name={t.name}
                      role={t.role}
                      isDark={isDark}
                      isArabic={isArabic}
                    />
                  ))}
                </div>
              </section>
            </LazySection>
          )}

          {/* ── CTA / Contact — always-dark inverted panel ── */}
          <LazySection id="contact" className="scroll-mt-28">
            <section
              className={`relative min-h-[720px] flex flex-col justify-center
                overflow-hidden rounded-3xl mb-24 md:mb-36
                bg-[#080807] text-white`}
            >
              {/* Ambient light orbs */}
              <div aria-hidden="true"
                className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full
                  bg-white/[0.018] blur-[200px] pointer-events-none"
              />
              <div aria-hidden="true"
                className="absolute -bottom-48 -right-48 w-[550px] h-[550px] rounded-full
                  bg-white/[0.012] blur-[170px] pointer-events-none"
              />

              {/* CTA body */}
              <div className={`relative z-10 w-full max-w-4xl mx-auto text-center px-8 md:px-14 py-24 md:py-36
                ${isArabic ? 'text-right' : ''}`}>
                <TextReveal>
                  <span className="text-[9px] font-bold tracking-[0.48em] uppercase block mb-12 text-white/25">
                    {copy.home.ctaLabel}
                  </span>
                </TextReveal>

                <SplitText
                  text={copy.home.ctaTitle}
                  className="text-[clamp(4.5rem,10vw,12rem)] font-display font-light
                    leading-[0.88] mb-12 overflow-visible text-white/92 text-center"
                  type="words"
                  delay={0.1}
                />

                <TextReveal delay={0.22}>
                  <p className="text-base md:text-lg font-light leading-[1.76]
                    mb-14 max-w-[28rem] mx-auto text-white/42">
                    {copy.home.ctaCopy}
                  </p>
                </TextReveal>

                {/* Availability pulse badge */}
                <TextReveal delay={0.30}>
                  <div className={`inline-flex items-center gap-3 mb-14
                    px-5 py-2.5 rounded-full border border-white/[0.10]
                    backdrop-blur-sm
                    ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-white/35">
                      {copy.home.ctaMeta}: {copy.home.ctaMetaValue}
                    </span>
                  </div>
                </TextReveal>

                <MagneticButton
                  href="mailto:hello@lightlab.dev"
                  isDark
                  variant="primary"
                  className={`inline-flex items-center gap-4 px-12 py-5 rounded-full
                    text-[11px] font-bold tracking-[0.28em] uppercase
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.home.ctaButton}
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1 4h14M9 1l4 3-4 3"
                      strokeWidth="1.3" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </MagneticButton>
              </div>

              {/* Bottom wordmark watermark */}
              <div aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[11vw] overflow-hidden
                  pointer-events-none flex items-start justify-center">
                <span className="text-[20vw] font-display font-bold leading-none whitespace-nowrap
                  select-none text-white/[0.022] translate-y-[18%]">
                  LIGHTLAB
                </span>
              </div>
            </section>
          </LazySection>

        </div>{/* /inner shell */}

        {/* ── Styles ── */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 52s linear infinite;
          }
          @keyframes scroll-pulse {
            0%   { transform: translateY(-100%); opacity: 0; }
            30%  { opacity: 1; }
            70%  { opacity: 1; }
            100% { transform: translateY(300%); opacity: 0; }
          }
          .animate-scroll-pulse {
            animation: scroll-pulse 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee { animation-play-state: paused; }
            .animate-scroll-pulse { animation: none; opacity: 0.4; }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  )
}

export default Home
