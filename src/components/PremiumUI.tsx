import {
  useLayoutEffect,
  useRef,
  useCallback,
  memo,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Animation config ────────────────────────────────────────────────────────
export const ANIMATION = {
  duration: { reveal: 1.2, hover: 0.6, stagger: 0.08 },
  ease: {
    luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
    smooth: "cubic-bezier(0.62, 0.05, 0.01, 0.99)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type CursorType = "default" | "view" | "play" | "drag";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  isDark?: boolean;
  type?: "button" | "submit" | "reset";
}

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: "chars" | "words";
}

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

interface CinematicVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

// ─── useCursor ────────────────────────────────────────────────────────────────
export function useCursor() {
  const [type, setType] = useState<CursorType>("default");
  return { type, setType };
}

// ─── MagneticButton ──────────────────────────────────────────────────────────
export const MagneticButton = memo(
  ({
    children,
    className = "",
    style,
    href,
    onClick,
    variant = "primary",
    isDark = true,
    type = "button",
  }: MagneticButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(buttonRef.current, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }, []);

    const handleMouseLeave = useCallback(() => {
      gsap.to(buttonRef.current, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    }, []);

    const baseStyles =
      variant === "primary"
        ? isDark
          ? "bg-white text-black border border-white/30 hover:bg-black hover:text-white hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] focus-visible:bg-black focus-visible:text-white"
          : "bg-black text-white border border-black/30 hover:bg-white hover:text-black hover:border-black/40 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] focus-visible:bg-white focus-visible:text-black"
        : isDark
          ? "border border-white/20 text-white hover:border-white/40 focus-visible:border-white/60"
          : "border border-black/20 text-black hover:border-black/40 focus-visible:border-black/60";

    const commonProps = {
      ref: buttonRef,
      className: `inline-block transition-[background-color,color,border-color,box-shadow] duration-300 ease-out ${baseStyles} ${className}`,
      style,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
    };

    if (href) return <a {...commonProps} href={href}>{children}</a>;
    return (
      <button {...commonProps} type={type}>
        {children}
      </button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ─── TextReveal ───────────────────────────────────────────────────────────────
export const TextReveal = memo(
  ({
    children,
    delay = 0,
    className = "",
    direction = "up",
  }: TextRevealProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      const ctx = gsap.context(() => {
        const fromY =
          direction === "up" ? 18 : direction === "down" ? -18 : 0;
        const fromX =
          direction === "left" ? 18 : direction === "right" ? -18 : 0;
        gsap.fromTo(
          el,
          { y: fromY, x: fromX, opacity: 0 },
          {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 0.65,
            delay,
            ease: ANIMATION.ease.luxury,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      }, ref);
      return () => ctx.revert();
    }, [delay, direction]);

    return (
      <div className={className}>
        <div ref={ref} className="will-change-transform">
          {children}
        </div>
      </div>
    );
  }
);
TextReveal.displayName = "TextReveal";

// ─── SplitText ────────────────────────────────────────────────────────────────
export const SplitText = memo(
  ({ text, className = "", delay = 0, type = "chars" }: SplitTextProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const elements =
      type === "chars"
        ? text.split("").map((char, i) => (
            <span
              key={i}
              className="split-char inline-block"
              style={{ display: char === " " ? "inline" : "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))
        : text.split(" ").map((word, i) => (
            <span key={i} className="split-word inline-block mr-[0.25em]">
              {word}
            </span>
          ));

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const chars = containerRef.current?.querySelectorAll(
          ".split-char, .split-word"
        );
        if (!chars?.length) return;
        gsap.fromTo(
          chars,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: type === "chars" ? 0.018 : 0.06,
            delay,
            ease: ANIMATION.ease.luxury,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 92%",
              once: true,
            },
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }, [delay, type]);

    return (
      <div ref={containerRef} className={className} style={{ perspective: "1000px" }}>
        <div className="flex flex-wrap">{elements}</div>
      </div>
    );
  }
);
SplitText.displayName = "SplitText";

// ─── CinematicImage ───────────────────────────────────────────────────────────
export const CinematicImage = memo(
  ({ src, alt, className = "", priority = false }: CinematicImageProps) => {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        if (wrapRef.current && imgRef.current) {
          gsap.fromTo(
            wrapRef.current,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: ANIMATION.duration.reveal,
              ease: ANIMATION.ease.luxury,
              scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
          gsap.fromTo(
            imgRef.current,
            { scale: 1.12 },
            {
              scale: 1,
              duration: ANIMATION.duration.reveal * 1.2,
              ease: ANIMATION.ease.smooth,
              scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      }, wrapRef);
      return () => ctx.revert();
    }, []);

    return (
      <div ref={wrapRef} className={`overflow-hidden ${className}`}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover will-change-transform"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }
);
CinematicImage.displayName = "CinematicImage";

// ─── CinematicVideo ───────────────────────────────────────────────────────────
export const CinematicVideo = memo(
  ({ src, poster, className = "" }: CinematicVideoProps) => {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        if (wrapRef.current && videoRef.current) {
          gsap.fromTo(
            wrapRef.current,
            { opacity: 0, scale: 1.04 },
            {
              opacity: 1,
              scale: 1,
              duration: ANIMATION.duration.reveal,
              ease: ANIMATION.ease.luxury,
              scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 95%",
                once: true,
              },
            }
          );
        }
      }, wrapRef);
      return () => ctx.revert();
    }, []);

    return (
      <div ref={wrapRef} className={`overflow-hidden will-change-transform ${className}`}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Cinematic overlay — subtle darkening vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      </div>
    );
  }
);
CinematicVideo.displayName = "CinematicVideo";

// ─── NoiseTexture ─────────────────────────────────────────────────────────────
export const NoiseTexture = memo(
  ({ opacity = 0.03, className = "" }: { opacity?: number; className?: string }) => (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  )
);
NoiseTexture.displayName = "NoiseTexture";

// ─── AmbientGlow ──────────────────────────────────────────────────────────────
export const AmbientGlow = memo(
  ({
    color,
    size = 600,
    opacity = 0.04,
    className = "",
    isDark,
  }: {
    color?: string;
    size?: number;
    opacity?: number;
    className?: string;
    isDark?: boolean;
  }) => {
    const resolvedColor = color ?? (isDark === false ? "black" : "white");
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          background: resolvedColor,
          opacity,
          filter: `blur(${size * 0.3}px)`,
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }
);
AmbientGlow.displayName = "AmbientGlow";
