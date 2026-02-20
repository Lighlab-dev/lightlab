import { useLayoutEffect, useRef, useMemo, memo, useState, useCallback, type ReactNode, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

// Theme Context
type Theme = 'dark' | 'light'

interface ProjectsProps {
  themeMode: Theme
}

// Premium curated images - museum/gallery quality
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1400&q=90',
  projects: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=90',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=90',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=90',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=90'
  ]
}

// Animation constants
const EASE = {
  luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.62, 0.05, 0.01, 0.99)',
  elastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
}

// Magnetic text link
interface MagneticLinkProps {
  href: string
  children: ReactNode
  className?: string
}

const MagneticLink = memo(({ href, children, className = '' }: MagneticLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return
    const rect = linkRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    setPosition({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return (
    <a
      ref={linkRef}
      href={href}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  )
})

// Text scramble effect
interface ScrambleTextProps {
  text: string
  className?: string
  triggerOnHover?: boolean
}

const ScrambleText = memo(({ text, className = '', triggerOnHover = false }: ScrambleTextProps) => {
  const elementRef = useRef<HTMLSpanElement | null>(null)
  const [displayText, setDisplayText] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  const scramble = useCallback(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((_, index: number) => {
            if (index < iteration) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      
      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 3
    }, 30)
  }, [text])

  useLayoutEffect(() => {
    if (!triggerOnHover) {
      const timer = setTimeout(scramble, 500)
      return () => clearTimeout(timer)
    }
  }, [scramble, triggerOnHover])

  return (
    <span 
      ref={elementRef}
      className={`inline-block ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  )
})

// Parallax image with depth
interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number
  className?: string
}

const ParallaxImage = memo(({ src, alt, speed = 0.5, className = '' }: ParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return

    gsap.to(image, {
      yPercent: speed * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  }, [speed])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img 
        ref={imageRef}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover will-change-transform scale-110"
      />
    </div>
  )
})

// Project card with hover expansion
type ProjectsItem = ReturnType<typeof useLanguage>['copy']['projects']['items'][number]

interface ProjectCardProps {
  project: ProjectsItem
  index: number
  layout?: 'standard' | 'wide' | 'featured'
  isArabic: boolean
  isDark: boolean
}

const ProjectCard = memo(({ project, index, layout = 'standard', isArabic, isDark }: ProjectCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }, [])

  const isFeatured = layout === 'featured'
  const isWide = layout === 'wide'

  return (
    <article
      ref={cardRef}
      data-cursor="pointer"
      className={`
        group relative overflow-hidden cursor-pointer
        ${isFeatured ? 'col-span-12 lg:col-span-8 row-span-2 h-[70vh] min-h-[600px]' : ''}
        ${isWide ? 'col-span-12 lg:col-span-6 h-[50vh] min-h-[400px]' : 'col-span-12 md:col-span-6 lg:col-span-4 h-[45vh] min-h-[350px]'}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: isHovered 
            ? `scale(1.05) translate(${(mousePosition.x - 0.5) * -20}px, ${(mousePosition.y - 0.5) * -20}px)`
            : 'scale(1)'
        }}
      >
        <ParallaxImage 
          src={IMAGES.projects[index % IMAGES.projects.length]} 
          alt={project.title}
          speed={isFeatured ? 0.3 : 0.5}
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlay */}
      <div className={`
        absolute inset-0 transition-all duration-700
        ${isFeatured 
          ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90' 
          : 'bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80'
        }
      `} />

      {/* Content */}
      <div className={`
        absolute inset-0 flex flex-col justify-end p-8 md:p-12
        transition-transform duration-500
        ${isArabic ? 'text-right items-end' : ''}
      `}>
        {/* Category tag */}
        <div className={`
          overflow-hidden mb-4 transition-all duration-500
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <span className="inline-block px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase bg-white/10 backdrop-blur-md rounded-full text-white/80 border border-white/10">
            {project.focus}
          </span>
        </div>

        {/* Title with character animation */}
        <h3 className={`
          font-display font-light text-white leading-[1.1] mb-4
          transition-all duration-500
          ${isFeatured ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-2xl md:text-3xl'}
          ${isHovered ? 'translate-y-0' : 'translate-y-2'}
        `}>
          <ScrambleText text={project.title} triggerOnHover={true} />
        </h3>

        {/* Description - only on featured */}
        {isFeatured && (
          <p className={`
            text-base md:text-lg text-white/70 max-w-xl font-light leading-relaxed mb-6
            transition-all duration-500 delay-100
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            {project.result}
          </p>
        )}

        {/* View project link */}
        <div className={`
          flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase text-white/60
          transition-all duration-500
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${isArabic ? 'flex-row-reverse' : ''}
        `}>
          <span>View Project</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isArabic ? 'rotate-180' : ''} ${isHovered ? 'translate-x-1' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Index number */}
      <div className={`
        absolute top-8 ${isArabic ? 'right-8' : 'left-8'}
        text-7xl font-display font-bold text-white/[0.03] select-none pointer-events-none
        transition-all duration-700
        ${isHovered ? 'text-white/[0.08] scale-110' : ''}
      `}>
        0{index + 1}
      </div>

      {/* Border accent */}
      <div className={`
        absolute inset-0 border transition-all duration-500 pointer-events-none
        ${isDark ? 'border-white/0 group-hover:border-white/20' : 'border-black/0 group-hover:border-black/20'}
      `} />
    </article>
  )
})

// Animated divider
interface AnimatedDividerProps {
  isDark: boolean
  isArabic: boolean
}

const AnimatedDivider = memo(({ isDark, isArabic }: AnimatedDividerProps) => (
  <div className={`flex items-center gap-6 py-20 ${isArabic ? 'flex-row-reverse' : ''}`}>
    <div className={`flex-1 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-black/20 to-transparent'}`} />
    <div className={`
      w-2 h-2 rounded-full border rotate-45
      ${isDark ? 'border-white/30' : 'border-black/30'}
    `} />
    <div className={`flex-1 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-black/20 to-transparent'}`} />
  </div>
))

// Stat counter with animation
interface StatCounterProps {
  value: string
  label: string
  isDark: boolean
  isArabic: boolean
}

const StatCounter = memo(({ value, label, isDark, isArabic }: StatCounterProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: parseInt(value),
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            setCount(Math.floor(this.targets()[0].val))
          }
        })
      }
    })
  }, [value])

  return (
    <div ref={ref} className={`text-center ${isArabic ? 'text-right' : ''}`}>
      <div className={`text-5xl md:text-6xl font-display font-light mb-2 ${isDark ? 'text-white/90' : 'text-black/90'}`}>
        {count}+
      </div>
      <div className={`text-[11px] font-medium tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>
        {label}
      </div>
    </div>
  )
})

function Projects({ themeMode }: ProjectsProps) {
  const { copy, language } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const isArabic = useMemo(() => language === 'ar', [language])
  const isDark = themeMode === 'dark'

  const projects = copy.projects.items || []
  const featuredProject = projects[0]
  const remainingProjects = projects.slice(1)

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo('.header-line',
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: EASE.luxury,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            once: true
          }
        }
      )

      // Stats animation
      gsap.fromTo('.stat-item',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: EASE.luxury,
          scrollTrigger: {
            trigger: '.stats-container',
            start: 'top 85%',
            once: true
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className={`relative min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}
    >
      {/* Navigation spacer */}
      <div className="h-24" />

      {/* Hero Header */}
      <header ref={headerRef} className="px-6 md:px-12 lg:px-20 pt-20 pb-16">
        <div className="max-w-[1800px] mx-auto">
          {/* Breadcrumb */}
          <div className={`overflow-hidden mb-12 ${isArabic ? 'text-right' : ''}`}>
            <div className="header-line inline-flex items-center gap-4">
              <span className={`text-[11px] font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                {copy.nav.projects}
              </span>
              <span className={`w-12 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <span className={`text-[11px] font-medium tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${isDark ? 'border-white/10 text-white/50' : 'border-black/10 text-black/50'}`}>
                2026
              </span>
            </div>
          </div>

          {/* Main title */}
          <div className={`mb-16 ${isArabic ? 'text-right' : ''}`}>
            <div className="overflow-hidden">
              <h1 className={`header-line font-display text-6xl md:text-8xl lg:text-[10rem] font-light leading-[0.85] tracking-tight ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                {isArabic ? copy.projects.title : (
                  <>
                    <span className="block">Selected</span>
                    <span className={`block italic ${isDark ? 'text-white/40' : 'text-black/30'}`}>Works</span>
                  </>
                )}
              </h1>
            </div>
          </div>

          {/* Subtitle & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div className={`overflow-hidden ${isArabic ? 'text-right' : ''}`}>
              <p className={`header-line text-lg md:text-xl max-w-xl leading-relaxed font-light ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {copy.projects.subtitle}
              </p>
            </div>

            <div className={`stats-container grid grid-cols-3 gap-8 ${isArabic ? 'text-right' : ''}`}>
              <div className="stat-item">
                <StatCounter value="48" label="Projects" isDark={isDark} isArabic={isArabic} />
              </div>
              <div className="stat-item">
                <StatCounter value="12" label="Awards" isDark={isDark} isArabic={isArabic} />
              </div>
              <div className="stat-item">
                <StatCounter value="8" label="Years" isDark={isDark} isArabic={isArabic} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Project - Full Bleed */}
      {featuredProject && (
        <div className="px-6 md:px-12 lg:px-20 mb-4">
          <div className="max-w-[1800px] mx-auto">
            <ProjectCard 
              project={featuredProject}
              index={0}
              layout="featured"
              isArabic={isArabic}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Project Grid - Masonry Style */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1800px] mx-auto grid grid-cols-12 gap-4">
          {remainingProjects.map((project, idx) => (
            <ProjectCard 
              key={project.title}
              project={project}
              index={idx + 1}
              layout={idx === 0 ? 'wide' : 'standard'}
              isArabic={isArabic}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      <AnimatedDivider isDark={isDark} isArabic={isArabic} />

      {/* Focus Areas & CTA */}
      <div className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Focus Areas */}
          <div className={`
            relative p-12 md:p-16 rounded-sm overflow-hidden
            ${isDark ? 'bg-white/[0.02] border border-white/[0.08]' : 'bg-black/[0.02] border border-black/[0.08]'}
          `}>
            {/* Background number */}
            <div className={`absolute -bottom-8 ${isArabic ? '-left-8' : '-right-8'} text-[200px] font-display font-bold ${isDark ? 'text-white/[0.02]' : 'text-black/[0.02]'} select-none pointer-events-none`}>
              01
            </div>

            <div className={`relative z-10 ${isArabic ? 'text-right' : ''}`}>
              <p className={`text-[11px] font-medium tracking-[0.3em] uppercase mb-10 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                {copy.ui.focusAreas}
              </p>
              
              <h2 className={`text-3xl md:text-4xl font-display font-light mb-12 leading-tight ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                {copy.projects.focusTitle}
              </h2>

              <ul className="space-y-6">
                {copy.projects.focusItems?.map((item: string, idx: number) => (
                  <li 
                    key={item} 
                    className={`group flex items-center gap-4 cursor-default ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    <span className={`
                      text-lg font-display font-light transition-all duration-300
                      ${isDark ? 'text-white/20 group-hover:text-white/60' : 'text-black/20 group-hover:text-black/60'}
                    `}>
                      0{idx + 1}
                    </span>
                    <span className={`
                      text-base font-light transition-colors duration-300
                      ${isDark ? 'text-white/60 group-hover:text-white' : 'text-black/60 group-hover:text-black'}
                    `}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Card */}
          <div className={`
            relative p-12 md:p-16 rounded-sm overflow-hidden flex flex-col justify-between min-h-[400px]
            ${isDark ? 'bg-white/[0.02] border border-white/[0.08]' : 'bg-black/[0.02] border border-black/[0.08]'}
          `}>
            {/* Animated gradient background */}
            <div className={`
              absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700
              ${isDark ? 'bg-gradient-to-br from-white/[0.03] to-transparent' : 'bg-gradient-to-br from-black/[0.02] to-transparent'}
            `} />

            <div className={`relative z-10 ${isArabic ? 'text-right' : ''}`}>
              <p className={`text-[11px] font-medium tracking-[0.3em] uppercase mb-8 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                {copy.ui.nextBuild}
              </p>
              <p className={`text-3xl md:text-4xl font-display font-light leading-tight ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                {copy.projects.ctaTitle}
              </p>
            </div>

            <MagneticLink 
              href="/contact"
              className={`
                relative z-10 mt-12 inline-flex items-center justify-center gap-4 
                px-12 py-6 rounded-full overflow-hidden group
                text-xs font-bold tracking-[0.2em] uppercase
                transition-all duration-500
                ${isDark 
                  ? 'bg-white text-black hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]' 
                  : 'bg-black text-white hover:shadow-[0_0_60px_rgba(0,0,0,0.3)]'
                }
              `}
            >
              <span className="relative z-10">{copy.projects.ctaButton}</span>
              <svg 
                className={`relative z-10 w-4 h-4 transition-transform duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              {/* Hover fill */}
              <div className={`
                absolute inset-0 transform scale-x-0 group-hover:scale-x-100 
                transition-transform duration-500 origin-left
                ${isDark ? 'bg-black' : 'bg-white'}
              `} />
              <span className={`
                absolute inset-0 flex items-center justify-center gap-4
                text-xs font-bold tracking-[0.2em] uppercase
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                {copy.projects.ctaButton}
                <svg className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </MagneticLink>
          </div>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="relative h-40 overflow-hidden">
        <div className={`absolute bottom-0 left-0 right-0 text-[15vw] font-display font-bold text-center whitespace-nowrap leading-none transform translate-y-1/3 ${isDark ? 'text-white/[0.015]' : 'text-black/[0.015]'}`}>
          PROJECTS
        </div>
      </div>

    </section>
  )
}

export default Projects