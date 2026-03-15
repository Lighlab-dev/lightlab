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
const DK = {
  bg:     'bg-[#090909]',
  text:   'text-white',
  stone:  'text-white/50',
  muted:  'text-white/25',
  border: 'border-white/[0.07]',
  cardBg: 'bg-white/[0.04]',
  faint:  'bg-white/[0.02]',
}
const P = DK
const ACCENT = '#FF3B3B'
const GOLD = '#C6A96B'

// ─── Media assets ─────────────────────────────────────────────────────────────
const MEDIA = {
  heroVideo: 'https://player.vimeo.com/external/494252666.sd.mp4?s=7297370e7674844339f8164366539e6a00839e9f&profile_id=165',
  heroPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
  projects: [
    {
      id: 'prj-03',
      title: 'Media Scale',
      category: 'Media Buying',
      result: '-40% CAC',
      tag: 'Featured',
      desc: 'Scaled paid acquisition across 6 channels, cutting cost-per-acquisition by 40% in 90 days.',
      videoSrc: 'https://player.vimeo.com/external/291648067.sd.mp4?s=94350b646e6b5e10aa85264f7e01fdb64c31e0e2&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90',
    },
    {
      id: 'prj-01',
      title: 'AI Revenue Engine',
      category: 'AI Automation',
      result: '+52% Leads',
      tag: '',
      desc: '',
      videoSrc: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aaa35f1d0ffe1ca&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    },
    {
      id: 'prj-02',
      title: 'Growth Platform',
      category: 'Development',
      result: '4x ROI',
      tag: '',
      desc: '',
      videoSrc: 'https://player.vimeo.com/external/370467553.sd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bab71348&profile_id=165',
      poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    },
  ],
}

// ─── Service icons ────────────────────────────────────────────────────────────
const SERVICE_ICONS = [
  // Brain / AI
  <svg key="ai" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>,
  // Code brackets
  <svg key="code" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  // Chart / growth
  <svg key="chart" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>,
  // Target / marketing
  <svg key="target" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>,
]

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
const ProjectCard = memo(({ project, index, featured = false, viewLabel = 'View Case' }: {
  project: typeof MEDIA.projects[0]
  index: number
  featured?: boolean
  viewLabel?: string
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { setType } = useCursor()

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {})
    setType('play')
    if (cardRef.current)
      gsap.to(cardRef.current, { scale: 1.013, duration: 0.6, ease: 'power2.out', overwrite: true })
  }

  const handleMouseLeave = () => {
    videoRef.current?.pause()
    setType('default')
    if (cardRef.current)
      gsap.to(cardRef.current, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power3.out', overwrite: true })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    gsap.to(cardRef.current, { rotateX: -y * 2.5, rotateY: x * 2.5, duration: 0.4, ease: 'power2.out', overwrite: true })
  }

  return (
    <div
      ref={cardRef}
      className="group relative w-full h-full overflow-hidden rounded-3xl cursor-none will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Base image */}
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.07]"
        loading="lazy"
      />
      {/* Video crossfade */}
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted playsInline loop
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />

      {/* Static gradient — always visible for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/5" />
      {/* Hover vignette from sides */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

      {/* Top bar: index + tags */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-6 flex items-start justify-between">
        {/* Index pill */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/[0.08] text-[8px] font-bold tracking-[0.4em] uppercase text-white/40">
          <span className="w-1 h-1 rounded-full bg-[#FF3B3B]/60" aria-hidden="true" />
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Result badge */}
        {project.result && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.28em] uppercase
            bg-[#FF3B3B] text-white shadow-[0_0_20px_rgba(255,59,59,0.35)]
            translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-300">
            {project.result}
          </span>
        )}
      </div>

      {/* Ghost watermark */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display font-bold leading-none select-none pointer-events-none
          text-white/[0.025] transition-opacity duration-500 group-hover:opacity-50"
        style={{ fontSize: featured ? '22vw' : '14vw', overflow: 'hidden' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Bottom content — lifts slightly on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 translate-y-0 group-hover:-translate-y-1 transition-transform duration-500 ease-out">

        {/* Category row */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-5 h-px bg-[#FF3B3B]/60" aria-hidden="true" />
          <span className="text-[8px] font-mono tracking-[0.45em] uppercase text-white/40">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-display font-light text-white leading-[1.05] mb-0
          ${featured ? 'text-[clamp(1.6rem,3.5vw,2.6rem)]' : 'text-xl'}`}>
          {project.title}
        </h3>

        {/* Description — featured card only, reveals on hover */}
        {featured && project.desc && (
          <p className="text-[13px] font-light leading-[1.65] text-white/0 group-hover:text-white/55
            max-h-0 group-hover:max-h-16 overflow-hidden
            transition-all duration-500 ease-out mt-0 group-hover:mt-3">
            {project.desc}
          </p>
        )}

        {/* View link row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/0 group-hover:border-white/[0.08] transition-colors duration-500">
          <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-white/0 group-hover:text-white/40 transition-colors duration-400">
            {viewLabel}
          </span>
          <div className={`flex items-center justify-center rounded-full border border-white/0 group-hover:border-white/20
            bg-transparent group-hover:bg-white/[0.06] backdrop-blur-sm
            opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-400 ease-out
            ${featured ? 'w-10 h-10' : 'w-8 h-8'}`}
            aria-hidden="true"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 11L11 2M11 2H4.5M11 2V8.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#FF3B3B] to-[#FF3B3B]/40 transition-all duration-700 ease-out" />
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'

// ─── AnimatedCounter ─────────────────────────────────────────────────────────
const AnimatedCounter = memo(({ value, label }: {
  value: string; label: string; isDark: boolean
}) => {
  const numRef = useRef<HTMLSpanElement>(null)

  // Split into prefix (+/-), core digits, suffix (% x Avg etc.)
  const match     = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/)
  const prefix    = match?.[1] ?? ''
  const numericStr = match?.[2] ?? '0'
  const suffix    = match?.[3]?.trim() ?? ''
  const numeric   = parseFloat(numericStr)
  const isDecimal = numericStr.includes('.')

  useLayoutEffect(() => {
    const el = numRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const counter = { val: 0 }
      gsap.to(counter, {
        val: numeric,
        duration: 2.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate() {
          if (el) el.textContent = isDecimal
            ? counter.val.toFixed(1)
            : String(Math.round(counter.val))
        },
      })
    }, numRef)
    return () => ctx.revert()
  }, [numeric, isDecimal])

  return (
    <div className="flex flex-col gap-0">
      {/* Number row: prefix + stable-width number + suffix — no layout shift */}
      <div className="flex items-end gap-1 font-display font-light leading-none text-[#FF3B3B] whitespace-nowrap mb-6">
        {prefix && (
          <span className="text-[2.2rem] md:text-[3rem] opacity-55 mb-2 tabular-nums">{prefix}</span>
        )}
        {/* Invisible placeholder locks width; animated span overlays it absolutely */}
        <span
          className="relative inline-block tabular-nums"
          style={{
            fontSize: 'clamp(5rem,9vw,8rem)',
            filter: 'drop-shadow(0 0 32px rgba(255,59,59,0.25))',
          }}
        >
          <span aria-hidden="true" style={{ opacity: 0 }} className="select-none">{numericStr}</span>
          <span ref={numRef} aria-live="polite" className="absolute left-0 top-0 w-full text-left">0</span>
        </span>
        {suffix && (
          <span className="text-[1.5rem] md:text-[2rem] opacity-45 mb-2.5 ml-1 tabular-nums">{suffix}</span>
        )}
      </div>

      {/* Red gradient rule */}
      <span
        className="block h-[1.5px] mb-5 rounded-full"
        style={{ width: '4rem', background: 'linear-gradient(to right, rgba(255,59,59,0.6), transparent)' }}
        aria-hidden="true"
      />

      {/* Label */}
      <span className="text-[10px] font-bold tracking-[0.44em] uppercase text-white/40">
        {label}
      </span>
    </div>
  )
})
AnimatedCounter.displayName = 'AnimatedCounter'

// ─── TrustSignals ─────────────────────────────────────────────────────────────
interface TrustSignalsProps {
  isArabic: boolean
  P: typeof DK
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

const TRUST_METRICS = ['+35% Avg Growth', '4x Performance', '40% Faster']

const TrustSignals = memo(({ isArabic, P, dir, copy }: TrustSignalsProps) => (
  <LazySection className={`border-t ${P.border}`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">

      {/* Header row — label + headline left, metric chips right */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
        <div className={dir.text}>
          <TextReveal>
            <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
              {copy.home.trustSignals.label}
            </span>
          </TextReveal>
          <p className="text-2xl md:text-3xl font-display font-light leading-[1.35] text-white/70 max-w-sm">
            Trusted by teams that demand results.
          </p>
        </div>
        <div className={`flex flex-wrap gap-2.5 shrink-0 ${isArabic ? 'justify-end' : ''}`}>
          {TRUST_METRICS.map((metric) => (
            <span
              key={metric}
              className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.28em] uppercase
                px-4 py-2 rounded-full border
                border-[#FF3B3B]/20 text-[#FF3B3B]/55 bg-[#FF3B3B]/[0.03]"
            >
              <span className="w-1 h-1 rounded-full bg-current opacity-60" aria-hidden="true" />
              {metric}
            </span>
          ))}
        </div>
      </div>

      {/* Client names — large editorial logo-wall */}
      <div className={`flex flex-wrap items-center justify-between gap-x-10 gap-y-6
        py-12 md:py-14 border-t border-b ${P.border} mb-12`}>
        {copy.home.trustSignals.clients.map((client) => (
          <span
            key={client.name}
            className={`font-display font-light text-xl md:text-2xl lg:text-3xl
              transition-all duration-400 cursor-default select-none
              opacity-[0.18] hover:opacity-75 hover:text-[#FF3B3B] ${P.text}`}
          >
            {client.name}
          </span>
        ))}
      </div>

      {/* Industry tags */}
      <div className={`flex flex-wrap gap-2 ${isArabic ? 'justify-end' : ''}`}>
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
  isArabic: boolean
  P: typeof DK
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

const HowWeWork = memo(({ isArabic, P, dir, copy }: HowWeWorkProps) => (
  <LazySection id="how-we-work">
    <div className={`border-t ${P.border}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className={`mb-16 ${dir.text}`}>
          <TextReveal>
            <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
              {copy.home.howWeWork.label}
            </span>
          </TextReveal>
          <SplitText
            text={copy.home.howWeWork.headline}
            className="text-3xl md:text-5xl font-display font-light leading-[1.08] text-white/90"
            type="words"
          />
        </div>

        {/* Steps grid */}
        <div className={`flex flex-col md:flex-row ${isArabic ? 'md:flex-row-reverse' : ''}`}>
          {copy.home.howWeWork.steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative flex flex-col gap-5 p-8 md:p-10 flex-1
                border-t border-white/[0.07]
                ${i < copy.home.howWeWork.steps.length - 1 ? 'md:border-r md:border-white/[0.07]' : ''}`}
            >
              {/* Ghost step number */}
              <span
                aria-hidden="true"
                className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} font-display font-light leading-none select-none pointer-events-none
                  text-[4rem] text-white opacity-[0.06]`}
              >
                {step.number}
              </span>

              <span className="font-mono text-[9px] tracking-[0.44em] uppercase text-white/20">
                {step.number}
              </span>
              <span className="h-px w-10 bg-white/10" />
              <h4 className="text-xl md:text-2xl font-display font-light leading-tight text-white/90 pr-12">
                {step.title}
              </h4>
              <p className="text-sm font-light leading-[1.72] flex-1 text-white/40">
                {step.copy}
              </p>
              {step.number === '04' && (
                <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border border-white/[0.08] text-white/30">
                  {isArabic ? step.title + ' ←' : '→ ' + step.title}
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
  isArabic: boolean
  P: typeof DK
  dir: { text: string; flex: string }
  copy: ReturnType<typeof useLanguage>['copy']
}

const WhyLightlab = memo(({ isArabic, P, dir, copy }: WhyLightlabProps) => (
  <LazySection id="why-lightlab">
    <div className={`border-t ${P.border}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">

        {/* Header */}
        <div className={`flex items-end justify-between gap-8 mb-16 md:mb-20 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={dir.text}>
            <TextReveal>
              <div className={`flex items-center gap-3 mb-5 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                <span className={`text-[9px] font-bold tracking-[0.52em] uppercase ${P.muted}`}>
                  {copy.home.whyLightlab.label}
                </span>
              </div>
            </TextReveal>
            <SplitText
              text={copy.home.whyLightlab.headline}
              className="text-3xl md:text-5xl font-display font-light leading-[1.08] text-white/90"
              type="words"
            />
          </div>
          {/* Count badge */}
          <span className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border shrink-0
            text-[9px] font-bold tracking-[0.3em] tabular-nums
            border-white/[0.08] text-white/20">
            0{copy.home.whyLightlab.pillars.length}
          </span>
        </div>

        {/* Numbered pillar list */}
        <div className="divide-y divide-white/[0.06]">
          {copy.home.whyLightlab.pillars.map((pillar, i) => (
            <div
              key={i}
              className={`group flex items-start gap-6 md:gap-12 py-8 md:py-10
                transition-colors duration-300 hover:bg-white/[0.015] -mx-4 px-4 rounded-lg
                ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {/* Number */}
              <span className="shrink-0 text-[9px] font-bold tracking-[0.4em] tabular-nums mt-1
                text-white/20 group-hover:text-[#FF3B3B]/60 transition-colors duration-300">
                0{i + 1}
              </span>

              {/* Content — two-column on md+ */}
              <div className={`flex-1 flex flex-col md:flex-row md:gap-12 gap-3 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
                <h4 className="md:w-72 shrink-0 text-base md:text-lg font-display font-light leading-tight text-white/85">
                  {pillar.title}
                </h4>
                <p className="flex-1 text-sm font-light leading-[1.76] text-white/40">
                  {pillar.copy}
                </p>
              </div>

              {/* Arrow — appears on hover */}
              <span
                className={`shrink-0 mt-1 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                  transition-all duration-300 text-[#FF3B3B]/60
                  ${isArabic ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </LazySection>
))
WhyLightlab.displayName = 'WhyLightlab'

// ─── TickerMarquee ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'AI Systems',
  'Custom SaaS',
  'Growth Infrastructure',
  'Performance Marketing',
  'Revenue Engineering',
  'Automation',
]

const TickerMarquee = memo(() => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div
      className="overflow-hidden border-y border-white/[0.07]"
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-0 py-3"
        style={{
          animation: 'ticker-scroll 28s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-0 shrink-0">
            <span
              className={`text-[9px] font-bold tracking-[0.44em] uppercase px-6
                text-white/20
                ${i % 3 === 2 ? 'text-[#FF3B3B]/30' : ''}`}
            >
              {item}
            </span>
            {/* Separator */}
            <span className="text-[9px] shrink-0 text-white/10">–</span>
          </span>
        ))}
      </div>
    </div>
  )
})
TickerMarquee.displayName = 'TickerMarquee'

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ themeMode }: HomeProps) {
  void themeMode
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLElement>(null)
  const serviceCardsRef = useRef<HTMLDivElement>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)
  const { setType } = useCursor()

  const dir = useMemo(() => ({
    text: isArabic ? 'text-right' : 'text-left',
    flex: isArabic ? 'flex-row-reverse' : 'flex-row',
  }), [isArabic])

  // Merge i18n project text with MEDIA poster/video URLs
  const h = copy.home as Record<string, unknown>
  const i18nProjects = (h.projects as typeof MEDIA.projects | undefined) ?? []
  const projects = useMemo(() =>
    MEDIA.projects.map((media, i) => ({ ...media, ...(i18nProjects[i] ?? {}) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copy.home]
  )

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
        .from('.hero-rule',  { scaleX: 0, opacity: 0, duration: 0.6, ease: ANIMATION.ease.luxury, transformOrigin: isArabic ? 'right center' : 'left center' }, '-=0.3')
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
  }, [isArabic])

  // Service cards staggered entrance
  useLayoutEffect(() => {
    const container = serviceCardsRef.current
    if (!container) return
    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll('.service-card')
      if (!cards.length) return
      gsap.fromTo(cards,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: ANIMATION.ease.luxury,
          scrollTrigger: { trigger: container, start: 'top 82%', once: true },
        }
      )
    }, serviceCardsRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapperRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative min-h-screen transition-colors duration-500 ${P.bg} ${P.text}`}
    >
      {/* Scroll progress line — red accent */}
      <div
        aria-hidden="true"
        className={`fixed top-0 h-[1.5px] z-[100]
          ${isArabic ? 'right-0' : 'left-0'}`}
        style={{ width: `${scrollProgress * 100}%`, backgroundColor: `${ACCENT}` }}
      />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        onMouseEnter={() => setType('view')}
        onMouseLeave={() => setType('default')}
      >
        {/* Video background */}
        <div className="hero-media absolute inset-0 will-change-transform">
          <CinematicVideo
            src={MEDIA.heroVideo}
            poster={MEDIA.heroPoster}
            className="w-full h-full scale-105"
          />
          <div className="absolute inset-0 bg-[#090909]/72" />

          {/* Dot-grid background — red-tinted dots */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,59,59,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 90% 90% at 50% 40%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 40%, black 30%, transparent 100%)',
            }}
          />
        </div>

        {/* Bottom vignette — fades into page bg */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10
            bg-gradient-to-t from-[#090909] to-transparent"
        />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 py-32 md:py-44">
          {/* Tag — bold pill with red dot */}
          <div className="hero-tag mb-6">
            <span className="inline-flex items-center gap-2.5 text-[9px] font-bold tracking-[0.44em] uppercase
              px-4 py-2 rounded-full border
              border-white/10 text-white/50 bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] shrink-0" />
              {copy.home.heroTag}
            </span>
          </div>

          {/* Thin rule below tag */}
          <div className="hero-rule h-px w-16 mb-10 bg-[#FF3B3B]/20" />

          {/* Headline */}
          <h1 className={`font-display font-light leading-[0.92]
            text-[clamp(3.5rem,8.5vw,9rem)] mb-8 max-w-5xl text-white ${dir.text}`}>
            <span className="hero-line block">
              <span className="block">{copy.home.heroTitle1}</span>
            </span>
            <span className="hero-line block italic opacity-70">
              <span className="block">{copy.home.heroTitle2}</span>
            </span>
          </h1>

          {/* Sub-copy */}
          <p className={`hero-copy text-base md:text-lg font-light leading-[1.76]
            max-w-[32rem] mb-10 text-white/55 ${dir.text}`}>
            {copy.home.heroCopy}
          </p>

          {/* CTAs + proof strip */}
          <div className={`hero-cta flex flex-wrap gap-4 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
            {/* Primary CTA — always red accent */}
            <MagneticButton
              href="#contact"
              variant="primary"
              isDark
              style={{ backgroundColor: '#FF3B3B', color: '#ffffff', borderColor: '#FF3B3B' }}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                text-[11px] tracking-[0.28em] uppercase font-bold border
                hover:bg-[#E02E2E] hover:border-[#E02E2E]
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
              isDark
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full
                text-[11px] tracking-[0.28em] uppercase font-bold
                border-white/15 text-white/60 hover:text-white
                ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {copy.home.heroCtaSecondary}
            </MagneticButton>
          </div>

          {/* Proof strip — three social-proof stats */}
          <div className={`hero-cta mt-10 pt-8 border-t border-white/[0.07] flex items-center gap-8 flex-wrap ${isArabic ? 'flex-row-reverse' : ''}`}>
            {[
              { n: '40+', label: 'Brands scaled' },
              { n: '3.8×', label: 'Avg. ROAS' },
              { n: '97%', label: 'On-time delivery' },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                {i > 0 && <span className="w-px h-6 bg-white/[0.08]" aria-hidden="true" />}
                <span className="font-display font-light text-2xl text-white/70">{s.n}</span>
                <span className="text-[9px] font-bold tracking-[0.38em] uppercase text-white/[0.28]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-14 z-20
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

      {/* ══════════════════════════ TICKER ══════════════════════════ */}
      <TickerMarquee />

      {/* ══════════════════════════ TRUST SIGNALS ══════════════════════════ */}
      <TrustSignals isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ SERVICES ══════════════════════════ */}
      <LazySection id="services">
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={dir.text}>
                <TextReveal>
                  <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
                    {copy.home.coreLabel}
                  </span>
                </TextReveal>
                <SplitText
                  text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                  className="text-3xl md:text-5xl font-display font-light leading-[1.08] text-white/90"
                  type="words"
                />
              </div>
              <TextReveal delay={0.1}>
                <a href="/services"
                  className={`text-[10px] font-bold tracking-[0.32em] uppercase
                    flex items-center gap-2 shrink-0 transition-opacity hover:opacity-70 text-white/40
                    ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {copy.home.servicesCta}
                  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1 3h10M7 1l3 2-3 2" strokeWidth="1.3" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </TextReveal>
            </div>

            {/* Service cards with GSAP stagger */}
            <div ref={serviceCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {copy.home.serviceTracks.map((track, i) => (
                <div
                  key={i}
                  className={`service-card group relative flex flex-col gap-6 p-10 rounded-3xl border min-h-[280px]
                    overflow-hidden transition-all duration-300 cursor-default
                    ${P.cardBg} ${P.border} hover:bg-white/[0.07]
                    hover:shadow-[0_0_0_1px_rgba(255,59,59,0.3),0_8px_32px_rgba(255,59,59,0.08)]`}
                >
                  {/* Red top hairline — reveals on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.5), transparent)' }}
                    aria-hidden="true"
                  />

                  {/* Icon — red accent background */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center
                    bg-[#FF3B3B]/10 text-[#FF3B3B]/80
                    transition-colors duration-300">
                    {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                  </div>

                  {/* Index */}
                  <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3 className="text-xl md:text-2xl font-display font-light leading-tight text-white/90">
                    {track.title}
                  </h3>
                  <p className="text-sm font-light leading-[1.72] flex-1 text-white/40">
                    {track.copy}
                  </p>
                  {track.result && (
                    <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border
                      border-[#FF3B3B]/20 text-[#FF3B3B]/70 bg-[#FF3B3B]/5">
                      {isArabic ? track.result + ' ↑' : '↑ ' + track.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ HOW WE WORK ══════════════════════════ */}
      <HowWeWork isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ PROJECTS ══════════════════════════ */}
      <LazySection id="projects">
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">

            {/* Header */}
            <div className={`mb-12 md:mb-16 flex items-end justify-between gap-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {/* Left: eyebrow + title + subtitle */}
              <div className={isArabic ? 'text-right' : ''}>
                <TextReveal>
                  <div className={`flex items-center gap-3 mb-5 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                    <span className={`text-[9px] font-bold tracking-[0.52em] uppercase ${P.muted}`}>
                      {(copy.home as Record<string, unknown>).projectsEyebrow as string ?? 'Case Studies'}
                    </span>
                    <span className="text-[9px] font-mono text-[#FF3B3B]/40 tabular-nums">
                      {projects.length.toString().padStart(2, '0')}
                    </span>
                  </div>
                </TextReveal>
                <SplitText
                  text={copy.home.projectsSectionTitle}
                  className="text-3xl md:text-5xl font-display font-light leading-[1.08] text-white/90"
                  type="words"
                />
                <TextReveal delay={0.12}>
                  <p className={`mt-3 text-sm font-light leading-relaxed ${P.stone} max-w-xs`}>
                    {(copy.home as Record<string, unknown>).projectsSubtitle as string ?? 'Real engagements. Measurable outcomes.'}
                  </p>
                </TextReveal>
              </div>

              {/* Right: view-all button — desktop only */}
              <TextReveal delay={0.1}>
                <a
                  href="/projects"
                  className={`hidden md:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-300 shrink-0
                    text-[9px] font-bold tracking-[0.28em] uppercase
                    border-white/[0.1] text-white/40 hover:border-[#FF3B3B]/40 hover:text-white/80
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.home.viewAllLabel}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                    className={isArabic ? 'scale-x-[-1]' : ''}>
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </TextReveal>
            </div>

            {/* Asymmetric layout: featured left (2/3) + two stacked right (1/3) */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[620px]">
              {/* Featured — Media Buying */}
              <a href="/projects" className="md:flex-[2.2] h-[440px] md:h-full block">
                <ProjectCard project={projects[0]} index={0} featured viewLabel={copy.home.viewProjectLabel} />
              </a>
              {/* Right column — two stacked */}
              <div className="md:flex-1 flex flex-col gap-3 md:gap-4 md:h-full">
                {projects.slice(1).map((project, i) => (
                  <a key={project.id} href="/projects" className="flex-1 h-[220px] md:h-auto block">
                    <ProjectCard project={project} index={i + 1} viewLabel={copy.home.viewProjectLabel} />
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile view-all */}
            <div className={`mt-6 md:hidden ${isArabic ? 'text-right' : ''}`}>
              <a
                href="/projects"
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border
                  text-[9px] font-bold tracking-[0.28em] uppercase transition-all duration-300
                  border-white/[0.1] text-white/40 hover:border-[#FF3B3B]/40 hover:text-white/80
                  ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                {copy.home.viewAllLabel}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                  className={isArabic ? 'scale-x-[-1]' : ''}>
                  <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ STATS ══════════════════════════ */}
      <LazySection id="stats">
        <div className="relative bg-[#060606] overflow-hidden">
          {/* Ambient red glow — center */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,59,59,0.05) 0%, transparent 70%)' }}
          />
          {/* Dot grid texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.018]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-36">
            {/* Eyebrow row */}
            <div className={`flex items-center gap-5 mb-20 md:mb-28 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="w-5 h-px bg-[#FF3B3B]/40 shrink-0" aria-hidden="true" />
              <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/[0.18] shrink-0">
                By the Numbers
              </span>
              <span className="flex-1 h-px bg-white/[0.05]" aria-hidden="true" />
            </div>

            {/* Counters — vertical dividers on desktop */}
            <div className={`grid grid-cols-1 md:grid-cols-3
              divide-y md:divide-y-0 md:divide-x divide-white/[0.05]
              ${isArabic ? 'text-right' : ''}`}>
              {copy.home.impactStats.map((stat, i) => (
                <div
                  key={i}
                  className={`
                    ${i === 0 ? 'pb-14 md:pb-0 md:pr-20' : ''}
                    ${i === 1 ? 'py-14 md:py-0 md:px-20' : ''}
                    ${i === 2 ? 'pt-14 md:pt-0 md:pl-20' : ''}
                  `}
                >
                  <AnimatedCounter value={stat.value} label={stat.label} isDark={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════ */}
      <LazySection>
        <div className={`border-t ${P.border}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
            <div className={`mb-14 ${dir.text}`}>
              <TextReveal>
                <span className={`text-[9px] font-bold tracking-[0.52em] uppercase block mb-4 ${P.muted}`}>
                  {copy.home.testimonialsTitle}
                </span>
              </TextReveal>
              <SplitText
                text={copy.home.testimonialsSubtitle ?? 'What clients say'}
                className="text-3xl md:text-5xl font-display font-light leading-[1.08] max-w-xl text-white/90"
                type="words"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copy.home.testimonials.slice(0, 2).map((t, i) => (
                <div
                  key={i}
                  className="relative flex flex-col p-10 md:p-12 rounded-3xl border overflow-hidden
                    bg-gradient-to-b from-white/[0.035] to-transparent border-white/[0.08]"
                >
                  {/* Red top accent */}
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.4), transparent 60%)' }}
                  />

                  {/* Ghost quote mark — large, dramatic */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-3 ${isArabic ? 'left-6' : 'right-7'} font-display font-bold leading-none select-none pointer-events-none
                      text-[#FF3B3B]/[0.07]`}
                    style={{ fontSize: '11rem' }}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className={`flex gap-1 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`} aria-label="5 star rating">
                    {[...Array(5)].map((_, si) => (
                      <svg key={si} width="11" height="11" viewBox="0 0 12 12" fill="currentColor"
                        className="text-[#FF3B3B]/75" aria-hidden="true">
                        <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 7.95 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z" />
                      </svg>
                    ))}
                  </div>

                  <p className="relative z-10 text-xl md:text-2xl font-display font-light leading-[1.52] italic flex-1 text-white/82">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className={`flex items-center gap-4 mt-10 pt-6 border-t border-white/[0.06]
                    ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      bg-gradient-to-br from-[#FF3B3B]/15 to-[#FF3B3B]/5 text-[#FF3B3B]/70 border border-[#FF3B3B]/15">
                      {t.name.charAt(0)}
                    </div>
                    <div className={dir.text}>
                      <div className="text-sm font-medium" style={{ color: GOLD }}>
                        {t.name}
                      </div>
                      <div className="text-[10px] tracking-[0.18em] uppercase text-white/25">
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
      <WhyLightlab isArabic={isArabic} P={P} dir={dir} copy={copy} />

      {/* ══════════════════════════ CONTACT CTA ══════════════════════════ */}
      <LazySection id="contact" className="scroll-mt-24">
        {/* Full-bleed dark stage */}
        <div className="relative bg-[#060606] overflow-hidden">

          {/* Top divider */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/[0.07]" aria-hidden="true" />

          {/* Dot-grid texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Centered radial red ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-[900px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,59,59,0.09) 0%, rgba(255,59,59,0.03) 40%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-20 md:pt-36 md:pb-28">
            <div
              className={`grid grid-cols-1 lg:gap-20 items-start
                ${isArabic
                  ? 'lg:grid-cols-[380px,1fr]'
                  : 'lg:grid-cols-[1fr,380px]'
                }`}
              style={{ gap: 'clamp(3rem, 5vw, 5rem)' }}
            >

              {/* Left: main content */}
              <div className={isArabic ? 'text-right' : ''}>
                <TextReveal>
                  <div className={`flex items-center gap-3 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/30">
                      {copy.home.ctaLabel}
                    </span>
                  </div>
                </TextReveal>

                <SplitText
                  text={copy.home.ctaTitle}
                  className={`text-[clamp(3.8rem,8vw,8.5rem)] font-display font-light leading-[0.86] text-white/92 mb-10
                    ${isArabic ? 'text-right' : ''}`}
                  type="words"
                  delay={0.06}
                />

                <TextReveal delay={0.12}>
                  <p className="text-base font-light leading-[1.76] mb-10 max-w-sm text-white/38">
                    {copy.home.ctaCopy}
                  </p>
                </TextReveal>

                {/* Availability badge */}
                <TextReveal delay={0.18}>
                  <div className={`inline-flex items-center gap-3 mb-12 px-4 py-2 rounded-full
                    border border-white/[0.07] bg-white/[0.02] ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/28">
                      {copy.home.ctaMeta}: {copy.home.ctaMetaValue}
                    </span>
                  </div>
                </TextReveal>

                {/* CTA buttons */}
                <TextReveal delay={0.22}>
                  <div className={`flex flex-col sm:flex-row gap-3 items-start ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                    <MagneticButton
                      href="mailto:hello@lightlab.dev"
                      isDark
                      variant="primary"
                      style={{ backgroundColor: '#FF3B3B', color: '#ffffff', borderColor: '#FF3B3B' }}
                      className={`group inline-flex items-center gap-3 px-10 py-5 rounded-full
                        text-[11px] font-bold tracking-[0.24em] uppercase border
                        transition-all duration-300 ease-out
                        hover:bg-[#E02E2E] hover:shadow-[0_0_32px_rgba(255,59,59,0.25)]
                        ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                      {copy.home.ctaButtonStart}
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"
                        className={`transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}>
                        <path d="M1 4h12M7.5 1l3.5 3-3.5 3" strokeWidth="1.4" stroke="currentColor"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </MagneticButton>

                    <MagneticButton
                      href="/contact"
                      variant="outline"
                      isDark
                      className={`inline-flex items-center gap-3 px-10 py-5 rounded-full
                        text-[11px] font-bold tracking-[0.24em] uppercase
                        border-white/[0.10] text-white/40
                        transition-all duration-300 ease-out
                        hover:text-white hover:border-white/20 hover:bg-white/[0.04]
                        ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                      {copy.home.ctaButton2}
                    </MagneticButton>
                  </div>
                </TextReveal>
              </div>

              {/* Right: "What happens next" timeline card */}
              <TextReveal delay={0.1}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]
                  overflow-hidden relative"
                  style={{ borderTop: '1px solid #FF3B3B' }}>

                  {/* Red top glow bleed */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-28"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,59,59,0.06), transparent)',
                    }}
                  />

                  <div className="relative p-7 md:p-8">
                    <p className="text-[9px] font-bold tracking-[0.48em] uppercase mb-8 text-white/22">
                      {(h.ctaStepsHeadline as string) ?? 'What happens next'}
                    </p>

                    {/* Vertical timeline */}
                    <div className="relative">
                      {/* Connecting line */}
                      <div
                        aria-hidden="true"
                        className={`absolute top-3 bottom-3 w-px bg-white/[0.06]
                          ${isArabic ? 'right-3' : 'left-3'}`}
                      />

                      <div className="flex flex-col gap-7">
                        {((h.ctaSteps as Array<{num: string; title: string; copy: string}>) ?? []).map((step) => (
                          <div
                            key={step.num}
                            className={`flex gap-5 ${isArabic ? 'flex-row-reverse text-right' : ''}`}
                          >
                            {/* Numbered ring circle */}
                            <div className="shrink-0 w-6 h-6 rounded-full border border-[#FF3B3B]/35
                              flex items-center justify-center mt-0.5 bg-[#060606]">
                              <span className="text-[8px] font-bold tabular-nums text-[#FF3B3B]/55">
                                {step.num}
                              </span>
                            </div>

                            <div className="pb-0">
                              <p className="text-sm font-medium mb-1 text-white/72">
                                {step.title}
                              </p>
                              <p className="text-[12px] font-light leading-[1.65] text-white/28">
                                {step.copy}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom note */}
                    <div className={`mt-8 pt-6 border-t border-white/[0.05] flex items-center gap-3
                      ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="w-4 h-px bg-[#FF3B3B]/35" aria-hidden="true" />
                      <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/18">
                        hello@lightlab.dev
                      </span>
                    </div>
                  </div>
                </div>
              </TextReveal>

            </div>
          </div>

          {/* Social proof row */}
          <div className="relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex justify-center">
              <p className="text-[9px] font-bold tracking-[0.38em] uppercase text-white/18 text-center">
                Trusted by 40+ brands across SaaS, E-Commerce &amp; HealthTech
              </p>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]" aria-hidden="true" />
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

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-pulse { animation: none; opacity: 0.3; }
          [style*="ticker-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Home
