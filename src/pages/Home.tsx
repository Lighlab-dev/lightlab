import { useLayoutEffect, useRef, useMemo, memo, useState, useCallback, createContext, useContext, type MouseEvent, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

// Theme Context for dark/light mode
type Theme = 'dark' | 'light'

type Copy = ReturnType<typeof useLanguage>['copy']

interface ThemeContextValue {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' })

interface HomeProps {
  themeMode: Theme
}

// Premium image URLs - curated for both dark and light modes
const IMAGES = {
  hero: {
    primary: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=85', // White concrete architecture
    secondary: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=85' // Abstract 3D shapes
  },
  services: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', // Minimal office
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=85', // Product design
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=85' // Brand identity
  ],
  method: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85', // Strategy
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=85', // Design process
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85' // Development
  ],
  cta: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=85' // Abstract gradient
}

// Animation configuration
const ANIMATION = {
  duration: { reveal: 1.2, hover: 0.6, stagger: 0.08 },
  ease: {
    luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'cubic-bezier(0.62, 0.05, 0.01, 0.99)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}

// Magnetic button with enhanced hover
interface MagneticButtonProps {
  children: ReactNode
  className?: string
  href: string
  variant?: 'primary' | 'outline'
}

const MagneticButton = memo(({ children, className = '', href, variant = 'primary' }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

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

  const baseStyles = variant === 'primary'
    ? (isDark
      ? 'bg-white text-black border border-white/30 hover:bg-black hover:text-white hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]'
      : 'bg-black text-white border border-black/30 hover:bg-white hover:text-black hover:border-black/40 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]')
    : (isDark
        ? 'border border-white/20 text-white hover:border-white/40'
        : 'border border-black/20 text-black hover:border-black/40')

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`inline-block transition-transform duration-300 ease-out ${baseStyles} ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  )
})

// Text reveal with mask animation
interface TextRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

const TextReveal = memo(({ children, delay = 0, className = '', direction = 'up' }: TextRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    
    const fromY = direction === 'up' ? '100%' : direction === 'down' ? '-100%' : '0%'
    const fromX = direction === 'left' ? '100%' : direction === 'right' ? '-100%' : '0%'
    
    gsap.fromTo(el, 
      { y: fromY, x: fromX, opacity: 0 },
      { 
        y: '0%', 
        x: '0%',
        opacity: 1, 
        duration: ANIMATION.duration.reveal,
        delay,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
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

// Split text animation
interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  type?: 'chars' | 'words'
}

const SplitText = memo(({ text, className = '', delay = 0, type = 'chars' }: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  const elements = type === 'chars' 
    ? text.split('').map((char: string, i: number) => (
        <span key={i} className="split-char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))
    : text.split(' ').map((word: string, i: number) => (
        <span key={i} className="split-word inline-block mr-[0.25em]">
          {word}
        </span>
      ))

  useLayoutEffect(() => {
    const chars = containerRef.current?.querySelectorAll('.split-char, .split-word')
    if (!chars?.length) return

    gsap.fromTo(chars,
      { y: '100%', opacity: 0, rotateX: -90 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: type === 'chars' ? 0.02 : 0.08,
        delay,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true
        }
      }
    )
  }, [delay, type])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`} style={{ perspective: '1000px' }}>
      <div className="flex flex-wrap">
        {elements}
      </div>
    </div>
  )
})

// Luxury card with glassmorphism
interface LuxuryCardItem {
  title: string
  copy: string
}

interface LuxuryCardProps {
  item: LuxuryCardItem
  index: number
  variant?: 'default' | 'featured'
  copy: Copy
  isArabic: boolean
}

const LuxuryCard = memo(({ item, index, variant = 'default', copy, isArabic }: LuxuryCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    setTilt({ x: y * -8, y: x * 8 })
  }, [])

  const isFeatured = variant === 'featured'

  return (
    <div
      ref={cardRef}
      className={`group relative ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false) }}
      style={{
        perspective: '1000px',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className={`
        relative h-full overflow-hidden rounded-lg
        transition-all duration-700
        ${isFeatured ? 'min-h-[540px] p-10 lg:p-14' : 'aspect-[4/5] p-8'}
        ${isDark 
          ? 'bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]' 
          : 'bg-black/[0.02] border border-black/[0.08] hover:border-black/20 hover:shadow-[0_0_60px_rgba(0,0,0,0.08)]'
        }
        ${isHovered ? 'backdrop-blur-xl' : 'backdrop-blur-md'}
      `}>
        {/* Animated gradient background */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
          ${isDark 
            ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02]' 
            : 'bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.01]'
          }
        `} />
        
        {/* Corner decorations */}
        <div className={`absolute top-0 left-0 w-12 h-px ${isDark ? 'bg-gradient-to-r from-white/30' : 'bg-gradient-to-r from-black/30'}`} />
        <div className={`absolute top-0 left-0 w-px h-12 ${isDark ? 'bg-gradient-to-b from-white/30' : 'bg-gradient-to-b from-black/30'}`} />
        <div className={`absolute bottom-0 right-0 w-12 h-px ${isDark ? 'bg-gradient-to-l from-white/30' : 'bg-gradient-to-l from-black/30'}`} />
        <div className={`absolute bottom-0 right-0 w-px h-12 ${isDark ? 'bg-gradient-to-t from-white/30' : 'bg-gradient-to-t from-black/30'}`} />

        <div className="relative z-10 h-full flex flex-col justify-between">
          {isFeatured ? (
            <>
              <div>
                <div className={`flex items-center gap-4 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-[10px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                    {copy.ui.chapter} 0{index + 1}
                  </span>
                  <div className={`flex-1 h-px ${isDark ? 'bg-gradient-to-r from-white/20' : 'bg-gradient-to-r from-black/20'}`} />
                </div>
                <h3 className={`
                  text-4xl md:text-5xl lg:text-6xl font-display font-light leading-[1.05] mb-6
                  ${isDark ? 'text-white/90 group-hover:text-white' : 'text-black/90 group-hover:text-black'}
                  transition-colors duration-500
                  ${isArabic ? 'text-right' : 'italic'}
                `}>
                  {item.title}
                </h3>
              </div>
              <p className={`
                text-sm leading-relaxed max-w-md font-light
                ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-black/50 group-hover:text-black/70'}
                transition-colors duration-500
                ${isArabic ? 'text-right' : ''}
              `}>
                {item.copy}
              </p>
            </>
          ) : (
            <>
              <div className={`flex justify-between items-start ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className={`text-[10px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  {copy.ui.chapter} 0{index + 1}
                </span>
                <div className={`
                  w-2 h-2 rounded-full border transition-all duration-500
                  ${isDark ? 'border-white/20' : 'border-black/20'}
                  ${isHovered ? (isDark ? 'bg-white/40' : 'bg-black/40') + ' scale-150' : 'bg-transparent'}
                `} />
              </div>
              
              <div className={isArabic ? 'text-right' : ''}>
                <h3 className={`
                  text-2xl md:text-3xl font-display font-light mb-4 leading-tight
                  ${isDark ? 'text-white/90 group-hover:text-white' : 'text-black/90 group-hover:text-black'}
                  transition-colors duration-500
                `}>
                  {item.title}
                </h3>
                <p className={`
                  text-[13px] leading-relaxed line-clamp-3 font-light
                  ${isDark ? 'text-white/40 group-hover:text-white/50' : 'text-black/50 group-hover:text-black/60'}
                  transition-colors duration-500
                `}>
                  {item.copy}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Large watermark number */}
        <div className={`
          absolute -bottom-6 ${isArabic ? '-left-6' : '-right-6'}
          text-[140px] font-display font-bold select-none pointer-events-none
          transition-all duration-700 group-hover:scale-110
          ${isDark ? 'text-white/[0.02] group-hover:text-white/[0.04]' : 'text-black/[0.02] group-hover:text-black/[0.04]'}
        `}>
          0{index + 1}
        </div>
      </div>
    </div>
  )
})

// Cinematic image with reveal
interface CinematicImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

const CinematicImage = memo(({ src, alt, className = '', priority = false }: CinematicImageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    const overlay = overlayRef.current
    
    if (!container || !image || !overlay) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true
      }
    })

    tl.fromTo(overlay,
      { scaleX: 1 },
      { scaleX: 0, duration: 1.4, ease: ANIMATION.ease.luxury, transformOrigin: 'right center' }
    )
    .fromTo(image,
      { scale: 1.3, filter: 'blur(20px)' },
      { scale: 1, filter: 'blur(0px)', duration: 1.6, ease: ANIMATION.ease.smooth },
      '-=1.2'
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={overlayRef} className="absolute inset-0 bg-current z-10" />
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
})

// Service showcase with 3D perspective
interface ServiceShowcaseItem {
  title: string
  copy: string
}

interface ServiceShowcaseProps {
  item: ServiceShowcaseItem
  index: number
  copy: Copy
  isReversed: boolean
}

const ServiceShowcase = memo(({ item, index, copy, isReversed }: ServiceShowcaseProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo(section.querySelectorAll('.reveal-service'),
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true
        }
      }
    )
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }, [])

  return (
    <div 
      ref={sectionRef}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center py-28 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Content */}
      <div className={`lg:col-span-5 ${isReversed ? 'lg:col-start-8' : 'lg:col-start-1'} reveal-service`}>
        <div className="relative">
          <span className={`text-[11px] font-medium tracking-[0.4em] uppercase block mb-6 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
            {copy.home.serviceLabel} 0{index + 1}
          </span>
          
          <h3 className={`text-4xl md:text-5xl lg:text-6xl font-display font-light leading-[1.05] mb-8 ${isDark ? 'text-white/90' : 'text-black/90'}`}>
            {item.title}
          </h3>
          
          <p className={`text-base leading-relaxed mb-10 max-w-md font-light ${isDark ? 'text-white/40' : 'text-black/50'}`}>
            {item.copy}
          </p>

          <MagneticButton 
            href="#contact"
            variant="outline"
            className="group inline-flex items-center gap-4 px-6 py-3 rounded-full text-xs font-medium tracking-[0.2em] uppercase"
          >
            <span className="relative overflow-hidden h-4">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {copy.home.servicesCta}
              </span>
              <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
                {copy.home.servicesCta}
              </span>
            </span>
            <div className={`w-8 h-px transform origin-left transition-transform duration-300 group-hover:scale-x-150 ${isDark ? 'bg-current' : 'bg-current'}`} />
          </MagneticButton>
        </div>
      </div>

      {/* Image with 3D tilt */}
      <div className={`lg:col-span-6 ${isReversed ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7'} reveal-service`}>
        <div 
          className="relative group cursor-pointer"
          style={{
            transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 5}deg) rotateX(${(0.5 - mousePos.y) * 5}deg)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <CinematicImage
              src={IMAGES.services[index]}
              alt={item.title}
              className="aspect-[4/3] w-full"
            />
            
            {/* Floating label */}
            <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-full backdrop-blur-md border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
              <span className={`text-[10px] font-medium tracking-widest uppercase ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                {copy.home.viewProjectLabel}
              </span>
            </div>
          </div>
          
          {/* Decorative frame */}
          <div className={`absolute -inset-4 border rounded-lg pointer-events-none transition-colors duration-500 ${isDark ? 'border-white/5 group-hover:border-white/10' : 'border-black/5 group-hover:border-black/10'}`} />
        </div>
      </div>
    </div>
  )
})

function Home({ themeMode }: HomeProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const { copy, language } = useLanguage()
  const isArabic = useMemo(() => language === 'ar', [language])
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll progress
  useLayoutEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollTop / docHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTl = gsap.timeline({ delay: 0.5 })
      
      heroTl.from('.hero-tag', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: ANIMATION.ease.luxury
      })
      .from('.hero-line', {
        y: '100%',
        duration: 1.2,
        stagger: 0.12,
        ease: ANIMATION.ease.luxury
      }, '-=0.4')
      .from('.hero-sub', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: ANIMATION.ease.smooth
      }, '-=0.6')
      .from('.hero-img', {
        scale: 1.3,
        opacity: 0,
        duration: 1.6,
        stagger: 0.2,
        ease: ANIMATION.ease.luxury
      }, '-=1')

      // Parallax
      gsap.to('.hero-img-1', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      gsap.to('.hero-img-2', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const isDark = themeMode === 'dark'
  const textDirection = useMemo(() => ({
    base: isArabic ? 'text-right' : 'text-left',
    flex: isArabic ? 'flex-row-reverse' : 'flex-row'
  }), [isArabic])

  return (
    <ThemeContext.Provider value={{ theme: themeMode }}>
      <div 
        ref={wrapperRef} 
        className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}
      >
        {/* Progress bar */}
        <div 
          className={`fixed top-0 left-0 h-[2px] z-[100] transition-colors duration-700 ${isDark ? 'bg-white/40' : 'bg-black/40'}`} 
          style={{ width: `${scrollProgress * 100}%` }} 
        />
        
        {/* Noise texture */}
        <div className={`fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-[0.03]`}>
          <svg className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </div>

        {/* Ambient glows */}
        <div className={`fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`} />
        <div className={`fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`} />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          
          {/* Navigation spacer */}
          <div className="h-28" />

          {/* Hero Section */}
          <section ref={heroRef} className="min-h-[85vh] flex flex-col justify-center relative mb-32">
            <div className="grid grid-cols-12 gap-6 items-end">
              
              {/* Typography */}
              <div className={`col-span-12 lg:col-span-7 ${textDirection.base}`}>
                <div className="hero-tag mb-10 overflow-hidden">
                  <span className={`inline-block text-[11px] font-medium tracking-[0.4em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    {copy.home.heroTag}
                  </span>
                </div>

                <h1 className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.9] font-light tracking-tight mb-16">
                  {isArabic ? (
                    <div className="hero-line overflow-hidden">
                      <span className="block">{copy.home.heroTitle1} {copy.home.heroTitle2}</span>
                    </div>
                  ) : (
                    <>
                      <div className="hero-line overflow-hidden">
                        <span className="block">{copy.home.heroTitle1}</span>
                      </div>
                      <div className="hero-line overflow-hidden">
                        <span className={`block italic ${isDark ? 'text-white/50' : 'text-black/40'}`}>{copy.home.heroTitle2}</span>
                      </div>
                    </>
                  )}
                </h1>

                <div className={`hero-sub flex flex-col md:flex-row ${textDirection.flex} gap-10 md:gap-20`}>
                  <p className={`text-sm uppercase tracking-widest font-medium max-w-[220px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                    {copy.home.heroMeta}
                  </p>
                  <p className={`text-lg md:text-xl leading-relaxed max-w-xl font-light ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {copy.home.heroCopy}
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="col-span-12 lg:col-span-5 relative h-[500px] lg:h-[650px] mt-16 lg:mt-0">
                <div className="hero-img hero-img-1 absolute top-0 right-0 w-[65%] aspect-[3/4] z-10 shadow-2xl rounded-lg overflow-hidden">
                  <CinematicImage
                    src={IMAGES.hero.primary}
                    alt="Hero primary"
                    className="w-full h-full"
                    priority
                  />
                </div>
                <div className="hero-img hero-img-2 absolute bottom-12 left-0 w-[55%] aspect-square z-20 shadow-2xl rounded-lg overflow-hidden">
                  <CinematicImage
                    src={IMAGES.hero.secondary}
                    alt="Hero secondary"
                    className="w-full h-full"
                    priority
                  />
                </div>
                
                {/* Decorative circle */}
                <div className={`absolute top-1/2 left-1/2 w-40 h-40 border rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'border-white/10' : 'border-black/10'}`} />
              </div>
            </div>

            {/* Scroll indicator */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 ${isDark ? 'opacity-30' : 'opacity-40'}`}>
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{copy.home.scrollLabel}</span>
              <div className={`w-px h-16 bg-gradient-to-b ${isDark ? 'from-white/40' : 'from-black/40'} to-transparent`} />
            </div>
          </section>

          {/* Marquee */}
          <div className={`py-16 border-y overflow-hidden ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {[...Array(4)].map((_, i) => (
                <span key={i} className={`text-6xl md:text-8xl font-display font-light uppercase tracking-tight ${isDark ? 'text-white/[0.03]' : 'text-black/[0.12]'}`}>
                  {copy.home.heroTitle1} — {copy.home.heroTitle2} —
                </span>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <section className="py-32">
            <div className={`mb-24 ${textDirection.base}`}>
              <TextReveal>
                <span className={`text-[11px] font-medium tracking-[0.4em] uppercase block mb-8 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {copy.home.expertiseLabel}
                </span>
              </TextReveal>
              <SplitText 
                text={copy.home.expertiseTitle}
                className={`text-5xl md:text-7xl lg:text-8xl font-display font-light mb-8 ${isDark ? 'text-white/90' : 'text-black/90'}`}
                type="words"
              />
              <TextReveal delay={0.2}>
                <p className={`text-base max-w-2xl leading-relaxed font-light ${isDark ? 'text-white/40' : 'text-black/50'}`}>
                  {copy.home.expertiseCopy}
                </p>
              </TextReveal>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {copy.home.bentoCards.map((item, index) => (
                <LuxuryCard 
                  key={item.title} 
                  item={item} 
                  index={index} 
                  copy={copy}
                  isArabic={isArabic}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          </section>

          {/* Philosophy */}
          <section className={`-mx-6 md:-mx-12 lg:-mx-20 py-32 relative overflow-hidden ${isDark ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`}>
            <div className="px-6 md:px-12 lg:px-20 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                {copy.home.clarity.map((item, index) => (
                  <div key={item.title} className={`group ${textDirection.base}`}>
                    <div className="mb-10 overflow-hidden">
                      <span className={`block text-[140px] font-display font-bold leading-none transition-colors duration-700 ${isDark ? 'text-white/[0.02] group-hover:text-white/[0.05]' : 'text-black/[0.02] group-hover:text-black/[0.05]'}`}>
                        0{index + 1}
                      </span>
                    </div>
                    <h4 className={`text-sm font-medium tracking-[0.3em] uppercase mb-8 transition-colors ${isDark ? 'text-white/30 group-hover:text-white/50' : 'text-black/40 group-hover:text-black/60'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-2xl md:text-3xl font-display font-light leading-tight mb-6 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      {item.lead}
                    </p>
                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-white/40' : 'text-black/50'}`}>
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="py-32">
            <div className={`mb-20 ${textDirection.base}`}>
              <TextReveal>
                <span className={`text-[11px] font-medium tracking-[0.4em] uppercase block mb-8 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {copy.home.coreLabel}
                </span>
              </TextReveal>
              <SplitText 
                text={`${copy.home.servicesTitleLine1} ${copy.home.servicesTitleLine2}`}
                className={`text-5xl md:text-7xl lg:text-9xl font-display font-light leading-[0.9] ${isDark ? 'text-white/90' : 'text-black/90'}`}
                type="words"
              />
            </div>

            <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
              {copy.home.serviceTracks.map((item, index) => (
                <ServiceShowcase 
                  key={item.title}
                  item={item}
                  index={index}
                  copy={copy}
                  isReversed={index % 2 === 1}
                />
              ))}
            </div>
          </section>

          {/* Method */}
          <section className={`py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className={`mb-24 ${textDirection.base}`}>
              <TextReveal>
                <span className={`text-[11px] font-medium tracking-[0.4em] uppercase block mb-8 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {copy.home.methodTitle}
                </span>
              </TextReveal>
              <h2 className={`text-5xl md:text-6xl lg:text-7xl font-display font-light mb-10 leading-tight ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                {copy.home.methodSteps.join(' · ')}
              </h2>
              <TextReveal delay={0.1}>
                <p className={`text-base max-w-2xl leading-relaxed font-light ${isDark ? 'text-white/40' : 'text-black/50'}`}>
                  {copy.home.methodCopy}
                </p>
              </TextReveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {copy.home.methodCards.map((item, index) => (
                <div key={item.title} className="group">
                  <div className={`aspect-[4/5] overflow-hidden rounded-lg mb-8 relative ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <CinematicImage
                      src={IMAGES.method[index]}
                      alt={item.title}
                      className="w-full h-full"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'from-black/60' : 'from-white/60'}`} />
                    
                    <div className={`absolute top-6 left-6 px-3 py-1.5 rounded-full backdrop-blur-md border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/30 border-black/10'}`}>
                      <span className={`text-[10px] font-medium tracking-widest uppercase ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                        {copy.home.stepLabel} 0{index + 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className={textDirection.base}>
                    <h3 className={`text-2xl font-display font-light mb-3 transition-colors ${isDark ? 'text-white/90 group-hover:text-white' : 'text-black/90 group-hover:text-black'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-white/40' : 'text-black/50'}`}>
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="py-40 relative scroll-mt-40" id="contact">
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isDark ? 'via-white/[0.01]' : 'via-black/[0.01]'} to-transparent pointer-events-none`} />
            
            <div className={`relative z-10 max-w-4xl mx-auto text-center ${textDirection.base}`}>
              <TextReveal>
                <span className={`text-[11px] font-medium tracking-[0.4em] uppercase block mb-10 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                  {copy.home.ctaLabel}
                </span>
              </TextReveal>
              
              <SplitText 
                text={copy.home.ctaTitle}
                className={`overflow-visible text-6xl md:text-8xl lg:text-[10rem] font-display font-normal mb-12 leading-[0.95] ${isDark ? 'text-white/90' : 'text-black'}`}
                type="words"
                delay={0.1}
              />
              
              <TextReveal delay={0.3}>
                <p className={`text-lg max-w-xl mx-auto leading-relaxed font-light mb-20 ${isDark ? 'text-white/40' : 'text-black/50'}`}>
                  {copy.home.ctaCopy}
                </p>
              </TextReveal>

              <div className="reveal-service">
                <MagneticButton 
                  href="mailto:hello@lightlab.dev"
                  className="group relative inline-flex items-center justify-center px-14 py-6 rounded-full overflow-hidden transition-all duration-500"
                  variant="primary"
                >
                  <span className="relative z-10 text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300">
                    {copy.home.ctaButton}
                  </span>
                </MagneticButton>
              </div>
            </div>

            {/* Background watermark */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
              <div className={`text-[18vw] font-display font-bold leading-none text-center whitespace-nowrap transform translate-y-1/3 ${isDark ? 'text-white/[0.015]' : 'text-black/[0.015]'}`}>
                LIGHTLAB
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`py-16 border-t flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] uppercase tracking-widest font-medium ${isDark ? 'border-white/5 text-white/30' : 'border-black/5 text-black/40'}`}>
            <span>© 2024 Lightlab Studio</span>
            <div className="flex gap-12">
              {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                <a 
                  key={social} 
                  href="#" 
                  className={`transition-colors duration-300 ${isDark ? 'hover:text-white/70' : 'hover:text-black/70'}`}
                >
                  {social}
                </a>
              ))}
            </div>
          </footer>
        </div>

        {/* Global styles */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  )
}

export default Home