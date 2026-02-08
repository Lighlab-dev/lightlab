import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

const serviceDetails: Record<string, { title: string; summary: string; deliverables: string[]; outcomes: string[] }> = {
  ai: {
    title: 'AI Solutions',
    summary: 'Agent orchestration, copilots, and automation frameworks tuned for operational velocity.',
    deliverables: ['Workflow mapping', 'Automation build', 'Monitoring + optimization'],
    outcomes: ['Reduced manual load', 'Faster execution cycles', 'Visibility across workflows'],
  },
  development: {
    title: 'Development Solutions',
    summary: 'Product engineering that unifies design, performance, and scalable infrastructure.',
    deliverables: ['Product strategy', 'Full-stack build', 'Launch systems'],
    outcomes: ['Stable releases', 'High-performance UX', 'Scalable infrastructure'],
  },
  'media-buying': {
    title: 'Media Buying',
    summary: 'Performance media stacks engineered for efficiency and predictable growth.',
    deliverables: ['Channel strategy', 'Creative testing', 'Conversion optimization'],
    outcomes: ['Improved ROAS', 'Lower CAC', 'Data-driven scaling'],
  },
}

function ServiceDetail() {
  const { slug } = useParams()
  const { copy, language } = useLanguage()
  const data = useMemo(() => serviceDetails[slug ?? ''] ?? serviceDetails.ai, [slug])

  const translatedTitle = language === 'fr'
    ? (slug === 'media-buying' ? 'Media Buying' : slug === 'development' ? 'Developpement' : 'Solutions IA')
    : data.title

  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Service Detail</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{translatedTitle}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {data.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Deliverables</p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              {data.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Next step</p>
              <p className="mt-4 text-lg text-[var(--fg)]">
                Share your objectives and we will map a tailored execution plan.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 px-10 py-4 bg-[var(--fg)] text-[var(--bg)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {copy.footer.cta}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {data.outcomes.map((item) => (
            <div key={item} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Outcome</p>
              <p className="text-lg font-serif mt-3">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceDetail
