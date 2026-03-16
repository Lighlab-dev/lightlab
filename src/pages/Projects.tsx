import React, { 
  useLayoutEffect, 
  useRef, 
  useMemo, 
  memo, 
  useState, 
  useCallback,
  type ReactNode
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

// --- Design Tokens ---
const TOKENS = {
  colors: {
    accent: "#FF3B3B",
    gold: "#C6A96B",
    dark: "#050505",
    darker: "#020202",
    surface: "#0a0a0a",
    surfaceElevated: "#111111",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.4)",
    textSubtle: "rgba(255,255,255,0.2)",
    border: "rgba(255,255,255,0.06)",
  },
  spacing: {
    section: "clamp(6rem, 12vw, 12rem)",
    container: "clamp(1.5rem, 6vw, 6rem)",
  },
  easing: {
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    editorial: "cubic-bezier(0.77, 0, 0.175, 1)",
  }
} as const;

// --- Types ---
interface Project {
  title: string;
  focus: string;
  desc?: string;
  result?: string;
  year?: string;
  tags?: string[];
}



interface ProjectCardProps {
  project: Project;
  index: number;
  viewLabel: string;
  isArabic: boolean;
  featured?: boolean;
  variant?: "large" | "medium" | "compact";
}



// --- Utilities ---
const formatIndex = (index: number): string => String(index + 1).padStart(2, "0");

const useMagneticEffect = (intensity: number = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    
    gsap.to(ref.current, {
      x: x * intensity * 20,
      y: y * intensity * 20,
      duration: 0.3,
      ease: "power2.out"
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
};

// --- Components ---



interface ScrollProgressProps {
  color?: string;
}

const ScrollProgress = memo(({ color = TOKENS.colors.accent }: ScrollProgressProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = progressRef.current;
    if (!element) return;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        element.style.transform = `scaleX(${self.progress})`;
      }
    });
    
    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[1px] bg-black/5 z-50">
      <div 
        ref={progressRef}
        className="h-full origin-left"
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}`,
          transform: "scaleX(0)"
        }}
      />
    </div>
  );
});
ScrollProgress.displayName = "ScrollProgress";

const RevealText = memo(({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(element, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay,
        ease: TOKENS.easing.editorial,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        }
      }
    );
  }, [delay]);

  return <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(60px)" }}>{children}</div>;
});
RevealText.displayName = "RevealText";


const ProjectCard = memo(({ 
  project, 
  index, 
  viewLabel, 
  isArabic, 
  featured = false,
  variant = "medium"
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);

    gsap.to(card, {
      rotateY: x * 5,
      rotateX: -y * 5,
      scale: 1.02,
      duration: 0.6,
      ease: "power2.out",
    });

    // Parallax image effect
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        x: x * 20,
        y: y * 20,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const imageUrl = `https://images.unsplash.com/photo-${[
    "1460925895917-afdab827c52f",
    "1551434678-e076c223a692",
    "1519389950473-47ba0277781c",
    "1618005182384-a83a8bd57fbe",
    "1497366216548-37526070297c"
  ][index % 5]}?w=1400&q=90`;

  const directionClass = isArabic ? "flex-row-reverse" : "flex-row";
  const textAlignment = isArabic ? "text-right" : "text-left";
  
  const sizeClasses = {
    large: "text-4xl md:text-6xl lg:text-7xl",
    medium: "text-2xl md:text-3xl lg:text-4xl",
    compact: "text-xl md:text-2xl"
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="group relative w-full h-full overflow-hidden rounded-2xl md:rounded-3xl cursor-none bg-neutral-900 will-change-transform"
      style={{ 
        perspective: "1500px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Image with parallax container */}
      <div 
        ref={imageContainerRef}
        className="absolute inset-[-20px] will-change-transform"
      >
        <img
          src={imageUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 ease-out scale-110 group-hover:scale-100"
          style={{ filter: isHovered ? "brightness(0.7)" : "brightness(0.9)" }}
        />
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        style={{ backgroundColor: isHovered ? `${TOKENS.colors.accent}10` : 'transparent' }}
      />
      
      {/* Content */}
      <div className={`absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10 ${textAlignment}`}>
        {/* Top row */}
        <div className={`flex justify-between items-start ${directionClass}`}>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
              {formatIndex(index)}
            </span>
            {project.year && (
              <span className="text-[10px] text-white/30 font-light">
                {project.year}
              </span>
            )}
          </div>
          
          {project.result && (
            <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-medium tracking-wider uppercase text-white/90">
              {project.result}
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="space-y-4">
          <div className="overflow-hidden">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/50 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
              {project.focus}
            </p>
          </div>
          
          <h3 className={`font-display font-light text-white leading-[1.1] tracking-tight ${sizeClasses[variant]}`}>
            {project.title}
          </h3>
          
          {featured && project.desc && (
            <p className="text-white/40 text-sm font-light max-w-md leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              {project.desc}
            </p>
          )}

          {/* Tags */}
          {project.tags && (
            <div className={`flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 ${isArabic ? "justify-end" : "justify-start"}`}>
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-[9px] uppercase tracking-wider text-white/40 border border-white/10 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View Project Link */}
          <div className={`pt-6 mt-6 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 ${directionClass}`}>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/60">
              {viewLabel}
            </span>
            <div className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white transform scale-0 group-hover/btn:scale-100 transition-transform duration-300 rounded-full" />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                className={`relative z-10 transform group-hover/btn:translate-x-0.5 transition-transform duration-300 ${isArabic ? "rotate-180" : ""}`}
              >
                <path 
                  d="M3 8h10M10 5l3 3-3 3" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-white group-hover/btn:text-black transition-colors duration-300"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l border-t border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-br-2xl" />
    </div>
  );
});
ProjectCard.displayName = "ProjectCard";

const StatCard = memo(({ value, label, index, isArabic, isDark }: {
  value: string;
  label: string;
  index: number;
  isArabic: boolean;
  isDark: boolean;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match?.[1] ?? '';
  const numericStr = match?.[2] ?? '0';
  const suffix = match?.[3]?.trim() ?? '';
  const numeric = parseFloat(numericStr);
  const isDecimal = numericStr.includes('.');

  useLayoutEffect(() => {
    const element = wrapRef.current;
    const numEl = numRef.current;
    if (!element || !numEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(element,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.12,
          ease: TOKENS.easing.editorial,
          scrollTrigger: { trigger: element, start: "top 90%" }
        }
      );

      const counter = { val: 0 };
      gsap.to(counter, {
        val: numeric,
        duration: 2.2,
        delay: index * 0.12 + 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        onUpdate() {
          if (numEl) numEl.textContent = isDecimal
            ? counter.val.toFixed(1)
            : String(Math.round(counter.val));
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [index, numeric, isDecimal]);

  return (
    <div
      ref={wrapRef}
      className={`relative p-8 rounded-2xl border backdrop-blur-sm group transition-colors duration-500
        ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.04]'}
        ${isArabic ? "text-right" : "text-left"}`}
      style={{ opacity: 0, transform: "translateY(40px)" }}
    >
      {/* Animated number */}
      <div
        className={`font-display font-light leading-none mb-1 ${isDark ? 'text-white' : 'text-[#0F0F0F]'}`}
        style={{ fontSize: 'clamp(3rem,5.5vw,4.8rem)', filter: 'drop-shadow(0 0 24px rgba(255,59,59,0.18))' }}
      >
        {prefix && <span className="opacity-50 text-[0.55em]">{prefix}</span>}
        <span ref={numRef} className="tabular-nums">0</span>
        {suffix && <span className="opacity-50 text-[0.5em] ml-0.5">{suffix}</span>}
      </div>

      {/* Red separator */}
      <span
        className="block h-px my-4 rounded-full"
        style={{ width: '2.5rem', background: 'linear-gradient(to right, rgba(255,59,59,0.55), transparent)' }}
      />

      <div className={`text-[10px] font-medium tracking-[0.2em] uppercase transition-colors
        ${isDark ? 'text-white/35 group-hover:text-white/55' : 'text-black/40 group-hover:text-black/60'}`}>
        {label}
      </div>
      <div className="absolute top-0 right-0 w-px h-0 bg-gradient-to-b from-[#FF3B3B]/40 to-transparent group-hover:h-full transition-all duration-700" />
    </div>
  );
});
StatCard.displayName = "StatCard";

const ImpactStat = memo(({ stat, index, isArabic, isDark }: { stat: { value: string; label: string }; index: number; isArabic: boolean; isDark: boolean }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const match = stat.value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match?.[1] ?? '';
  const numericStr = match?.[2] ?? '0';
  const suffix = match?.[3]?.trim() ?? '';
  const numeric = parseFloat(numericStr);
  const isDecimal = numericStr.includes('.');

  useLayoutEffect(() => {
    const el = wrapRef.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9,
          delay: index * 0.15,
          ease: TOKENS.easing.editorial,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );

      const counter = { val: 0 };
      gsap.to(counter, {
        val: numeric, duration: 2.4,
        delay: index * 0.15 + 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate() {
          if (numEl) numEl.textContent = isDecimal
            ? counter.val.toFixed(1)
            : String(Math.round(counter.val));
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [index, numeric, isDecimal]);

  return (
    <div
      ref={wrapRef}
      className={`group ${isArabic ? 'text-right' : 'text-left'}`}
      style={{ opacity: 0 }}
    >
      {/* Red accent line */}
      <span
        className="block h-px mb-6 rounded-full"
        style={{ width: '3rem', background: 'linear-gradient(to right, rgba(255,59,59,0.6), transparent)' }}
        aria-hidden="true"
      />

      {/* Number */}
      <div
        className={`font-display font-light leading-none mb-4 ${isDark ? 'text-white' : 'text-[#0F0F0F]'}`}
        style={{
          fontSize: 'clamp(4rem,8vw,7rem)',
          filter: 'drop-shadow(0 0 28px rgba(255,59,59,0.22))',
        }}
      >
        {prefix && <span className="opacity-45 text-[0.52em]">{prefix}</span>}
        <span ref={numRef} className="tabular-nums text-[#FF3B3B]">0</span>
        {suffix && <span className="opacity-45 text-[0.52em] ml-0.5">{suffix}</span>}
      </div>

      <div className={`text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300
        ${isDark ? 'text-white/35 group-hover:text-white/55' : 'text-black/40 group-hover:text-black/60'}`}>
        {stat.label}
      </div>
    </div>
  );
});
ImpactStat.displayName = "ImpactStat";

const MagneticButton = memo(({ 
  children, 
  href, 
  isArabic 
}: { 
  children: ReactNode; 
  href: string;
  isArabic: boolean;
}) => {
  // Fix ref type for anchor element
  const ref = useRef<HTMLAnchorElement>(null);
  const { handleMouseMove, handleMouseLeave } = useMagneticEffect(0.4);

  return (
    <a 
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center gap-4 px-10 py-5 rounded-full overflow-hidden group"
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: '#FF3B3B' }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to right, #FF3B3B, #cc2020)' }} />
      
      <span className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase">
        {children}
      </span>
      
      <svg 
        width="18" 
        height="12" 
        viewBox="0 0 18 12" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={`relative z-10 transform group-hover:translate-x-1 transition-transform duration-300 ${isArabic ? "rotate-180" : ""}`}
      >
        <path d="M1 6h16M12 1l5 5-5 5" />
      </svg>
    </a>
  );
});
MagneticButton.displayName = "MagneticButton";

// --- Main Page ---

export default function Projects({ themeMode }: { themeMode: 'dark' | 'light' }) {
  const isDark = themeMode === 'dark';
  const { copy, language } = useLanguage();
  const headerRef = useRef<HTMLDivElement>(null);
  
  const isArabic = useMemo(() => language === "ar", [language]);
  
  const projects = useMemo(() => copy.projects?.items ?? [], [copy.projects?.items]);
  const viewLabel = copy.ui?.viewProject ?? "View Project";

  const stats = useMemo(() => [
    { value: "48+", label: copy.projects?.stats?.projects ?? "Projects" },
    { value: "12", label: copy.projects?.stats?.awards ?? "Awards" },
    { value: "08", label: copy.projects?.stats?.years ?? "Years" }
  ], [copy.projects?.stats]);

  // Header parallax
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.to(header, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: header,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  if (!projects.length) return null;

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${isDark ? 'bg-[#090909] text-white' : 'bg-[#EDE8DF] text-[#0F0F0F]'}`}
    >
      <ScrollProgress />



      {/* Header */}
      <header 
        ref={headerRef}
        className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-20"
      >
        <div className="max-w-[1600px] mx-auto w-full">
          <RevealText delay={0.2}>
            <div className={`flex items-center gap-6 mb-16 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`h-px flex-1 max-w-[100px] ${isDark ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' : 'bg-gradient-to-r from-transparent via-black/30 to-transparent'}`} />
              <span className={`text-[11px] font-mono tracking-[0.4em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                {copy.nav?.projects ?? "Selected Work"}
              </span>
              <div className={`h-px flex-1 max-w-[100px] ${isDark ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' : 'bg-gradient-to-r from-transparent via-black/30 to-transparent'}`} />
            </div>
          </RevealText>

          <div className={`${isArabic ? "text-right" : "text-left"}`}>
            <RevealText delay={0.4}>
              <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-display font-light leading-[0.9] tracking-tighter mb-8">
                <span className={`block ${isDark ? 'text-white/90' : 'text-black/90'}`}>{copy.projects?.titleLine1 ?? "Crafting"}</span>
                <span className={`block ${isDark ? 'text-white/55' : 'text-black/55'}`}>
                  {copy.projects?.titleLine2 ?? "Digital Excellence"}
                </span>
              </h1>
            </RevealText>

            <RevealText delay={0.6}>
              <p className={`text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-16 ${isArabic ? "ml-auto" : ""} ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                {copy.projects?.subtitle ?? "We transform ambitious visions into award-winning digital experiences that define industries and inspire audiences."}
              </p>
            </RevealText>

            <RevealText delay={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {stats.map((stat, index) => (
                  <StatCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    index={index}
                    isArabic={isArabic}
                    isDark={isDark}
                  />
                ))}
              </div>
            </RevealText>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className={`text-[10px] tracking-[0.3em] uppercase ${isDark ? 'text-white/30' : 'text-black/30'}`}>Scroll</span>
          <div className={`w-px h-12 ${isDark ? 'bg-gradient-to-b from-white/30 to-transparent' : 'bg-gradient-to-b from-black/30 to-transparent'}`} />
        </div>
      </header>

      {/* Projects Grid */}
      <main className="relative z-10 px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* First row: Featured large + 2 stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[85vh]">
            <div className="lg:col-span-7 h-[60vh] lg:h-full">
              <ProjectCard 
                project={projects[0]} 
                index={0} 
                featured 
                variant="large"
                viewLabel={viewLabel} 
                isArabic={isArabic} 
              />
            </div>
            <div className="lg:col-span-5 grid grid-rows-2 gap-6 h-[80vh] lg:h-full">
              {projects.slice(1, 3).map((project, i) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={i + 1}
                  variant="compact"
                  viewLabel={viewLabel} 
                  isArabic={isArabic} 
                />
              ))}
            </div>
          </div>

          {/* Second row: 2 equal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[70vh]">
            {projects.slice(3, 5).map((project, i) => (
              <ProjectCard 
                key={project.title} 
                project={project} 
                index={i + 3}
                variant="medium"
                viewLabel={viewLabel} 
                isArabic={isArabic} 
              />
            ))}
          </div>

          {/* Third row: Asymmetric */}
          {projects.length > 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[50vh]">
              {projects.slice(5, 8).map((project, i) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={i + 5}
                  variant="compact"
                  viewLabel={viewLabel} 
                  isArabic={isArabic} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Impact Section */}
      <section className={`relative py-32 ${isDark ? 'border-y border-white/5 bg-[#060606]' : 'border-y border-black/5 bg-[#E5DFD5]'}`}>
        {/* Ambient red glow */}
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: 700, height: 700,
            background: 'rgba(255,59,59,0.04)',
            filter: 'blur(180px)',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-3 gap-12 md:gap-24">
            {copy.home?.impactStats?.slice(0, 3).map((stat: any, i: number) => (
              <ImpactStat key={i} stat={stat} index={i} isArabic={isArabic} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-6 md:px-12 lg:px-20 overflow-hidden">

        <div className="relative max-w-4xl mx-auto text-center">
          <RevealText>
            <p className="text-[11px] font-mono tracking-[0.4em] uppercase mb-8" style={{ color: '#FF3B3B' }}>
              {copy.projects?.ctaButton ?? "Start a Project"}
            </p>
          </RevealText>

          <RevealText delay={0.2}>
            <h2 className={`text-4xl md:text-6xl lg:text-7xl font-display font-light mb-12 leading-tight ${isDark ? 'text-white/90' : 'text-black/90'}`}>
              {copy.projects?.ctaTitle ?? "Ready to create something extraordinary?"}
            </h2>
          </RevealText>

          <RevealText delay={0.4}>
            <MagneticButton href="/contact" isArabic={isArabic}>
              {copy.projects?.ctaButton ?? "Let's Talk"}
            </MagneticButton>
          </RevealText>
        </div>

        {/* Decorative elements */}
        <div className={`absolute top-1/2 left-12 w-px h-32 hidden lg:block ${isDark ? 'bg-gradient-to-b from-transparent via-white/10 to-transparent' : 'bg-gradient-to-b from-transparent via-black/10 to-transparent'}`} />
        <div className={`absolute top-1/2 right-12 w-px h-32 hidden lg:block ${isDark ? 'bg-gradient-to-b from-transparent via-white/10 to-transparent' : 'bg-gradient-to-b from-transparent via-black/10 to-transparent'}`} />
      </section>
    </div>
  );
}