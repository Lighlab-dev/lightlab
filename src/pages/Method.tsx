import { useLayoutEffect, useRef, useMemo, useState, useCallback, memo, type ReactNode, type MouseEvent } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

type Theme = 'dark' | 'light'

interface MethodProps {
  themeMode: Theme
}

// Animation constants
const EASE = {
  luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.62, 0.05, 0.01, 0.99)'
}

// Curated method images - process & architecture focused
const METHOD_IMAGES = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90', // Strategy
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=90', // Design process
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90', // Development
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=90'  // Launch
]

// Magnetic button component
interface MagneticButtonProps {
  children: ReactNode
  href: string
  variant?: 'primary' | 'dark' | 'light' | 'outline'
  className?: string
  isArabic: boolean
  isDark: boolean
}

const MagneticButton = memo(({ children, href, variant = 'primary', className = '', isArabic, isDark }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4
    setPosition({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  const isPrimaryDark = variant === 'dark'
  const isOutline = variant === 'outline'

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`
        group relative inline-flex items-center justify-center gap-3 
        px-10 py-5 rounded-full overflow-hidden
        text-xs font-bold tracking-[0.2em] uppercase
        transition-all duration-500
        ${isOutline 
          ? (isDark
              ? 'border border-white/30 text-white hover:bg-white hover:text-black hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
              : 'border border-black/30 text-black hover:bg-black hover:text-white hover:border-black/50 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]')
          : isPrimaryDark
            ? 'bg-white text-black border border-white/30 hover:bg-transparent hover:text-white hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]'
            : 'bg-black text-white border border-black/30 hover:bg-transparent hover:text-black hover:border-black/50 hover:shadow-[0_0_40px_rgba(0,0,0,0.25)]'
        }
        ${className}
      `}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="relative z-10">{children}</span>
      {isOutline ? (
        <svg 
          className={`relative z-10 w-4 h-4 transition-transform duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      ) : null}
    </a>
  )
})

// Text reveal animation
interface TextRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down'
}

const TextReveal = memo(({ children, delay = 0, className = '', direction = 'up' }: TextRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    
    gsap.fromTo(el, 
      { y: direction === 'up' ? '100%' : '-100%', opacity: 0 },
      { 
        y: '0%', 
        opacity: 1, 
        duration: 1,
        delay,
        ease: EASE.luxury,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      }
    )
  }, [delay, direction])

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={ref} className="will-change-transform">
        {children}
      </div>
    </div>
  )
})

// Split headline animation
interface SplitHeadlineProps {
  text: string
  className?: string
  delay?: number
}

const SplitHeadline = memo(({ text, className = '', delay = 0 }: SplitHeadlineProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lines = text.split('\n')

  useLayoutEffect(() => {
    const lines = containerRef.current?.querySelectorAll('.headline-line')
    if (!lines?.length) return

    gsap.fromTo(lines,
      { y: '100%', rotateX: -90, opacity: 0 },
      {
        y: '0%',
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        delay,
        ease: EASE.luxury,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true
        }
      }
    )
  }, [delay])

  return (
    <div ref={containerRef} className={className} style={{ perspective: '1000px' }}>
      {lines.map((line: string, i: number) => (
        <div key={i} className="overflow-hidden">
          <div className="headline-line will-change-transform" style={{ transformOrigin: 'center bottom' }}>
            {line}
          </div>
        </div>
      ))}
    </div>
  )
})

// Progress ring component
interface ProgressRingProps {
  progress: string
  size?: number
  strokeWidth?: number
  isDark: boolean
}

const ProgressRing = memo(({ progress, size = 120, strokeWidth = 2, isDark }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (parseInt(progress) / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={isDark ? 'text-white/10' : 'text-black/10'}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${isDark ? 'text-white/60' : 'text-black/60'}`}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-sm font-display font-light ${isDark ? 'text-white/80' : 'text-black/80'}`}>
        {progress}
      </div>
    </div>
  )
})

// Step card with immersive design
type MethodStep = NonNullable<ReturnType<typeof useLanguage>['copy']['method']>['steps'][number]

interface StepCardProps {
  step: MethodStep
  index: number
  totalSteps: number
  isArabic: boolean
  isDark: boolean
}

const StepCard = memo(({ step, index, totalSteps, isArabic, isDark }: StepCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const isEven = index % 2 === 0
  const progress = ['25%', '50%', '75%', '100%'][index] || '100%'

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }, [])

  return (
    <section
      ref={cardRef}
      className={`
        min-h-screen relative flex items-center py-20 overflow-hidden
        ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'}
        transition-colors duration-700
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background number watermark */}
      <div className={`
        absolute top-1/2 -translate-y-1/2 pointer-events-none select-none
        ${isArabic ? 'right-0 translate-x-1/3' : 'left-0 -translate-x-1/3'}
        text-[40vw] font-display font-bold leading-none
        ${isDark ? 'text-white/[0.015]' : 'text-black/[0.015]'}
      `}>
        {step.number}
      </div>

      {/* Ambient glow */}
      <div 
        className={`
          absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none
          transition-all duration-1000
          ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}
        `}
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${isArabic ? 'text-right' : ''}`}>
            
            {/* Content Side */}
            <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
              {/* Step indicator */}
              <div className={`flex items-center gap-6 mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`
                  px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase
                  ${isDark ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/60'}
                `}>
                  Step {step.number} / {totalSteps}
                </div>
                <div className={`flex-1 h-px max-w-[100px] ${isDark ? 'bg-gradient-to-r from-white/20' : 'bg-gradient-to-r from-black/20'}`} />
              </div>

              {/* Title */}
              <SplitHeadline 
                text={step.title}
                className={`
                  text-5xl md:text-6xl lg:text-7xl font-display font-light leading-[0.95] mb-8
                  ${index % 2 === 0 ? 'italic' : ''}
                  ${isDark ? 'text-white/90' : 'text-black/90'}
                `}
              />

              {/* Description */}
              <TextReveal delay={0.2}>
                <p className={`text-lg leading-relaxed mb-12 max-w-lg font-light ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  {step.copy}
                </p>
              </TextReveal>

              {/* Deliverables */}
              <div className="space-y-6">
                <div className={`text-[11px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {step.deliverablesLabel}
                </div>
                <ul className="space-y-4">
                  {step.deliverables.map((item: string) => (
                    <li 
                      key={item} 
                      className={`
                        group flex items-center gap-4 text-base font-light
                        ${isArabic ? 'flex-row-reverse' : ''}
                        ${isDark ? 'text-white/60' : 'text-black/60'}
                      `}
                    >
                      <span className={`
                        w-8 h-px transition-all duration-300 group-hover:w-12
                        ${isDark ? 'bg-white/30' : 'bg-black/30'}
                      `} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta value */}
              <div className="mt-12 pt-8 border-t border-current border-opacity-10">
                <div className={`text-[11px] font-medium tracking-[0.3em] uppercase mb-2 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {step.metaLabel}
                </div>
                <div className={`text-2xl font-display font-light ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                  {step.metaValue}
                </div>
              </div>
            </div>

            {/* Visual Side */}
            <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
              <div 
                className="relative group cursor-pointer"
                style={{
                  transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 5}deg) rotateX(${(0.5 - mousePos.y) * 5}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                {/* Main image container */}
                <div className={`
                  relative aspect-[4/3] rounded-lg overflow-hidden
                  ${isDark ? 'shadow-2xl shadow-white/5' : 'shadow-2xl shadow-black/5'}
                `}>
                  <img
                    src={METHOD_IMAGES[index % METHOD_IMAGES.length]}
                    alt={step.title}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-t opacity-60
                    ${isDark ? 'from-black/60 via-transparent to-transparent' : 'from-white/40 via-transparent to-transparent'}
                  `} />

                  {/* Progress indicator overlay */}
                  <div className={`
                    absolute top-8 ${isArabic ? 'left-8' : 'right-8'}
                    transition-transform duration-500
                    ${isHovered ? 'scale-110' : 'scale-100'}
                  `}>
                    <ProgressRing 
                      progress={progress} 
                      size={100} 
                      strokeWidth={1.5}
                      isDark={isDark}
                    />
                  </div>

                  {/* Step number overlay */}
                  <div className={`
                    absolute bottom-8 ${isArabic ? 'right-8' : 'left-8'}
                    text-8xl font-display font-bold
                    ${isDark ? 'text-white/10' : 'text-black/10'}
                  `}>
                    0{index + 1}
                  </div>
                </div>

                {/* Floating deliverables cards */}
                <div className={`
                  absolute -bottom-6 ${isArabic ? '-left-6' : '-right-6'}
                  w-64 p-6 rounded-lg backdrop-blur-md border
                  ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/10'}
                  transform transition-all duration-500
                  ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  <div className={`text-[10px] font-medium tracking-[0.2em] uppercase mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    Key Deliverable
                  </div>
                  <div className={`text-sm font-light ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                    {step.deliverables[0]}
                  </div>
                </div>

                {/* Decorative frame */}
                <div className={`
                  absolute -inset-4 border rounded-lg pointer-events-none transition-colors duration-500
                  ${isDark ? 'border-white/5 group-hover:border-white/10' : 'border-black/5 group-hover:border-black/10'}
                `} />
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className={`flex justify-between text-[10px] font-medium tracking-[0.2em] uppercase mb-3 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  <span>Progress</span>
                  <span>{progress}</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isDark ? 'bg-white/60' : 'bg-black/60'}`}
                    style={{ width: progress }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

function Method({ themeMode }: MethodProps) {
  const { copy, language } = useLanguage()
  const heroRef = useRef<HTMLElement | null>(null)
  const isArabic = useMemo(() => language === 'ar', [language])
  const isDark = themeMode === 'dark'

  const steps = copy.method?.steps || []
  const totalSteps = steps.length

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline({ delay: 0.3 })
      
      heroTl.from('.hero-eyebrow', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: EASE.luxury
      })
      .from('.hero-line', {
        y: '100%',
        duration: 1.2,
        stagger: 0.1,
        ease: EASE.luxury
      }, '-=0.4')
      .from('.hero-copy', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: EASE.smooth
      }, '-=0.6')
      .from('.hero-scroll', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: EASE.luxury
      }, '-=0.4')

      // Parallax on hero symbol
      gsap.to('.hero-symbol', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={`relative transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-20 relative overflow-hidden"
      >
        {/* Background symbol */}
        <div className="hero-symbol absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className={`
            text-[50vw] font-display font-black leading-none
            ${isDark ? 'text-white/[0.015]' : 'text-black/[0.015]'}
          `}>
            ∴
          </div>
        </div>

        {/* Ambient glow */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[800px] h-[800px] rounded-full blur-[200px] pointer-events-none
          ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}
        `} />

        <div className={`text-center relative z-10 max-w-5xl ${isArabic ? 'text-right' : ''}`}>
          {/* Eyebrow */}
          <div className="hero-eyebrow overflow-hidden mb-10">
            <span className={`
              inline-block text-[11px] font-medium tracking-[0.4em] uppercase
              ${isDark ? 'text-white/40' : 'text-black/40'}
            `}>
              {copy.method?.heroEyebrow || 'Our Process'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] font-light tracking-tight mb-16">
            {isArabic ? (
              <div className="hero-line overflow-hidden">
                <span className="block">{copy.method?.heroTitleLine1}</span>
              </div>
            ) : (
              <>
                <div className="hero-line overflow-hidden">
                  <span className="block">{copy.method?.heroTitleLine1 || 'Method'}</span>
                </div>
                <div className="hero-line overflow-hidden">
                  <span className={`block italic ${isDark ? 'text-white/40' : 'text-black/30'}`}>
                    {copy.method?.heroTitleLine2 || 'ology'}
                  </span>
                </div>
              </>
            )}
          </h1>

          {/* Copy */}
          <div className="hero-copy max-w-3xl mx-auto mb-16">
            <p className={`
              text-lg md:text-2xl font-light leading-relaxed
              ${isDark ? 'text-white/50' : 'text-black/50'}
            `}>
              {copy.method?.heroCopy || 'A systematic approach to creating exceptional digital experiences.'}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="hero-scroll flex flex-col items-center gap-4">
            <div className={`flex items-center gap-4 text-[10px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              <div className={`w-12 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <span>{copy.ui?.scrollToExplore || 'Scroll to Explore'}</span>
              <div className={`w-12 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
            </div>
            <FiChevronDown className={`
              text-3xl animate-bounce mt-2
              ${isDark ? 'text-white/20' : 'text-black/20'}
            `} />
          </div>
        </div>
      </section>

      {/* Process Steps */}
      {steps.map((step, index) => (
        <StepCard
          key={step.number}
          step={step}
          index={index}
          totalSteps={totalSteps}
          isArabic={isArabic}
          isDark={index % 2 === 1 ? !isDark : isDark} // Alternate sections for visual rhythm
        />
      ))}

      {/* CTA Section */}
      <section className={`
        min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-20 relative overflow-hidden
        ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}
      `}>
        {/* Decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`
            w-[600px] h-[600px] rounded-full border-[60px]
            ${isDark ? 'border-white/[0.02]' : 'border-black/[0.02]'}
          `} />
        </div>

        <div className={`text-center max-w-4xl relative z-10 ${isArabic ? 'text-right' : ''}`}>
          {/* Badge */}
          <div className="inline-block mb-10">
            <span className={`
              px-5 py-2 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase
              ${isDark ? 'bg-white/5 text-white/50 border border-white/10' : 'bg-black/5 text-black/50 border border-black/10'}
            `}>
              {copy.ui?.readyToStart || 'Ready to Start'}
            </span>
          </div>

          {/* Title */}
          <SplitHeadline 
            text={`${copy.method?.ctaTitleLine1 || 'Start Your'}\n${copy.method?.ctaTitleLine2 || 'Project'}`}
            className={`
              text-5xl md:text-7xl lg:text-8xl font-display font-light leading-[0.9] mb-12
              ${isDark ? 'text-white/90' : 'text-black/90'}
            `}
          />

          {/* Copy */}
          <TextReveal delay={0.2}>
            <p className={`
              text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-light
              ${isDark ? 'text-white/40' : 'text-black/40'}
            `}>
              {copy.method?.ctaCopy || 'Let\'s create something extraordinary together.'}
            </p>
          </TextReveal>

          {/* Buttons */}
          <div className={`flex flex-col md:flex-row gap-6 justify-center items-center ${isArabic ? 'md:flex-row-reverse' : ''}`}>
            <MagneticButton 
              href="mailto:hello@lightlab.dev"
              variant={isDark ? 'dark' : 'light'}
              isArabic={isArabic}
              isDark={isDark}
            >
              {copy.method?.ctaPrimary || 'Get in Touch'}
            </MagneticButton>
            
            <MagneticButton 
              href="/projects"
              variant="outline"
              isArabic={isArabic}
              isDark={isDark}
            >
              {copy.method?.ctaSecondary || 'View Work'}
            </MagneticButton>
          </div>

          {/* End marker */}
          <div className={`flex items-center justify-center gap-4 mt-24 text-[10px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/20' : 'text-black/20'}`}>
            <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
            <span>{copy.ui?.endOfMethod || 'End of Method'}</span>
            <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Method