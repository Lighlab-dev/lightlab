import { FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../i18n'

function Services() {
  const { copy } = useLanguage()

  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
      <section className="pt-48 pb-32">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.4em] mb-8 block opacity-60">
              {copy.services.overview.heroEyebrow}
            </span>
            <h1 className="font-display text-[8vw] leading-[0.9] kerning-tight font-black uppercase">
              {copy.services.overview.heroTitleLine1}
              <br />
              <span className="italic font-normal">{copy.services.overview.heroTitleLine2}</span>
            </h1>
          </div>
          <div className="max-w-sm mb-4">
            <p className="text-lg opacity-60 leading-relaxed uppercase tracking-tight">
              {copy.services.overview.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-4 min-h-[700px] mb-40">
        {copy.services.overview.tracks.map((track, index) => (
          <div key={track.title} className="service-column glass-card p-12 rounded-3xl flex flex-col justify-between group cursor-default">
            <div>
              <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase block mb-12">{`Track 0${index + 1}`}</span>
              <h2 className="text-6xl md:text-7xl font-display italic mb-8">{track.title}</h2>
              <p className="text-xl opacity-70 max-w-xs leading-relaxed">{track.description}</p>
              <div className="deliverables">
                <div className="pt-8 border-t border-primary/10">
                  <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-6">Livrables</span>
                  <ul className="space-y-4 text-sm font-medium">
                    {track.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-4">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {track.tech.map((item) => (
                        <span key={item} className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-bold">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 flex items-center justify-between">
              <span className="text-4xl opacity-20 group-hover:opacity-100 transition-opacity">{track.icon === 'ai' ? '✦' : track.icon === 'code' ? '⌘' : '↗'}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">{track.hint}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="py-40">
        <div className="text-center mb-32">
          <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60 text-center">
            {copy.services.overview.workflowEyebrow}
          </span>
          <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight">
            {copy.services.overview.workflowTitleLine1}
            <br />
            <span className="italic font-normal">{copy.services.overview.workflowTitleLine2}</span>
          </h2>
        </div>
        <div className="relative px-4">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px timeline-line opacity-20" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {copy.services.overview.workflowSteps.map((step) => (
              <div key={step.title} className="relative group">
                <div className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-primary/20 bg-[var(--bg)] items-center justify-center z-10">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                </div>
                <div className="pt-12 text-center lg:text-left">
                  <span className="text-xs font-bold opacity-40 block mb-4">{step.label}</span>
                  <h4 className="text-2xl font-display mb-4 italic">{step.title}</h4>
                  <p className="text-sm opacity-50 leading-relaxed">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 border-t border-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60">
              {copy.services.overview.ctaEyebrow}
            </span>
            <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight mb-8">
              {copy.services.overview.ctaTitle}{' '}
              <span className="italic font-normal">{copy.services.overview.ctaTitleEmphasis}</span>
            </h2>
            <p className="text-lg opacity-50 max-w-md">{copy.services.overview.ctaCopy}</p>
          </div>
          <div className="glass-card p-16 rounded-3xl text-center">
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{copy.services.overview.ctaMetaLabel}</span>
              <div className="text-3xl font-display italic">{copy.services.overview.ctaMetaValue}</div>
            </div>
            <a className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform" href="mailto:hello@lightlab.dev">
              {copy.services.overview.ctaButton} <FiArrowRight className="text-sm" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services
