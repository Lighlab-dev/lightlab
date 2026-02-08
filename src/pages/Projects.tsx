import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

function Projects() {
  const { copy } = useLanguage()
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.nav.projects}</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{copy.projects.title}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {copy.projects.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {copy.projects.items.map((project) => (
            <div key={project.title} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl min-h-[220px] flex flex-col justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{project.focus}</p>
                <h3 className="text-2xl font-serif italic mt-4">{project.title}</h3>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)] mt-4">{project.result}</p>
                <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--muted)] mt-6">View case</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 mt-16">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Focus areas</p>
            <h2 className="text-2xl font-serif mt-4">{copy.projects.focusTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              {copy.projects.focusItems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Next build</p>
              <p className="text-lg text-[var(--fg)] mt-4">{copy.projects.ctaTitle}</p>
            </div>
            <Link to="/contact" className="primary-button text-center">{copy.projects.ctaButton}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
