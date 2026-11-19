"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

// Cursor position each photo "owns" (x: -1 left … 1 right, y: -1 up … 1 down).
// `file` / `flip` let a pose reuse another photo, mirrored (left-down is the mirror of right-down).
const POSES: readonly { id: string; file?: string; flip?: boolean; x: number; y: number }[] = [
  { id: "front", x: 0, y: 0 },
  { id: "l3q", x: -0.5, y: 0 },
  { id: "lprof", x: -1, y: 0 },
  { id: "r3q", x: 0.5, y: 0 },
  { id: "rprof", x: 1, y: 0 },
  { id: "up", x: 0, y: -0.9 },
  { id: "down", x: 0, y: 0.9 },
  { id: "lup", x: -0.75, y: -0.7 },
  { id: "rdown", x: 0.75, y: 0.7 },
  { id: "ldown", file: "rdown", flip: true, x: -0.75, y: 0.7 },
];

// With no cursor nearby (page just opened, or the pointer left the window) the face glances down and to
// the right, then comes alive as soon as the cursor moves. Touch screens have no hover, so they keep the front pose.
const IDLE = { id: "rdown", x: 0.75, y: 0.7 };
const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Props = { maxWidth?: number; base?: string };

/** One photo is visible at a time (frame swapping, like the reference), so there is never a ghost of another pose. */
export default function InteractivePortrait({ maxWidth = 240, base = "/poses" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);
  const rotY = useTransform(x, [-1, 1], [-3, 3]);
  const rotX = useTransform(y, [-1, 1], [2, -2]);
  const [active, setActive] = useState(0);
  const cur = useRef(0);
  const idle = useRef({ x: 0, y: 0 });

  // Pick the nearest photo to the smoothed cursor position; a small margin stops flicker at the borders.
  useEffect(() => {
    if (reduce) return;
    const dist = (i: number) => Math.hypot(x.get() - POSES[i].x, y.get() - POSES[i].y);
    const pick = () => {
      let n = 0;
      for (let i = 1; i < POSES.length; i++) if (dist(i) < dist(n)) n = i;
      if (n !== cur.current && dist(n) < dist(cur.current) - 0.06) { cur.current = n; setActive(n); }
    };
    const a = x.on("change", pick);
    const b = y.on("change", pick);
    return () => { a(); b(); };
  }, [reduce, x, y]);

  // Hover-capable screens start in the idle glance (set before the portrait fades in).
  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    idle.current = { x: IDLE.x, y: IDLE.y };
    mx.set(IDLE.x); my.set(IDLE.y); x.jump(IDLE.x); y.jump(IDLE.y);
    const i = POSES.findIndex((p) => p.id === IDLE.id);
    cur.current = i; setActive(i);
  }, [reduce, mx, my, x, y]);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const rx = clamp(window.innerWidth * 0.35, 180, 440);   // scales with the screen
      const ry = clamp(window.innerHeight * 0.3, 150, 300);
      const nx = (e.clientX - (r.left + r.width / 2)) / rx;
      const ny = (e.clientY - (r.top + r.height * 0.35)) / ry;
      const e2 = Math.hypot(nx, ny);
      const fall = e2 <= 1.35 ? 1 : Math.max(0, 1 - (e2 - 1.35)); // eases back to the front pose when far away
      mx.set(clamp(nx, -1, 1) * fall);
      my.set(clamp(ny, -1, 1) * fall);
    };
    const rest = () => { mx.set(idle.current.x); my.set(idle.current.y); };
    const up = (e: PointerEvent) => { if (e.pointerType !== "mouse") rest(); }; // a mouse click keeps following
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", rest);
    window.addEventListener("blur", rest);
    document.documentElement.addEventListener("mouseleave", rest);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", rest);
      window.removeEventListener("blur", rest);
      document.documentElement.removeEventListener("mouseleave", rest);
    };
  }, [reduce, mx, my]);

  return (
    <div ref={ref} className="ip" style={{ maxWidth }} role="img" aria-label="Portrait of Guna">
      <motion.div className="ip-stack" style={{ rotateX: rotX, rotateY: rotY }}>
        {POSES.map((p, i) => (
          <img key={p.id} src={`${base}/${p.file ?? p.id}.webp`} alt="" draggable={false} className="ip-img" style={{ opacity: i === active ? 1 : 0, transform: p.flip ? "scaleX(-1)" : undefined }} />
        ))}
      </motion.div>
    </div>
  );
}
