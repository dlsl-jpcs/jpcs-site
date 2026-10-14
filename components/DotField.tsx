import { useEffect, useRef, memo } from "react";

import "./DotField.css";

const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  [key: string]: unknown;
}

const DotField = memo(
  ({
    dotRadius = 1.5,
    dotSpacing = 14,
    cursorRadius = 500,
    cursorForce = 0.1,
    bulgeOnly = true,
    bulgeStrength = 67,
    glowRadius = 160,
    sparkle = false,
    waveAmplitude = 0,
    gradientFrom = "rgba(168, 85, 247, 0.35)",
    gradientTo = "rgba(180, 151, 207, 0.25)",
    glowColor = "#120F17",
    ...rest
  }: DotFieldProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const glowRef = useRef<SVGCircleElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const mouseRef = useRef({
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      speed: 0,
    });
    const rafRef = useRef<number | null>(null);
    const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });
    const glowOpacity = useRef(0);
    const engagement = useRef(0);
    const propsRef = useRef<Record<string, unknown>>({});
    propsRef.current = {
      dotRadius,
      dotSpacing,
      cursorRadius,
      cursorForce,
      bulgeOnly,
      bulgeStrength,
      sparkle,
      waveAmplitude,
      gradientFrom,
      gradientTo,
    };
    const rebuildRef = useRef<(() => void) | null>(null);
    const glowIdRef = useRef(
      `dot-field-glow-${Math.random().toString(36).slice(2, 9)}`,
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      const glowEl = glowRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let resizeTimer: ReturnType<typeof setTimeout>;

      function resize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(doResize, 100);
      }

      function doResize() {
        const rect = canvas!.parentElement!.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        canvas!.style.width = `${w}px`;
        canvas!.style.height = `${h}px`;
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        sizeRef.current = {
          w,
          h,
          offsetX: rect.left + window.scrollX,
          offsetY: rect.top + window.scrollY,
        };

        buildDots(w, h);
        // Resizing clears the canvas; redraw if the loop is parked (reduced motion).
        if (rafRef.current === 0 && onScreen) rafRef.current = requestAnimationFrame(tick);
      }

      function buildDots(w: number, h: number) {
        const p = propsRef.current;
        const step = (p.dotRadius as number) + (p.dotSpacing as number);
        const cols = Math.floor(w / step);
        const rows = Math.floor(h / step);
        const padX = (w % step) / 2;
        const padY = (h % step) / 2;
        const dots: Dot[] = new Array(rows * cols);
        let idx = 0;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const ax = padX + col * step + step / 2;
            const ay = padY + row * step + step / 2;
            dots[idx++] = {
              ax,
              ay,
              sx: ax,
              sy: ay,
              vx: 0,
              vy: 0,
              x: ax,
              y: ay,
            };
          }
        }
        dotsRef.current = dots;
      }

      function onMouseMove(e: MouseEvent) {
        const s = sizeRef.current;
        mouseRef.current.x = e.pageX - s.offsetX;
        mouseRef.current.y = e.pageY - s.offsetY;
      }

      function updateMouseSpeed() {
        const m = mouseRef.current;
        const dx = m.prevX - m.x;
        const dy = m.prevY - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m.speed += (dist - m.speed) * 0.5;
        if (m.speed < 0.001) m.speed = 0;
        m.prevX = m.x;
        m.prevY = m.y;
      }

      let onScreen = true;
      const speedInterval = setInterval(() => {
        if (onScreen) updateMouseSpeed();
      }, 20);

      let frameCount = 0;
      // ~7,000 dots are redrawn per frame, so draw at 30fps. Easing below is scaled by the
      // real elapsed time, so the motion looks the same as it did at 60fps.
      const FRAME_MS = 1000 / 30;
      let lastDraw = 0;
      let gradient: CanvasGradient | null = null;
      let gradientKey = "";
      const ease = (k: number, dt: number) => 1 - Math.pow(1 - k, dt / (1000 / 60));
      const glowVisible = glowEl !== null && glowColor !== "transparent";
      // Only animate while the field is on screen, and hold it still for reduced motion.
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      function tick(now: number) {
        if (!onScreen) {
          rafRef.current = 0;
          return;
        }
        const dt = now - lastDraw;
        if (dt < FRAME_MS - 2 && frameCount > 0) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        lastDraw = now;
        if (!reducedMotion.matches || frameCount === 0) frameCount++;
        const dots = dotsRef.current;
        const m = mouseRef.current;
        const { w, h } = sizeRef.current;
        const p = propsRef.current;
        const len = dots.length;
        const t = now * 0.0012;
        const step = Math.min(dt, 100);

        const targetEngagement = Math.min(m.speed / 5, 1);
        engagement.current += (targetEngagement - engagement.current) * ease(0.06, step);
        if (engagement.current < 0.001) engagement.current = 0;
        const eng = engagement.current;

        glowOpacity.current += (eng - glowOpacity.current) * ease(0.08, step);

        if (glowVisible && glowEl) {
          glowEl.setAttribute("cx", String(m.x));
          glowEl.setAttribute("cy", String(m.y));
          glowEl.style.opacity = String(glowOpacity.current);
        }

        ctx!.clearRect(0, 0, w, h);

        const key = `${w}x${h}|${p.gradientFrom}|${p.gradientTo}`;
        if (!gradient || key !== gradientKey) {
          gradient = ctx!.createLinearGradient(0, 0, w, h);
          gradient.addColorStop(0, p.gradientFrom as string);
          gradient.addColorStop(1, p.gradientTo as string);
          gradientKey = key;
        }
        ctx!.fillStyle = gradient;
        const pull = ease(0.15, step);
        const settle = ease(0.1, step);

        const cr = p.cursorRadius as number;
        const crSq = cr * cr;
        const rad = (p.dotRadius as number) / 2;
        const diameter = rad * 2;
        const isBulge = p.bulgeOnly as boolean;

        ctx!.beginPath();

        for (let i = 0; i < len; i++) {
          const d = dots[i];
          const dx = m.x - d.ax;
          const dy = m.y - d.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < crSq && eng > 0.01) {
            const dist = Math.sqrt(distSq);
            if (isBulge) {
              const t = 1 - dist / cr;
              const push = t * t * (p.bulgeStrength as number) * eng;
              const angle = Math.atan2(dy, dx);
              d.sx += (d.ax - Math.cos(angle) * push - d.sx) * pull;
              d.sy += (d.ay - Math.sin(angle) * push - d.sy) * pull;
            } else {
              const angle = Math.atan2(dy, dx);
              const move = (500 / dist) * (m.speed * (p.cursorForce as number));
              d.vx += Math.cos(angle) * -move;
              d.vy += Math.sin(angle) * -move;
            }
          } else if (isBulge) {
            d.sx += (d.ax - d.sx) * settle;
            d.sy += (d.ay - d.sy) * settle;
          }

          if (!isBulge) {
            d.vx *= 0.9;
            d.vy *= 0.9;
            d.x = d.ax + d.vx;
            d.y = d.ay + d.vy;
            d.sx += (d.x - d.sx) * settle;
            d.sy += (d.y - d.sy) * settle;
          }

          let drawX = d.sx;
          let drawY = d.sy;
          if ((p.waveAmplitude as number) > 0) {
            drawY += Math.sin(d.ax * 0.03 + t) * (p.waveAmplitude as number);
            drawX +=
              Math.cos(d.ay * 0.03 + t * 0.7) *
              (p.waveAmplitude as number) *
              0.5;
          }

          // Dots are under 2px, so a square reads as a dot; far cheaper to rasterize than an
          // anti-aliased arc, which matters with thousands of them per frame. Sparkles stay round.
          if (p.sparkle && (((i * 2654435761) ^ (frameCount >> 2)) >>> 0) % 100 < 3) {
            ctx!.moveTo(drawX + rad * 1.8, drawY);
            ctx!.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
          } else {
            ctx!.rect(drawX - rad, drawY - rad, diameter, diameter);
          }
        }

        ctx!.fill();

        rafRef.current = reducedMotion.matches ? 0 : requestAnimationFrame(tick);
      }

      const visibility = new IntersectionObserver(([entry]) => {
        const wasOnScreen = onScreen;
        onScreen = entry.isIntersecting;
        if (onScreen && !wasOnScreen && !rafRef.current) {
          rafRef.current = requestAnimationFrame(tick);
        }
      });
      visibility.observe(canvas!);

      doResize();
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      rafRef.current = requestAnimationFrame(tick);

      rebuildRef.current = () => {
        const { w, h } = sizeRef.current;
        if (w > 0 && h > 0) buildDots(w, h);
      };

      return () => {
        visibility.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        clearInterval(speedInterval);
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouseMove);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      rebuildRef.current?.();
    }, [dotRadius, dotSpacing]);

    return (
      <div className="dot-field-container" {...rest}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <radialGradient id={glowIdRef.current}>
              <stop offset="0%" stopColor={glowColor} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle
            ref={glowRef}
            cx="-9999"
            cy="-9999"
            r={glowRadius}
            fill={`url(#${glowIdRef.current})`}
            style={{ opacity: 0, willChange: "opacity" }}
          />
        </svg>
      </div>
    );
  },
);

DotField.displayName = "DotField";

export default DotField;
