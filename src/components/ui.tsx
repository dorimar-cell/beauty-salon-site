import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";

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
        setSeen(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
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
          className="photo-img"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
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

/* ---------------- Drag gallery ---------------- */

export function DragGallery({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const vp = useRef<HTMLDivElement | null>(null);
  const tr = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const view = vp.current;
    const track = tr.current;
    if (!view || !track) return;

    let x = 0;
    let startX = 0;
    let startOffset = 0;
    let down = false;
    let moved = false;
    let vel = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;

    const min = () => Math.min(0, view.clientWidth - track.scrollWidth);
    const clamp = (v: number) => Math.max(min(), Math.min(0, v));
    const apply = (v: number) => {
      track.style.transform = `translate3d(${v}px,0,0)`;
    };

    const downH = (e: PointerEvent) => {
      down = true;
      moved = false;
      startX = e.clientX;
      startOffset = x;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      cancelAnimationFrame(raf);
      view.setPointerCapture(e.pointerId);
      setDragging(true);
    };

    const moveH = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      x = clamp(startOffset + dx);
      apply(x);
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vel = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX;
      lastT = now;
    };

    const upH = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      setDragging(false);
      try {
        view.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const step = () => {
        if (Math.abs(vel) < 0.4) return;
        x = clamp(x + vel);
        apply(x);
        vel *= 0.94;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const clickH = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    view.addEventListener("pointerdown", downH);
    view.addEventListener("pointermove", moveH);
    view.addEventListener("pointerup", upH);
    view.addEventListener("pointercancel", upH);
    view.addEventListener("click", clickH, true);

    return () => {
      cancelAnimationFrame(raf);
      view.removeEventListener("pointerdown", downH);
      view.removeEventListener("pointermove", moveH);
      view.removeEventListener("pointerup", upH);
      view.removeEventListener("pointercancel", upH);
      view.removeEventListener("click", clickH, true);
    };
  }, []);

  return (
    <div
      className={`gallery__viewport ${dragging ? "is-dragging" : ""} ${className}`.trim()}
      ref={vp}
      data-cursor="drag"
    >
      <div className="gallery__track" ref={tr}>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Custom select ---------------- */

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder = "Выберите",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="field">
      <label>{label}</label>
      <div className="select" ref={box}>
        <button
          type="button"
          className="select__btn"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span style={value ? undefined : { color: "rgba(247,242,234,.32)" }}>
            {value || placeholder}
          </span>
          <ChevronDown size={14} strokeWidth={1.6} />
        </button>
        {open ? (
          <ul className="select__list" role="listbox">
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === o}
                  className={`select__opt ${value === o ? "is-selected" : ""}`}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                >
                  {o}
                  <Check size={13} strokeWidth={1.8} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <span className="field__error">{error}</span>
    </div>
  );
}

/* ---------------- Custom date picker ---------------- */

const MONTHS_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const MONTHS_NOM = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const DOW = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const box = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const label2 = value
    ? `${Number(value.slice(8, 10))} ${MONTHS_GEN[Number(value.slice(5, 7)) - 1]} ${value.slice(0, 4)}`
    : "Выберите дату";

  return (
    <div className="field">
      <label>{label}</label>
      <div className="cal" ref={box}>
        <button
          type="button"
          className="cal__btn"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={value ? "" : "is-empty"}>{label2}</span>
          <ChevronDown size={14} strokeWidth={1.6} />
        </button>

        {open ? (
          <div className="cal__pop">
            <div className="cal__head">
              <button
                type="button"
                className="cal__nav"
                aria-label="Предыдущий месяц"
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
                }
              >
                <ChevronLeft size={14} />
              </button>
              <span className="cal__title">
                {MONTHS_NOM[view.getMonth()]} {view.getFullYear()}
              </span>
              <button
                type="button"
                className="cal__nav"
                aria-label="Следующий месяц"
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
                }
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="cal__grid">
              {DOW.map((d) => (
                <span className="cal__dow" key={d}>
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <span className="cal__day is-empty" key={`e-${i}`} />;
                const date = new Date(view.getFullYear(), view.getMonth(), day);
                const iso = toISO(date);
                const past = date < today;
                return (
                  <button
                    type="button"
                    key={iso}
                    className={`cal__day ${iso === value ? "is-sel" : ""} ${
                      iso === toISO(today) ? "is-today" : ""
                    }`}
                    disabled={past}
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <span className="field__error">{error}</span>
    </div>
  );
}
