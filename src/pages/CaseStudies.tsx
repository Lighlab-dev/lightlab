import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

function CaseStudies() {
  const { copy } = useLanguage()
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.nav.caseStudies}</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{copy.caseStudies.title}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {copy.caseStudies.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {copy.caseStudies.outcomes.map((item) => (
            <div key={item.label} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{item.label}</p>
              <p className="text-3xl md:text-4xl font-serif mt-4">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {copy.caseStudies.studies.map((study) => (
            <div key={study.title} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl min-h-[220px] flex flex-col justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{study.sector}</p>
                <h3 className="text-2xl font-serif italic mt-4">{study.title}</h3>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">{study.result}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Delivery Flow</p>
            <h2 className="text-2xl font-serif mt-4">{copy.caseStudies.flowTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              {copy.caseStudies.flowSteps.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ul>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Next Case</p>
              <p className="text-lg text-[var(--fg)] mt-4">{copy.caseStudies.ctaTitle}</p>
              <p className="text-sm text-[var(--muted)] mt-2">{copy.caseStudies.ctaCopy}</p>
            </div>
            <Link to="/contact" className="primary-button text-center">{copy.caseStudies.ctaButton}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
