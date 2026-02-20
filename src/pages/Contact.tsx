import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../i18n'

function Contact() {
  const { copy } = useLanguage()

  return (
    <main className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
      {/* Hero Image Section */}
      <section className="pt-48 pb-20">
        <div className="rounded-lg overflow-hidden h-[400px] md:h-[500px] group mb-16 shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop" 
            alt="Contact us"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </section>

      <section className="grid grid-cols-12 gap-12 lg:gap-24 pb-24">
        <div className="col-span-12 lg:col-span-7">
          <header className="mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block opacity-50 font-bold">
              {copy.contact.heroEyebrow}
            </span>
            <h1 className="font-display text-[8vw] lg:text-[6vw] leading-[0.95] kerning-tight font-black uppercase">
              {copy.contact.heroTitleLine1}
              <br />
              <span className="font-normal">{copy.contact.heroTitleLine2}</span>
            </h1>
          </header>

          <form className="space-y-16">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-6 opacity-50 font-bold">
                {copy.contact.serviceQuestion}
              </p>
              <div className="flex flex-wrap gap-4">
                {copy.contact.projectTypes.map((type) => {
                  const id = `service-${type.replace(/\s+/g, '-').toLowerCase()}`
                  return (
                    <div className="relative" key={type}>
                      <input className="hidden service-toggle" id={id} name="service" type="checkbox" value={type} />
                      <label className="px-8 py-3 rounded-full border border-black/8 dark:border-white/12 text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all hover:border-black/20 dark:hover:border-white/25 inline-block bg-black/3 dark:bg-white/3" htmlFor={id}>
                        {type}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-50 font-bold">
                  {copy.contact.nameLabel}
                </label>
                <input className="w-full custom-underline-input text-xl font-display font-normal" placeholder={copy.contact.namePlaceholder} type="text" />
              </div>
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-50 font-bold">
                  {copy.contact.emailLabel}
                </label>
                <input className="w-full custom-underline-input text-xl font-display font-normal" placeholder={copy.contact.emailPlaceholder} type="email" />
              </div>
              <div className="col-span-full relative">
                <label className="text-[10px] uppercase tracking-widest mb-2 block opacity-50 font-bold">
                  {copy.contact.detailsLabel}
                </label>
                <textarea className="w-full custom-underline-input text-xl font-display font-normal resize-none" placeholder={copy.contact.detailsPlaceholder} rows={3} />
              </div>
            </div>

            <div className="pt-8">
              <button className="group flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg" type="submit">
                {copy.contact.sendLabel}
                <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        <aside className="col-span-12 lg:col-span-5">
          <div className="border border-black/8 dark:border-white/8 overflow-hidden rounded-lg bg-white/[0.2] dark:bg-white/[0.02]">
            {/* Contact Image */}
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop" 
                alt="Get in touch"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            
            {/* Contact Info */}
            <div className="p-10 lg:p-12">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                    {copy.contact.statusLabel}
                  </span>
                </div>

                <div className="space-y-10">
                  <section>
                    <span className="text-[10px] uppercase tracking-widest block mb-4 opacity-50 font-bold">{copy.contact.studioLabel}</span>
                    <a className="text-2xl font-display font-normal hover:opacity-60 transition-opacity block mb-2" href={`mailto:${copy.footer.email}`}>
                      {copy.footer.email}
                    </a>
                    <p className="text-xs opacity-45 leading-relaxed max-w-[200px] font-medium">{copy.footer.location}</p>
                  </section>

                  <section>
                    <span className="text-[10px] uppercase tracking-widest block mb-5 opacity-50 font-bold">{copy.contact.followLabel}</span>
                    <div className="flex flex-col gap-3">
                      {copy.contact.socials.map((label) => (
                        <a key={label} className="flex items-center justify-between group py-2 border-b border-black/8 dark:border-white/8 hover:border-black/15 dark:hover:border-white/15 transition-colors" href="#">
                          <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
                          <FiArrowUpRight className="text-xs opacity-40 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </section>

                  <div>
                    <div className="p-4 rounded-lg bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/12">
                      <span className="text-[10px] uppercase tracking-widest block mb-2 opacity-50 font-bold">{copy.contact.processLabel}</span>
                      <p className="text-[11px] opacity-55 font-medium">{copy.contact.processCopy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Contact
