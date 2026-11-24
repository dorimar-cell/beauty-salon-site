import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowUpRight, Plus } from "lucide-react";

/* ---------------- Reveal on scroll ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "is-in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ---------------- Split text ---------------- */

export function SplitText({
  text,
  className = "",
  stagger = 45,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span className="split-word" key={`${word}-${i}`} aria-hidden="true">
          <span style={{ "--d": `${i * stagger}ms` } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ---------------- Magnetic ---------------- */

export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const move = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ display: "inline-flex", transition: "transform .45s cubic-bezier(.22,1,.36,1)" }}
    >
      {children}
    </span>
  );
}

/* ---------------- Tilt ---------------- */

export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(0)`;
  };

  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ transition: "transform .5s cubic-bezier(.22,1,.36,1)" }}
    >
      {children}
    </div>
  );
}

/* ---------------- Marquee ---------------- */

export function Marquee({
  items,
  dark = false,
}: {
  items: string[];
  dark?: boolean;
}) {
  return (
    <div className={`marquee ${dark ? "marquee--dark" : ""}`.trim()}>
      <div className="marquee__track">
        {items.map((item, i) => (
          <span className="marquee__item" key={`${item}-a-${i}`}>
            {item}
          </span>
        ))}
        {items.map((item, i) => (
          <span className="marquee__item" key={`${item}-b-${i}`} aria-hidden="true">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Photo slot ---------------- */

export function Photo({
  src,
  alt,
  tone = 1,
  monogram = "S",
}: {
  src?: string;
  alt: string;
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  monogram?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <div className={`plate-bg plate-bg--${tone}`} />
      <div className="plate-fallback" aria-hidden="true">
        {monogram}
      </div>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 2,
          }}
        />
      ) : null}
      <span className="sr-only">{alt}</span>
    </>
  );
}

/* ---------------- Accordion ---------------- */

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="acc">
      {items.map((item, i) => (
        <div className={`acc__item ${open === i ? "is-open" : ""}`} key={item.q}>
          <button
            className="acc__btn"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <span className="acc__icon" aria-hidden="true">
              <Plus size={14} strokeWidth={1.6} />
            </span>
          </button>
          <div className="acc__panel">
            <div>
              <p>{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Small bits ---------------- */

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="hero__stars" aria-label={`${count} из 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.6l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.7 5.9 21l1.3-6.7-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function ArrowLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      className="link-arrow"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={1.6} />
    </a>
  );
}

export function CheckMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12.5l5 5L20 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
