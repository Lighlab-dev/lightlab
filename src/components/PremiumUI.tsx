import { useLayoutEffect, useRef, useCallback, memo, type ReactNode, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Animation configuration
export const ANIMATION = {
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
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  isDark?: boolean
  type?: 'button' | 'submit'
}

export const MagneticButton = memo(({
  children,
  className = '',
  href,
  onClick,
  variant = 'primary',
  isDark = true,
  type = 'button'
}: MagneticButtonProps) => {
  const buttonRef = useRef<any>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    gsap.to(buttonRef.current, { x, y, duration: 0.3, ease: 'power2.out', overwrite: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true })
  }, [])

  const baseStyles = variant === 'primary'
    ? (isDark
      ? 'bg-white text-black border border-white/30 hover:bg-black hover:text-white hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] focus-visible:bg-black focus-visible:text-white'
      : 'bg-black text-white border border-black/30 hover:bg-white hover:text-black hover:border-black/40 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] focus-visible:bg-white focus-visible:text-black')
    : (isDark
        ? 'border border-white/20 text-white hover:border-white/40 focus-visible:border-white/60'
        : 'border border-black/20 text-black hover:border-black/40 focus-visible:border-black/60')

  const commonProps = {
    ref: buttonRef,
    className: `inline-block transition-[background-color,color,border-color,box-shadow] duration-300 ease-out ${baseStyles} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick
  }

  if (href) {
    return (
      <a {...commonProps} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button {...commonProps} type={type}>
      {children}
    </button>
  )
})

// Text reveal with mask animation
interface TextRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const TextReveal = memo(({ children, delay = 0, className = '', direction = 'up' }: TextRevealProps) => {
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
        duration: 0.65,
        delay,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
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

export const SplitText = memo(({ text, className = '', delay = 0, type = 'chars' }: SplitTextProps) => {
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
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: type === 'chars' ? 0.018 : 0.06,
        delay,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 92%',
          once: true
        }
      }
    )
  }, [delay, type])

  return (
    <div ref={containerRef} className={`${className}`} style={{ perspective: '1000px' }}>
      <div className="flex flex-wrap">
        {elements}
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

export const CinematicImage = memo(({ src, alt, className = '', priority = false }: CinematicImageProps) => {
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
        start: 'top 88%',
        once: true
      }
    })

    tl.fromTo(overlay,
      { scaleX: 1 },
      { scaleX: 0, duration: 1, ease: ANIMATION.ease.luxury, transformOrigin: 'right center' }
    )
    .fromTo(image,
      { scale: 1.1 },
      { scale: 1, duration: 1.2, ease: ANIMATION.ease.smooth },
      '-=0.8'
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={overlayRef} className="absolute inset-0 bg-current z-10 opacity-10" />
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

export const NoiseTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-[0.03]">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
    </svg>
  </div>
)

export const AmbientGlow = ({ isDark }: { isDark: boolean }) => (
  <>
    <div className={`fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`} />
    <div className={`fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`} />
  </>
)
