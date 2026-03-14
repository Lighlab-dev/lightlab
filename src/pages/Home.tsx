import {
  useLayoutEffect,
  useRef,
  useMemo,
  memo,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  MagneticButton,
  TextReveal,
  SplitText,
  CinematicVideo,
  ANIMATION,
  useCursor,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

type Theme = 'dark' | 'light'
interface HomeProps { themeMode: Theme }

// ─── Palette tokens ───────────────────────────────────────────────────────────
const LT = {
  bg:      'bg-[#eeeae0]',
  text:    'text-[#18160f]',
  stone:   'text-[#56514a]',
  muted:   'text-[#8c8780]',
  border:  'border-[#d9d5ca]',
  cardBg:  'bg-white',
  faint:   'bg-[#e8e4d9]',
}
const DK = {
  bg:      'bg-[#080807]',
  text:    'text-white',
  stone:   'text-white/50',
  muted:   'text-white/25',
  border:  'border-white/[0.07]',
  cardBg:  'bg-white/[0.04]',
  faint:   'bg-white/[0.02]',
}

// ─── Media assets ─────────────────────────────────────────────────────────────
const MEDIA = {
  heroVideo: 'https://player.vimeo.com/external/494252666.sd.mp4?s=7297370e7674844339f8164366539e6a00839e9f&profile_id=165',
  heroPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
  projects: [
    {
      id: 'prj-01',
      title: 'AI Revenue Engine',
      category: 'AI Automation',
      result: '+52% Leads',
      videoSrc: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aaa35f1d0ffe1ca&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    },
    {
      id: 'prj-02',
      title: 'Growth Platform',
      category: 'Development',
      result: '4x ROI',
      videoSrc: 'https://player.vimeo.com/external/370467553.sd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bab71348&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    },
    {
      id: 'prj-03',
      title: 'Media Scale',
      category: 'Media Buying',
      result: '−40% CAC',
      videoSrc: 'https://player.vimeo.com/external/291648067.sd.mp4?s=94350b646e6b5e10aa85264f7e01fdb64c31e0e2&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
  ],
}

// ─── LazySection ─────────────────────────────────────────────────────────────
const LazySection = memo(({ children, className = '', id }: {
  children: React.ReactNode; className?: string; id?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.04, rootMargin: '0px 0px -32px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      id={id}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  )
})
LazySection.displayName = 'LazySection'

// ─── ProjectCard ─────────────────────────────────────────────────────────────
const ProjectCard = memo(({ project, isDark }: {
  project: typeof MEDIA.projects[0]; isDark: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { setType } = useCursor()

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-none
        border ${isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'}`}
      style={{ height: '300px' }}
      onMouseEnter={() => { videoRef.current?.play().catch(() => {}); setType('play') }}
      onMouseLeave={() => { videoRef.current?.pause(); setType('default') }}
    >
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/50 block mb-1.5">
          {project.category}
        </span>
        <h3 className="font-display font-light text-xl text-white leading-tight">
          {project.title}
        </h3>
        {project.result && (
          <span className="font-display font-light text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400 block mt-1">
            {project.result}
          </span>
        )}
      </div>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'

// ─── AnimatedCounter ─────────────────────────────────────────────────────────
const AnimatedCounter = memo(({ value, label, isDark }: {
  value: string; label: string; isDark: boolean
}) => {
  const numRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = numRef.current
    if (!el) return
    const numeric = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    const suffix = value.replace(/[0-9.]/g, '')
    const ctx = gsap.context(() => {
      const counter = { val: 0 }
      gsap.to(counter, {
        val: numeric,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate() { if (el) el.textContent = Math.round(counter.val) + suffix },
      })
    }, numRef)
    return () => ctx.revert()
  }, [value])
  return (
    <div className="flex flex-col gap-2">
      <div
        ref={numRef}
        className={`font-display font-light text-[3.5rem] md:text-[4.5rem] leading-none
          ${isDark ? 'text-white' : 'text-[#18160f]'}`}
      >
        {value}
      </div>
      <span className={`text-[10px] font-bold tracking-[0.4em] uppercase
        ${isDark ? 'text-white/30' : 'text-[#8c8780]'}`}>
        {label}
      </span>
    </div>
  )
})
AnimatedCounter.displayName = 'AnimatedCounter'

// ─── TrustSignals ─────────────────────────────────────────────────────────────
interface TrustSignalsProps {
  isDark: boolean
  isArabic: boolean
  P: typeof LT
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TrustSignals = memo(({ isDark: _isDark, isArabic, P, dir, copy }: TrustSignalsProps) => (
  <LazySection className={`border-t ${P.border}`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-6 ${P.muted} ${dir.text}`}>
        {copy.home.trustSignals.label}
      </span>
      <div className={`flex flex-wrap gap-8 md:gap-14 items-center mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
        {copy.home.trustSignals.clients.map((client) => (
          <span
            key={client.name}
            className={`font-display font-light text-sm md:text-base opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-default ${P.text}`}
          >
            {client.name}
          </span>
        ))}
      </div>
      <div className={`flex flex-wrap gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
        {copy.home.trustSignals.industries.map((industry) => (
          <span
            key={industry}
            className={`text-[9px] font-bold tracking-[0.32em] uppercase px-3 py-1.5 rounded-full border ${P.border} ${P.stone}`}
          >
            {industry}
          </span>
        ))}
      </div>
    </div>
  </LazySection>
))
TrustSignals.displayName = 'TrustSignals'

// ─── HowWeWork ────────────────────────────────────────────────────────────────
interface HowWeWorkProps {
  isDark: boolean
  isArabic: boolean
  P: typeof LT
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

const HowWeWork = memo(({ isDark, isArabic: _isArabic, P, dir, copy }: HowWeWorkProps) => (
  <LazySection id="how-we-work">
    <div className={`border-t ${P.border}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className={`mb-12 ${dir.text}`}>
          <TextReveal>
            <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-3 ${P.muted}`}>
              {copy.home.howWeWork.label}
            </span>
          </TextReveal>
          <SplitText
            text={copy.home.howWeWork.headline}
            className={`text-3xl md:text-4xl font-display font-light leading-[1.1] ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
            type="words"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {copy.home.howWeWork.steps.map((step) => (
            <div
              key={step.number}
              className={`relative flex flex-col gap-5 p-8 rounded-2xl border
                ${isDark ? `${P.cardBg} ${P.border}` : `${P.cardBg} ${P.border}`}`}
            >
              <span className={`font-mono text-[9px] tracking-[0.44em] uppercase ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
                {step.number}
              </span>
              <span className={`h-px w-12 ${isDark ? 'bg-white/10' : 'bg-[#d9d5ca]'}`} />
              <h4 className={`text-xl md:text-2xl font-display font-light leading-tight
                ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
                {step.title}
              </h4>
              <p className={`text-sm font-light leading-[1.72] flex-1
                ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
                {step.copy}
              </p>
              {step.number === '04' && (
                <div className={`inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border
                  ${isDark ? 'border-white/[0.08] text-white/30' : 'border-[#d9d5ca] text-[#8c8780]'}`}>
                  → {step.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </LazySection>
))
HowWeWork.displayName = 'HowWeWork'

// ─── WhyLightlab ──────────────────────────────────────────────────────────────
interface WhyLightlabProps {
  isDark: boolean
  isArabic: boolean
  P: typeof LT
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

const WhyLightlab = memo(({ isDark, isArabic: _isArabic, P, dir, copy }: WhyLightlabProps) => (
  <LazySection id="why-lightlab">
    <div className={`border-t ${P.border}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className={`mb-12 ${dir.text}`}>
          <TextReveal>
            <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-3 ${P.muted}`}>
              {copy.home.whyLightlab.label}
            </span>
          </TextReveal>
          <SplitText
            text={copy.home.whyLightlab.headline}
            className={`text-3xl md:text-4xl font-display font-light leading-[1.1] ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
            type="words"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {copy.home.whyLightlab.pillars.map((pillar, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 p-8 rounded-2xl border
                ${isDark
                  ? `${P.cardBg} ${P.border} hover:bg-white/[0.06]`
                  : `${P.cardBg} ${P.border} hover:bg-[#f5f2ea]`}
                transition-colors duration-300 group`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#d9d5ca]'}`} />
              <h4 className={`text-lg md:text-xl font-display font-light leading-tight
                ${isDark ? 'text-white/85' : 'text-[#18160f]'}`}>
                {pillar.title}
              </h4>
              <p className={`text-sm font-light leading-[1.72]
                ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
                {pillar.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </LazySection>
))
WhyLightlab.displayName = 'WhyLightlab'

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ themeMode }: HomeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLElement>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)
  const { setType } = useCursor()

  const isDark = themeMode === 'dark'
  const P = isDark ? DK : LT
  const dir = useMemo(() => ({
    text: isArabic ? 'text-right' : 'text-left',
    flex: isArabic ? 'flex-row-reverse' : 'flex-row',
  }), [isArabic])

  // Scroll progress
  useLayoutEffect(() => {
    let raf: number
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(total > 0 ? window.scrollY / total : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Hero animations
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from('.hero-tag',   { y: 16, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth })
        .from('.hero-line',  { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-copy',  { y: 20, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-cta',   { y: 16, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth }, '-=0.5')
        .from('.hero-media', { opacity: 0, scale: 1.04, duration: 1.4, ease: 'power2.out' }, 0)
      if (heroRef.current) {
        gsap.to('.hero-media', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapperRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${P.bg} ${P.text}`}
    >
      {/* Scroll progress line */}
      <div
        aria-hidden="true"
        className={`fixed top-0 h-[1.5px] z-[100]
          ${isArabic ? 'right-0' : 'left-0'}
          ${isDark ? 'bg-white/40' : 'bg-[#18160f]/60'}`}
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        onMouseEnter={() => setType('view')}
        onMouseLeave={() => setType('default')}
      >
        {/* Video background — muted, reduced opacity */}
        <div className="hero-media absolute inset-0 will-change-transform">
          <CinematicVideo
            src={MEDIA.heroVideo}
            poster={MEDIA.heroPoster}
            className="w-full h-full scale-105"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-[#080807]/70' : 'bg-[#eeeae0]/80'}`} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 py-32 md:py-40">
          {/* Tag */}
          <div className="hero-tag mb-8">
            <span className={`inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.44em] uppercase
              px-4 py-2 rounded-full border
              ${isDark ? 'border-white/10 text-white/40 bg-white/[0.04]' : 'border-[#d9d5ca] text-[#8c8780] bg-white/60'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              {copy.home.heroTag}
            </span>
          </div>

          {/* Headline */}
          <h1 className={`font-display font-light leading-[0.88]
            text-[clamp(3.5rem,8vw,8rem)] mb-8 max-w-4xl ${dir.text}
            ${isDark ? 'text-white' : 'text-[#18160f]'}`}>
            <span className="hero-line block overflow-hidden">
              <span className="block">{copy.home.heroTitle1}</span>
            </span>
            <span className="hero-line block overflow-hidden italic opacity-70">
              <span className="block">{copy.home.heroTitle2}</span>
            </span>
          </h1>

          {/* Sub-copy */}
          <p className={`hero-copy text-base md:text-lg font-light leading-[1.76]
            max-w-[32rem] mb-10 ${dir.text}
            ${isDark ? 'text-white/55' : 'text-[#56514a]'}`}>
            {copy.home.heroCopy}
          </p>

          {/* CTAs */}
          <div className={`hero-cta flex flex-wrap gap-4 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
            <MagneticButton
              href="#contact"
              variant="primary"
              isDark
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                text-[11px] tracking-[0.28em] uppercase font-bold
                ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {copy.home.ctaButtonStart}
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"
                className={isArabic ? 'scale-x-[-1]' : ''}>
                <path d="M1 4h12M7.5 1l3.5 3-3.5 3" strokeWidth="1.4" stroke="currentColor"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
            <MagneticButton
              href="/services"
              variant="outline"
              isDark={isDark}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                text-[11px] tracking-[0.28em] uppercase font-bold
                ${isDark ? 'border-white/15 text-white/60 hover:text-white' : 'border-[#d9d5ca] text-[#56514a]'}
                ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {copy.home.heroCtaSecondary}
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 z-10
          ${isArabic ? 'right-8 md:right-14' : 'left-8 md:left-14'}
          flex items-center gap-3`}>
          <div className="relative w-px h-10 overflow-hidden bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-scroll-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/25">
            {copy.home.scrollLabel}
          </span>
        </div>
      </section>

      {/* ══════════════════════════ TRUST SIGNALS ══════════════════════════ */}
      <TrustSignals isDark={isDark} isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ SERVICES ══════════════════════════ */}
      <LazySection id="services">
        <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28`}>
          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={dir.text}>
              <TextReveal>
                <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-3 ${P.muted}`}>
                  {copy.home.coreLabel}
                </span>
              </TextReveal>
              <SplitText
                text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                className={`text-3xl md:text-4xl font-display font-light leading-[1.1]
                  ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                type="words"
              />
            </div>
            <TextReveal delay={0.1}>
              <a href="/services"
                className={`text-[10px] font-bold tracking-[0.32em] uppercase
                  flex items-center gap-2 shrink-0 transition-opacity hover:opacity-70
                  ${isArabic ? 'flex-row-reverse' : ''}
                  ${isDark ? 'text-white/40' : 'text-[#8c8780]'}`}>
                {copy.home.servicesCta}
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden="true"
                  className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1 3h10M7 1l3 2-3 2" strokeWidth="1.3" stroke="currentColor"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </TextReveal>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {copy.home.serviceTracks.map((track, i) => (
              <div
                key={i}
                className={`group relative flex flex-col gap-5 p-8 rounded-2xl border
                  transition-colors duration-300 cursor-default
                  ${isDark
                    ? `${P.cardBg} ${P.border} hover:bg-white/[0.07]`
                    : `${P.cardBg} ${P.border} hover:bg-[#f5f2ea]`
                  }`}
              >
                {/* Index */}
                <span className={`text-[9px] font-mono tracking-[0.4em] uppercase
                  ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`text-xl md:text-2xl font-display font-light leading-tight
                  ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
                  {track.title}
                </h3>
                <p className={`text-sm font-light leading-[1.72] flex-1
                  ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
                  {track.copy}
                </p>
                {track.result && (
                  <div className={`inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border
                    ${isDark
                      ? 'border-white/[0.08] text-white/30 bg-white/[0.03]'
                      : 'border-[#d9d5ca] text-[#8c8780] bg-white'
                    }`}>
                    ↑ {track.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ HOW WE WORK ══════════════════════════ */}
      <HowWeWork isDark={isDark} isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ PROJECTS ══════════════════════════ */}
      <LazySection id="projects">
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={dir.text}>
                <TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-3 ${P.muted}`}>
                    {copy.home.viewProjectLabel ?? 'Selected Work'}
                  </span>
                </TextReveal>
                <SplitText
                  text={copy.home.projectsSectionTitle}
                  className={`text-3xl md:text-4xl font-display font-light leading-[1.1]
                    ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                  type="words"
                />
              </div>
              <TextReveal delay={0.1}>
                <a href="/projects"
                  className={`text-[10px] font-bold tracking-[0.32em] uppercase
                    flex items-center gap-2 shrink-0 transition-opacity hover:opacity-70
                    ${isArabic ? 'flex-row-reverse' : ''}
                    ${isDark ? 'text-white/40' : 'text-[#8c8780]'}`}>
                  {copy.home.viewAllLabel}
                  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1 3h10M7 1l3 2-3 2" strokeWidth="1.3" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </TextReveal>
            </div>

            {/* 3-column project grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MEDIA.projects.map((project) => (
                <ProjectCard key={project.id} project={project} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ STATS ══════════════════════════ */}
      <LazySection id="stats">
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 ${isArabic ? 'text-right' : 'text-left'}`}>
              {copy.home.impactStats.map((stat, i) => (
                <AnimatedCounter key={i} value={stat.value} label={stat.label} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════ */}
      <LazySection>
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
            <div className={`mb-12 ${dir.text}`}>
              <TextReveal>
                <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-3 ${P.muted}`}>
                  {copy.home.testimonialsTitle}
                </span>
              </TextReveal>
              <SplitText
                text={copy.home.testimonialsSubtitle ?? 'What clients say'}
                className={`text-3xl md:text-4xl font-display font-light leading-[1.1] max-w-xl
                  ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                type="words"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copy.home.testimonials.slice(0, 2).map((t, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-6 p-8 md:p-10 rounded-2xl border
                    ${isDark ? `${P.cardBg} ${P.border}` : `${P.cardBg} ${P.border}`}`}
                >
                  <p className={`text-lg md:text-xl font-display font-light leading-[1.5] italic
                    ${isDark ? 'text-white/75' : 'text-[#18160f]'}`}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className={`flex items-center gap-4 pt-4 border-t
                    ${isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'}
                    ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${isDark ? 'bg-white/10 text-white/50' : 'bg-[#e8e4d9] text-[#8c8780]'}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div className={dir.text}>
                      <div className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-[#18160f]'}`}>
                        {t.name}
                      </div>
                      <div className={`text-[10px] tracking-[0.18em] uppercase ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ WHY LIGHTLAB ══════════════════════════ */}
      <WhyLightlab isDark={isDark} isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ CONTACT CTA ══════════════════════════ */}
      <LazySection id="contact" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
          <section className="relative overflow-hidden rounded-3xl bg-[#080807] text-white px-10 md:px-20 py-20 md:py-28">
            {/* Ambient orbs */}
            <div aria-hidden="true" className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-[180px] pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/[0.010] blur-[150px] pointer-events-none" />

            {/* Content */}
            <div className={`relative z-10 max-w-2xl ${isArabic ? 'mr-auto text-right' : 'text-left'}`}>
              <TextReveal>
                <span className="text-[9px] font-bold tracking-[0.48em] uppercase block mb-6 text-white/25">
                  {copy.home.ctaLabel}
                </span>
              </TextReveal>
              <SplitText
                text={copy.home.ctaTitle}
                className="text-[clamp(2.8rem,6vw,6rem)] font-display font-light leading-[0.92] mb-6 text-white/92"
                type="words"
                delay={0.08}
              />
              <TextReveal delay={0.15}>
                <p className="text-base md:text-lg font-light leading-[1.76] mb-8 max-w-[26rem] text-white/40">
                  {copy.home.ctaCopy}
                </p>
              </TextReveal>

              {/* Availability */}
              <TextReveal delay={0.2}>
                <div className={`inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-white/[0.08]
                  ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/30">
                    {copy.home.ctaMeta}: {copy.home.ctaMetaValue}
                  </span>
                </div>
              </TextReveal>

              <div className={`flex flex-wrap gap-4 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                <MagneticButton
                  href="mailto:hello@lightlab.dev"
                  isDark
                  variant="primary"
                  className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.home.ctaButtonStart}
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1 4h12M7.5 1l3.5 3-3.5 3" strokeWidth="1.4" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>
                <MagneticButton
                  href="/contact"
                  variant="outline"
                  isDark
                  className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase
                    border-white/15 text-white/60 hover:text-white
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.home.ctaButton2}
                </MagneticButton>
              </div>
            </div>

            {/* Wordmark watermark */}
            <div aria-hidden="true" className="absolute right-0 bottom-0 h-full overflow-hidden pointer-events-none flex items-end">
              <span className="text-[18vw] font-display font-bold leading-none select-none text-white/[0.018] translate-x-[10%] translate-y-[10%]">
                LIGHT
              </span>
            </div>
          </section>
        </div>
      </LazySection>

      {/* Keyframes */}
      <style>{`
        @keyframes scroll-pulse {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 0.6; }
          70%  { opacity: 0.6; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        .animate-scroll-pulse { animation: scroll-pulse 2.2s cubic-bezier(0.4,0,0.2,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-pulse { animation: none; opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default Home
