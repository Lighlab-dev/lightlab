import { FiChevronDown } from 'react-icons/fi'
import { useLanguage } from '../i18n'

function Method() {
  const { copy } = useLanguage()

  return (
    <main className="method-snap">
      <section className="method-section min-h-screen flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
          <div className="text-[45vw] font-display font-black select-none leading-none">∴</div>
        </div>
        <div className="text-center relative z-10 max-w-5xl">
          <span className="text-[10px] uppercase tracking-[0.6em] mb-12 block opacity-40 font-bold">
            {copy.method.heroEyebrow}
          </span>
          <h1 className="font-display text-[14vw] md:text-[12vw] leading-[0.8] kerning-tight font-black uppercase mb-20">
            {copy.method.heroTitleLine1}
            <br />
            <span className="italic font-normal">{copy.method.heroTitleLine2}</span>
          </h1>
          <div className="flex flex-col items-center gap-12">
            <p className="text-xl md:text-2xl font-display max-w-2xl text-center leading-relaxed opacity-70">
              {copy.method.heroCopy}
            </p>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest opacity-40">
              <div className="w-12 h-[1px] bg-primary/20" />
              <span>Scroll to explore</span>
              <div className="w-12 h-[1px] bg-primary/20" />
            </div>
            <div className="animate-bounce mt-6">
              <FiChevronDown className="text-4xl opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {copy.method.steps.map((step, index) => {
        const isDark = index === 1
        const isRightContent = index % 2 === 1
        return (
          <section
            key={step.number}
            className={`method-section min-h-screen relative flex items-center overflow-hidden px-8 md:px-16 lg:px-24 py-20 ${isDark ? 'bg-primary text-white' : 'border-t border-primary/5'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={`text-[35vw] font-display font-black select-none leading-none transition-all duration-1000 ${isDark ? 'opacity-[0.05]' : 'opacity-[0.02]'} ${index === 0 ? 'translate-x-1/4' : index === 1 ? '-translate-x-1/4' : index === 2 ? 'translate-y-1/4' : '-translate-x-1/3'}`}
              >
                {step.number}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-12 lg:gap-20 w-full relative z-10 max-w-[1400px] mx-auto">
              <div className={`col-span-12 lg:col-span-5 flex flex-col justify-center ${isRightContent ? 'lg:order-2' : ''}`}>
                <div className="mb-16">
                  <div className={`inline-block px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest mb-8 ${isDark ? 'bg-white/10 text-white/60' : 'bg-primary/5 text-primary/60'}`}>
                    {step.number} / {copy.method.steps.length < 10 ? '0' : ''}{copy.method.steps.length}
                  </div>
                  <h2 className={`text-5xl md:text-7xl font-display uppercase kerning-tight mb-8 leading-[0.9] ${index % 2 === 0 ? 'italic' : ''}`}>
                    {step.title}
                  </h2>
                  <p className={`text-lg md:text-xl leading-relaxed max-w-lg ${isDark ? 'opacity-80' : 'opacity-70'}`}>
                    {step.copy}
                  </p>
                </div>
                <div className={`grid grid-cols-1 gap-10 pt-8 border-t ${isDark ? 'border-white/10' : 'border-primary/10'}`}>
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold block mb-5 ${isDark ? 'opacity-50' : 'opacity-40'}`}>
                      {step.deliverablesLabel}
                    </span>
                    <ul className={`space-y-3 text-sm leading-relaxed ${isDark ? 'opacity-80' : 'opacity-70'}`}>
                      {step.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/40' : 'bg-primary/30'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold block mb-3 ${isDark ? 'opacity-50' : 'opacity-40'}`}>
                      {step.metaLabel}
                    </span>
                    <p className={`text-lg font-display ${isDark ? 'opacity-90' : 'opacity-80'}`}>{step.metaValue}</p>
                  </div>
                </div>
              </div>
              <div className={`hidden lg:col-span-7 lg:flex items-center justify-center ${isRightContent ? 'lg:order-1' : ''}`}>
                <div className={`glass-card w-full aspect-[5/6] rounded-3xl flex items-center justify-center p-16 transition-all duration-500 ${isDark ? '!bg-white/5 !border-white/10 hover:!bg-white/[0.075]' : 'hover:bg-primary/[0.015]'}`}>
                  <div className={`relative w-full h-full ${index === 1 ? 'grid grid-cols-2 gap-6' : index === 2 ? 'flex flex-col gap-6' : 'border-2 border-primary/5 rounded-2xl overflow-hidden flex flex-col p-10'}`}>
                    {index === 0 && (
                      <>
                        <div className="flex items-center gap-4 mb-16">
                          <div className="h-[2px] w-16 bg-primary/30" />
                          <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Analysis Phase</span>
                        </div>
                        <div className="space-y-8 mb-auto">
                          <div className="space-y-4">
                            <div className="h-3 w-full bg-primary/5 rounded-full" />
                            <div className="h-3 w-5/6 bg-primary/5 rounded-full" />
                            <div className="h-3 w-11/12 bg-primary/5 rounded-full" />
                          </div>
                          <div className="space-y-4 opacity-60">
                            <div className="h-3 w-3/4 bg-primary/5 rounded-full" />
                            <div className="h-3 w-4/6 bg-primary/5 rounded-full" />
                          </div>
                          <div className="space-y-4 opacity-40">
                            <div className="h-3 w-2/3 bg-primary/5 rounded-full" />
                          </div>
                        </div>
                        <div className="mt-auto pt-12 flex justify-between items-end">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-2xl border-2 border-primary/10 flex items-center justify-center">
                              <span className="text-xs opacity-40">AI</span>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                              <span className="text-xs opacity-40">+</span>
                            </div>
                          </div>
                          <div className="text-[9px] uppercase tracking-widest opacity-30">Audit Report</div>
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="border-2 border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                          <div className="text-[9px] opacity-50 uppercase tracking-widest mb-auto">Structure Layer</div>
                          <div className="space-y-3 mt-8">
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                            <div className="h-2 w-4/6 bg-white/20 rounded-full" />
                          </div>
                        </div>
                        <div className="border-2 border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                          <div className="text-[9px] opacity-50 uppercase tracking-widest mb-auto">Performance</div>
                          <div className="flex items-end gap-2 h-24">
                            <div className="flex-1 bg-white/10 h-1/3 rounded-t" />
                            <div className="flex-1 bg-white/10 h-2/3 rounded-t" />
                            <div className="flex-1 bg-white/20 h-full rounded-t" />
                          </div>
                        </div>
                        <div className="col-span-2 border-2 border-white/10 rounded-2xl p-6 flex items-center justify-between">
                          <div>
                            <div className="text-[9px] opacity-50 uppercase tracking-widest mb-2">System Schema</div>
                            <div className="text-2xl font-display italic opacity-90">Architecture</div>
                          </div>
                          <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                            <span className="text-2xl opacity-40">∴</span>
                          </div>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="p-8 bg-primary/5 rounded-2xl border-l-[6px] border-primary relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
                          <div className="flex justify-between items-center mb-4 relative z-10">
                            <span className="text-[9px] font-bold uppercase opacity-40 tracking-widest">Sprint 04</span>
                            <span className="text-[9px] px-3 py-1.5 bg-primary/10 rounded-full uppercase font-bold">Active</span>
                          </div>
                          <div className="space-y-3 mb-4 relative z-10">
                            <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-3/4 rounded-full" />
                            </div>
                            <div className="flex gap-2">
                              <div className="h-1.5 w-1/4 bg-primary/20 rounded-full" />
                              <div className="h-1.5 w-1/4 bg-primary/20 rounded-full" />
                              <div className="h-1.5 w-1/4 bg-primary/10 rounded-full" />
                            </div>
                          </div>
                          <div className="text-[9px] uppercase opacity-40 tracking-widest relative z-10">75% Complete</div>
                        </div>
                        <div className="p-8 bg-primary/5 rounded-2xl opacity-40 relative overflow-hidden">
                          <div className="absolute inset-0 border-2 border-primary/5 rounded-2xl border-dashed" />
                          <span className="text-[9px] font-bold uppercase block mb-4 tracking-widest">Sprint 05</span>
                          <div className="h-2 w-full bg-primary/5 rounded-full" />
                        </div>
                        <div className="p-8 bg-primary/5 rounded-2xl opacity-20">
                          <span className="text-[9px] font-bold uppercase block mb-4 tracking-widest">Sprint 06</span>
                          <div className="h-2 w-full bg-primary/5 rounded-full" />
                        </div>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 rounded-full border-2 border-primary/5" />
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 h-1/2 flex items-end gap-3 px-8">
                          <div className="flex-1 bg-primary/5 h-1/4 rounded-t-xl" />
                          <div className="flex-1 bg-primary/5 h-2/4 rounded-t-xl relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-t-xl" />
                          </div>
                          <div className="flex-1 bg-primary/5 h-3/4 rounded-t-xl relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-t-xl" />
                          </div>
                          <div className="flex-1 bg-primary h-full rounded-t-xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1/3 bg-white/10" />
                          </div>
                        </div>
                        <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full border-2 border-primary/10 flex items-center justify-center backdrop-blur-sm bg-white/5">
                          <div className="flex flex-col items-center">
                            <span className="text-4xl mb-1">↑</span>
                            <span className="text-[8px] uppercase opacity-40 tracking-widest font-bold">Growth</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="no-snap min-h-screen flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 border-t border-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015]">
          <div className="w-[600px] h-[600px] rounded-full border-[80px] border-primary/20" />
        </div>
        <div className="text-center max-w-4xl relative z-10">
          <div className="inline-block px-6 py-2 rounded-full bg-primary/5 text-[9px] font-bold uppercase tracking-widest mb-12 text-primary/60">
            Ready to start
          </div>
          <h2 className="text-6xl md:text-9xl font-display uppercase kerning-tight mb-16 leading-[0.85]">
            {copy.method.ctaTitleLine1}
            <br />
            <span className="italic font-normal">{copy.method.ctaTitleLine2}</span>
          </h2>
          <p className="text-lg md:text-xl opacity-70 mb-16 max-w-2xl mx-auto leading-relaxed">{copy.method.ctaCopy}</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
            <a className="bg-primary text-white px-14 py-7 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-primary/10" href="mailto:hello@lightlab.dev">
              {copy.method.ctaPrimary}
            </a>
            <a className="border-2 border-primary/20 px-14 py-7 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white hover:border-primary transition-all" href="/projects">
              {copy.method.ctaSecondary}
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-widest opacity-30 mt-16">
            <div className="w-8 h-[1px] bg-primary/20" />
            <span>End of method</span>
            <div className="w-8 h-[1px] bg-primary/20" />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Method
