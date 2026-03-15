import { useRef, useLayoutEffect, useState, memo } from 'react'
import { FiArrowRight, FiCheck, FiPlus, FiMinus } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'
import {
  MagneticButton,
  TextReveal,
  ANIMATION,
} from '../components/PremiumUI'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = '#FF3B3B'

const SIDEBAR_IMAGE =
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=85'

// ─── LazySection ─────────────────────────────────────────────────────────────
const LazySection = memo(
  ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useLayoutEffect(() => {
      const el = ref.current
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        },
        { threshold: 0.04, rootMargin: '0px 0px -32px 0px' }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }, [])
    return (
      <div
        ref={ref}
        className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      >
        {children}
      </div>
    )
  }
)
LazySection.displayName = 'LazySection'

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
const Eyebrow = memo(
  ({ label, className = '' }: { label: string; className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-5 h-px bg-[#FF3B3B]/50 shrink-0" aria-hidden="true" />
      <span className="text-[9px] font-bold tracking-[0.52em] uppercase text-white/25">
        {label}
      </span>
    </div>
  )
)
Eyebrow.displayName = 'Eyebrow'

// ─── Contact page ─────────────────────────────────────────────────────────────
interface ContactProps {
  themeMode: 'dark' | 'light'
}

function Contact({ themeMode }: ContactProps) {
  void themeMode // always dark

  const { copy } = useLanguage()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {

      // ── Hero entrance: 5-beat timeline ──
      gsap.timeline({ delay: 0.15 })
        .from('.hero-tag',   { y: 16, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth })
        .from('.hero-rule',  { scaleX: 0, opacity: 0, duration: 0.6, ease: ANIMATION.ease.luxury,
          transformOrigin: 'left center' }, '-=0.3')
        .from('.hero-line',  { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-copy',  { y: 20, opacity: 0, duration: 0.7, ease: ANIMATION.ease.smooth }, '-=0.6')
        .from('.hero-badge', { y: 14, opacity: 0, duration: 0.6, ease: ANIMATION.ease.smooth }, '-=0.4')

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

    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div ref={wrapperRef} className="bg-[#090909] text-white min-h-screen overflow-x-hidden">

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >

        {/* Ghost letter parallax */}
        <div
          aria-hidden="true"
          className="hero-bg-letter absolute inset-0 flex items-center justify-center
            pointer-events-none select-none will-change-transform"
        >
          <span
            className="font-display font-bold leading-none text-white/[0.018]"
            style={{ fontSize: 'clamp(18rem,55vw,80rem)' }}
          >
            C
          </span>
        </div>

        {/* Red ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,59,59,0.045) 0%, transparent 65%)',
          }}
        />

        {/* Red dot-grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,59,59,0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 100%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-48
            bg-gradient-to-t from-[#090909] to-transparent pointer-events-none z-10"
        />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 py-32 md:py-44">

          {/* Tag pill */}
          <div className="hero-tag mb-6">
            <span
              className="inline-flex items-center gap-2.5 text-[9px] font-bold
                tracking-[0.44em] uppercase px-4 py-2 rounded-full
                border border-white/10 text-white/50 bg-white/[0.04]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: ACCENT }}
                aria-hidden="true"
              />
              {copy.contact.heroEyebrow}
            </span>
          </div>

          {/* Red rule */}
          <div
            className="hero-rule h-px w-16 mb-10"
            style={{ backgroundColor: 'rgba(255,59,59,0.2)' }}
            aria-hidden="true"
          />

          {/* Headline */}
          <h1
            className="font-display font-light leading-[0.88] tracking-[-0.02em] mb-8 max-w-5xl"
            style={{ fontSize: 'clamp(3.5rem,10vw,10rem)' }}
          >
            <span className="hero-line block text-white/92">
              {copy.contact.heroTitleLine1}
            </span>
            <span className="hero-line block italic text-white/38">
              {copy.contact.heroTitleLine2}
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="hero-copy text-base font-light leading-[1.82] text-white/48 max-w-[36ch] mb-12">
            {copy.contact.statusLabel}
          </p>

          {/* Availability badge */}
          <div className="hero-badge inline-flex items-center gap-3 px-4 py-2 rounded-full
            border border-white/[0.07] bg-white/[0.02]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className="animate-ping absolute inline-flex h-full w-full
                  rounded-full bg-emerald-400 opacity-60"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/28">
              Available for new projects — Q2 2025
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-14 left-8 md:left-14 z-20 flex items-center gap-3">
          <div className="relative w-px h-10 overflow-hidden bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-scroll-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.44em] uppercase text-white/25">
            {copy.ui?.scrollToExplore || 'Scroll'}
          </span>
        </div>
      </section>

      {/* ══════════════════════════ FORM + SIDEBAR ══════════════════════════ */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-16">

            {/* ─── Form side (col-span 7) ─── */}
            <div className="md:col-span-7 space-y-20">

              {/* Section eyebrow + heading */}
              <LazySection>
                <TextReveal>
                  <Eyebrow label="Let's talk" className="mb-8" />
                </TextReveal>
                <h2
                  className="font-display font-light text-white/85"
                  style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)' }}
                >
                  {copy.contact.serviceQuestion}
                </h2>
              </LazySection>

              {/* ─── Form or success state ─── */}
              <LazySection>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-16">

                    {/* Service type pill toggles */}
                    <div className="space-y-6">
                      <span
                        className="block text-[9px] font-bold tracking-[0.44em] uppercase text-white/28"
                      >
                        {copy.contact.serviceQuestion}
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {copy.contact.projectTypes.map((type) => {
                          const id = `service-${type.replace(/\s+/g, '-').toLowerCase()}`
                          return (
                            <div key={type} className="relative">
                              <input
                                className="sr-only peer service-toggle"
                                id={id}
                                name="service"
                                type="checkbox"
                                value={type}
                              />
                              <label
                                htmlFor={id}
                                className="inline-block px-6 py-3 rounded-full cursor-pointer
                                  border border-white/[0.08]
                                  text-[10px] font-bold tracking-[0.24em] uppercase text-white/40
                                  transition-all duration-200 ease-out
                                  hover:border-white/20 hover:text-white/65
                                  peer-checked:bg-[#FF3B3B] peer-checked:text-white
                                  peer-checked:border-[#FF3B3B]
                                  peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF3B3B]/40
                                  peer-focus-visible:ring-offset-2
                                  peer-focus-visible:ring-offset-[#090909]"
                              >
                                {type}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">

                      {/* Name */}
                      <div className="relative group">
                        <label
                          htmlFor="contact-name"
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 mb-3 block
                            group-focus-within:text-white/55 transition-colors duration-200"
                        >
                          {copy.contact.nameLabel}
                        </label>
                        <input
                          id="contact-name"
                          required
                          type="text"
                          placeholder={copy.contact.namePlaceholder}
                          className="bg-transparent border-b border-white/[0.1]
                            focus:border-[#FF3B3B]/50 py-4 text-2xl font-display
                            font-light outline-none placeholder:text-white/15
                            w-full text-white transition-colors duration-200"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative group">
                        <label
                          htmlFor="contact-email"
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 mb-3 block
                            group-focus-within:text-white/55 transition-colors duration-200"
                        >
                          {copy.contact.emailLabel}
                        </label>
                        <input
                          id="contact-email"
                          required
                          type="email"
                          placeholder={copy.contact.emailPlaceholder}
                          className="bg-transparent border-b border-white/[0.1]
                            focus:border-[#FF3B3B]/50 py-4 text-2xl font-display
                            font-light outline-none placeholder:text-white/15
                            w-full text-white transition-colors duration-200"
                        />
                      </div>

                      {/* Details */}
                      <div className="col-span-full relative group">
                        <label
                          htmlFor="contact-details"
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 mb-3 block
                            group-focus-within:text-white/55 transition-colors duration-200"
                        >
                          {copy.contact.detailsLabel}
                        </label>
                        <textarea
                          id="contact-details"
                          required
                          rows={4}
                          placeholder={copy.contact.detailsPlaceholder}
                          className="bg-transparent border-b border-white/[0.1]
                            focus:border-[#FF3B3B]/50 py-4 text-2xl font-display
                            font-light outline-none placeholder:text-white/15
                            w-full text-white resize-none min-h-[150px]
                            transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <MagneticButton
                        type="submit"
                        isDark
                        style={{ backgroundColor: ACCENT, color: '#ffffff', borderColor: ACCENT }}
                        className="group inline-flex items-center gap-3 px-10 py-5
                          rounded-full text-[11px] font-bold tracking-[0.24em] uppercase
                          border transition-all duration-300 ease-out
                          hover:shadow-[0_0_32px_rgba(255,59,59,0.28)]"
                      >
                        <span>{copy.contact.sendLabel}</span>
                        <FiArrowRight
                          className="text-base transition-transform duration-300
                            group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </MagneticButton>
                    </div>
                  </form>
                ) : (
                  /* ─── Success state ─── */
                  <div
                    className="relative rounded-3xl border border-white/[0.07]
                      bg-gradient-to-b from-white/[0.03] to-transparent
                      py-24 px-12 text-center overflow-hidden"
                  >
                    {/* Red top hairline */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background:
                          'linear-gradient(to right, rgba(255,59,59,0.4), transparent)',
                      }}
                    />

                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center
                        mx-auto mb-10 border border-[#FF3B3B]/20"
                      style={{ backgroundColor: 'rgba(255,59,59,0.08)' }}
                    >
                      <FiCheck className="text-4xl" style={{ color: ACCENT }} />
                    </div>

                    <h3
                      className="font-display font-light italic tracking-tighter
                        text-white/92 mb-6"
                      style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}
                    >
                      Message Sent
                    </h3>

                    <p className="text-base font-light leading-[1.82] text-white/42
                      max-w-[34ch] mx-auto mb-12">
                      Thank you for reaching out. Our team will review your project details
                      and get back to you within 24 hours.
                    </p>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[10px] uppercase tracking-[0.4em] font-bold
                        text-white/35 hover:text-white/65 transition-colors duration-200
                        underline underline-offset-[10px]"
                    >
                      Send another message
                    </button>
                  </div>
                )}
              </LazySection>

              {/* ─── FAQ accordion ─── */}
              <LazySection>
                <div className="pt-8 border-t border-white/[0.07]">

                  {/* FAQ eyebrow + heading */}
                  <TextReveal>
                    <Eyebrow label={copy.contact.faqTitle} className="mb-8" />
                  </TextReveal>

                  <h2
                    className="font-display font-light italic text-white/75
                      tracking-[-0.01em] mb-12"
                    style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)' }}
                  >
                    {copy.contact.faqSubtitle}
                  </h2>

                  <div>
                    {copy.contact.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="border-t border-white/[0.07] overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full py-8 flex items-center justify-between
                            text-left group"
                          aria-expanded={openFaq === idx}
                        >
                          <h4
                            className="text-xl md:text-2xl font-display font-light
                              text-white/58 group-hover:text-white/85
                              transition-colors duration-200 pr-8"
                          >
                            {faq.q}
                          </h4>
                          <div
                            className={`w-9 h-9 rounded-full border flex items-center
                              justify-center shrink-0 transition-all duration-300
                              ${
                                openFaq === idx
                                  ? 'border-[#FF3B3B] text-[#FF3B3B]'
                                  : 'border-white/[0.1] text-white/35 group-hover:border-white/20 group-hover:text-white/55'
                              }`}
                          >
                            {openFaq === idx ? <FiMinus size={13} /> : <FiPlus size={13} />}
                          </div>
                        </button>

                        <div
                          className={`transition-all duration-500 ease-in-out
                            ${
                              openFaq === idx
                                ? 'max-h-96 pb-10 opacity-100'
                                : 'max-h-0 opacity-0 overflow-hidden'
                            }`}
                        >
                          <p
                            className="text-base font-light leading-[1.82]
                              text-white/40 max-w-2xl"
                          >
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    ))}
                    {/* Final border */}
                    <div className="border-t border-white/[0.07]" />
                  </div>
                </div>
              </LazySection>
            </div>

            {/* ─── Sidebar (col-span 5) ─── */}
            <aside className="md:col-span-5">
              <div className="sticky top-32 space-y-6">

                {/* Top image card */}
                <LazySection>
                  <div className="relative rounded-3xl overflow-hidden group">
                    <img
                      src={SIDEBAR_IMAGE}
                      alt="Lightlab studio space"
                      className="w-full aspect-[4/3] object-cover grayscale opacity-55
                        group-hover:grayscale-0 group-hover:opacity-85
                        transition-all duration-700"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t
                        from-black/70 to-transparent pointer-events-none"
                    />

                    {/* Availability badge — top-left */}
                    <div
                      className="absolute top-5 left-5 flex items-center gap-3
                        px-4 py-2 rounded-full backdrop-blur-md
                        bg-black/40 border border-white/[0.1]"
                    >
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full
                            rounded-full bg-emerald-400 opacity-75"
                        />
                        <span
                          className="relative inline-flex rounded-full h-2.5 w-2.5
                            bg-emerald-500"
                        />
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-[0.3em]
                          font-bold text-white/80"
                      >
                        {copy.contact.statusLabel}
                      </span>
                    </div>
                  </div>
                </LazySection>

                {/* Info card */}
                <LazySection>
                  <div
                    className="relative rounded-3xl border border-white/[0.07]
                      bg-gradient-to-b from-white/[0.03] to-transparent
                      p-10 overflow-hidden"
                  >
                    {/* Red top hairline */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background:
                          'linear-gradient(to right, rgba(255,59,59,0.4), transparent)',
                      }}
                    />

                    <div className="space-y-12">

                      {/* Studio email + location */}
                      <div>
                        <span
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 block mb-6"
                        >
                          {copy.contact.studioLabel}
                        </span>

                        <a
                          href={`mailto:${copy.footer.email}`}
                          className="text-3xl font-display font-light
                            text-white/85 block mb-3 tracking-tight
                            hover:italic hover:text-[#FF3B3B]
                            transition-all duration-300
                            underline underline-offset-[10px]
                            decoration-white/[0.1]
                            hover:decoration-[#FF3B3B]/40"
                        >
                          {copy.footer.email}
                        </a>

                        <p
                          className="text-sm font-light text-white/38
                            leading-relaxed max-w-[28ch]"
                        >
                          {copy.footer.location}
                        </p>
                      </div>

                      {/* Social links */}
                      <div>
                        <span
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 block mb-6"
                        >
                          {copy.contact.followLabel}
                        </span>

                        <div className="space-y-1">
                          {copy.contact.socials.map((label) => (
                            <a
                              key={label}
                              href="#"
                              className="flex items-center justify-between group
                                py-4 px-5 -mx-5 rounded-xl
                                hover:bg-white/[0.03]
                                border border-transparent hover:border-white/[0.07]
                                transition-all duration-200"
                            >
                              <span
                                className="text-[10px] font-bold uppercase
                                  tracking-[0.24em] text-white/50
                                  group-hover:text-white/80
                                  transition-colors duration-200"
                              >
                                {label}
                              </span>
                              <FiArrowRight
                                className="text-sm text-white/20 -rotate-45
                                  group-hover:rotate-0 group-hover:text-[#FF3B3B]
                                  transition-all duration-300"
                                aria-hidden="true"
                              />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Fast-track velocity card */}
                      <div
                        className="relative rounded-2xl border border-white/[0.05]
                          bg-white/[0.03] p-8 overflow-hidden group"
                      >
                        {/* Accent hairline sweeper */}
                        <div
                          className="absolute top-0 right-0 h-px w-1/3
                            bg-gradient-to-l from-[#FF3B3B]/30 to-transparent
                            group-hover:w-full transition-all duration-1000"
                          aria-hidden="true"
                        />

                        <span
                          className="text-[9px] font-bold tracking-[0.44em] uppercase
                            text-white/28 block mb-5"
                        >
                          {copy.contact.processLabel}
                        </span>

                        <p
                          className="text-sm font-light leading-[1.76]
                            text-white/45 italic mb-8"
                        >
                          "{copy.contact.processCopy}"
                        </p>

                        {/* Stacked avatars + label */}
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-full border-2 border-[#090909]
                                  overflow-hidden bg-white/10"
                              >
                                <img
                                  src={`https://i.pravatar.cc/100?u=${i + 10}`}
                                  alt="team member"
                                  className="w-full h-full object-cover grayscale"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                          <span
                            className="text-[9px] uppercase tracking-[0.24em]
                              font-bold text-white/28"
                          >
                            Fast-track Discovery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </LazySection>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* ══════════════════════════ WATERMARK STRIP ══════════════════════════ */}
      <div
        className="bg-[#060606] border-t border-white/[0.07]
          overflow-hidden py-8 flex items-center justify-center"
      >
        <span
          className="font-display font-bold leading-none
            text-white/[0.015] select-none whitespace-nowrap"
          style={{ fontSize: '18vw' }}
          aria-hidden="true"
        >
          CONTACT
        </span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scroll-pulse {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 0.6; }
          70%  { opacity: 0.6; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        .animate-scroll-pulse {
          animation: scroll-pulse 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-pulse { animation: none; opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default Contact
