import { useLanguage } from '../i18n'

function Contact() {
  const { copy } = useLanguage()
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <div className="bento-item bg-[var(--card-bg)] p-10 rounded-2xl">
          <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">Contact</p>
          <h1 className="reveal text-[7vw] md:text-[3.6vw] font-serif uppercase tracking-tight mt-4">{copy.contact.title}</h1>
          <p className="reveal text-sm md:text-base text-[var(--muted)] leading-relaxed mt-4">
            {copy.contact.subtitle}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 text-sm text-[var(--muted)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em]">{copy.contact.meta.response}</p>
              <p className="mt-2 text-lg text-[var(--fg)]">{copy.contact.meta.responseValue}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em]">{copy.contact.meta.emailLabel}</p>
              <p className="mt-2">hello@lightlab.dev</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em]">{copy.contact.meta.locationLabel}</p>
              <p className="mt-2">{copy.contact.meta.locationValue}</p>
            </div>
          </div>
        </div>
        <form className="bento-item bg-[var(--card-bg)] p-10 rounded-2xl">
          <div className="grid gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.contact.form.name}</label>
              <input className="form-input" placeholder="Your full name" required />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.contact.form.email}</label>
              <input type="email" className="form-input" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.contact.form.company}</label>
              <input className="form-input" placeholder="Company name" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.contact.form.projectType}</label>
              <select className="form-input" required defaultValue="">
                <option value="" disabled>{copy.contact.form.selectPlaceholder}</option>
                {copy.contact.projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{copy.contact.form.letter}</label>
              <textarea className="form-input min-h-[140px]" placeholder="Tell us about the project." required />
            </div>
            <button type="submit" className="primary-button">
              {copy.contact.form.submit}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-[1200px] mx-auto mt-16">
        <div className="flex items-end justify-between gap-8 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">FAQ</p>
            <h2 className="reveal text-[6vw] md:text-[3.2vw] font-serif uppercase tracking-tight">{copy.contact.faqTitle}</h2>
          </div>
          <p className="reveal max-w-md text-sm text-[var(--muted)] leading-relaxed">
            {copy.contact.faqSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {copy.contact.faqs.map((item) => (
            <div key={item.q} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <h3 className="text-lg font-serif italic">{item.q}</h3>
              <p className="text-sm text-[var(--muted)] mt-3">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact
