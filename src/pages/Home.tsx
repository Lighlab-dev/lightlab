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

        {/* ════════════ PLACEHOLDER SECTIONS (plan 04) ════════════ */}
        <section id="services">
          {/* TODO: plan 04 */}
        </section>

        <section id="about">
          {/* TODO: plan 04 */}
        </section>

        <section id="contact">
          {/* TODO: plan 04 */}
        </section>

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
