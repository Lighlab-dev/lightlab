import { FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../i18n'

function Services() {
  const { copy, language } = useLanguage()

  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
      <section className="pt-48 pb-32">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-8 block opacity-50 font-bold">
              {copy.services.overview.heroEyebrow}
            </span>
            <h1 className="font-display text-[8vw] leading-[0.9] kerning-tight font-black uppercase">
              {copy.services.overview.heroTitleLine1}
              <br />
              <span className="font-normal">{copy.services.overview.heroTitleLine2}</span>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-lg opacity-45 leading-relaxed font-medium">
              {copy.services.overview.heroSubtitle}
            </p>
          </div>
        </div>
        
        {/* Services Hero Image */}
        <div className="rounded-lg overflow-hidden h-[380px] md:h-[480px] group shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop" 
            alt="Services overview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12 mb-40">
        {copy.services.overview.tracks.map((track, index) => (
          <div key={track.title} className="group rounded-2xl overflow-hidden relative h-96 md:h-[420px] flex items-end">
            {/* Background Image */}
            <img 
              src={[
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&h=700&fit=crop',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&h=700&fit=crop',
                'https://images.unsplash.com/photo-1611632622046-7e7b7e675a0a?w=1000&h=700&fit=crop'
              ][index % 3]}
              alt={track.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80 group-hover:from-black/10 group-hover:via-black/50 group-hover:to-black/90 transition-all duration-700" />
            
            {/* Integrated Content */}
            <div className="relative z-10 w-full p-8 md:p-12 text-white">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold tracking-widest opacity-60 uppercase block mb-4">{`${copy.ui.track} 0${index + 1}`}</span>
                <h2 className="text-4xl md:text-5xl font-display font-normal mb-6 leading-tight">{track.title}</h2>
                <p className="text-base opacity-90 mb-8 leading-relaxed font-medium max-w-xl">{track.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-4 font-bold">{copy.ui.deliverables}</span>
                    <ul className="space-y-2 text-sm font-medium">
                      {track.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-4 font-bold">{copy.ui.techStack}</span>
                    <div className="flex flex-wrap gap-2">
                      {track.tech.map((item) => (
                        <span key={item} className="px-2.5 py-1 bg-white/15 rounded-full text-[10px] font-semibold border border-white/25 backdrop-blur-sm">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                <div className={`pt-12 text-center ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
                  <span className="text-xs font-bold opacity-40 block mb-4">{step.label}</span>
                  <h4 className="text-2xl font-display mb-4 italic">{step.title}</h4>
                  <p className="text-sm opacity-50 leading-relaxed">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 border-t border-black/8 dark:border-white/8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block opacity-50 font-bold">
              {copy.services.overview.ctaEyebrow}
            </span>
            <h2 className="text-6xl md:text-8xl font-display uppercase kerning-tight font-black mb-8">
              {copy.services.overview.ctaTitle}{' '}
              <span className="font-normal">{copy.services.overview.ctaTitleEmphasis}</span>
            </h2>
            <p className="text-lg opacity-45 max-w-md font-medium">{copy.services.overview.ctaCopy}</p>
          </div>
          <div className="rounded-lg border border-black/8 dark:border-white/8 p-12 text-center bg-white/[0.2] dark:bg-white/[0.02]">
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-widest opacity-45 block mb-3 font-bold">{copy.services.overview.ctaMetaLabel}</span>
              <div className="text-3xl font-display font-normal">{copy.services.overview.ctaMetaValue}</div>
            </div>
            <a className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg" href="mailto:hello@lightlab.dev">
              {copy.services.overview.ctaButton} <FiArrowRight className="text-sm" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services
