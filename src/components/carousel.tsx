import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "./ui";

type Item = { src: string; label: string; meta: string; tone?: 1 | 2 | 3 | 4 | 5 | 6 };

/**
 * 3D ring с автодрифтом: кольцо едет само, драг подталкивает,
 * после отпускания — мягкий догон и возврат к дрифту.
 */
export function CircularCarousel({ items }: { items: Item[] }) {
  const n = items.length;
  const step = 360 / n;

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const ring = useRef<HTMLDivElement | null>(null);
  const offset = useRef(0);
  const target = useRef(0);
  const drag = useRef({ down: false, startX: 0, startOffset: 0, moved: false, lastX: 0, lastT: 0, vel: 0 });
  const paused = useRef(false);
  const resumeAt = useRef(0);
  const lastIdx = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    let last = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      const canDrift = !reduce && !drag.current.down && !paused.current && now > resumeAt.current;

      if (canDrift) {
        offset.current += (5.5 / step) * dt; // ~5.5°/сек
        target.current = offset.current;
      } else {
        const diff = target.current - offset.current;
        if (Math.abs(diff) > 0.0004) {
          offset.current += diff * 0.07;
        }
      }

      if (ring.current) {
        ring.current.style.transform = `rotateX(-5deg) rotateY(${-offset.current * step}deg)`;
      }

      const idx = ((Math.round(offset.current) % n) + n) % n;
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        setIndex(idx);
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [n, step]);

  const focusCard = (i: number) => {
    const base = Math.round(target.current);
    target.current = i + Math.round((base - i) / n) * n;
    resumeAt.current = performance.now() + 2600;
    lastIdx.current = ((i % n) + n) % n;
    setIndex(lastIdx.current);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      down: true,
      startX: e.clientX,
      startOffset: offset.current,
      moved: false,
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const width = ring.current?.getBoundingClientRect().width || 260;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;

    offset.current = drag.current.startOffset - dx / (width * 0.9);
    target.current = offset.current;

    const now = performance.now();
    const dt = Math.max(1, now - drag.current.lastT);
    drag.current.vel = ((e.clientX - drag.current.lastX) / dt) * 6;
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    target.current = Math.round(offset.current - drag.current.vel);
    resumeAt.current = performance.now() + 2200;
  };

  return (
    <div>
      <div
        className={`ring-carousel ${dragging ? "is-dragging" : ""}`}
        data-cursor="drag"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => {
          paused.current = true;
        }}
        onPointerLeave={() => {
          paused.current = false;
          resumeAt.current = performance.now() + 900;
        }}
      >
        <div className="ring-carousel__ring" ref={ring}>
          {items.map((it, i) => (
            <div
              key={`${it.label}-${i}`}
              className={`ring-carousel__card ${i === index ? "is-active" : ""}`}
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--radius))` }}
              onClick={() => {
                if (!drag.current.moved) focusCard(i);
              }}
              role="button"
              tabIndex={0}
              aria-label={it.label}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") focusCard(i);
              }}
            >
              <Photo src={it.src} alt={it.label} tone={it.tone ?? 1} monogram="S" />
              <div className="ring-carousel__cap">
                <span>{it.label}</span>
                <span>{it.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ring-carousel__controls">
        <button className="carousel__btn" onClick={() => focusCard(index - 1)} aria-label="Назад">
          <ChevronLeft size={16} strokeWidth={1.6} />
        </button>
        <span className="carousel__count">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button className="carousel__btn" onClick={() => focusCard(index + 1)} aria-label="Вперёд">
          <ChevronRight size={16} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
