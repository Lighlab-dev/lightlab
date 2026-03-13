import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../i18n";
import {
  TextReveal,
  SplitText,
  CinematicImage,
  MagneticButton,
  NoiseTexture,
  AmbientGlow,
  ANIMATION,
} from "../components/PremiumUI";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85",
  tracks: [
    "/images/ai-solutions.png",
    "/images/engineering.png",
    "/images/media-buying.png",
  ],
};

interface ServicesProps {
  themeMode?: "dark" | "light";
}

function Services({ themeMode = "dark" }: ServicesProps) {
  const { copy } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === "dark";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-services", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: ANIMATION.ease.luxury,
        scrollTrigger: {
          trigger: ".reveal-services",
          start: "top 90%",
          once: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${isDark ? "bg-[#080807] text-white" : "bg-[#eeeae0] text-[#18160f]"}`}
    >
      <NoiseTexture />
      <AmbientGlow isDark={isDark} />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Navigation spacer */}
        <div className="h-32" />

        {/* Hero Section */}
        <section className="min-h-[70vh] flex flex-col justify-center py-20">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
            <div className="max-w-5xl">
              <TextReveal>
                <div
                  className={`text-[11px] uppercase tracking-[0.5em] mb-10 font-bold ${isDark ? "opacity-40" : "text-[#56514a]"}`}
                >
                  {copy.services.overview.heroEyebrow}
                </div>
              </TextReveal>
              <h1 className="font-display text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] font-light tracking-tighter uppercase">
                <SplitText
                  text={copy.services.overview.heroTitleLine1}
                  type="words"
                />
                <div className="overflow-hidden pb-6">
                  <span className="block italic opacity-40 translate-y-0">
                    <SplitText
                      text={copy.services.overview.heroTitleLine2}
                      type="words"
                    />
                  </span>
                </div>
              </h1>
            </div>
            <div className="max-w-sm reveal-services">
              <p
                className={`text-xl leading-relaxed font-light italic ${isDark ? "opacity-40" : "text-[#56514a]"}`}
              >
                {copy.services.overview.heroSubtitle}
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden h-[450px] md:h-[650px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group reveal-services">
            <CinematicImage
              src={IMAGES.hero}
              alt={copy.services.overview.heroImageAlt}
              className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          </div>
        </section>

        {/* Tracks Section */}
        <section className="py-40 flex flex-col gap-24">
          {copy.services.overview.tracks.map((track, index) => (
            <div
              key={index}
              className="group grid grid-cols-12 gap-8 md:gap-16 items-center reveal-services"
            >
              <div
                className={`col-span-12 lg:col-span-7 h-[500px] md:h-[600px] rounded-2xl overflow-hidden relative shadow-2xl ${index % 2 !== 0 ? "lg:order-2" : ""}`}
              >
                <CinematicImage
                  src={IMAGES.tracks[index % 3]}
                  alt={track.title}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                <div className="absolute top-10 left-10 md:top-14 md:left-14">
                  <span className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase border border-white/20 px-6 py-3 rounded-full backdrop-blur-md">
                    {copy.ui.track} 0{index + 1}
                  </span>
                </div>
              </div>

              <div
                className={`col-span-12 lg:col-span-5 space-y-12 ${index % 2 !== 0 ? "lg:order-1" : ""}`}
              >
                <h2 className="text-5xl md:text-7xl font-display font-light leading-none tracking-tighter uppercase group-hover:italic transition-all duration-500">
                  {track.title}
                </h2>
                <p
                  className={`text-lg leading-relaxed font-light max-w-xl ${isDark ? "opacity-40" : "text-[#56514a]"}`}
                >
                  {track.description}
                </p>

                <div
                  className={`space-y-12 pt-12 border-t ${isDark ? "border-white/10" : "border-[#d9d5ca]"}`}
                >
                  <div>
                    <span
                      className={`text-[10px] uppercase tracking-[0.4em] block mb-8 font-bold ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
                    >
                      {copy.ui.deliverables}
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      {track.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-4 text-sm font-light transition-opacity ${isDark ? "opacity-50 group-hover:opacity-80" : "text-[#56514a] group-hover:text-[#18160f]"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/30" : "bg-[#56514a]"}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] uppercase tracking-[0.4em] block mb-8 font-bold ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
                    >
                      {copy.ui.techStack}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {track.tech.map((item, idx) => (
                        <span
                          key={idx}
                          className={`px-5 py-2 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase transition-all ${isDark ? "bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black" : "bg-white border border-[#d9d5ca] text-[#56514a] group-hover:bg-[#18160f] group-hover:text-white group-hover:border-[#18160f]"}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Workflow Section */}
        <section
          className={`py-40 border-t ${isDark ? "border-white/5" : "border-[#d9d5ca]"}`}
        >
          <div className="text-center mb-40 reveal-services">
            <span
              className={`text-[11px] uppercase tracking-[0.5em] mb-8 block font-bold ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
            >
              {copy.services.overview.workflowEyebrow}
            </span>
            <h2
              className={`text-7xl md:text-9xl font-display font-light tracking-tighter uppercase leading-none italic ${isDark ? "opacity-80" : "text-[#18160f]"}`}
            >
              {copy.services.overview.workflowTitleLine1}{" "}
              <br className="hidden md:block" />
              {copy.services.overview.workflowTitleLine2}
            </h2>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden reveal-services shadow-2xl border ${isDark ? "bg-white/10 border-white/10" : "bg-[#d9d5ca] border-[#d9d5ca]"}`}
          >
            {copy.services.overview.workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-12 lg:p-16 transition-colors duration-500 group relative overflow-hidden ${isDark ? "bg-[#080807] hover:bg-white/[0.03]" : "bg-[#eeeae0] hover:bg-white"}`}
              >
                <div
                  className={`absolute top-0 right-0 p-8 text-4xl font-display italic transition-opacity ${isDark ? "opacity-5 group-hover:opacity-20" : "opacity-10 group-hover:opacity-30 text-[#18160f]"}`}
                >
                  0{idx + 1}
                </div>
                <span
                  className={`text-[10px] font-bold block mb-12 tracking-[0.3em] ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
                >
                  {step.label}
                </span>
                <h4 className="text-3xl font-display font-light mb-8 group-hover:italic transition-all">
                  {step.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed font-light transition-opacity ${isDark ? "opacity-40 group-hover:opacity-60" : "text-[#56514a] group-hover:text-[#18160f]"}`}
                >
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className={`py-40 border-t ${isDark ? "border-white/5" : "border-[#d9d5ca]"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="reveal-services">
              <span
                className={`text-[11px] uppercase tracking-[0.5em] mb-8 block font-bold ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
              >
                {copy.services.overview.ctaEyebrow}
              </span>
              <h2 className="text-7xl md:text-9xl font-display font-light tracking-tighter uppercase mb-12 leading-[0.85]">
                {copy.services.overview.ctaTitle}{" "}
                <br className="hidden md:block" />
                <span
                  className={`italic ${isDark ? "opacity-60" : "text-[#56514a]"}`}
                >
                  {copy.services.overview.ctaTitleEmphasis}
                </span>
              </h2>
              <p
                className={`text-xl max-w-md font-light leading-relaxed ${isDark ? "opacity-40" : "text-[#56514a]"}`}
              >
                {copy.services.overview.ctaCopy}
              </p>
            </div>

            <div className="reveal-services flex justify-center lg:justify-end">
              <div
                className={`rounded-3xl border p-12 md:p-20 text-center backdrop-blur-3xl max-w-lg w-full relative overflow-hidden group shadow-2xl ${isDark ? "border-white/10 bg-white/[0.02]" : "bg-[#18160f] text-white border-[#18160f]"}`}
              >
                <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-white/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[1px] h-32 bg-gradient-to-t from-white/40 to-transparent" />

                <span
                  className={`text-[11px] uppercase tracking-[0.4em] block mb-8 font-bold ${isDark ? "opacity-30" : "text-white/50"}`}
                >
                  {copy.services.overview.ctaMetaLabel}
                </span>
                <div
                  className={`text-4xl font-display font-light mb-16 italic ${isDark ? "opacity-80" : "text-white"}`}
                >
                  {copy.services.overview.ctaMetaValue}
                </div>

                <MagneticButton
                  href="/contact"
                  isDark={true}
                  className="w-full py-7 rounded-full text-[11px] font-bold uppercase tracking-[0.3em]"
                >
                  {copy.services.overview.ctaButton}
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* Background watermark */}
        <div className="absolute bottom-0 left-0 right-0 h-[8vw] overflow-hidden pointer-events-none flex items-start justify-center">
          <div
            className={`text-[18vw] font-display font-bold leading-none text-center whitespace-nowrap tracking-widest ${isDark ? "text-white/[0.015]" : "text-[#d0ccbf]"}`}
          >
            ENGINEERING VALUE
          </div>
        </div>
      </div>
    </main>
  );
}

export default Services;
