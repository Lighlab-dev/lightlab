import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

function Layout() {
  const logoSrc = "/lightlab-lightlogo.svg";
  const mainRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLogoRef = useRef<HTMLImageElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLImageElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const { language, setLanguage, copy } = useLanguage();
  const isRtl = language === "ar";
  const [isHeroSection, setIsHeroSection] = useState(location.pathname === "/");

  const handleLanguageChange = (value: string) => {
    if (value === "fr" || value === "en" || value === "ar") {
      setLanguage(value);
    }
  };

  // Desktop nav link — active underline uses accent red
  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    `relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:origin-left after:transition-transform transition-all duration-200 ${
      isActive
        ? "after:scale-x-100 opacity-100 after:bg-[#FF3B3B]"
        : "after:scale-x-0 opacity-55 hover:opacity-100 hover:after:scale-x-100 hover:after:bg-[#FF3B3B]"
    }`;

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.scrollTo(0, { immediate: true });

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(".reveal");
      if (!targets.length) return;
      gsap.from(targets, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, mainRef);

    return () => ctx.revert();
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsHeroSection(false);
    } else {
      setIsHeroSection(window.scrollY < 2);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    setShowIntro(true);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!showIntro) return;
    const navLogo = navLogoRef.current;
    const introLogo = introLogoRef.current;
    const overlay = introOverlayRef.current;
    if (!navLogo || !introLogo || !overlay) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const startRect = introLogo.getBoundingClientRect();
    const endRect = navLogo.getBoundingClientRect();

    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top + startRect.height / 2;
    const endCenterX = endRect.left + endRect.width / 2;
    const endCenterY = endRect.top + endRect.height / 2;

    const deltaX = endCenterX - startCenterX;
    const deltaY = endCenterY - startCenterY;
    const scale = endRect.width / startRect.width;

    let ctx = gsap.context(() => {
      gsap.set(navLogo, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(navLogo, { opacity: 1 });
          setShowIntro(false);
          body.style.overflow = prevOverflow;
        },
      });

      tl.set(introLogo, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        clipPath: "inset(0 100% 0 0)",
        transformOrigin: "center center",
      })
        .to(introLogo, { duration: 0.7, clipPath: "inset(0 0% 0 0)", ease: "power2.out" }, 0)
        .to(introLogo, { duration: 0.9, x: deltaX, y: deltaY, scale, ease: "power3.inOut" }, 0.8)
        .to(introLogo, { duration: 0.15, opacity: 0, ease: "power2.out" }, 1.7)
        .to(overlay, { duration: 0.3, opacity: 0, ease: "power2.out" }, 1.55);
    }, [navLogo, introLogo, overlay]);

    return () => {
      ctx.revert();
      gsap.set(navLogo, { opacity: 1 });
      body.style.overflow = prevOverflow;
    };
  }, [showIntro]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateNavbar = () => {
      if (menuOpen) {
        nav.classList.remove("navbar-scrolled");
        return;
      }
      if (window.scrollY > 50) {
        nav.classList.add("navbar-scrolled");
      } else {
        nav.classList.remove("navbar-scrolled");
      }
      setIsHeroSection(location.pathname === "/" && window.scrollY < 2);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar);
    return () => window.removeEventListener("scroll", updateNavbar);
  }, [menuOpen, location.pathname]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={`transition-colors duration-700`}>
      {showIntro && (
        <div
          ref={introOverlayRef}
          className="fixed inset-0 z-200 bg-[#090909] flex items-center justify-center"
        >
          <img
            ref={introLogoRef}
            src={logoSrc}
            alt="Lightlab"
            className="h-32 sm:h-36 w-auto"
          />
        </div>
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        id="main-nav"
        className={`fixed top-0 w-full z-100 transition-all duration-500 text-white ${isHeroSection ? "nav-over-hero" : ""}`}
      >
        <div className="max-w-360 mx-auto px-6 md:px-16 py-4 sm:py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <img
              ref={navLogoRef}
              src={isHeroSection ? "/lightlab-lightlogo.svg" : logoSrc}
              alt="Lightlab"
              className="h-14 sm:h-16 w-auto transition-all duration-300 group-hover:opacity-70"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-bold">
            <NavLink to="/services" className={desktopNavClass}>{copy.nav.services}</NavLink>
            <NavLink to="/projects" className={desktopNavClass}>{copy.nav.projects}</NavLink>
            <NavLink to="/method" className={desktopNavClass}>{copy.nav.method}</NavLink>
            <NavLink to="/about" className={desktopNavClass}>{copy.nav.about}</NavLink>
            <NavLink to="/contact" className={desktopNavClass}>{copy.nav.contact}</NavLink>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* CTA button */}
            <Link
              to="/contact"
              className="hidden lg:block px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 bg-[#FF3B3B] text-white border border-[#FF3B3B] hover:bg-[#E02E2E] hover:border-[#E02E2E]"
            >
              {copy.nav.cta}
            </Link>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center px-4 justify-center py-2 rounded-full border border-white/20 text-white text-[10px] uppercase tracking-widest transition-opacity hover:opacity-70"
              aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-90 theme-menu-overlay transition-opacity duration-500 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="h-full flex flex-col justify-between">
          <div
            className={`pt-28 px-10 flex flex-col gap-8 ${isRtl ? "text-right items-end" : "text-left items-start"}`}
          >
            {[
              { to: "/services", label: copy.nav.services },
              { to: "/projects", label: copy.nav.projects },
              { to: "/method", label: copy.nav.method },
              { to: "/about", label: copy.nav.about },
              { to: "/contact", label: copy.nav.contact },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[clamp(1.75rem,5vw,3rem)] font-bold uppercase tracking-[0.1em] leading-none transition-all duration-200 ${
                    isActive ? "opacity-100 text-[#FF3B3B]" : "opacity-40 hover:opacity-100"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className={`px-10 pb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <Link
              to="/contact"
              className="inline-flex px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#E02E2E] w-fit bg-[#FF3B3B] text-white border border-[#FF3B3B]"
            >
              {copy.nav.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom-right controls: language + scroll-to-top */}
      <div className="fixed bottom-6 right-6 z-110 flex flex-col items-end gap-2" dir="ltr">
        {/* Scroll to top */}
        {/* Scroll to top */}
        <button
          type="button"
          className={`inline-flex items-center justify-center h-9 w-9 rounded-full
            bg-white/[0.04] border border-white/[0.08] text-white/50
            transition-all duration-300 hover:border-[#FF3B3B]/50 hover:text-[#FF3B3B]
            ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FiArrowUp className="text-sm" />
        </button>

        {/* Language selector — segmented pill */}
        <div
          className="flex items-stretch rounded-full border border-white/[0.08] bg-white/[0.03] overflow-hidden"
          role="group"
          aria-label="Select language"
        >
          {(["en", "fr", "ar"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageChange(lang)}
              className={`px-3.5 py-2 text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-200
                ${language === lang
                  ? "bg-[#FF3B3B] text-white"
                  : "text-white/30 hover:text-white/60"
                }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <main id="main-content" ref={mainRef} className="pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-24 px-8 md:px-16 lg:px-24 border-t border-white/[0.07] bg-[#080808] text-white">
        <div className="max-w-360 mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-25 mb-5 font-bold">
                Digital Studio
              </p>
              <div className="mb-7">
                <img src={logoSrc} alt="Lightlab" className={`h-8 sm:h-9 w-auto ${isRtl ? "mr-auto" : ""}`} />
              </div>
              <p className="text-sm opacity-45 max-w-xs leading-[1.8]">{copy.footer.summary}</p>
            </div>
            <div className="lg:col-span-3 lg:pt-12">
              <span className="text-[10px] uppercase tracking-widest opacity-30 block mb-6 font-bold">{copy.footer.servicesTitle}</span>
              <ul className="space-y-4 text-sm">
                {copy.footer.services.map((item) => (
                  <li key={item}>
                    <Link
                      className="opacity-50 hover:opacity-100 hover:text-[#FF3B3B] transition-all duration-200"
                      to="/services"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4 lg:pt-12">
              <span className="text-[10px] uppercase tracking-widest opacity-30 block mb-6 font-bold">{copy.footer.contactTitle}</span>
              <div className="space-y-2 mb-12">
                <a
                  className="text-lg font-display hover:opacity-60 hover:text-[#FF3B3B] transition-all duration-200 block"
                  href="mailto:hello@lightlab.dev"
                >
                  {copy.footer.email}
                </a>
                <p className="text-sm opacity-30">{copy.footer.location}</p>
              </div>
              <Link
                className="theme-solid px-7 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform inline-block"
                to="/contact"
              >
                {copy.footer.cta}
              </Link>
            </div>
          </div>
          <div className={`mt-20 pt-8 border-t border-white/[0.06]
            flex justify-between items-center text-[10px] uppercase tracking-widest opacity-20
            ${isRtl ? "flex-row-reverse" : ""}`}>
            <span>
              &copy; 2026{" "}
              <span style={{ color: "var(--color-gold)" }}>Lightlab Studio</span>
            </span>
            <div className="flex gap-8">
              <a className="hover:opacity-100 transition-opacity duration-200" href="https://www.linkedin.com" target="_blank" rel="noreferrer">Linkedin</a>
              <a className="hover:opacity-100 transition-opacity duration-200" href="https://x.com" target="_blank" rel="noreferrer">X / Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
