import { useLayoutEffect, useRef, useMemo, memo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  MagneticButton,
  TextReveal,
  SplitText,
  ANIMATION,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

type Theme = 'dark' | 'light'
interface MethodProps { themeMode: Theme }

const ACCENT = '#FF3B3B'

const IMAGES = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=90',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=90',
]

// Results shown in the strip between steps and CTA
const RESULTS = [
  { value: '14', unit: 'days', label: 'Avg. time to first results' },
  { value: '3.8×', unit: '',   label: 'Avg. client ROI at 6 months' },
  { value: '97',  unit: '%',   label: 'Projects shipped on schedule' },
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

// ─── Types ────────────────────────────────────────────────────────────────────
type MethodStep = NonNullable<ReturnType<typeof useLanguage>['copy']['method']>['steps'][number]

// ─── ProcessRail ─────────────────────────────────────────────────────────────
// Horizontal process overview — all 4 steps at a glance
const ProcessRail = memo(({ steps, isArabic }: { steps: readonly MethodStep[]; isArabic: boolean }) => (
  <LazySection>
    <div className="border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-16">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-0 ${isArabic ? 'direction-rtl' : ''}`}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative group py-2 ${
                i < steps.length - 1 ? 'pr-6 md:pr-10 border-r border-white/[0.07]' : ''
              } ${i > 0 ? 'pl-6 md:pl-10' : ''}`}
            >
              {/* Step number */}
              <span
                className="block text-[9px] font-bold tracking-[0.44em] uppercase mb-3"
                style={{ color: 'rgba(255,59,59,0.55)' }}
              >
                {step.number}
              </span>
              {/* Title */}
              <span className="block font-display font-light text-xl md:text-2xl text-white/70 mb-1.5 group-hover:text-white transition-colors duration-300">
                {step.title}
              </span>
              {/* Timeline */}
              <span className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/22">
                {step.metaValue}
              </span>
              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.5), transparent)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </LazySection>
))
ProcessRail.displayName = 'ProcessRail'

// ─── StepCard ─────────────────────────────────────────────────────────────────
const StepCard = memo(({ step, index, totalSteps, isArabic }: {
  step: MethodStep
  index: number
  totalSteps: number
  isArabic: boolean
}) => {
  const isEven = index % 2 === 0

  return (
    <LazySection>
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* ── Content ── */}
            <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'} ${isArabic ? 'text-right' : ''}`}>

              {/* Giant ghost step number — behind all content */}
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
                {step.number}
              </span>

              <div className="relative z-10">

                {/* Eyebrow */}
                <TextReveal>
                  <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                      Step {step.number} of {String(totalSteps).padStart(2, '0')}
                    </span>
                  </div>
                </TextReveal>

                {/* Title */}
                <SplitText
                  text={step.title}
                  className="text-[clamp(2.8rem,5.5vw,5rem)] font-display font-light leading-[0.96] text-white/92 tracking-[-0.02em] mb-6"
                  type="words"
                />

                {/* Copy */}
                <TextReveal delay={0.08}>
                  <p className="text-base md:text-lg font-light leading-[1.82] text-white/45 mb-10 max-w-[38ch]">
                    {step.copy}
                  </p>
                </TextReveal>

                {/* Deliverables — pill chips */}
                <TextReveal delay={0.13}>
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/20 block mb-4">
                      {step.deliverablesLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((item: string) => (
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

                {/* Meta strip */}
                <TextReveal delay={0.18}>
                  <div className={`mt-10 pt-8 border-t border-white/[0.07] flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/20 block mb-2">
                        {step.metaLabel}
                      </span>
                      <span className="text-xl md:text-2xl font-display font-light text-white/70">
                        {step.metaValue}
                      </span>
                    </div>
                    {/* Faint step number accent */}
                    <span
                      aria-hidden="true"
                      className="font-display font-light tabular-nums"
                      style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'rgba(255,59,59,0.12)' }}
                    >
                      {step.number}
                    </span>
                  </div>
                </TextReveal>

              </div>
            </div>

            {/* ── Image ── */}
            <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative group">

                {/* Image container */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/[0.07]">
                  <img
                    src={IMAGES[index % IMAGES.length]}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

                  {/* Red tint on hover */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(255,59,59,0.09) 0%, transparent 55%)' }}
                  />

                  {/* Bottom sweep line */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
                    style={{ background: 'linear-gradient(to right, #FF3B3B, rgba(255,59,59,0.2))' }}
                  />

                  {/* Meta overlay — bottom left */}
                  <div className={`absolute bottom-6 ${isArabic ? 'right-6 text-right' : 'left-6'}`}>
                    <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-white/28 block mb-1">
                      {step.metaLabel}
                    </span>
                    <span className="text-base font-display font-light text-white/60">
                      {step.metaValue}
                    </span>
                  </div>

                  {/* Step badge — top right */}
                  <div className="absolute top-5 right-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      bg-black/40 backdrop-blur-md border border-white/[0.1]
                      text-[8px] font-bold tracking-[0.38em] uppercase text-white/42">
                      <span className="w-1 h-1 rounded-full bg-[#FF3B3B]/65" aria-hidden="true" />
                      {step.number} / {String(totalSteps).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Ambient red glow on hover */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,59,59,0.07) 0%, transparent 70%)' }}
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </LazySection>
  )
})
StepCard.displayName = 'StepCard'

// ─── ResultsStrip ─────────────────────────────────────────────────────────────
// Proof metrics after all step cards
const ResultsStrip = memo(({ isArabic }: { isArabic: boolean }) => (
  <LazySection>
    <div className="border-t border-white/[0.07] bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">

        {/* Label */}
        <div className={`flex items-center gap-4 mb-14 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span className="w-5 h-px bg-[#FF3B3B]/40 shrink-0" aria-hidden="true" />
          <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/20">
            Why it works
          </span>
          <span className="flex-1 h-px bg-white/[0.05]" aria-hidden="true" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/[0.07] ${isArabic ? 'text-right' : ''}`}>
          {RESULTS.map((r, i) => (
            <div key={i} className={`group ${i > 0 ? 'md:pl-14' : ''} ${i < RESULTS.length - 1 ? 'md:pr-14' : ''}`}>
              {/* Number */}
              <div
                className="font-display font-light leading-none text-white mb-3"
                style={{
                  fontSize: 'clamp(3.5rem,6vw,5.5rem)',
                  filter: 'drop-shadow(0 0 20px rgba(255,59,59,0.2))',
                  color: '#FF3B3B',
                }}
              >
                {r.value}
                {r.unit && (
                  <span className="text-[0.45em] opacity-55 ml-0.5 align-baseline">{r.unit}</span>
                )}
              </div>
              {/* Separator */}
              <span
                className="block h-px mb-4 rounded-full"
                style={{ width: '2.5rem', background: 'linear-gradient(to right, rgba(255,59,59,0.45), transparent)' }}
                aria-hidden="true"
              />
              {/* Label */}
              <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/32 group-hover:text-white/50 transition-colors duration-300">
                {r.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  </LazySection>
))
ResultsStrip.displayName = 'ResultsStrip'

// ─── Method page ──────────────────────────────────────────────────────────────
function Method({ themeMode }: MethodProps) {
  const { copy, language } = useLanguage()
  const heroRef    = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isArabic   = useMemo(() => language === 'ar', [language])
  void themeMode // always dark

  const steps      = copy.method?.steps || []
  const totalSteps = steps.length

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from('.hero-tag',       { y: 16, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth })
        .from('.hero-rule',      { scaleX: 0, opacity: 0, duration: 0.6, ease: ANIMATION.ease.luxury, transformOrigin: isArabic ? 'right center' : 'left center' }, '-=0.3')
        .from('.hero-line',      { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-copy',      { y: 20, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-steps-row', { y: 14, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth }, '-=0.4')

      if (heroRef.current) {
        gsap.to('.hero-bg-letter', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
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
            M
          </span>
        </div>

        {/* Red ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,59,59,0.045) 0%, transparent 65%)' }}
        />

        {/* Dot grid */}
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
              {copy.method?.heroEyebrow || 'Our Process'}
            </span>
          </div>

          {/* Red rule */}
          <div
            className={`hero-rule h-px w-16 mb-10 ${isArabic ? 'mr-0 ml-auto' : ''}`}
            style={{ backgroundColor: 'rgba(255,59,59,0.2)' }}
            aria-hidden="true"
          />

          {/* Headline */}
          <h1 className={`font-display font-light leading-[0.88] tracking-[-0.02em]
            text-[clamp(3.5rem,10vw,10rem)] mb-8 max-w-5xl`}>
            <span className="hero-line block text-white/92">
              {copy.method?.heroTitleLine1 || 'Built to'}
            </span>
            <span className="hero-line block italic text-white/38">
              {copy.method?.heroTitleLine2 || 'Deliver.'}
            </span>
          </h1>

          {/* Sub-copy */}
          <p className={`hero-copy text-base md:text-lg font-light leading-[1.82] text-white/48
            max-w-[36ch] mb-12`}>
            {copy.method?.heroCopy || 'A precision system that turns your vision into a scalable growth engine — predictably.'}
          </p>

          {/* Step indicator row */}
          <div className={`hero-steps-row flex items-center gap-5 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/22">
              {totalSteps} Steps
            </span>
            <div className={`flex gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {steps.map((_: unknown, i: number) => (
                <span
                  key={i}
                  className="block h-[2px] w-8 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i === 0 ? ACCENT : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-14 z-20 flex items-center gap-3
          ${isArabic ? 'right-8 md:right-14' : 'left-8 md:left-14'}`}>
          <div className="relative w-px h-10 overflow-hidden bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-scroll-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/25">
            {copy.ui?.scrollToExplore || 'Scroll'}
          </span>
        </div>
      </section>

      {/* ══════════════════════════ PROCESS RAIL ══════════════════════════ */}
      <ProcessRail steps={steps} isArabic={isArabic} />

      {/* ══════════════════════════ STEP CARDS ══════════════════════════ */}
      {steps.map((step: MethodStep, index: number) => (
        <StepCard
          key={step.number}
          step={step}
          index={index}
          totalSteps={totalSteps}
          isArabic={isArabic}
        />
      ))}

      {/* ══════════════════════════ RESULTS STRIP ══════════════════════════ */}
      <ResultsStrip isArabic={isArabic} />

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <LazySection id="cta">
        <div className="relative bg-[#060606] overflow-hidden">

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

            <TextReveal>
              <div className={`flex items-center gap-3 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/30">
                  {copy.ui?.readyToStart || 'Ready to Start'}
                </span>
              </div>
            </TextReveal>

            <SplitText
              text={`${copy.method?.ctaTitleLine1 || 'Every project starts'} ${copy.method?.ctaTitleLine2 || 'with a conversation.'}`}
              className="text-[clamp(3rem,7.5vw,8rem)] font-display font-light leading-[0.92] text-white/92 tracking-[-0.02em] mb-10"
              type="words"
              delay={0.06}
            />

            <TextReveal delay={0.12}>
              <p className="text-base font-light leading-[1.82] text-white/38 max-w-[38ch] mb-10">
                {copy.method?.ctaCopy || "Book a free diagnostic. We review your systems and show you exactly where the leverage is."}
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
                  {copy.home.ctaMeta}: {copy.home.ctaMetaValue}
                </span>
              </div>
            </TextReveal>

            {/* Buttons */}
            <TextReveal delay={0.2}>
              <div className={`flex flex-col sm:flex-row gap-3 items-start ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                <MagneticButton
                  href="mailto:hello@lightlab.dev"
                  isDark
                  variant="primary"
                  style={{ backgroundColor: ACCENT, color: '#ffffff', borderColor: ACCENT }}
                  className={`group inline-flex items-center gap-3 px-10 py-5 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase border
                    transition-all duration-300 ease-out
                    hover:shadow-[0_0_32px_rgba(255,59,59,0.28)]
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.method?.ctaPrimary || 'Book free diagnostic'}
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"
                    className={`transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? 'scale-x-[-1] group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}>
                    <path d="M1 4h12M7.5 1l3.5 3-3.5 3" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>

                <MagneticButton
                  href="/projects"
                  variant="outline"
                  isDark
                  className={`inline-flex items-center gap-3 px-10 py-5 rounded-full
                    text-[11px] font-bold tracking-[0.24em] uppercase
                    border-white/[0.10] text-white/40
                    transition-all duration-300 ease-out
                    hover:text-white hover:border-white/20 hover:bg-white/[0.04]
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {copy.method?.ctaSecondary || 'See our work'}
                </MagneticButton>
              </div>
            </TextReveal>
          </div>

          {/* Bottom social proof strip */}
          <div className="relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex justify-center">
              <p className="text-[9px] font-bold tracking-[0.38em] uppercase text-white/18 text-center">
                {copy.home.testimonialsTitle} — 40+ brands, consistent results
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

export default Method
