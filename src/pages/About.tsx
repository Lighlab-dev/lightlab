import { useLanguage } from '../i18n'

function About() {
  const { copy } = useLanguage()
  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
      <section className="min-h-screen flex flex-col justify-center pt-32 pb-20">
        <div className="text-[10px] uppercase tracking-[0.3em] mb-8 opacity-50 font-bold">
          {copy.about.overview.heroEyebrow}
        </div>
        <h1 className="font-display text-[9vw] leading-[0.85] kerning-tight font-black uppercase mb-24">
          {copy.about.overview.heroTitleLine1}
          <br />
          <span className="font-normal">{copy.about.overview.heroTitleLine2}</span>
        </h1>
        <div className="grid grid-cols-12 gap-12 lg:gap-24">
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-32">
              <div className="rounded-lg border border-black/8 dark:border-white/8 p-10 bg-white/[0.3] dark:bg-white/[0.03] backdrop-blur-[2px]">
                <span className="text-[10px] uppercase tracking-widest block mb-8 opacity-50 font-bold">
                  {copy.about.overview.manifestoLabel}
                </span>
                <div className="space-y-8">
                  <p className="text-3xl font-display font-normal leading-relaxed">
                    {copy.about.overview.manifestoLead}
                  </p>
                  <p className="text-sm opacity-55 leading-relaxed max-w-md font-medium">
                    {copy.about.overview.manifestoCopy}
                  </p>
                  <div className="pt-8 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-black/15 dark:bg-white/15" />
                    <span className="text-[10px] uppercase tracking-widest opacity-45 font-semibold">
                      {copy.about.overview.sinceLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* About Page Image */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-lg overflow-hidden h-[480px] md:h-[620px] group sticky top-32 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=900&fit=crop" 
                alt="About lightlab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 border-t border-black/8 dark:border-white/8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {copy.about.overview.pillars.map((pillar, idx) => (
            <div key={pillar.label} className="group rounded-2xl overflow-hidden relative h-80 flex items-end">
              {/* Background Image */}
              <img 
                src={[
                  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1611632622046-7e7b7e675a0a?w=600&h=500&fit=crop'
                ][idx]}
                alt={pillar.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/70 group-hover:from-black/10 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-700" />
              
              {/* Integrated Content */}
              <div className="relative z-10 w-full p-8 text-white">
                <span className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-bold">{pillar.label}</span>
                <h3 className="text-2xl font-display font-normal mb-3 leading-tight">{pillar.title}</h3>
                <p className="text-sm opacity-85 leading-relaxed font-medium">{pillar.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-40">
        <div className="text-center mb-32">
          <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60">{copy.about.overview.journeyEyebrow}</span>
          <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight">{copy.about.overview.journeyTitle}</h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full timeline-line-vertical hidden md:block" />
          <div className="space-y-32">
            {copy.about.overview.milestones.map((milestone) => (
              <div key={milestone.title} className="relative flex flex-col md:flex-row items-center gap-8 md:gap-0">
                <div className={`md:w-1/2 ${milestone.align === 'left' ? 'md:pr-16 md:text-right' : 'md:pr-16'} ${milestone.align === 'right' ? 'md:pr-16' : ''}`.trim()}>
                  {milestone.align === 'left' ? (
                    <div className="glass-card p-8 rounded-2xl">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{milestone.date}</span>
                      <h4 className="text-3xl font-display mb-4">{milestone.title}</h4>
                      <p className="text-sm opacity-50 leading-relaxed">{milestone.copy}</p>
                    </div>
                  ) : (
                    <div className="md:hidden">
                      <div className="glass-card p-8 rounded-2xl">
                        <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{milestone.date}</span>
                        <h4 className="text-3xl font-display mb-4">{milestone.title}</h4>
                        <p className="text-sm opacity-50 leading-relaxed">{milestone.copy}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="z-10 w-3 h-3 rounded-full bg-primary outline outline-8 outline-[var(--bg)]" />
                <div className={`md:w-1/2 ${milestone.align === 'right' ? 'md:pl-16 text-left' : 'md:pl-16'}`}>
                  {milestone.align === 'right' ? (
                    <div className="glass-card p-8 rounded-2xl">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{milestone.date}</span>
                      <h4 className="text-3xl font-display mb-4 italic">{milestone.title}</h4>
                      <p className="text-sm opacity-50 leading-relaxed">{milestone.copy}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 border-t border-black/8 dark:border-white/8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block opacity-50 font-bold">{copy.about.overview.ctaEyebrow}</span>
            <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight font-black mb-8">{copy.about.overview.ctaTitle}</h2>
            <p className="text-lg opacity-45 max-w-md font-medium">{copy.about.overview.ctaCopy}</p>
          </div>
          <div className="rounded-lg border border-black/8 dark:border-white/8 p-12 text-center bg-white/[0.2] dark:bg-white/[0.02]">
            <span className="text-[10px] uppercase tracking-widest opacity-45 block mb-3 font-bold">{copy.about.overview.ctaMetaLabel}</span>
            <div className="text-3xl font-display font-normal mb-8">{copy.about.overview.ctaMetaValue}</div>
            <a className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg" href="mailto:hello@lightlab.dev">
              {copy.about.overview.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
