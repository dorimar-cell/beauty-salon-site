import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CONTACTS, NAV } from "../data";
import { Magnetic } from "./ui";

/* ---------------- smooth scroll ---------------- */

export function useSmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.6,
        smoothWheel: true,
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
}

/* ---------------- scroll progress ---------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/* ---------------- custom cursor ---------------- */

export function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const lbl = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement | null;
      const labelled = target?.closest("[data-cursor]") as HTMLElement | null;
      const interactive = target?.closest("a, button, .service-card, .plate, .master, .work");
      const dark = Boolean(target?.closest(".reviews, .booking, .menu, .preloader, .footer"));

      const isDrag = labelled?.dataset.cursor === "drag";
      ring.current?.classList.toggle("is-active", Boolean(interactive));
      ring.current?.classList.toggle("is-drag", isDrag);
      ring.current?.classList.toggle("is-light", dark);
      dot.current?.classList.toggle("is-light", dark);
      if (lbl.current) lbl.current.textContent = isDrag ? "тянуть" : "";
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor cursor--ring" ref={ring} aria-hidden="true">
        <span ref={lbl} />
      </div>
      <div className="cursor cursor--dot" ref={dot} aria-hidden="true" />
    </>
  );
}

/* ---------------- liquid pointer ---------------- */

export function LiquidCursor() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    root.classList.add("has-liquid");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mx = -999;
    let my = -999;
    let lx = 0;
    let ly = 0;
    let dark = false;

    type Blob = { x: number; y: number; r: number; life: number; dark: boolean };
    const blobs: Blob[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = e.target as HTMLElement | null;
      dark = Boolean(el?.closest(".reviews, .booking, .footer, .menu, .preloader"));

      const dx = mx - lx;
      const dy = my - ly;
      if (dx * dx + dy * dy > 90) {
        blobs.push({ x: mx, y: my, r: 6, life: 1, dark });
        if (blobs.length > 64) blobs.shift();
        lx = mx;
        ly = my;
      }
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
      const hc = dark ? "247,242,234" : "168,126,82";
      halo.addColorStop(0, `rgba(${hc},0.05)`);
      halo.addColorStop(1, `rgba(${hc},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mx, my, 120, 0, Math.PI * 2);
      ctx.fill();

      for (let i = blobs.length - 1; i >= 0; i -= 1) {
        const b = blobs[i];
        b.r += 1.5;
        b.life -= 0.013;
        if (b.life <= 0) {
          blobs.splice(i, 1);
          continue;
        }
        const col = b.dark ? "247,242,234" : "168,126,82";
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${col},${0.045 * b.life})`);
        g.addColorStop(0.65, `rgba(${col},${0.028 * b.life})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mx > -100) {
        ctx.fillStyle = dark ? "rgba(247,242,234,0.6)" : "rgba(23,19,15,0.42)";
        ctx.beginPath();
        ctx.arc(mx, my, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      root.classList.remove("has-liquid");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="liquid" ref={ref} aria-hidden="true" />;
}

/* ---------------- ambient color field ---------------- */

export function AmbientBackground() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? window.scrollY / max : 0;
      const mode = t > 0.86 ? "ink" : t > 0.6 ? "bronze" : t > 0.3 ? "sage" : "paper";
      if (root.dataset.amb !== mode) root.dataset.amb = mode;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="ambient-veil" aria-hidden="true" />
    </>
  );
}

/* ---------------- preloader ---------------- */

export function Preloader() {
  const [done, setDone] = useState(() => {
    try {
      return sessionStorage.getItem("seraphine-preloaded") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem("seraphine-preloaded", "1");
      } catch {
        /* ignore */
      }
    }, 1150);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader__inner">
            <span className="preloader__mark">SÉRAPHINE</span>
            <div className="preloader__bar">
              <span />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- header ---------------- */

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <>
      <header className={`header ${solid || open ? "is-solid" : ""}`}>
        <div className="wrap header__row">
          <Link to="/" className="brand" aria-label="Séraphine — на главную">
            SÉRAPHINE <small>studio</small>
          </Link>

          <nav className="nav" aria-label="Основная навигация">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav__link ${isActive && !item.to.includes("#") ? "is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <a className="header__phone" href={CONTACTS.phoneHref}>
              {CONTACTS.phone}
            </a>
            <Magnetic>
              <Link to="/contacts" className="btn btn--sm">
                <span>Записаться</span>
              </Link>
            </Magnetic>
            <button
              className={`burger ${open ? "is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="menu__links" aria-label="Мобильная навигация">
          {NAV.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="menu__link"
              style={{ transitionDelay: `${0.12 + i * 0.06}s` }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="menu__meta">
          <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          <span>{CONTACTS.address}</span>
          <span>{CONTACTS.hours}</span>
        </div>
      </div>
    </>
  );
}

/* ---------------- footer ---------------- */

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <Link to="/" className="footer__brand" aria-label="Séraphine">
            SÉRAPHINE
          </Link>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>Студия</h4>
              <Link to="/services">Услуги</Link>
              <Link to="/masters">Мастера</Link>
              <Link to="/contacts">Контакты</Link>
            </div>
            <div className="footer__col">
              <h4>Связь</h4>
              <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
              <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
              <a href={CONTACTS.socials[0].href} target="_blank" rel="noopener noreferrer">
                Telegram <ArrowUpRight size={12} style={{ display: "inline" }} />
              </a>
            </div>
            <div className="footer__col">
              <h4>Адрес</h4>
              <p>{CONTACTS.address}</p>
              <p>{CONTACTS.metro}</p>
              <p>{CONTACTS.hours}</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Séraphine Studio. Все права защищены.</span>
          <span>Сделано с уважением к тишине и деталям.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- layout ---------------- */

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        К содержанию
      </a>
      <AmbientBackground />
      <LiquidCursor />
      <Preloader />
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
