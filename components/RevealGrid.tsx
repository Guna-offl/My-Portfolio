"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const CELL = 32;    // grid pitch, px (multiple of 4)
const REACH = 160;  // radius of the revealed circle, px
const ACCENT = "147,255,59";

/**
 * Background grid that is invisible until the cursor arrives: only a soft circle of it shows around
 * the pointer, which trails the cursor with a little easing and fades out when the cursor leaves.
 * The loop sleeps once everything has settled, so an idle page costs nothing.
 */
export default function RevealGrid({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (reduce || !cv || !ctx) return;
    let w = 0, h = 0, raf = 0, last = 0, k = 0, sx = 0, sy = 0, cx = -9999, cy = -9999, inside = false;

    const draw = (dt: number): boolean => {
      const r = cv.getBoundingClientRect();
      const px = cx - r.left, py = cy - r.top;
      const was = inside;
      inside = px >= 0 && py >= 0 && px <= w && py <= h;
      if (inside) {
        if (!was) { sx = px; sy = py; }                      // snap in, so the circle never sweeps across from afar
        const follow = 1 - Math.exp(-dt * 11);
        sx += (px - sx) * follow; sy += (py - sy) * follow;
      }
      k += ((inside ? 1 : 0) - k) * (1 - Math.exp(-dt * (inside ? 10 : 4)));

      ctx.clearRect(0, 0, w, h);
      if (k > 0.004) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y <= h; y += CELL) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.strokeStyle = `rgba(${ACCENT},0.42)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalCompositeOperation = "destination-in"; // keep the lines only inside a soft circle
        const mask = ctx.createRadialGradient(sx, sy, 0, sx, sy, REACH);
        mask.addColorStop(0, `rgba(0,0,0,${k})`); mask.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mask; ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 36);
        glow.addColorStop(0, `rgba(${ACCENT},${0.3 * k})`); glow.addColorStop(1, `rgba(${ACCENT},0)`);
        ctx.fillStyle = glow; ctx.fillRect(sx - 36, sy - 36, 72, 72);
      }
      return k > 0.004 || (inside && Math.abs(cx - r.left - sx) + Math.abs(cy - r.top - sy) > 0.5);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      raf = draw(dt) ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(() => { size(); wake(); });
    ro.observe(cv);
    const move = (e: PointerEvent) => { cx = e.clientX; cy = e.clientY; wake(); };
    const leave = () => { cx = cy = -9999; wake(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("blur", leave);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("blur", leave);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [reduce]);

  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
