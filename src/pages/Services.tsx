import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

function Services() {
  const { copy } = useLanguage()
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Services</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{copy.services.title}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {copy.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {copy.services.items.map((service) => (
            <div key={service.title} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl min-h-[280px] flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif italic">{service.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">{service.summary}</p>
              </div>
              <ul className="mt-6 space-y-2 text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.services.stackIntro}</p>
            <h2 className="text-3xl font-serif mt-4">{copy.services.stackTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              {copy.services.stackItems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.services.engagementTitle}</p>
            <div className="mt-6 space-y-6">
              {copy.services.engagements.map((engagement) => (
                <div key={engagement.title}>
                  <h3 className="text-xl font-serif italic">{engagement.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-2">{engagement.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bento-item bg-[var(--card-bg)] p-10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Ready to scope?</p>
            <h3 className="text-2xl font-serif mt-3">{copy.services.ctaTitle}</h3>
          </div>
          <Link to="/contact" className="primary-button text-center">{copy.services.ctaButton}</Link>
        </div>
      </div>
    </section>
  )
}

export default Services
