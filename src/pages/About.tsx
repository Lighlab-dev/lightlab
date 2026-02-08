import { useLanguage } from '../i18n'

function About() {
  const { copy } = useLanguage()
  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
      <section className="min-h-screen flex flex-col justify-center pt-32 pb-20">
        <div className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-60">
          {copy.about.overview.heroEyebrow}
        </div>
        <h1 className="font-display text-[9vw] leading-[0.85] kerning-tight font-black uppercase mb-24">
          {copy.about.overview.heroTitleLine1}
          <br />
          <span className="italic font-normal">{copy.about.overview.heroTitleLine2}</span>
        </h1>
        <div className="grid grid-cols-12 gap-12 lg:gap-24">
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-32">
              <div className="glass-card p-10 rounded-2xl">
                <span className="text-[10px] uppercase tracking-widest block mb-8 opacity-40">
                  {copy.about.overview.manifestoLabel}
                </span>
                <div className="space-y-8">
                  <p className="text-3xl font-display leading-relaxed">
                    {copy.about.overview.manifestoLead}
                  </p>
                  <p className="text-sm opacity-60 leading-relaxed max-w-md">
                    {copy.about.overview.manifestoCopy}
                  </p>
                  <div className="pt-8 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-primary/20" />
                    <span className="text-[10px] uppercase tracking-widest opacity-40 italic">
                      {copy.about.overview.sinceLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 hidden" />
        </div>
      </section>

      <section className="py-40 border-t border-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {copy.about.overview.pillars.map((pillar) => (
            <div key={pillar.label} className="glass-card p-8 rounded-2xl">
              <span className="text-[10px] uppercase tracking-widest block mb-8 opacity-40">{pillar.label}</span>
              <h3 className="text-2xl font-display italic mb-6">{pillar.title}</h3>
              <p className="text-sm opacity-50 leading-relaxed">{pillar.copy}</p>
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

      <section className="py-40 border-t border-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60">{copy.about.overview.ctaEyebrow}</span>
            <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight mb-8">{copy.about.overview.ctaTitle}</h2>
            <p className="text-lg opacity-50 max-w-md">{copy.about.overview.ctaCopy}</p>
          </div>
          <div className="glass-card p-12 rounded-2xl text-center">
            <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{copy.about.overview.ctaMetaLabel}</span>
            <div className="text-3xl font-display italic mb-8">{copy.about.overview.ctaMetaValue}</div>
            <a className="inline-block bg-primary text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform" href="mailto:hello@lightlab.dev">
              {copy.about.overview.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
