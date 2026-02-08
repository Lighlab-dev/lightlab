import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

function Home() {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const { copy } = useLanguage()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-word', {
                yPercent: 120,
                opacity: 0,
                duration: 1.6,
                stagger: 0.12,
                ease: 'power4.out',
            })

            ScrollTrigger.batch('.glass-card', {
                start: 'top 85%',
                onEnter: (batch) => {
                    gsap.fromTo(
                        batch,
                        { y: 40, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }
                    )
                },
                once: true,
            })
        }, wrapperRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={wrapperRef} className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
            <section className="min-h-screen flex flex-col justify-center pt-32 pb-20">
                <div className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-60">{copy.home.heroTag}</div>
                <h1 className="font-display text-[12vw] leading-[0.85] kerning-tight font-black uppercase mb-12">
                    {copy.home.heroTitle1}<br />
                    <span className="hero-word italic font-normal">{copy.home.heroTitle2}</span>
                </h1>
                <div className="grid grid-cols-12 gap-8 items-end">
                    <div className="col-span-12 lg:col-span-4 text-xs uppercase tracking-widest opacity-40">
                        {copy.home.heroMeta}
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        <p className="text-2xl md:text-3xl font-display max-w-2xl leading-relaxed">
                            {copy.home.heroCopy}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {copy.home.bentoCards.map((item, index) => (
                    <div key={item.title} className="glass-card rounded-xl p-6 md:p-8 lg:p-10 flex flex-col justify-between aspect-auto md:aspect-square group">
                        <div className="flex justify-between items-start">
                            <span className="text-[9px] md:text-[10px] font-bold tracking-widest opacity-40 uppercase">Cap. 0{index + 1}</span>
                            <div className="w-2 h-2 rounded-full bg-primary/20 dark:bg-white/20 group-hover:bg-primary dark:group-hover:bg-white transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-[clamp(1.1rem,2.6vw,2.25rem)] font-display italic mb-3 md:mb-4 leading-[1.15]">{item.title}</h3>
                            <p className="text-[clamp(0.7rem,1.2vw,0.95rem)] opacity-60 leading-relaxed">{item.copy}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="-mx-8 md:-mx-16 lg:-mx-24 bg-[#f6f3ee] py-20 md:py-24">
                <div className="px-8 md:px-16 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                        {copy.home.clarity.map((item) => (
                            <div key={item.title}>
                                <span className="text-[9px] uppercase tracking-[0.34em] block mb-5 text-[#8c857c]">{item.title}</span>
                                <h4 className="text-[18px] md:text-[19px] font-normal mb-3 text-[#2f2b27]">{item.lead}</h4>
                                <p className="text-[12px] md:text-[13px] text-[#8c857c] leading-relaxed">{item.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-40">
                <div className="flex flex-col lg:flex-row justify-between items-baseline mb-24 gap-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60">{copy.home.coreLabel}</span>
                        <h2 className="text-7xl font-display uppercase kerning-tight">{copy.home.servicesTitleLine1}<br />{copy.home.servicesTitleLine2}</h2>
                    </div>
                    <p className="max-w-sm text-sm opacity-50 leading-relaxed uppercase tracking-wider">
                        {copy.home.servicesSubtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
                    {copy.home.serviceTracks.map((item) => (
                        <div
                            key={item.title}
                            className="group relative flex flex-col justify-between p-8 lg:p-10 bg-white border border-black/[0.04] rounded-[2.5rem] aspect-[4/5] overflow-hidden hover:shadow-xl transition-all duration-700"
                        >
                            {/* Top Section */}
                            <div className="relative z-10">
                                <h4 className="text-[28px] font-display italic mb-5 leading-[1.2] tracking-tight">
                                    {item.title}
                                </h4>

                                {/* We use a max-width and smaller text to prevent "reaching" the edges */}
                                <p className="text-[12px] md:text-[13px] opacity-40 leading-relaxed max-w-[85%] font-medium">
                                    {item.copy}
                                </p>
                            </div>

                            {/* Bottom Section */}
                            <div className="relative z-10 flex items-center gap-2 text-[8px] uppercase tracking-[0.32em] font-black group-hover:gap-4 transition-all duration-500">
                                {copy.home.servicesCta} <span className="text-base">→</span>
                            </div>

                            {/* Subtle Background Accent on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-40">
                <h2 className="text-center font-display italic text-8xl md:text-[12vw] opacity-10 uppercase mb-20 select-none">{copy.home.methodTitle}</h2>
                <div className="space-y-32">
                    {copy.home.methodCards.map((item, index) => (
                        <div key={item.title} className="relative">
                            <div className={`flex flex-col md:flex-row ${item.align === 'right' ? 'md:flex-row-reverse' : ''} items-center gap-12 glass-card p-12 md:p-24 rounded-2xl`}>
                                <span className={`text-8xl md:text-[15vw] font-display font-black opacity-5 absolute -top-12 ${item.align === 'right' ? '-right-4' : '-left-4'} pointer-events-none`}>{`0${index + 1}`}</span>
                                <div className={`flex-1 ${item.align === 'right' ? 'text-right' : ''}`}>
                                    <h3 className="text-5xl md:text-7xl font-display mb-8">{item.title}</h3>
                                </div>
                                <div className="max-w-xs text-sm opacity-50 leading-relaxed">
                                    {item.copy}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-40 border-t border-primary/5 dark:border-white/5" id="contact">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60">{copy.home.ctaLabel}</span>
                        <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight mb-8">{copy.home.ctaTitle}</h2>
                        <p className="text-lg opacity-50 max-w-md">{copy.home.ctaCopy}</p>
                    </div>
                    <div className="glass-card p-12 rounded-2xl text-center">
                        <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{copy.home.ctaMeta}</span>
                        <div className="text-3xl font-display italic mb-8">{copy.home.ctaMetaValue}</div>
                        <a className="inline-block bg-primary dark:bg-white text-white dark:text-primary px-12 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform" href="mailto:hello@lightlab.dev">
                            {copy.home.ctaButton}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
