import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

function About() {
  const { copy } = useLanguage()
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.nav.about}</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{copy.about.title}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {copy.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {copy.about.values.map((value) => (
            <div key={value} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl min-h-[220px] flex items-end">
              <p className="text-sm text-[var(--muted)] leading-relaxed">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.about.principlesTitle}</p>
            <div className="mt-6 space-y-6">
              {copy.about.principles.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-serif italic">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-2">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.about.teamTitle}</p>
            <h2 className="text-2xl font-serif mt-4">{copy.about.teamSubtitle}</h2>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              {copy.about.teamStack.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 bento-item bg-[var(--card-bg)] p-10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Meet the team</p>
            <h3 className="text-2xl font-serif mt-3">{copy.about.ctaTitle}</h3>
          </div>
          <Link to="/contact" className="primary-button text-center">{copy.about.ctaButton}</Link>
        </div>
      </div>
    </section>
  )
}

export default About
