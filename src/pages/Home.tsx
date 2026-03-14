import {
  useLayoutEffect,
  useRef,
  useMemo,
  memo,
  useState,
  createContext,
  type ReactNode,
} from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  MagneticButton,
  TextReveal,
  SplitText,
  CinematicVideo,
  CinematicImage,
  ANIMATION,
  useCursor,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

type Theme = 'dark' | 'light'

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

// ─── Media assets ─────────────────────────────────────────────────────────────
const MEDIA = {
  heroVideo: 'https://player.vimeo.com/external/494252666.sd.mp4?s=7297370e7674844339f8164366539e6a00839e9f&profile_id=165',
  heroPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
  projects: [
    {
      id: 'prj-01',
      title: 'AI Revenue Engine',
      category: 'AI Automation',
      videoSrc: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aaa35f1d0ffe1ca&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85',
    },
    {
      id: 'prj-02',
      title: 'Growth Platform',
      category: 'Development',
      videoSrc: 'https://player.vimeo.com/external/370467553.sd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bab71348&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85',
    },
    {
      id: 'prj-03',
      title: 'Media Scale',
      category: 'Media Buying',
      videoSrc: 'https://player.vimeo.com/external/291648067.sd.mp4?s=94350b646e6b5e10aa85264f7e01fdb64c31e0e2&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85',
    },
  ],
  services: [
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=85',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=85',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85',
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

// ─── ProjectCard ─────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: { id: string; title: string; category: string; videoSrc: string; poster: string }
  index: number
  isArabic: boolean
  isDark: boolean
  align: 'left' | 'right' | 'center'
}

const ProjectCard = memo(({ project, index, isArabic, isDark, align }: ProjectCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { setType } = useCursor()

  const overlayAlign = useMemo(() => {
    const effectiveAlign = isArabic
      ? align === 'left' ? 'right' : align === 'right' ? 'left' : 'center'
      : align
    if (effectiveAlign === 'left') return 'items-start text-left'
    if (effectiveAlign === 'right') return 'items-end text-right'
    return 'items-center text-center'
  }, [align, isArabic])

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {})
    setType('play')
    if (titleRef.current) {
      gsap.to(titleRef.current, { yPercent: -5, duration: 0.6, ease: ANIMATION.ease.luxury, overwrite: true })
    }
  }

  const handleMouseLeave = () => {
    videoRef.current?.pause()
    setType('default')
    if (titleRef.current) {
      gsap.to(titleRef.current, { yPercent: 0, duration: 0.6, ease: ANIMATION.ease.luxury, overwrite: true })
    }
  }

  const indexLabel = String(index + 1).padStart(2, '0')

  const borderColor = isDark ? 'border-white/[0.06]' : 'border-[#d9d5ca]'

  return (
    <div
      className={`relative w-full aspect-[16/9] max-sm:aspect-[4/3] overflow-hidden cursor-none border-b ${borderColor}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster fallback */}
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Video on hover */}
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Ghost typography accent */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center
          text-[22vw] font-display font-bold leading-none
          opacity-[0.04] mix-blend-overlay
          pointer-events-none select-none text-white"
      >
        {indexLabel}
      </span>

      {/* Text overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end p-8 md:p-12 ${overlayAlign}`}>
        <span className="text-[9px] font-mono tracking-[0.44em] uppercase text-white/50 mb-3 block small-caps">
          {project.category}
        </span>
        <h3
          ref={titleRef}
          className="font-display font-light text-[6vw] leading-[0.9] text-white will-change-transform"
        >
          {project.title}
        </h3>
      </div>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'

// ─── ServiceRowItem ───────────────────────────────────────────────────────────
interface ServiceRowItem { title: string; copy: string; result?: string; href?: string }

// ─── DynamicServiceRow ────────────────────────────────────────────────────────
interface DynamicServiceRowProps {
  item: ServiceRowItem
  index: number
  imageSrc: string
  isArabic: boolean
  isDark: boolean
}

const DynamicServiceRow = memo(({ item, index, imageSrc, isArabic, isDark }: DynamicServiceRowProps) => {
  const [hovered, setHovered] = useState(false)
  const { setType } = useCursor()

  const borderColor = isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'
  const indexLabel = String(index + 1).padStart(2, '0')

  return (
    <div
      className={`relative overflow-hidden border-b ${borderColor} cursor-none group`}
      onMouseEnter={() => { setHovered(true); setType('view') }}
      onMouseLeave={() => { setHovered(false); setType('default') }}
    >
      {/* Background image — fades in on hover */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${hovered ? 'opacity-10' : 'opacity-0'}`}
      >
        <CinematicImage src={imageSrc} alt={item.title} className="w-full h-full" />
      </div>

      {/* Row content */}
      <div
        className={`relative z-10 flex items-start justify-between gap-8 px-6 md:px-12 py-10 md:py-14
          transition-transform duration-500 ease-out
          ${hovered ? (isArabic ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
          ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Index */}
        <span className={`font-mono text-[10px] tracking-[0.4em] uppercase mt-1 shrink-0
          ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
          {indexLabel}
        </span>

        {/* Title + copy */}
        <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className={`text-4xl md:text-5xl lg:text-6xl font-display font-light leading-[0.95] mb-4
            ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
            {item.title}
          </h3>
          <p className={`text-sm md:text-base font-light leading-[1.72] max-w-[32rem]
            ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
            {item.copy}
          </p>
        </div>

        {/* Result badge */}
        {item.result && (
          <div className={`shrink-0 self-center hidden md:flex items-center gap-2
            ${isArabic ? 'flex-row-reverse' : ''}`}>
            <span className={`text-[9px] font-bold tracking-[0.36em] uppercase px-4 py-2 rounded-full border
              ${isDark
                ? 'border-white/[0.10] text-white/35 bg-white/[0.03]'
                : 'border-[#d9d5ca] text-[#8c8780] bg-white/60'
              }`}>
              {item.result}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})
DynamicServiceRow.displayName = 'DynamicServiceRow'

// ─── ClarityCard ─────────────────────────────────────────────────────────────
interface ClarityCardProps {
  card: { title: string; lead: string; copy: string }
  isDark: boolean
}

const ClarityCard = memo(({ card, isDark }: ClarityCardProps) => (
  <div className={`rounded-2xl p-8 flex flex-col gap-4 border
    ${isDark ? 'bg-white/[0.03] border-white/[0.07]' : 'bg-white border-[#d9d5ca]'}`}>
    <span className={`text-[9px] font-bold tracking-[0.44em] uppercase
      ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>
      {card.title}
    </span>
    <p className={`text-xl md:text-2xl font-display font-light leading-[1.2]
      ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
      {card.lead}
    </p>
    <p className={`text-sm font-light leading-[1.72]
      ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
      {card.copy}
    </p>
  </div>
))
ClarityCard.displayName = 'ClarityCard'

// ─── ProcessStep ─────────────────────────────────────────────────────────────
interface ProcessStepProps {
  card: { title: string; copy: string; align?: string }
  step: string
  index: number
  isDark: boolean
}

const ProcessStep = memo(({ card, step, index, isDark }: ProcessStepProps) => (
  <div className={`flex flex-col gap-5 p-8 rounded-2xl border
    ${isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-white border-[#d9d5ca]'}`}>
    <div className={`flex items-center gap-3`}>
      <span className={`font-mono text-[9px] tracking-[0.44em] uppercase
        ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className={`h-px flex-1 ${isDark ? 'bg-white/[0.07]' : 'bg-[#d9d5ca]'}`} />
    </div>
    <p className={`text-[9px] font-bold tracking-[0.44em] uppercase
      ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>
      {step}
    </p>
    <h4 className={`text-2xl md:text-3xl font-display font-light leading-[1.1]
      ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
      {card.title}
    </h4>
    <p className={`text-sm font-light leading-[1.72]
      ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
      {card.copy}
    </p>
  </div>
))
ProcessStep.displayName = 'ProcessStep'

// ─── TestimonialCard ─────────────────────────────────────────────────────────
interface TestimonialCardProps {
  testimonial: { quote: string; name: string; role: string }
  isDark: boolean
}

const TestimonialCard = memo(({ testimonial, isDark }: TestimonialCardProps) => (
  <div className={`flex flex-col gap-6 p-8 md:p-10 rounded-2xl border
    ${isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-white border-[#d9d5ca]'}`}>
    <p className={`text-xl md:text-2xl font-display font-light leading-[1.4] italic
      ${isDark ? 'text-white/80' : 'text-[#18160f]'}`}>
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className={`flex flex-col gap-1 pt-4 border-t
      ${isDark ? 'border-white/[0.07]' : 'border-[#d9d5ca]'}`}>
      <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-[#18160f]'}`}>
        {testimonial.name}
      </span>
      <span className={`text-[11px] tracking-[0.2em] uppercase ${isDark ? 'text-white/30' : 'text-[#8c8780]'}`}>
        {testimonial.role}
      </span>
    </div>
  </div>
))
TestimonialCard.displayName = 'TestimonialCard'

// ─── AnimatedCounter ─────────────────────────────────────────────────────────
const AnimatedCounter = memo(({ value, label, isDark }: { value: string; label: string; isDark: boolean }) => {
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
        onUpdate() {
          if (el) el.textContent = Math.round(counter.val) + suffix
        },
      })
    }, numRef)
    return () => ctx.revert()
  }, [value])
  return (
    <div>
      <div className={`h-px w-10 mb-3 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
      <span className={`text-[9px] font-bold tracking-[0.44em] uppercase block mb-2 ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>{label}</span>
      <div ref={numRef} className={`font-display font-light leading-[0.9] text-[5rem] md:text-[7rem] lg:text-[8rem] ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
        {value}
      </div>
    </div>
  )
})
AnimatedCounter.displayName = 'AnimatedCounter'

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ themeMode }: HomeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLElement>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)

  const { setType } = useCursor()

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
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.hero-line',       { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' })
        .from('.hero-body',       { y: 30, opacity: 0, duration: 0.8, ease: ANIMATION.ease.smooth }, '-=0.8')
        .from('.hero-meta',       { y: 20, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-cta',        { y: 20, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth }, '-=0.5')
        .from('.hero-video-wrap', { opacity: 0, duration: 1.5, ease: 'none' }, 0)

      if (heroRef.current) {
        gsap.to('.hero-video-wrap', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        gsap.to('.hero-content-inner', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
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
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-end overflow-hidden"
          onMouseEnter={() => setType('view')}
          onMouseLeave={() => setType('default')}
        >
          {/* Full-screen cinematic video loop */}
          <div className="hero-video-wrap absolute inset-0 will-change-transform">
            <CinematicVideo
              src={MEDIA.heroVideo}
              poster={MEDIA.heroPoster}
              className="w-full h-full scale-110"
            />
            {/* Layered scrims */}
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* heroTag — top left */}
          <div className={`hero-meta absolute top-10 z-20
            ${isArabic ? 'right-8 md:right-14' : 'left-8 md:left-14'}`}>
            <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/30">
              {copy.home.heroTag}
            </span>
          </div>

          {/* Studio badge — top right (flips to left for Arabic) */}
          <div className={`hero-meta absolute top-10 z-20
            ${isArabic ? 'left-8 md:left-14' : 'right-8 md:right-14'}`}>
            <span className="text-[9px] font-mono tracking-[0.42em] uppercase text-white/40
              border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md bg-white/[0.03]">
              {copy.home.heroMeta ?? 'Est. 2024 · AI & Digital Studio'}
            </span>
          </div>

          {/* Hero content */}
          <div className="hero-content-inner relative z-10 w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pb-24 md:pb-36">
            <div className={dir.text}>
              {/* Blend-mode typography */}
              <h1 className="font-display font-light leading-[0.85]
                text-[clamp(4.5rem,11vw,11rem)] mb-12 mix-blend-difference text-white">
                <span className="hero-line block overflow-hidden">
                  <span className="block">{copy.home.heroTitle1}</span>
                </span>
                <span className="hero-line block overflow-hidden italic text-white/70">
                  <span className="block">{copy.home.heroTitle2}</span>
                </span>
              </h1>

              {/* Sub-copy */}
              <p className={`hero-body text-base md:text-lg text-white/70 max-w-[34rem]
                leading-[1.72] font-light mb-14 ${isArabic ? 'mr-0 ml-auto lg:ml-0' : ''}`}>
                {copy.home.heroCopy}
              </p>

              {/* CTA row */}
              <div className={`hero-cta flex flex-wrap gap-6 items-center
                ${isArabic ? 'flex-row-reverse' : ''}`}>
                <MagneticButton
                  href="#contact"
                  variant="primary"
                  isDark
                  className={`inline-flex items-center gap-4 px-12 py-5 rounded-full
                    text-[11px] tracking-[0.32em] uppercase font-bold
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.home.ctaButton}
                  <svg width="15" height="8" viewBox="0 0 15 8" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1 4h13M8.5 1l4 3-4 3"
                      strokeWidth="1.4" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </MagneticButton>

                {/* Scroll indicator */}
                <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="relative w-px h-12 overflow-hidden bg-white/10">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-pulse" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.48em] uppercase text-white/30">
                    {copy.home.scrollLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ PROJECTS ════════════════════ */}
        <LazySection>
          <section aria-label="Featured projects" className={`border-b ${P.border}`}>
            {/* Section eyebrow */}
            <div className={`max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10 md:pb-16`}>
              <div className={`flex items-end justify-between gap-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={dir.text}>
                  <TextReveal>
                    <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
                      {copy.home.viewProjectLabel ?? 'Selected Work'}
                    </span>
                  </TextReveal>
                  <SplitText
                    text="Featured Projects"
                    className={`text-4xl md:text-5xl font-display font-light leading-[1.05]
                      ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                    type="words"
                  />
                </div>
                <TextReveal delay={0.1}>
                  <span className={`text-[10px] font-mono uppercase tracking-widest opacity-30 ${P.text} hidden md:block`}>
                    {copy.home.heroTag}
                  </span>
                </TextReveal>
              </div>
            </div>

            {/* Project cards — vertical editorial stack */}
            <div className="flex flex-col">
              {MEDIA.projects.map((project, i) => (
                <div key={project.id} className="mb-4 md:mb-6 last:mb-0">
                  <ProjectCard
                    project={project}
                    index={i}
                    isArabic={isArabic}
                    isDark={isDark}
                    align={(['left', 'right', 'center'] as const)[i]}
                  />
                </div>
              ))}
            </div>
          </section>
        </LazySection>

        {/* ════════════════════ SERVICES ════════════════════ */}
        <LazySection id="services">
          {/* Pause / expertise text block */}
          <div className={`relative ${P.bg} py-40 md:py-60 text-center px-6 md:px-12 overflow-hidden`}>
            <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-6 ${P.muted}`}>
              {copy.home.expertiseLabel}
            </span>
            <SplitText
              text={copy.home.expertiseTitle}
              className={`text-4xl md:text-6xl lg:text-7xl font-display font-light mx-auto
                ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
              type="words"
            />
            <div className="mt-8 max-w-xl mx-auto">
              <TextReveal delay={0.15}>
                <p className={`text-base md:text-lg font-light leading-[1.76]
                  ${isDark ? 'text-white/40' : 'text-[#56514a]'}`}>
                  {copy.home.expertiseCopy}
                </p>
              </TextReveal>
            </div>
          </div>

          {/* Fine-line divider */}
          <div className={`h-px w-full ${isDark ? 'bg-white/[0.07]' : 'bg-[#d9d5ca]'}`} />

          {/* Services body */}
          <div className={`relative overflow-hidden ${P.bg} pt-20 md:pt-28 pb-20 md:pb-28`}>
            {/* Ghost typography accent */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center
                text-[28vw] font-display font-bold leading-none
                opacity-[0.025] mix-blend-overlay
                pointer-events-none select-none"
            >
              SCALE
            </span>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
              {/* Section header */}
              <div className={`mb-16 ${dir.text}`}>
                <TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
                    {copy.home.coreLabel}
                  </span>
                </TextReveal>
                <div className={`h-px w-16 mb-8 ${isDark ? 'bg-white/[0.07]' : 'bg-[#d9d5ca]'}`} />
                <SplitText
                  text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                  className={`text-5xl md:text-6xl lg:text-[5rem] font-display font-light leading-[0.95]
                    ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}
                  type="words"
                />
              </div>

              {/* Clarity cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
                {copy.home.clarity.map((card, i) => (
                  <ClarityCard key={i} card={card} isDark={isDark} />
                ))}
              </div>

              {/* Dynamic service rows */}
              <div className={`border-t ${P.border}`}>
                {copy.home.serviceTracks.map((track, i) => (
                  <DynamicServiceRow
                    key={i}
                    item={track}
                    index={i}
                    imageSrc={MEDIA.services[i] ?? MEDIA.services[0]}
                    isArabic={isArabic}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          </div>
        </LazySection>

        {/* ════════════════════ ABOUT / STATS ════════════════════ */}
        <LazySection id="about">
          <div className={`relative overflow-hidden ${P.bg} pt-24 md:pt-36 pb-24 md:pb-36`}>
            {/* Ghost typography accent */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-start pl-8
                text-[30vw] font-display font-bold leading-none
                opacity-[0.025] mix-blend-overlay
                pointer-events-none select-none"
            >
              {copy.home.methodTitle.charAt(0)}
            </span>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
              {/* Section eyebrow */}
              <TextReveal>
                <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-16 ${P.muted}`}>
                  {copy.home.methodTitle}
                </span>
              </TextReveal>

              {/* Two-column: vision text + stats */}
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24`}>
                {/* Left: vision text */}
                <div className={dir.text}>
                  <TextReveal>
                    <p className={`text-lg md:text-xl font-light leading-[1.8] mb-6
                      ${isDark ? 'text-white/60' : 'text-[#56514a]'}`}>
                      {copy.home.expertiseCopy}
                    </p>
                  </TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.44em] uppercase
                    ${isDark ? 'text-white/20' : 'text-[#8c8780]'}`}>
                    {copy.home.expertiseLabel}
                  </span>
                </div>

                {/* Right: animated counters */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-10 ${isArabic ? 'text-right' : 'text-left'}`}>
                  {copy.home.impactStats.map((stat, i) => (
                    <AnimatedCounter
                      key={i}
                      value={stat.value}
                      label={stat.label}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>

              {/* ProcessStep cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {copy.home.methodCards.map((card, i) => (
                  <ProcessStep
                    key={i}
                    card={card}
                    step={copy.home.methodSteps[i] ?? ''}
                    index={i}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Method copy */}
              <div className="max-w-2xl mb-24">
                <TextReveal>
                  <p className={`text-lg md:text-xl font-light leading-[1.8]
                    ${isDark ? 'text-white/50' : 'text-[#56514a]'}`}>
                    {copy.home.methodCopy}
                  </p>
                </TextReveal>
              </div>

              {/* Testimonials sub-section */}
              <div className="mb-4">
                <TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-12 ${P.muted}`}>
                    {copy.home.testimonialsTitle}
                  </span>
                </TextReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                  {copy.home.testimonials.slice(0, 2).map((t, i) => (
                    <div key={i} className={i === 1 ? 'md:mt-24' : ''}>
                      <TestimonialCard testimonial={t} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LazySection>

        {/* ════════════════════ CONTACT CTA ════════════════════ */}
        <LazySection id="contact" className="scroll-mt-28">
          <section
            className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center overflow-hidden rounded-3xl mb-24 md:mb-36 bg-[#080807] text-white mx-4 md:mx-8 lg:mx-12"
          >
            {/* Ambient light orbs */}
            <div aria-hidden="true" className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-white/[0.018] blur-[200px] pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-48 -right-48 w-[550px] h-[550px] rounded-full bg-white/[0.012] blur-[170px] pointer-events-none" />

            {/* Content */}
            <div className={`relative z-10 w-full max-w-4xl mx-auto px-8 md:px-14 py-24 md:py-36
              ${isArabic ? 'text-right' : 'text-center'}`}>

              {/* CTA label eyebrow */}
              <TextReveal>
                <span className="text-[9px] font-bold tracking-[0.48em] uppercase block mb-12 text-white/25">
                  {copy.home.ctaLabel}
                </span>
              </TextReveal>

              {/* CTA title */}
              <SplitText
                text={copy.home.ctaTitle}
                className="text-[clamp(4.5rem,10vw,12rem)] font-display font-light leading-[0.88] mb-12 overflow-visible text-white/90 text-center"
                type="words"
                delay={0.1}
              />

              {/* CTA body copy */}
              <TextReveal delay={0.22}>
                <p className={`text-base md:text-lg font-light leading-[1.76] mb-14 max-w-[28rem] mx-auto text-white/40
                  ${isArabic ? 'text-right' : ''}`}>
                  {copy.home.ctaCopy}
                </p>
              </TextReveal>

              {/* Availability badge */}
              <TextReveal delay={0.30}>
                <div className={`inline-flex items-center gap-3 mb-14 px-5 py-2.5 rounded-full border border-white/[0.10] backdrop-blur-sm
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

              {/* MagneticButton */}
              <MagneticButton
                href="mailto:hello@lightlab.dev"
                isDark
                variant="primary"
                className={`inline-flex items-center gap-4 px-12 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase
                  ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                {copy.home.ctaButton}
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"
                  className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1 4h14M9 1l4 3-4 3"
                    strokeWidth="1.4" stroke="currentColor"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MagneticButton>
            </div>

            {/* Bottom wordmark watermark */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[11vw] overflow-hidden pointer-events-none flex items-start justify-center">
              <span className="text-[20vw] font-display font-bold leading-none whitespace-nowrap select-none text-white/[0.022] translate-y-[18%]">
                LIGHTLAB
              </span>
            </div>
          </section>
        </LazySection>

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
