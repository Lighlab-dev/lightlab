import { useLayoutEffect, useRef, useMemo, memo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  TextReveal,
  SplitText,
  MagneticButton,
  ANIMATION,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = '#FF3B3B'

// ─── Outcome data (hardcoded per spec) ───────────────────────────────────────
const TRACK_OUTCOMES = [
  { metric: '60%',  label: 'reduction in manual operations' },
  { metric: '2×',   label: 'faster time to market' },
  { metric: '3.8×', label: 'average ROAS' },
] as const

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

// ─── Track type ───────────────────────────────────────────────────────────────
type Track = {
  readonly title: string
  readonly description: string
  readonly deliverables: readonly string[]
  readonly tech: readonly string[]
  readonly icon: string
  readonly hint: string
}

// ─── OutcomeCard ──────────────────────────────────────────────────────────────
const OutcomeCard = memo(({
  metric, label, deliverables, index, isArabic
}: {
  metric: string
  label: string
  deliverables: readonly string[]
  index: number
  isArabic: boolean
}) => (
  <div className={`relative rounded-3xl border border-white/[0.07]
    bg-gradient-to-b from-white/[0.03] to-transparent
    p-10 md:p-14 overflow-hidden group ${isArabic ? 'text-right' : ''}`}>

    {/* Top red hairline */}
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-px"
      style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.45), transparent)' }}
    />

    {/* Top-left ambient glow */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(255,59,59,0.05), transparent 70%)' }}
    />

    <div className="relative z-10">
      {/* Metric number */}
      <div
        className="font-display font-light leading-none mb-3"
        style={{
          fontSize: 'clamp(4rem,8vw,7rem)',
          color: ACCENT,
          filter: 'drop-shadow(0 0 24px rgba(255,59,59,0.22))',
        }}
      >
        {metric}
      </div>

      {/* Red gradient separator */}
      <span
        aria-hidden="true"
        className="block h-px mb-3 rounded-full"
        style={{ width: '3rem', background: 'linear-gradient(to right, rgba(255,59,59,0.45), transparent)' }}
      />

      {/* Metric label */}
      <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/35 mb-8 max-w-[18ch]">
        {label}
      </p>

      {/* Divider */}
      <div className="border-t border-white/[0.07] mb-8" />

      {/* Numbered deliverables */}
      <ol className={`space-y-4 mb-10 ${isArabic ? 'text-right' : ''}`}>
        {deliverables.map((item, i) => (
          <li key={i} className={`flex items-center gap-4 group/item ${isArabic ? 'flex-row-reverse' : ''}`}>
            <span
              className="shrink-0 font-display font-light tabular-nums"
              style={{ fontSize: '0.65rem', color: 'rgba(255,59,59,0.55)', letterSpacing: '0.08em' }}
            >
              0{i + 1}
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 w-px h-3 bg-white/[0.12]"
            />
            <span className="text-sm font-light text-white/55 group-hover/item:text-white/80 transition-colors duration-300">
              {item}
            </span>
          </li>
        ))}
      </ol>

      {/* Start this track link */}
      <a
        href="/contact"
        className={`inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.22em] uppercase
          text-white/35 hover:text-white/75 transition-colors duration-300
          ${isArabic ? 'flex-row-reverse' : ''}`}
      >
        Start this track
        <svg
          width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true"
          className={`transition-transform duration-300 group-hover:translate-x-1
            ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}
        >
          <path d="M1 3.5h10M6 1l2.5 2.5L6 6" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>

    {/* Index ghost watermark */}
    <span
      aria-hidden="true"
      className="absolute bottom-4 right-6 font-display font-bold leading-none select-none pointer-events-none text-white/[0.03]"
      style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
    >
      {`0${index + 1}`}
    </span>
  </div>
))
OutcomeCard.displayName = 'OutcomeCard'

// ─── TrackCard ────────────────────────────────────────────────────────────────
const TrackCard = memo(({ track, index, isArabic }: {
  track: Track
  index: number
  isArabic: boolean
}) => {
  const isEven = index % 2 === 0
  const outcome = TRACK_OUTCOMES[index]

  return (
    <LazySection>
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* ── Content column ── */}
            <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'} ${isArabic ? 'text-right' : ''}`}>

              {/* Giant ghost step number */}
              <span
                aria-hidden="true"
                className="absolute select-none pointer-events-none font-display font-bold leading-none text-white/[0.022]"
                style={{
                  fontSize: 'clamp(9rem,20vw,18rem)',
                  top: '-0.15em',
                  left: isArabic ? 'auto' : '-0.05em',
                  right: isArabic ? '-0.05em' : 'auto',
                  lineHeight: 0.85,
                }}
              >
                {`0${index + 1}`}
              </span>

              <div className="relative z-10">

                {/* Eyebrow */}
                <TextReveal>
                  <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                      Track 0{index + 1}
                    </span>
                  </div>
                </TextReveal>

                {/* Title */}
                <SplitText
                  text={track.title}
                  className="text-[clamp(2.8rem,5.5vw,5rem)] font-display font-light leading-[0.96] text-white/92 tracking-[-0.02em] mb-6"
                  type="words"
                />

                {/* Description */}
                <TextReveal delay={0.08}>
                  <p className="text-base md:text-lg font-light leading-[1.82] text-white/45 mb-10 max-w-[38ch]">
                    {track.description}
                  </p>
                </TextReveal>

                {/* Deliverables */}
                <TextReveal delay={0.12}>
                  <div className="mb-8">
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/20 block mb-4">
                      Deliverables
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {track.deliverables.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            border border-white/[0.08] bg-white/[0.03]
                            text-[10px] font-medium tracking-[0.14em] uppercase text-white/48
                            hover:border-[#FF3B3B]/25 hover:text-white/70 hover:bg-white/[0.05]
                            transition-all duration-300 cursor-default"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#FF3B3B]/55 shrink-0" aria-hidden="true" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </TextReveal>

                {/* Tech stack */}
                <TextReveal delay={0.16}>
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/20 block mb-4">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {track.tech.map((item) => (
                        <span
                          key={item}
                          className="px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]
                            text-[9px] font-bold tracking-[0.22em] uppercase text-white/40
                            hover:bg-white hover:text-black transition-all duration-300 cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </TextReveal>

              </div>
            </div>

            {/* ── Outcome card column ── */}
            <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
              <OutcomeCard
                metric={outcome.metric}
                label={outcome.label}
                deliverables={[...track.deliverables]}
                index={index}
                isArabic={isArabic}
              />
            </div>

          </div>
        </div>
      </div>
    </LazySection>
  )
})
TrackCard.displayName = 'TrackCard'

// ─── ProcessSection ───────────────────────────────────────────────────────────
type WorkflowStep = { readonly label: string; readonly title: string; readonly copy: string }

const ProcessSection = memo(({ steps, eyebrow, titleLine1, titleLine2, isArabic }: {
  steps: readonly WorkflowStep[]
  eyebrow: string
  titleLine1: string
  titleLine2: string
  isArabic: boolean
}) => (
  <LazySection>
    <div className="border-t border-white/[0.07] bg-[#060606]">
      <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 ${isArabic ? 'text-right' : ''}`}>

        {/* Eyebrow row */}
        <div className={`flex items-center gap-4 mb-14 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span className="w-5 h-px bg-[#FF3B3B]/40 shrink-0" aria-hidden="true" />
          <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
            {eyebrow}
          </span>
          <span className="flex-1 h-px bg-white/[0.05]" aria-hidden="true" />
        </div>

        {/* Headline */}
        <SplitText
          text={`${titleLine1} ${titleLine2}`}
          className="text-[clamp(2.2rem,4.5vw,5rem)] font-display font-light italic leading-[0.96] text-white/38 tracking-[-0.02em] mb-20"
          type="words"
        />

        {/* Steps grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative group py-10
                ${i < steps.length - 1 ? 'pr-6 md:pr-10 border-r border-white/[0.07]' : ''}
                ${i > 0 ? 'pl-6 md:pl-10' : ''}`}
            >
              {/* Red step number */}
              <span
                className="block text-[9px] font-bold tracking-[0.44em] uppercase mb-4"
                style={{ color: 'rgba(255,59,59,0.55)' }}
              >
                {step.label}
              </span>

              {/* Step title */}
              <span className="block font-display font-light text-xl text-white/75 group-hover:text-white transition-colors duration-300 mb-3">
                {step.title}
              </span>

              {/* Step copy */}
              <p className="text-sm font-light leading-[1.72] text-white/35 group-hover:text-white/50 transition-colors duration-300">
                {step.copy}
              </p>

              {/* Hover accent bottom line */}
              <div
                className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.5), transparent)' }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  </LazySection>
))
ProcessSection.displayName = 'ProcessSection'

// ─── Services page ────────────────────────────────────────────────────────────
type Theme = 'dark' | 'light'
interface ServicesProps { themeMode?: Theme }

function Services({ themeMode }: ServicesProps) {
  void themeMode // always dark
  const { copy, language } = useLanguage()
  const heroRef    = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isArabic   = useMemo(() => language === 'ar', [language])

  const overview = copy.services.overview
  const tracks   = overview.tracks as readonly Track[]

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from('.hero-tag',   { y: 16, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth })
        .from('.hero-rule',  { scaleX: 0, opacity: 0, duration: 0.6, ease: ANIMATION.ease.luxury, transformOrigin: isArabic ? 'right center' : 'left center' }, '-=0.3')
        .from('.hero-line',  { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-copy',  { y: 20, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-chips', { y: 14, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth, stagger: 0.07 }, '-=0.4')

      if (heroRef.current) {
        gsap.to('.hero-bg-letter', {
          yPercent: 18,
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
  }, [isArabic])

  return (
    <div ref={wrapperRef} className="bg-[#090909] text-white min-h-screen">

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Background letter parallax */}
        <div
          aria-hidden="true"
          className="hero-bg-letter absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
        >
          <span
            className="font-display font-bold leading-none text-white/[0.018]"
            style={{ fontSize: 'clamp(18rem,55vw,80rem)' }}
          >
            S
          </span>
        </div>

        {/* Red ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,59,59,0.045) 0%, transparent 65%)' }}
        />

        {/* Red dot grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,59,59,0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 100%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#090909] to-transparent pointer-events-none z-10"
        />

        {/* Content */}
        <div className={`relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 py-32 md:py-44 ${isArabic ? 'text-right' : ''}`}>

          {/* Tag pill */}
          <div className="hero-tag mb-6">
            <span className="inline-flex items-center gap-2.5 text-[9px] font-bold tracking-[0.44em] uppercase
              px-4 py-2 rounded-full border border-white/10 text-white/50 bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] shrink-0" aria-hidden="true" />
              {overview.heroEyebrow}
            </span>
          </div>

          {/* Red rule */}
          <div
            className={`hero-rule h-px w-16 mb-10 ${isArabic ? 'mr-0 ml-auto' : ''}`}
            style={{ backgroundColor: 'rgba(255,59,59,0.2)' }}
            aria-hidden="true"
          />

          {/* Headline */}
          <h1 className="font-display font-light leading-[0.88] tracking-[-0.02em]
            text-[clamp(3.5rem,10vw,10rem)] mb-8 max-w-5xl">
            <span className="hero-line block text-white/92">
              {overview.heroTitleLine1}
            </span>
            <span className="hero-line block italic text-white/38">
              {overview.heroTitleLine2}
            </span>
          </h1>

          {/* Sub-copy */}
          <p className={`hero-copy text-base md:text-lg font-light leading-[1.82] text-white/48 max-w-[36ch] mb-12`}>
            {overview.heroSubtitle}
          </p>

          {/* Service name chips */}
          <div className={`flex flex-wrap gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
            {tracks.map((track) => (
              <span
                key={track.title}
                className="hero-chips px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03]
                  text-[10px] font-bold tracking-[0.18em] uppercase text-white/45
                  hover:border-[#FF3B3B]/25 hover:text-white/65 hover:bg-white/[0.05]
                  transition-all duration-300 cursor-default"
              >
                {track.title}
              </span>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-14 z-20 flex items-center gap-3 ${isArabic ? 'right-8 md:right-14' : 'left-8 md:left-14'}`}>
          <div className="relative w-px h-10 overflow-hidden bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-scroll-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/25">
            {copy.ui?.scrollToExplore || 'Scroll'}
          </span>
        </div>
      </section>

      {/* ══════════════════════════ TRACK CARDS ══════════════════════════ */}
      {tracks.map((track, index) => (
        <TrackCard
          key={track.title}
          track={track}
          index={index}
          isArabic={isArabic}
        />
      ))}

      {/* ══════════════════════════ PROCESS SECTION ══════════════════════════ */}
      <ProcessSection
        steps={overview.workflowSteps}
        eyebrow={overview.workflowEyebrow}
        titleLine1={overview.workflowTitleLine1}
        titleLine2={overview.workflowTitleLine2}
        isArabic={isArabic}
      />

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <LazySection id="cta">
        <div className="relative bg-[#060606] overflow-hidden">

          {/* Top hairline */}
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

          {/* Centered red glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,59,59,0.09) 0%, rgba(255,59,59,0.03) 40%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />

          <div className={`relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-20 md:pt-36 md:pb-28 ${isArabic ? 'text-right' : ''}`}>

            {/* Eyebrow */}
            <TextReveal>
              <div className={`flex items-center gap-3 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/30">
                  {overview.ctaEyebrow}
                </span>
              </div>
            </TextReveal>

            {/* Headline */}
            <SplitText
              text={`${overview.ctaTitle} ${overview.ctaTitleEmphasis}`}
              className="text-[clamp(3rem,7.5vw,8rem)] font-display font-light leading-[0.92] text-white/92 tracking-[-0.02em] mb-10"
              type="words"
              delay={0.06}
            />

            {/* Body copy */}
            <TextReveal delay={0.12}>
              <p className="text-base font-light leading-[1.82] text-white/38 max-w-[38ch] mb-10">
                {overview.ctaCopy}
              </p>
            </TextReveal>

            {/* Availability badge */}
            <TextReveal delay={0.16}>
              <div className={`inline-flex items-center gap-3 mb-12 px-4 py-2 rounded-full
                border border-white/[0.07] bg-white/[0.02] ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/28">
                  {overview.ctaMetaLabel}: {overview.ctaMetaValue}
                </span>
              </div>
            </TextReveal>

            {/* Buttons */}
            <TextReveal delay={0.2}>
              <div className={`flex flex-col sm:flex-row gap-3 items-start ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                <MagneticButton
                  href="/contact"
                  isDark
                  variant="primary"
                  style={{ backgroundColor: ACCENT, color: '#ffffff', borderColor: ACCENT }}
                  className={`group inline-flex items-center gap-3 px-10 py-5 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase border
                    transition-all duration-300 ease-out
                    hover:shadow-[0_0_32px_rgba(255,59,59,0.28)]
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {overview.ctaButton}
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"
                    className={`transition-transform duration-300 group-hover:translate-x-1
                      ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}>
                    <path d="M1 4h12M7.5 1l3.5 3-3.5 3" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>

                <MagneticButton
                  href="/method"
                  variant="outline"
                  isDark
                  className={`inline-flex items-center gap-3 px-10 py-5 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase
                    border-white/[0.10] text-white/40
                    transition-all duration-300 ease-out
                    hover:text-white hover:border-white/20 hover:bg-white/[0.04]
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  See the method
                </MagneticButton>
              </div>
            </TextReveal>

          </div>

          {/* Bottom social proof strip */}
          <div className="relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex justify-center">
              <p className="text-[9px] font-bold tracking-[0.38em] uppercase text-white/18 text-center">
                {copy.home.testimonialsTitle} — trusted by 40+ brands
              </p>
            </div>
          </div>

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
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-pulse { animation: none; opacity: 0.3; }
        }
      `}</style>

    </div>
  )
}

export default Services
