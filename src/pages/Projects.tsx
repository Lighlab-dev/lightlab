import {
  useLayoutEffect,
  useRef,
  useMemo,
  memo,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../i18n";
import {
  NoiseTexture,
  AmbientGlow,
  CinematicImage,
  TextReveal,
  SplitText,
  ANIMATION,
} from "../components/PremiumUI";

gsap.registerPlugin(ScrollTrigger);

type Theme = "dark" | "light";

interface ProjectsProps {
  themeMode: Theme;
}

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1400&q=90",
  projects: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=90",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=90",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=90",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=90",
  ],
};

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const MagneticLink = memo(({ href, children, className = "" }: MagneticLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
});

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

const ScrambleText = memo(({ text, className = "", triggerOnHover = false }: ScrambleTextProps) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index: number) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useLayoutEffect(() => {
    if (!triggerOnHover) {
      const timer = setTimeout(scramble, 500);
      return () => clearTimeout(timer);
    }
  }, [scramble, triggerOnHover]);

  return (
    <span
      ref={elementRef}
      className={`inline-block ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  );
});

type ProjectsItem = ReturnType<typeof useLanguage>["copy"]["projects"]["items"][number];

interface ProjectCardProps {
  project: ProjectsItem;
  index: number;
  layout?: "standard" | "wide" | "featured";
  isArabic: boolean;
  isDark: boolean;
  copy: any;
}

const ProjectCard = memo(
  ({
    project,
    index,
    layout = "standard",
    isArabic,
    copy,
  }: ProjectCardProps) => {
    const cardRef = useRef<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }, []);

    const isFeatured = layout === "featured";
    const isWide = layout === "wide";

    return (
      <article
        ref={cardRef}
        data-cursor="pointer"
        className={`
          group relative overflow-hidden cursor-pointer
          ${isFeatured ? "col-span-12 lg:col-span-8 row-span-2 h-[70vh] min-h-[600px] rounded-3xl" : ""}
          ${isWide ? "col-span-12 lg:col-span-6 h-[50vh] min-h-[400px] rounded-3xl" : "col-span-12 md:col-span-6 lg:col-span-4 h-[45vh] min-h-[350px] rounded-3xl"}
        `}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container with parallax */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transform: isHovered
              ? `scale(1.05) translate(${(mousePosition.x - 0.5) * -20}px, ${(mousePosition.y - 0.5) * -20}px)`
              : "scale(1)",
          }}
        >
          <CinematicImage
            src={IMAGES.projects[index % IMAGES.projects.length]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3-stop gradient overlay */}
        <div
          className={`
            absolute inset-0 transition-all duration-700
            ${
              isFeatured
                ? "bg-gradient-to-t from-black/85 via-black/30 via-[55%] to-transparent group-hover:from-black/92"
                : "bg-gradient-to-t from-black/75 via-black/20 via-[60%] to-transparent group-hover:from-black/85"
            }
          `}
        />

        {/* Content */}
        <div
          className={`
            absolute inset-0 flex flex-col justify-end
            ${isFeatured ? "p-10 md:p-14" : "p-7 md:p-10"}
            transition-transform duration-500
            ${isArabic ? "text-right items-end" : ""}
          `}
        >
          {/* Category badge */}
          <div
            className={`
              overflow-hidden mb-3.5 transition-all duration-500
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-[0.22em] uppercase bg-white/[0.12] backdrop-blur-md rounded-full text-white/85 border border-white/[0.15]">
              <span className="w-1 h-1 rounded-full bg-white/60 inline-block" />
              {project.focus}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`
              font-display font-light text-white leading-[1.08] mb-3.5
              transition-all duration-500
              ${isFeatured ? "text-4xl md:text-6xl lg:text-7xl" : "text-2xl md:text-3xl"}
              ${isHovered ? "translate-y-0" : "translate-y-2"}
            `}
          >
            <ScrambleText text={project.title} triggerOnHover={true} />
          </h3>

          {/* Description / Result */}
          <p
            className={`
              text-base text-white/70 max-w-xl font-light leading-relaxed mb-5
              transition-all duration-500 delay-100
              ${isFeatured ? "md:text-lg" : "text-sm line-clamp-2"}
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <span className="block text-[9px] uppercase tracking-[0.22em] text-white/40 mb-1.5">
              {copy.ui.impact}
            </span>
            {project.result}
          </p>

          {/* View project link */}
          <div
            className={`
              flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/60
              transition-all duration-500
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              ${isArabic ? "flex-row-reverse" : ""}
            `}
          >
            <span>{copy.ui.viewProject}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isArabic ? "rotate-180" : ""} ${isHovered ? "translate-x-1" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>

        {/* Index number */}
        <div
          className={`
            absolute top-8 ${isArabic ? "right-8" : "left-8"}
            text-7xl font-display font-bold text-white/[0.03] select-none pointer-events-none
            transition-all duration-700
            ${isHovered ? "text-white/[0.08] scale-110" : ""}
          `}
        >
          0{index + 1}
        </div>

        {/* Inset border — featured gets a slightly brighter glow */}
        <div
          className={`
            absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
            ${isFeatured
              ? "border border-white/0 group-hover:border-white/[0.14] ring-0 group-hover:ring-1 group-hover:ring-white/[0.06] ring-inset"
              : "border border-white/0 group-hover:border-white/10"
            }
          `}
        />
      </article>
    );
  },
);

interface AnimatedDividerProps {
  isDark: boolean;
  isArabic: boolean;
}

const AnimatedDivider = memo(({ isDark, isArabic }: AnimatedDividerProps) => (
  <div className={`flex items-center gap-6 py-16 ${isArabic ? "flex-row-reverse" : ""}`}>
    <div
      className={`flex-1 h-px ${isDark ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-black/20 to-transparent"}`}
    />
    <div
      className={`w-2.5 h-2.5 border rotate-45 ${isDark ? "border-white/30" : "border-black/30"}`}
    />
    <div
      className={`flex-1 h-px ${isDark ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-black/20 to-transparent"}`}
    />
  </div>
));

interface StatCounterProps {
  value: string;
  label: string;
  isDark: boolean;
  isArabic: boolean;
}

const StatCounter = memo(({ value, label, isDark, isArabic }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: parseInt(value),
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                setCount(Math.floor(this.targets()[0].val));
              },
            },
          );
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value]);

  return (
    <div
      ref={ref}
      className={`
        pt-5 border-t
        ${isDark ? "border-white/10" : "border-black/10"}
        ${isArabic ? "text-right" : ""}
      `}
    >
      <div
        className={`text-5xl md:text-6xl font-display font-light mb-1.5 tracking-tight ${isDark ? "text-white/90" : "text-black/90"}`}
      >
        {count}+
      </div>
      <div
        className={`text-[9px] font-bold tracking-[0.32em] uppercase ${isDark ? "text-white/30" : "text-black/30"}`}
      >
        {label}
      </div>
    </div>
  );
});

function Projects({ themeMode = "dark" }: ProjectsProps) {
  const isDark = themeMode === "dark";
  const { copy, language } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const isArabic = useMemo(() => language === "ar", [language]);

  const projects = copy.projects.items || [];
  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(
        ".reveal-projects",
        sectionRef.current,
      );
      if (!els.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: els[0],
          start: "top 90%",
          once: true,
        },
      });

      tl.from(els, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: ANIMATION.ease.luxury,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={sectionRef}
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${isDark ? "bg-[#080807] text-white" : "bg-[#eeeae0] text-[#18160f]"}`}
    >
      <NoiseTexture />
      <AmbientGlow isDark={isDark} />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Navigation spacer */}
        <div className="h-32" />

        {/* Hero Header */}
        <header ref={headerRef} className="pt-20 pb-20">
          {/* Breadcrumb */}
          <div
            className={`overflow-hidden mb-10 ${isArabic ? "text-right" : ""}`}
          >
            <TextReveal>
              <div className="flex items-center gap-5">
                <span
                  className={`text-[11px] font-bold tracking-[0.5em] uppercase ${isDark ? "opacity-40" : "text-[#8c8780]"}`}
                >
                  {copy.nav.projects}
                </span>
                <span
                  className={`w-14 h-px ${isDark ? "bg-white/20" : "bg-[#d9d5ca]"}`}
                />
                <span
                  className={`text-[10px] font-bold tracking-[0.3em] uppercase px-3.5 py-1 rounded-full border ${isDark ? "border-white/10 opacity-40" : "border-[#d9d5ca] text-[#8c8780]"}`}
                >
                  2026 Archive
                </span>
              </div>
            </TextReveal>
          </div>

          {/* Main title */}
          <div className={`mb-20 ${isArabic ? "text-right" : ""}`}>
            <h1 className="font-display text-[clamp(3.5rem,10vw,12rem)] font-light leading-[0.88] tracking-tighter uppercase">
              <SplitText text={copy.projects.titleLine1} type="words" />
              <div className="overflow-hidden">
                <span className="block italic opacity-40 translate-y-4 translate-x-4">
                  <SplitText text={copy.projects.titleLine2} type="words" />
                </span>
              </div>
            </h1>
          </div>

          {/* Subtitle & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div
              className={`col-span-12 lg:col-span-7 overflow-hidden ${isArabic ? "text-right" : ""}`}
            >
              <p
                className={`reveal-projects text-xl md:text-2xl max-w-2xl leading-relaxed font-light italic ${isDark ? "opacity-40" : "text-[#56514a]"}`}
              >
                {copy.projects.subtitle}
              </p>
            </div>

            <div className="col-span-12 lg:col-span-5 stats-container grid grid-cols-3 gap-6">
              <div className="reveal-projects">
                <StatCounter
                  value="48"
                  label={copy.projects.stats.projects}
                  isDark={isDark}
                  isArabic={isArabic}
                />
              </div>
              <div className="reveal-projects">
                <StatCounter
                  value="12"
                  label={copy.projects.stats.awards}
                  isDark={isDark}
                  isArabic={isArabic}
                />
              </div>
              <div className="reveal-projects">
                <StatCounter
                  value="8"
                  label={copy.projects.stats.years}
                  isDark={isDark}
                  isArabic={isArabic}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-5 reveal-projects">
            <ProjectCard
              project={featuredProject}
              index={0}
              layout="featured"
              isArabic={isArabic}
              isDark={isDark}
              copy={copy}
            />
          </div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-12 gap-5 reveal-projects">
          {remainingProjects.map((project, idx) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={idx + 1}
              layout={idx === 0 ? "wide" : "standard"}
              isArabic={isArabic}
              isDark={isDark}
              copy={copy}
            />
          ))}
        </div>

        <AnimatedDivider isDark={isDark} isArabic={isArabic} />

        {/* Focus Areas & CTA */}
        <div className="pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Focus Areas */}
            <div
              className={`relative p-12 md:p-16 rounded-3xl overflow-hidden reveal-projects shadow-sm group ${isDark ? "bg-white/[0.02] border border-white/10" : "bg-white border border-[#e8e4d9]"}`}
            >
              {/* Background watermark */}
              <div
                className={`absolute -bottom-12 ${isArabic ? "-left-12" : "-right-12"} text-[25vw] font-display font-bold select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-700 ${isDark ? "text-white/[0.012]" : "text-[#ece8dd]"}`}
              >
                01
              </div>

              <div className={`relative z-10 ${isArabic ? "text-right" : ""}`}>
                <p
                  className={`text-[11px] font-bold tracking-[0.5em] uppercase mb-10 ${isDark ? "opacity-30" : "text-[#8c8780]"}`}
                >
                  {copy.ui.focusAreas}
                </p>

                <h2
                  className={`text-4xl md:text-5xl font-display font-light mb-12 leading-[1.05] tracking-tight uppercase group-hover:italic transition-all duration-500 ${isDark ? "" : "text-[#18160f]"}`}
                >
                  {copy.projects.focusTitle}
                </h2>

                <ul className="space-y-6">
                  {copy.projects.focusItems?.map(
                    (item: string, idx: number) => (
                      <li
                        key={item}
                        className={`group/item flex items-center gap-5 cursor-default ${isArabic ? "flex-row-reverse" : ""}`}
                      >
                        <span
                          className={`text-xl font-display font-light tabular-nums transition-all duration-300 group-hover/item:italic ${isDark ? "text-white/10 group-hover/item:text-white/40" : "text-[#d0ccbf] group-hover/item:text-[#8c8780]"}`}
                        >
                          0{idx + 1}
                        </span>
                        <span
                          className={`text-base font-light tracking-wide transition-all duration-300 group-hover/item:translate-x-2 ${isDark ? "text-white/40 group-hover/item:text-white" : "text-[#56514a] group-hover/item:text-[#18160f]"}`}
                        >
                          {item}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* CTA Card */}
            <div
              className={`relative p-12 md:p-16 rounded-3xl overflow-hidden flex flex-col justify-between min-h-[500px] reveal-projects group ${isDark ? "bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-3xl" : "bg-[#18160f] text-white border border-[#18160f]"}`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l ${isDark ? "from-white/40" : "from-white/30"} to-transparent group-hover:w-full transition-all duration-1000`}
              />
              <div
                className={`absolute bottom-0 left-0 w-[1px] h-32 bg-gradient-to-t ${isDark ? "from-white/40" : "from-white/30"} to-transparent group-hover:h-full transition-all duration-1000`}
              />

              <div className={`relative z-10 ${isArabic ? "text-right" : ""}`}>
                <p className="text-[11px] font-bold tracking-[0.5em] uppercase mb-10 opacity-30 text-white">
                  {copy.ui.nextBuild}
                </p>
                <p className="text-4xl md:text-7xl font-display font-light leading-[1.06] tracking-[-0.02em] uppercase group-hover:italic transition-all duration-700 text-white">
                  {copy.projects.ctaTitle}
                </p>
              </div>

              <div className="relative z-10 mt-16">
                <MagneticLink
                  href="/contact"
                  className="w-full md:w-auto inline-flex items-center justify-between px-16 py-8 rounded-full bg-white text-black text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:scale-[1.02] shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
                >
                  <span>{copy.projects.ctaButton}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isArabic ? "rotate-180" : ""} group-hover:translate-x-3`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </MagneticLink>
              </div>
            </div>
          </div>
        </div>

        {/* Footer watermark */}
        <div className="relative h-[8vw] overflow-hidden flex items-start justify-center pointer-events-none">
          <div
            className={`text-[15vw] font-display font-bold text-center whitespace-nowrap leading-none tracking-widest uppercase ${isDark ? "text-white/[0.015]" : "text-[#d0ccbf]"}`}
          >
            {copy.nav.projects}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Projects;
