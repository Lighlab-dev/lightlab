import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

type LayoutProps = {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
};

function Layout({ themeMode, onToggleTheme }: LayoutProps) {
  const logoSrc = themeMode === "dark" ? "/lightlab-lightlogo.svg" : "/logo.svg";
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

  const handleLanguageChange = (value: string) => {
    if (value === "fr" || value === "en" || value === "ar") {
      setLanguage(value);
    }
  };

  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    `relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:bg-current after:origin-left after:transition-transform transition-opacity ${
      isActive ? "after:scale-x-100 opacity-100" : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `transition-opacity ${isActive ? "opacity-100 underline underline-offset-8" : "hover:opacity-60"}`;

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

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, []);

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

    // Calculate center-to-center movement
    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top + startRect.height / 2;
    const endCenterX = endRect.left + endRect.width / 2;
    const endCenterY = endRect.top + endRect.height / 2;

    const deltaX = endCenterX - startCenterX;
    const deltaY = endCenterY - startCenterY;
    const scale = endRect.width / startRect.width;

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
      .to(
        introLogo,
        { duration: 0.7, clipPath: "inset(0 0% 0 0)", ease: "power2.out" },
        0,
      )
      .to(
        introLogo,
        { duration: 0.9, x: deltaX, y: deltaY, scale, ease: "power3.inOut" },
        0.8,
      )
      .to(introLogo, { duration: 0.15, opacity: 0, ease: "power2.out" }, 1.7)
      .to(overlay, { duration: 0.3, opacity: 0, ease: "power2.out" }, 1.55);

    return () => {
      tl.kill();
      gsap.set(navLogo, { opacity: 1 });
      body.style.overflow = prevOverflow;
    };
  }, [showIntro]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateNavbar = () => {
      // 🧊 Freeze + reset when menu is open
      if (menuOpen) {
        nav.classList.remove("navbar-scrolled");
        return;
      }

      // 🧭 Normal scroll behavior
      if (window.scrollY > 50) {
        nav.classList.add("navbar-scrolled");
      } else {
        nav.classList.remove("navbar-scrolled");
      }
    };

    // Run immediately (handles menu open / close)
    updateNavbar();

    // Listen to scroll
    window.addEventListener("scroll", updateNavbar);

    return () => window.removeEventListener("scroll", updateNavbar);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`transition-colors duration-700 ${isRtl ? "rtl-adapt" : ""}`}>
      {showIntro && (
        <div
          ref={introOverlayRef}
          className="fixed inset-0 z-200 theme-hero-overlay flex items-center justify-center"
        >
          <img
            ref={introLogoRef}
            src={logoSrc}
            alt="Lightlab"
            className="h-32 sm:h-36 w-auto"
          />
        </div>
      )}
      <nav
        ref={navRef}
        id="main-nav"
        className="fixed top-0 w-full z-100 transition-all duration-300"
      >
        <div className="max-w-360 mx-auto px-6 md:px-16 py-5 sm:py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              ref={navLogoRef}
              src={logoSrc}
              alt="Lightlab"
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-8  text-[10px] uppercase tracking-[0.2em] font-bold">
            <NavLink
              to="/services"
              className={desktopNavClass}
            >
              {copy.nav.services}
            </NavLink>
            <NavLink
              to="/projects"
              className={desktopNavClass}
            >
              {copy.nav.projects}
            </NavLink>
            <NavLink
              to="/method"
              className={desktopNavClass}
            >
              {copy.nav.method}
            </NavLink>
            <NavLink
              to="/about"
              className={desktopNavClass}
            >
              {copy.nav.about}
            </NavLink>
            <NavLink
              to="/contact"
              className={desktopNavClass}
            >
              {copy.nav.contact}
            </NavLink>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              className="theme-toggle"
              aria-pressed={themeMode === "dark"}
              onClick={onToggleTheme}
            >
              {themeMode === "dark" ? "Light" : "Dark"}
            </button>
            <Link
              to="/contact"
              className="hidden lg:block theme-outline px-5 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              {copy.nav.cta}
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex items-center px-5 justify-center py-2 rounded-none border border-current text-[10px] uppercase tracking-widest"
              aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-90 theme-menu-overlay transition-opacity duration-300 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className={`pt-24 px-8 flex flex-col gap-6 text-[14px] uppercase tracking-[0.2em] font-bold ${isRtl ? "text-right" : "text-left"}`}>
          <NavLink to="/services" className={mobileNavClass}>
            {copy.nav.services}
          </NavLink>
          <NavLink to="/projects" className={mobileNavClass}>
            {copy.nav.projects}
          </NavLink>
          <NavLink to="/method" className={mobileNavClass}>
            {copy.nav.method}
          </NavLink>
          <NavLink to="/about" className={mobileNavClass}>
            {copy.nav.about}
          </NavLink>
          <NavLink to="/contact" className={mobileNavClass}>
            {copy.nav.contact}
          </NavLink>
          <Link
            to="/contact"
            className="mt-2 inline-flex theme-outline px-6 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all w-fit"
          >
            {copy.nav.cta}
          </Link>
        </div>
      </div>

      <div className={`fixed bottom-6 z-110 ${isRtl ? "right-6" : "left-6"}`}>
        <div className="relative">
          <select
            aria-label="Select language"
            value={language}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className={`theme-surface backdrop-blur border border-black/10 dark:border-white/12 rounded-none appearance-none text-[11px] font-bold tracking-[0.12em] ${isRtl ? "pl-10 pr-4 text-right" : "pr-10 pl-4 text-left"} py-2.5 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-black/30 dark:focus:border-white/25`}
          >
            <option value="fr">FR · Français</option>
            <option value="en">EN · English</option>
            <option value="ar">AR · العربية</option>
          </select>
          <span
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[10px] opacity-60 ${isRtl ? "left-4" : "right-4"}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`fixed bottom-6 z-110 inline-flex items-center justify-center h-10 w-10 rounded-none theme-surface backdrop-blur border border-black/10 dark:border-white/12 transition-all ${isRtl ? "left-6" : "right-6"} ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FiArrowUp className="scroll-top-icon text-base" />
      </button>

      <main ref={mainRef} className="pt-0">
        <Outlet />
      </main>

      <footer className="py-24 px-8 md:px-16 lg:px-24 border-t border-black/8 dark:border-white/10 bg-white/[0.12] dark:bg-white/[0.01]">
        <div className="max-w-360 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <div className="mb-8">
                <img
                  src={logoSrc}
                  alt="Lightlab"
                  className="h-9 sm:h-10 w-auto"
                />
              </div>
              <p className="text-sm opacity-50 max-w-sm leading-relaxed">
                {copy.footer.summary}
              </p>
            </div>
            <div className="lg:col-span-3">
              <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-8">
                {copy.footer.servicesTitle}
              </span>
              <ul className="space-y-4 text-sm font-medium">
                {copy.footer.services.map((item) => (
                  <li key={item}>
                    <Link
                      className="hover:opacity-50 transition-opacity"
                      to="/services"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4">
              <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-8">
                {copy.footer.contactTitle}
              </span>
              <div className="space-y-1 mb-12">
                <a
                  className="text-xl font-display hover:opacity-50 transition-opacity"
                  href="mailto:hello@lightlab.dev"
                >
                  {copy.footer.email}
                </a>
                <p className="text-sm opacity-40">{copy.footer.location}</p>
              </div>
              <Link
                className="theme-solid px-8 py-4 rounded-none font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform"
                to="/contact"
              >
                {copy.footer.cta}
              </Link>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-primary/10 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-30">
            <span>(c) 2024 Lightlab Studio</span>
            <div className="flex gap-8">
              <a
                className="hover:opacity-100"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                Linkedin
              </a>
              <a
                className="hover:opacity-100"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
              >
                X / Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
