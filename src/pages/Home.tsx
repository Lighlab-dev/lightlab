import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const funnelRef = useRef<HTMLElement>(null)
  const { copy } = useLanguage()

  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        yPercent: 110,
        rotateZ: 2,
        duration: 1.8,
        stagger: 0.15,
        ease: 'power4.out',
      })

      const cards = gsap.utils.toArray('.funnel-card') as HTMLElement[]
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 8%',
          pin: true,
          pinSpacing: false,
          endTrigger: funnelRef.current,
          end: 'bottom bottom',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: true,
          onUpdate: (self) => {
            const scale = 1 - (self.progress * 0.05)
            gsap.set(card, { scale: scale })
          }
        })
      })

      ScrollTrigger.batch('.bento-item', {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out' }
          )
        },
        once: true,
      })

      ScrollTrigger.refresh()
    }, wrapperRef)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="transition-colors duration-700">
      <section className="min-h-[70vh] flex flex-col justify-end pb-16 px-6 md:px-10">
        <div className="w-full">
          <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.home.heroTag}</p>
          <h1 className="reveal text-[12vw] md:text-[9vw] font-serif leading-[0.8] tracking-tight uppercase">
            <div className="overflow-hidden"><span className="block hero-word">{copy.home.heroTitle1}</span></div>
            <div className="overflow-hidden"><span className="block hero-word italic">{copy.home.heroTitle2}</span></div>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start mt-10 pt-8 border-t border-[var(--accent-line)]">
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)] mb-4 md:mb-0">{copy.home.heroMeta}</p>
            <p className="reveal max-w-2xl text-xl md:text-2xl font-light leading-relaxed text-[var(--fg)]">
              {copy.home.heroCopy}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bento-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
          {copy.home.bentoCards.map((card, i) => (
            <div key={i} className={`bento-item bg-[var(--card-bg)] p-8 md:p-10 min-h-[360px] flex flex-col justify-between group rounded-2xl ${card.span}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">Cap. 0{i+1}</span>
                <div className="w-9 h-9 border border-[var(--accent-line)] rounded-full flex items-center justify-center group-hover:border-[var(--fg)]">
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-serif mb-4 leading-none tracking-tight italic">{card.title}</h3>
                <p className="text-sm text-[var(--muted)] max-w-xs group-hover:text-[var(--fg)] transition-colors leading-loose">{card.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.home.clarity.map((item) => (
            <div key={item.title} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{item.title}</p>
              <p className="text-lg font-serif mt-4">{item.lead}</p>
              <p className="text-sm text-[var(--muted)] mt-4">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
            <div>
              <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Core Services</p>
              <h2 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{copy.home.servicesTitle}</h2>
            </div>
            <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
              {copy.home.servicesSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {copy.home.serviceTracks.map((service) => (
              <Link key={service.title} to={service.href} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl min-h-[240px] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif italic">{service.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">{service.copy}</p>
                </div>
                <div className="mt-6 text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">Explore</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.home.impactStats.map((stat) => (
            <div key={stat.label} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-serif mt-4">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={funnelRef} className="px-6 pb-[12vh]">
        <div className="mb-20">
           <h2 className="text-[7vw] md:text-[5vw] font-serif uppercase tracking-tight opacity-20 text-center italic">{copy.home.methodTitle}</h2>
        </div>
        <div className="flex flex-col gap-[8vh]">
          {copy.home.methodSteps.map((step, i) => (
            <div
              key={i}
              className="funnel-card min-h-[60vh] bg-[var(--card-bg)] border border-[var(--accent-line)] rounded-[36px] p-10 md:p-16 flex flex-col justify-between"
            >
              <span className="text-7xl md:text-8xl font-serif opacity-5">0{i+1}</span>
              <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <h4 className="text-[10vw] md:text-[7vw] font-serif leading-none tracking-tight">{step}</h4>
                <p className="max-w-xs text-sm text-[var(--muted)] pb-4 leading-relaxed">
                  {copy.home.methodCopy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between gap-8 pb-10 border-b border-[var(--accent-line)]">
            <div>
              <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Client Signal</p>
              <h2 className="reveal text-[6vw] md:text-[3.5vw] font-serif uppercase tracking-tight">{copy.home.testimonialsTitle}</h2>
            </div>
            <p className="reveal max-w-md text-sm text-[var(--muted)] leading-relaxed">
              {copy.home.testimonialsSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {copy.home.testimonials.map((item) => (
              <div key={item.name} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
                <p className="text-lg font-light leading-relaxed">“{item.quote}”</p>
                <div className="mt-6 text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">
                  {item.name} · {item.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Next Move</p>
            <h2 className="reveal text-[7vw] md:text-[3.6vw] font-serif uppercase tracking-tight">{copy.home.ctaTitle}</h2>
            <p className="reveal text-sm md:text-base text-[var(--muted)] leading-relaxed mt-4">
              {copy.home.ctaCopy}
            </p>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl flex flex-col gap-4">
            <div className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.home.ctaMeta}</div>
            <div className="text-2xl font-serif">{copy.home.ctaMetaValue}</div>
            <Link to="/contact" className="primary-button text-center">{copy.home.ctaButton}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
