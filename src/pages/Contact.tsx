import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../i18n'

function Contact() {
  const { copy } = useLanguage()

  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 pt-48 pb-24">
      <section className="grid grid-cols-12 gap-12 lg:gap-24">
        <div className="col-span-12 lg:col-span-7">
          <header className="mb-20">
            <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block opacity-60 font-bold">
              {copy.contact.heroEyebrow}
            </span>
            <h1 className="font-display text-[8vw] lg:text-[6vw] leading-[0.95] kerning-tight font-black uppercase">
              {copy.contact.heroTitleLine1}
              <br />
              <span className="italic font-normal">{copy.contact.heroTitleLine2}</span>
            </h1>
          </header>

          <form className="space-y-16">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-6 opacity-40 font-bold">
                {copy.contact.serviceQuestion}
              </p>
              <div className="flex flex-wrap gap-4">
                {copy.contact.projectTypes.map((type) => {
                  const id = `service-${type.replace(/\s+/g, '-').toLowerCase()}`
                  return (
                    <div className="relative" key={type}>
                      <input className="hidden service-toggle" id={id} name="service" type="checkbox" value={type} />
                      <label className="px-8 py-3 rounded-full border border-primary/10 text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all hover:border-primary inline-block" htmlFor={id}>
                        {type}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-40 font-bold">
                  {copy.contact.nameLabel}
                </label>
                <input className="w-full custom-underline-input text-xl font-display italic" placeholder={copy.contact.namePlaceholder} type="text" />
              </div>
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-40 font-bold">
                  {copy.contact.emailLabel}
                </label>
                <input className="w-full custom-underline-input text-xl font-display italic" placeholder={copy.contact.emailPlaceholder} type="email" />
              </div>
              <div className="col-span-full relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-40 font-bold">
                  {copy.contact.detailsLabel}
                </label>
                <textarea className="w-full custom-underline-input text-xl font-display italic resize-none" placeholder={copy.contact.detailsPlaceholder} rows={3} />
              </div>
            </div>

            <div className="pt-8">
              <button className="group flex items-center gap-6 bg-primary text-white px-10 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all" type="submit">
                {copy.contact.sendLabel}
                <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        <aside className="col-span-12 lg:col-span-5 pt-12 lg:pt-48">
          <div className="glass-card p-12 lg:p-16 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
                  {copy.contact.statusLabel}
                </span>
              </div>

              <div className="space-y-16">
                <section>
                  <span className="text-[10px] uppercase tracking-widest block mb-4 opacity-40 font-bold">{copy.contact.studioLabel}</span>
                  <a className="text-3xl font-display italic hover:opacity-50 transition-opacity block mb-2" href={`mailto:${copy.footer.email}`}>
                    {copy.footer.email}
                  </a>
                  <p className="text-sm opacity-40 leading-relaxed max-w-[200px] font-medium">{copy.footer.location}</p>
                </section>

                <section>
                  <span className="text-[10px] uppercase tracking-widest block mb-6 opacity-40 font-bold">{copy.contact.followLabel}</span>
                  <div className="flex flex-col gap-4">
                    {copy.contact.socials.map((label) => (
                      <a key={label} className="flex items-center justify-between group py-2 border-b border-primary/5" href="#">
                        <span className="text-sm font-semibold uppercase tracking-widest">{label}</span>
                        <FiArrowUpRight className="text-sm opacity-40 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ))}
                  </div>
                </section>

                <div className="pt-8">
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/5">
                    <span className="text-[10px] uppercase tracking-widest block mb-2 opacity-40 italic font-bold">{copy.contact.processLabel}</span>
                    <p className="text-xs opacity-60 font-medium">{copy.contact.processCopy}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none select-none">
              <span className="font-display text-[20vw] leading-none">LL</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Contact
