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

// ─── Types ────────────────────────────────────────────────────────────────────
type TeamMember = {
  readonly name: string
  readonly role: string
  readonly image: string
  readonly offset: string
}

type Milestone = {
  readonly date: string
  readonly title: string
  readonly copy: string
  readonly align: string
}

type Pillar = {
  readonly label: string
  readonly title: string
  readonly copy: string
}

type Principle = {
  readonly title: string
  readonly copy: string
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

// ─── PrincipleCard ────────────────────────────────────────────────────────────
const PrincipleCard = memo(({ principle, index }: {
  principle: Principle
  index: number
}) => (
  <div className="relative rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent
    p-10 md:p-12 group hover:border-white/[0.12] transition-colors duration-300 overflow-hidden">

    {/* Top red hairline */}
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-px"
      style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.4), transparent)' }}
    />

    {/* Number eyebrow */}
    <span
      className="block text-[9px] font-bold tracking-[0.44em] uppercase mb-8"
      style={{ color: 'rgba(255,59,59,0.55)' }}
    >
      Principle 0{index + 1}
    </span>

    {/* Title */}
    <h3 className="text-2xl md:text-3xl font-display font-light text-white/85 mb-4
      group-hover:italic transition-all duration-300">
      {principle.title}
    </h3>

    {/* Copy */}
    <p className="text-sm font-light leading-[1.76] text-white/42
      group-hover:text-white/58 transition-colors duration-300">
      {principle.copy}
    </p>

    {/* Ghost index */}
    <span
      aria-hidden="true"
      className="absolute bottom-4 right-6 font-display font-bold leading-none select-none pointer-events-none text-white/[0.025]"
      style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
    >
      0{index + 1}
    </span>
  </div>
))
PrincipleCard.displayName = 'PrincipleCard'

// ─── TeamCard ─────────────────────────────────────────────────────────────────
const TeamCard = memo(({ member }: { member: TeamMember }) => (
  <div className="team-card-inner group cursor-crosshair">

    {/* Image container */}
    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-8 border border-white/[0.07]">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover grayscale opacity-60
          group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]
          transition-all duration-700"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Role badge */}
      <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full
        bg-black/50 backdrop-blur-md border border-white/[0.1]
        text-[8px] font-bold tracking-[0.3em] uppercase text-white/55
        opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        {member.role}
      </div>
    </div>

    {/* Name */}
    <h4 className="text-xl md:text-2xl font-display font-light text-white/85
      group-hover:italic transition-all duration-300">
      {member.name}
    </h4>

    {/* Role */}
    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/28 mt-1">
      {member.role}
    </p>
  </div>
))
TeamCard.displayName = 'TeamCard'

// ─── About page ───────────────────────────────────────────────────────────────
interface AboutProps { themeMode: 'dark' | 'light' }

function About({ themeMode }: AboutProps) {
  void themeMode // always dark
  const { copy, language } = useLanguage()
  const isArabic  = useMemo(() => language === 'ar', [language])
  const heroRef   = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timelineRef    = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  const overview = copy.about.overview

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {

      // ── Hero entrance timeline ──
      gsap.timeline({ delay: 0.15 })
        .from('.hero-tag',   { y: 16, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth })
        .from('.hero-rule',  { scaleX: 0, opacity: 0, duration: 0.6, ease: ANIMATION.ease.luxury,
          transformOrigin: isArabic ? 'right center' : 'left center' }, '-=0.3')
        .from('.hero-line',  { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-copy',  { y: 20, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-stats', { y: 14, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth, stagger: 0.08 }, '-=0.4')

      // ── Hero bg letter parallax ──
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

      // ── Timeline progress line ──
      if (progressLineRef.current && timelineRef.current) {
        gsap.fromTo(progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 30%',
              end: 'bottom 70%',
              scrub: 1,
            },
          }
        )
      }

      // ── Team image parallax ──
      gsap.utils.toArray<HTMLDivElement>('.team-card-inner').forEach((card) => {
        const img = card.querySelector('img')
        if (!img) return
        gsap.fromTo(img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

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
            A
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
          <p className={`hero-copy text-base md:text-lg font-light leading-[1.82] text-white/48 max-w-[36ch] mb-16`}>
            {copy.about.subtitle}
          </p>

          {/* Studio stats row */}
          <div className={`flex items-center gap-8 md:gap-12 flex-wrap ${isArabic ? 'flex-row-reverse' : ''}`}>
            {[
              { value: '40+', label: 'Brands' },
              { value: '6',   label: 'Years' },
              { value: '3',   label: 'Disciplines' },
            ].map((stat, i) => (
              <div key={stat.label} className={`hero-stats flex items-center gap-8 md:gap-12 ${isArabic ? 'flex-row-reverse' : ''}`}>
                {i > 0 && (
                  <span className="w-px h-10 bg-white/[0.07] shrink-0" aria-hidden="true" />
                )}
                <div className="flex flex-col">
                  <span
                    className="font-display font-light leading-none mb-1"
                    style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: ACCENT }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/30">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
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

      {/* ══════════════════════════ MANIFESTO ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
            <div className="grid md:grid-cols-12 gap-8 items-stretch">

              {/* Left column — manifesto card */}
              <div className={`md:col-span-7 relative rounded-3xl border border-white/[0.07]
                bg-gradient-to-b from-white/[0.03] to-transparent
                p-12 md:p-20 overflow-hidden ${isArabic ? 'text-right' : ''}`}>

                {/* Top red hairline */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(to right, rgba(255,59,59,0.4), transparent)' }}
                />

                {/* Ghost quote mark */}
                <span
                  aria-hidden="true"
                  className="absolute top-6 right-10 font-display font-bold select-none pointer-events-none leading-none text-white/[0.025]"
                  style={{ fontSize: 'clamp(10rem,20vw,18rem)' }}
                >
                  "
                </span>

                <div className="relative z-10">
                  {/* Eyebrow */}
                  <TextReveal>
                    <div className={`flex items-center gap-3 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                      <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                        {overview.manifestoLabel}
                      </span>
                    </div>
                  </TextReveal>

                  {/* Lead text */}
                  <p
                    className="font-display font-light leading-[1.25] text-white/88 tracking-[-0.01em] mb-8"
                    style={{ fontSize: 'clamp(1.8rem,3.5vw,3.2rem)' }}
                  >
                    {overview.manifestoLead}
                  </p>

                  {/* Body copy */}
                  <p className="text-base md:text-lg font-light leading-[1.82] text-white/45 max-w-[48ch] mb-12">
                    {overview.manifestoCopy}
                  </p>

                  {/* Bottom row */}
                  <div className={`flex items-center gap-6 pt-10 border-t border-white/[0.07] ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-px bg-white/20" aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold italic text-white/30">
                      {overview.sinceLabel}
                    </span>
                    {copy.about.values[0] && (
                      <>
                        <span className="w-px h-4 bg-white/[0.1]" aria-hidden="true" />
                        <span className="text-[10px] font-light italic text-white/22 max-w-[32ch]">
                          {copy.about.values[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Right column — tall editorial image, desktop only */}
              <div className="hidden md:block md:col-span-5">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden h-full">
                  <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=85"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover grayscale"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(255,59,59,0.10), transparent)' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ PRINCIPLES ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07]">
          <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 ${isArabic ? 'text-right' : ''}`}>

            {/* Eyebrow */}
            <TextReveal>
              <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                  {copy.about.principlesTitle}
                </span>
              </div>
            </TextReveal>

            {/* Heading */}
            <SplitText
              text={copy.about.principlesTitle}
              className="text-[clamp(2.2rem,4.5vw,5rem)] font-display font-light italic leading-[0.96] text-white/38 tracking-[-0.02em] mb-16"
              type="words"
            />

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {copy.about.principles.map((principle, idx) => (
                <PrincipleCard key={idx} principle={principle} index={idx} />
              ))}
            </div>

          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ STUDIO GALLERY ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80', label: 'Strategy & Branding', aspect: 'aspect-[4/3]' },
                { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80', label: 'Interface Design', aspect: 'aspect-[4/5]' },
                { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80', label: 'Digital Spaces', aspect: 'aspect-[4/3]' },
              ].map((img, i) => (
                <div key={i} className={`group relative ${img.aspect} rounded-3xl overflow-hidden`}>
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-[1.04] transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-5 left-6 text-[9px] font-bold tracking-[0.4em] uppercase text-white/45 group-hover:text-white/75 transition-colors duration-300">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ PILLARS ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07] bg-[#060606]">
          <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 ${isArabic ? 'text-right' : ''}`}>

            {/* Eyebrow */}
            <TextReveal>
              <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/40 shrink-0" aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                  Our Beliefs
                </span>
                <span className="flex-1 h-px bg-white/[0.05]" aria-hidden="true" />
              </div>
            </TextReveal>

            {/* Large italic label */}
            <SplitText
              text="Our Beliefs."
              className="text-[clamp(2rem,4vw,4.5rem)] font-display font-light italic leading-[0.96] text-white/35 tracking-[-0.02em] mb-16"
              type="words"
            />

            {/* Stacked pillar rows */}
            {(() => {
              const pillarImages = [
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
              ]
              return (
            <div>
              {(copy.about.overview.pillars as readonly Pillar[]).map((pillar, idx) => (
                <div
                  key={idx}
                  className={`group py-8 md:py-10 flex items-start gap-8 md:gap-16
                    ${idx > 0 ? 'border-t border-white/[0.07]' : ''}
                    ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {/* Giant index number */}
                  <span
                    className="font-display font-light tabular-nums w-20 shrink-0 leading-none pt-1"
                    style={{
                      fontSize: 'clamp(3rem,5vw,4.5rem)',
                      color: 'rgba(255,59,59,0.15)',
                    }}
                  >
                    0{idx + 1}
                  </span>

                  {/* Middle content */}
                  <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold tracking-[0.44em] uppercase text-white/22 mb-2">
                      {pillar.label}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-light text-white/78 mb-2
                      group-hover:italic transition-all duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-light text-white/38 max-w-[46ch] leading-[1.72]">
                      {pillar.copy}
                    </p>
                  </div>

                  {/* Hover thumbnail — desktop only */}
                  <div className="hidden lg:block w-32 h-24 rounded-xl overflow-hidden shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <img
                      src={pillarImages[idx]}
                      alt={pillar.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover arrow */}
                  <span
                    className="text-2xl shrink-0 self-center transition-colors duration-300 ml-auto"
                    style={{ color: 'rgba(255,59,59,0)' }}
                    aria-hidden="true"
                  >
                    <span className="group-hover:text-[#FF3B3B]/50 transition-colors duration-300 text-2xl">
                      →
                    </span>
                  </span>
                </div>
              ))}
            </div>
              )
            })()}

          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ TEAM ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07]">
          <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 ${isArabic ? 'text-right' : ''}`}>

            {/* Header row */}
            <div className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-20 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
              <div>
                {/* Eyebrow */}
                <TextReveal>
                  <div className={`flex items-center gap-3 mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                    <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                      {copy.about.teamTitle}
                    </span>
                  </div>
                </TextReveal>

                {/* Heading */}
                <SplitText
                  text={copy.about.teamSubtitle}
                  className="text-[clamp(2.5rem,5vw,5rem)] font-display font-light text-white/85 tracking-[-0.01em]"
                  type="words"
                />
              </div>

              {/* Stack pills */}
              <div className={`flex flex-wrap gap-3 max-w-sm ${isArabic ? 'justify-start' : 'justify-end'}`}>
                {copy.about.teamStack.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03]
                      text-[9px] font-bold tracking-[0.18em] uppercase text-white/40 whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Team grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {(overview.team as readonly TeamMember[]).map((member, idx) => (
                <div key={idx} className={member.offset}>
                  <TeamCard member={member} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </LazySection>

      {/* ══════════════════════════ TIMELINE ══════════════════════════ */}
      <LazySection>
        <div className="border-t border-white/[0.07] overflow-visible">
          <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 ${isArabic ? 'text-right' : ''}`}>

            {/* Eyebrow */}
            <TextReveal>
              <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-5 h-px bg-[#FF3B3B]/50" aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
                  {overview.journeyEyebrow}
                </span>
              </div>
            </TextReveal>

            {/* Giant heading */}
            <SplitText
              text={overview.journeyTitle}
              className="text-[clamp(3rem,8vw,9rem)] font-display font-light italic text-white/35 tracking-[-0.02em] mb-24 md:mb-40"
              type="words"
            />

            {/* Timeline */}
            <div ref={timelineRef} className="relative max-w-6xl mx-auto">

              {/* Vertical center line */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-white/[0.07] hidden md:block">
                <div
                  ref={progressLineRef}
                  className="w-full h-full bg-gradient-to-b from-[#FF3B3B] via-[#FF3B3B]/40 to-transparent origin-top"
                  style={{ transform: 'scaleY(0)' }}
                />
              </div>

              <div className="space-y-32 md:space-y-48">
                {(overview.milestones as readonly Milestone[]).map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isArabic ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Left side */}
                    <div className={`md:w-1/2 ${milestone.align === 'left' ? 'md:pr-20 md:text-right' : 'md:opacity-0 pointer-events-none hidden md:block'}`}>
                      <div className="group">
                        <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/22 block mb-4">
                          {milestone.date}
                        </span>
                        <h4 className="text-3xl md:text-5xl font-display font-light text-white/85
                          group-hover:italic transition-all duration-300 leading-tight mb-4">
                          {milestone.title}
                        </h4>
                        <p className="text-sm font-light text-white/40 max-w-xs ml-auto leading-relaxed">
                          {milestone.copy}
                        </p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div
                      className="z-10 w-3 h-3 rounded-full bg-[#FF3B3B] border-2 border-[#090909]
                        absolute left-1/2 -translate-x-1/2 hidden md:block"
                      style={{ boxShadow: '0 0 16px rgba(255,59,59,0.5)' }}
                    />

                    {/* Right side */}
                    <div className={`md:w-1/2 ${milestone.align === 'right' ? 'md:pl-20 text-left' : 'md:opacity-0 pointer-events-none hidden md:block'}`}>
                      <div className="group">
                        <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/22 block mb-4">
                          {milestone.date}
                        </span>
                        <h4 className="text-3xl md:text-5xl font-display font-light text-white/85
                          group-hover:italic transition-all duration-300 leading-tight mb-4">
                          {milestone.title}
                        </h4>
                        <p className="text-sm font-light text-white/40 max-w-xs leading-relaxed">
                          {milestone.copy}
                        </p>
                      </div>
                    </div>

                    {/* Mobile version */}
                    <div className="md:hidden text-center">
                      <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/22 block mb-3">
                        {milestone.date}
                      </span>
                      <h4 className="text-3xl font-display font-light text-white/85 mb-4 leading-tight">
                        {milestone.title}
                      </h4>
                      <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm mx-auto">
                        {milestone.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </LazySection>

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
              text={`${overview.ctaTitle} ${(overview as typeof overview & { ctaTitleEmphasis: string }).ctaTitleEmphasis}`}
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
                  See our work
                </MagneticButton>
              </div>
            </TextReveal>

          </div>

          {/* Bottom social proof strip */}
          <div className="relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex justify-center">
              <p className="text-[9px] font-bold tracking-[0.38em] uppercase text-white/18 text-center">
                trusted by 40+ brands worldwide
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

export default About
