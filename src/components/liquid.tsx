import { useEffect, useRef } from "react";

type RGB = [number, number, number];

/** Палитра движения: бронза → тёмная бронза → шалфей → пудра → шампань. */
const PALETTE: RGB[] = [
  [168, 126, 82],
  [125, 88, 54],
  [140, 154, 130],
  [201, 163, 154],
  [217, 196, 169],
  [176, 143, 106],
];

const PAPER: RGB = [247, 242, 234];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Приводим цвет фото к нашей гамме: слегка обесцвечиваем и подмешиваем бумагу. */
function tone(c: RGB): RGB {
  const gray = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  const desat = mix(c, [gray, gray, gray], 0.28);
  return mix(desat, PAPER, 0.18);
}

const cache = new WeakMap<HTMLImageElement, RGB | null>();

function imageColor(img: HTMLImageElement): RGB | null {
  if (cache.has(img)) return cache.get(img) ?? null;
  if (!img.complete || !img.naturalWidth) return null;
  try {
    const c = document.createElement("canvas");
    c.width = 18;
    c.height = 18;
    const g = c.getContext("2d");
    if (!g) return null;
    g.drawImage(img, 0, 0, 18, 18);
    const d = g.getImageData(0, 0, 18, 18).data;
    let r = 0;
    let gr = 0;
    let b = 0;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 140) continue;
      r += d[i];
      gr += d[i + 1];
      b += d[i + 2];
      n += 1;
    }
    if (!n) return null;
    const res: RGB = [Math.round(r / n), Math.round(gr / n), Math.round(b / n)];
    cache.set(img, res);
    return res;
  } catch {
    cache.set(img, null);
    return null;
  }
}

export function LiquidPointer() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    let traveled = 0;
    let colorIdx = 0;
    let fromImage: RGB | null = null;
    let current: RGB = PALETTE[0];

    type Blob = { x: number; y: number; r: number; life: number; c: RGB };
    const blobs: Blob[] = [];

    const holders =
      ".plate, .master, .work__frame, .hero__arch, .space__frame, .case-hero__frame, .ring-carousel__card, .carousel__card";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const el = e.target as HTMLElement | null;

      const holder = el?.closest(holders) as HTMLElement | null;
      const img = holder?.querySelector("img") as HTMLImageElement | null;
      fromImage = img ? imageColor(img) : null;

      const dx = mx - lx;
      const dy = my - ly;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 9) {
        traveled += dist;
        if (traveled > 110) {
          traveled = 0;
          colorIdx = (colorIdx + 1) % PALETTE.length;
        }

        // блики крупнее на 35%, цвет фиксируется в момент рождения
        blobs.push({ x: mx, y: my, r: 8, life: 1, c: { ...current } });
        if (blobs.length > 84) blobs.shift();
        lx = mx;
        ly = my;
      }
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const want: RGB = fromImage ? tone(fromImage) : PALETTE[colorIdx];
      current = mix(current, want, 0.055);

      const haloR = 162; // +35%
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, haloR);
      halo.addColorStop(0, `rgba(${current[0]},${current[1]},${current[2]},0.05)`);
      halo.addColorStop(1, `rgba(${current[0]},${current[1]},${current[2]},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mx, my, haloR, 0, Math.PI * 2);
      ctx.fill();

      for (let i = blobs.length - 1; i >= 0; i -= 1) {
        const b = blobs[i];
        b.r += 2.0;
        b.life -= 0.012;
        if (b.life <= 0) {
          blobs.splice(i, 1);
          continue;
        }
        const c = b.c;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.042 * b.life})`);
        g.addColorStop(0.65, `rgba(${c[0]},${c[1]},${c[2]},${0.026 * b.life})`);
        g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="liquid" ref={ref} aria-hidden="true" />;
}
