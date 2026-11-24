/* Адаптация React Bits Circular Carousel под палитру SÉRAPHINE */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./circular.css";

export type CCItem = { src: string; alt: string; title: string; subtitle: string };

const TILES = 8;
const OVERLAP = 2.5;
const DRAG_THRESHOLD = 5;
const SPRING = 118;
const SETTLE_SPEED = 9;
const TO_RAD = Math.PI / 180;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const wrap = (deg: number) => (((deg + 180) % 360) + 360) % 360 - 180;

export function CircularCarousel({
  items,
  cardWidth = 240,
  gap = 26,
  tilt = -5,
  perspective = 2500,
  speed = 8,
  parallax = 0.25,
  depthFade = 0.55,
  fadeColor = "#F7F2EA",
  onChange,
}: {
  items: CCItem[];
  cardWidth?: number;
  gap?: number;
  tilt?: number;
  perspective?: number;
  speed?: number;
  parallax?: number;
  depthFade?: number;
  fadeColor?: string;
  onChange?: (i: number) => void;
}) {
  const count = items.length;
  const step = 360 / count;

  const [cw, setCw] = useState(cardWidth);

  useEffect(() => {
    const calc = () => {
      const target = Math.min(cardWidth * 1.75, Math.max(230, window.innerWidth * 0.27));
      setCw(Math.round(target));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [cardWidth]);

  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = cw + gap;
    return Math.max(pitch / (2 * Math.sin(Math.PI / n)), cw * 0.6);
  }, [count, cw, gap]);

  const tiles = useMemo(() => {
    const length = cw / TILES;
    const bend = radius;
    return Array.from({ length: TILES }, (_, index) => {
      const start = index * length - (index > 0 ? OVERLAP / 2 : 0);
      const end = (index + 1) * length + (index < TILES - 1 ? OVERLAP / 2 : 0);
      const center = (start + end) / 2 - cw / 2;
      const alpha = center / bend;
      const shift = bend * Math.sin(alpha);
      const sink = bend * (1 - Math.cos(alpha));
      const turn = (alpha * 180) / Math.PI;
      return {
        index,
        start,
        size: end - start,
        move: `translate3d(0px, ${shift}px, ${-sink}px) rotateX(${-turn}deg)`,
      };
    });
  }, [cw, radius]);

  const root = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const camera = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const wakeRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const state = useRef({
    angle: 0,
    velocity: 0,
    target: null as number | null,
    dir: -1,
    press: null as null | { id: number; x: number; y: number; angle: number; moved: boolean; origin: number; samples: { t: number; a: number }[] },
    drag: false,
    hover: false,
    pointer: { x: 0, y: 0, inside: false },
    yaw: 0,
    pitch: 0,
    last: 0,
    suppress: false,
  });

  const settings = useRef({ speed });
  settings.current.speed = speed;

  const reduceRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = mq.matches;
    const on = () => {
      reduceRef.current = mq.matches;
    };
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    const cam = camera.current;
    const rng = ring.current;
    if (!el || !cam || !rng) return;

    let raf = 0;
    let visible = true;

    const nearest = (a: number) => Math.round(a / step) * step;

    const advance = (dt: number) => {
      const s = state.current;
      const reduced = reduceRef.current;
      const cruise = reduced ? 0 : settings.current.speed * s.dir;
      const paused = s.hover || s.drag;

      if (s.drag) {
        s.velocity = 0;
      } else if (s.target !== null) {
        let remaining = dt;
        const damping = 2 * Math.sqrt(SPRING);
        while (remaining > 0) {
          const h = Math.min(remaining, 1 / 240);
          const accel = SPRING * (s.target - s.angle) - damping * s.velocity;
          s.velocity += accel * h;
          s.angle += s.velocity * h;
          remaining -= h;
        }
        if (Math.abs(s.target - s.angle) < 0.004 && Math.abs(s.velocity) < 0.03) {
          s.angle = s.target;
          s.velocity = 0;
          s.target = null;
        }
      } else {
        const goal = paused ? 0 : cruise;
        const tau = 0.5;
        s.velocity += (goal - s.velocity) * (1 - Math.exp(-dt / tau));
        s.angle += s.velocity * dt;
        if (Math.abs(goal) < 0.01 && Math.abs(s.velocity) < SETTLE_SPEED) {
          s.target = nearest(s.angle);
        }
      }

      const ease = 1 - Math.exp(-dt / 0.35);
      const aimYaw = s.pointer.inside ? s.pointer.x * parallax * 9 : 0;
      const aimPitch = s.pointer.inside ? -s.pointer.y * parallax * 6 : 0;
      s.yaw += (aimYaw - s.yaw) * ease;
      s.pitch += (aimPitch - s.pitch) * ease;
    };

    const render = () => {
      const s = state.current;
      cam.style.transform = `translate3d(0,0,${-radius}px) rotateX(${tilt + s.pitch}deg) rotateY(${s.yaw}deg)`;
      rng.style.transform = `rotateY(${s.angle}deg)`;

      for (let i = 0; i < count; i += 1) {
        const card = cards.current[i];
        if (!card) continue;
        const base = i * step;
        card.style.transform = `rotateY(${base}deg) translateZ(${radius}px)`;
        const world = wrap(base + s.angle);
        const facing = Math.cos(world * TO_RAD);
        const fade = depthFade * Math.pow((1 - facing) / 2, 1.25);
        card.style.setProperty("--cc-depth", fade.toFixed(3));
      }

      const idx = ((Math.round(-s.angle / step) % count) + count) % count || 0;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
        onChange?.(idx);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = state.current.last ? Math.min((now - state.current.last) / 1000, 0.05) : 1 / 60;
      state.current.last = now;
      advance(dt);
      render();
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else state.current.last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        state.current.last = 0;
      }
    });
    io.observe(el);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    document.addEventListener("visibilitychange", onVis);

    render();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count, step, radius, tilt, depthFade, parallax, onChange]);

  const focus = useCallback(
    (index: number) => {
      const s = state.current;
      let target = -index * step;
      target += 360 * Math.round((s.angle - target) / 360);
      s.target = target;
      wakeRef.current();
    },
    [step],
  );

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.suppress = false;
    if (e.button !== 0) return;
    s.press = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      angle: s.angle,
      moved: false,
      origin: 0,
      samples: [{ t: performance.now(), a: s.angle }],
    };
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (e.pointerType === "mouse" && root.current) {
      s.pointer.inside = true;
      const rect = root.current.getBoundingClientRect();
      s.pointer.x = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      s.pointer.y = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    }

    const p = s.press;
    if (!p || p.id !== e.pointerId) return;
    const delta = e.clientX - p.x;
    if (!p.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      p.moved = true;
      p.origin = delta;
      s.drag = true;
      s.target = null;
      s.velocity = 0;
      setDragging(true);
      try {
        root.current?.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    const perPixel = 180 / (Math.PI * radius);
    s.angle = p.angle + (delta - p.origin) * perPixel;
    const now = performance.now();
    p.samples.push({ t: now, a: s.angle });
    while (p.samples.length > 2 && now - p.samples[0].t > 110) p.samples.shift();
    wakeRef.current();
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    const p = s.press;
    if (!p || p.id !== e.pointerId) return;
    s.press = null;
    if (!p.moved) return;
    s.drag = false;
    setDragging(false);
    s.suppress = true;
    const first = p.samples[0];
    const last = p.samples[p.samples.length - 1];
    const span = (last.t - first.t) / 1000;
    const v = span > 0.008 ? clamp((last.a - first.a) / span, -1400, 1400) : 0;
    s.velocity = v;
    if (Math.abs(v) > 60) s.dir = Math.sign(v);
    s.target = Math.round((s.angle + v * 0.5) / step) * step;
    wakeRef.current();
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = state.current;
    if (s.suppress) {
      s.suppress = false;
      return;
    }
    const card = (e.target as HTMLElement).closest?.("[data-cc-index]") as HTMLElement | null;
    if (!card) return;
    focus(Number(card.dataset.ccIndex));
  };

  const current = items[active] ?? items[0];

  return (
    <div
      className="cc"
      ref={root}
      style={{ "--cc-fade": fadeColor, "--cc-w": `${cw}px` } as React.CSSProperties}
      data-dragging={dragging ? "" : undefined}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Работы студии"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={() => {
        state.current.hover = true;
      }}
      onPointerLeave={() => {
        state.current.hover = false;
        state.current.pointer.inside = false;
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          focus(active + 1);
          e.preventDefault();
        }
        if (e.key === "ArrowLeft") {
          focus(active - 1);
          e.preventDefault();
        }
      }}
    >
      <div className="cc__view">
        <div className="cc__stage" ref={stage} style={{ perspective: `${perspective}px` }}>
          <div className="cc__camera" ref={camera}>
            <div className="cc__ring" ref={ring}>
              {items.map((item, index) => (
                <div
                  key={item.src + index}
                  className="cc__card"
                  data-cc-index={index}
                  ref={(node) => {
                    cards.current[index] = node;
                  }}
                >
                  {tiles.map((tile) => (
                    <div
                      key={tile.index}
                      className="cc__tile"
                      style={{
                        top: -tile.size / 2,
                        height: tile.size,
                        transform: tile.move,
                      }}
                    >
                      <div className="cc__frame" style={{ height: tile.size }}>
                        <img
                          className="cc__photo"
                          src={item.src}
                          alt={item.alt}
                          draggable={false}
                          style={{ top: -tile.start, height: cw }}
                        />
                        <div className="cc__shade" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cc__caption">
        <span className="cc__title" key={current?.title}>
          {current?.title}
          <span className="cc__sub">{current?.subtitle}</span>
        </span>
        <span className="cc__count">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

