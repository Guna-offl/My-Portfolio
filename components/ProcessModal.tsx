"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * "How the process really moves": a hand-drawn flowchart that opens in a modal. A clean linear process
 * draws itself ("how I thought it worked"), then colour-coded layers of real work pile on top of it
 * ("how it actually works"). Content comes from the Recotap case study.
 */

type Layer = "base" | "red" | "violet" | "blue" | "teal" | "yellow" | "pink";
const COLORS: Record<Layer, string> = {
  base: "#9aa4b2", red: "#eb4736", violet: "#a78bfa", blue: "#6d8dff", teal: "#3ddbc0", yellow: "#ffd24a", pink: "#ff6ad5",
};
// When each layer starts, in seconds from opening.
const START: Record<Layer, number> = { base: 0.2, red: 3.8, violet: 5.2, blue: 6.2, teal: 8.0, yellow: 9.6, pink: 11.0 };
const DIM_AT = 3.3; // the clean chain greys out as the real work arrives

type NodeD = { id: string; layer: Layer; x: number; y: number; w: number; lines: string[]; at: number };
type EdgeD = { layer: Layer; d: string; at: number; dur?: number };

const NODES: NodeD[] = [
  { id: "brief", layer: "base", x: 70, y: 300, w: 84, lines: ["Brief"], at: 0 },
  { id: "under", layer: "base", x: 215, y: 300, w: 124, lines: ["Understanding", "the brief"], at: 0.32 },
  { id: "research", layer: "base", x: 385, y: 300, w: 100, lines: ["Research"], at: 0.64 },
  { id: "iter", layer: "base", x: 555, y: 300, w: 100, lines: ["Iterations"], at: 0.96 },
  { id: "final", layer: "base", x: 725, y: 300, w: 110, lines: ["Final design"], at: 1.28 },
  { id: "ship", layer: "base", x: 890, y: 300, w: 80, lines: ["Ship"], at: 1.6 },

  { id: "r1", layer: "red", x: 135, y: 190, w: 116, lines: ["Mapping the", "whole system"], at: 0 },
  { id: "r2", layer: "red", x: 320, y: 105, w: 140, lines: ["Talking to CEO,", "CS & support"], at: 0.7 },
  { id: "v1", layer: "violet", x: 300, y: 205, w: 120, lines: ["Framing the", "real problem"], at: 0 },
  { id: "b1", layer: "blue", x: 190, y: 430, w: 112, lines: ["Funnel &", "drop-off data"], at: 0 },
  { id: "b2", layer: "blue", x: 190, y: 505, w: 140, lines: ["Client interviews"], at: 0.5 },
  { id: "b3", layer: "blue", x: 390, y: 455, w: 104, lines: ["Competitor", "teardown"], at: 0.9 },
  { id: "b4", layer: "blue", x: 560, y: 480, w: 160, lines: ["Prototyping in code"], at: 1.3 },
  { id: "t1", layer: "teal", x: 470, y: 200, w: 112, lines: ["PM + CTO sync"], at: 0 },
  { id: "t2", layer: "teal", x: 650, y: 175, w: 104, lines: ["Backend", "constraints"], at: 0.6 },
  { id: "t3", layer: "teal", x: 830, y: 150, w: 128, lines: ["Dev feasibility", "check"], at: 1.1 },
  { id: "y1", layer: "yellow", x: 745, y: 430, w: 124, lines: ["Design system", "buy-in"], at: 0 },
  { id: "y2", layer: "yellow", x: 780, y: 530, w: 108, lines: ["Scope", "trade-offs"], at: 0.6 },
  { id: "p1", layer: "pink", x: 905, y: 420, w: 100, lines: ["Launch", "with CS"], at: 0 },
  { id: "p2", layer: "pink", x: 905, y: 525, w: 112, lines: ["Measuring", "drop-off"], at: 0.6 },
];

const EDGES: EdgeD[] = [
  { layer: "base", d: "M 112 300 L 153 300", at: 0.2 },
  { layer: "base", d: "M 277 300 L 335 300", at: 0.52 },
  { layer: "base", d: "M 435 300 L 505 300", at: 0.84 },
  { layer: "base", d: "M 605 300 L 670 300", at: 1.16 },
  { layer: "base", d: "M 780 300 L 850 300", at: 1.48 },

  { layer: "red", d: "M 205 276 C 190 255 165 240 152 214", at: 0.25 },
  { layer: "red", d: "M 190 175 C 215 150 225 125 250 112", at: 0.55 },
  { layer: "red", d: "M 390 100 C 520 70 585 150 556 278", at: 1.1, dur: 0.9 },
  { layer: "violet", d: "M 320 130 L 306 180", at: 0.2 },
  { layer: "violet", d: "M 195 198 L 238 205", at: 0.4 },
  { layer: "violet", d: "M 305 230 C 320 250 350 265 372 279", at: 0.6 },
  { layer: "blue", d: "M 360 324 C 330 360 260 380 228 406", at: 0.2 },
  { layer: "blue", d: "M 190 454 L 190 485", at: 0.45 },
  { layer: "blue", d: "M 262 502 C 295 500 310 485 338 466", at: 0.8 },
  { layer: "blue", d: "M 405 324 C 410 360 400 395 395 431", at: 1.0 },
  { layer: "blue", d: "M 432 438 C 480 400 520 360 538 324", at: 1.2 },
  { layer: "blue", d: "M 548 324 C 540 380 540 420 552 459", at: 1.5 },
  { layer: "blue", d: "M 572 459 C 585 420 585 380 572 324", at: 1.7 },
  { layer: "teal", d: "M 420 280 C 415 250 430 225 445 222", at: 0.2 },
  { layer: "teal", d: "M 495 221 C 520 240 535 258 545 279", at: 0.4 },
  { layer: "teal", d: "M 528 198 C 555 190 575 185 600 181", at: 0.55 },
  { layer: "teal", d: "M 655 200 C 680 225 705 250 716 278", at: 0.95 },
  { layer: "teal", d: "M 700 165 C 735 150 750 148 766 150", at: 1.05 },
  { layer: "teal", d: "M 825 175 C 820 220 775 250 748 279", at: 1.4 },
  { layer: "yellow", d: "M 592 322 C 610 370 650 400 685 418", at: 0.2 },
  { layer: "yellow", d: "M 745 406 L 740 324", at: 0.4 },
  { layer: "yellow", d: "M 770 454 C 775 480 778 495 780 506", at: 0.75 },
  { layer: "pink", d: "M 890 322 C 898 350 902 370 902 391", at: 0.2 },
  { layer: "pink", d: "M 903 444 L 903 498", at: 0.5 },
  { layer: "pink", d: "M 880 548 C 700 604 100 604 70 330", at: 0.85, dur: 1.2 },
];

const at = (layer: Layer, offset: number, instant: boolean) => (instant ? 0 : START[layer] + offset);

function Edge({ e, instant, color }: { e: EdgeD; instant: boolean; color: string }) {
  const ref = useRef<SVGPathElement>(null);
  const [head, setHead] = useState<string | null>(null);
  const delay = at(e.layer, e.at, instant), dur = instant ? 0 : e.dur ?? 0.45;
  useLayoutEffect(() => {
    const p = ref.current;
    if (!p) return;
    const len = p.getTotalLength(), end = p.getPointAtLength(len), back = p.getPointAtLength(Math.max(0, len - 6));
    setHead(`translate(${end.x} ${end.y}) rotate(${(Math.atan2(end.y - back.y, end.x - back.x) * 180) / Math.PI})`);
  }, [e.d]);
  return (
    <>
      <motion.path
        ref={ref} d={e.d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round"
        initial={{ pathLength: instant ? 1 : 0, opacity: instant ? 1 : 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { delay, duration: dur, ease: "easeInOut" }, opacity: { delay, duration: 0.05 } }}
      />
      {head && (
        <g transform={head}>
          <motion.path
            d="M -9 -5.5 L 0 0 L -9 5.5" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            initial={{ opacity: instant ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + dur, duration: 0.1 }}
          />
        </g>
      )}
    </>
  );
}

const nodeH = (n: NodeD) => (n.lines.length > 1 ? 48 : 40);
const pop = (delay: number, instant: boolean) => ({
  initial: { opacity: instant ? 1 : 0, scale: instant ? 1 : 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  style: { transformBox: "fill-box" as const, transformOrigin: "center" },
});

function Diagram({ instant }: { instant: boolean }) {
  const [phase, setPhase] = useState<1 | 2>(instant ? 2 : 1);
  useEffect(() => {
    if (instant) return;
    const t = setTimeout(() => setPhase(2), DIM_AT * 1000);
    return () => clearTimeout(t);
  }, [instant]);

  const dim = (layer: Layer) => (layer === "base" ? { initial: { opacity: 1 }, animate: { opacity: 0.38 }, transition: { delay: instant ? 0 : DIM_AT, duration: instant ? 0 : 0.6 } } : {});

  return (
    <div className="relative min-w-[760px]">
      <div className="absolute left-0 top-0 h-5 text-[12px] leading-5 text-muted">
        <AnimatePresence mode="wait">
          <motion.span key={phase} className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {phase === 1 ? "how I thought it worked" : "how it actually works"}
          </motion.span>
        </AnimatePresence>
      </div>
      <svg viewBox="0 0 1000 620" className="block h-auto w-full" role="img" aria-label="A clean six-step process, then the real work layered on top: stakeholder conversations, data and research, PM and engineering checks, design system buy-in, launch support and feedback loops.">
        <defs>
          <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
          </filter>
        </defs>
        <g filter="url(#rough)">
          {(["base", "red", "violet", "blue", "teal", "yellow", "pink"] as Layer[]).map((layer) => (
            <motion.g key={layer} {...dim(layer)}>
              {EDGES.filter((e) => e.layer === layer).map((e) => <Edge key={e.d} e={e} instant={instant} color={COLORS[e.layer]} />)}
              {NODES.filter((n) => n.layer === layer).map((n) => {
                const h = nodeH(n);
                return (
                  <motion.rect
                    key={n.id} x={n.x - n.w / 2} y={n.y - h / 2} width={n.w} height={h} rx={h / 2}
                    fill={layer === "base" ? "none" : `${COLORS[layer]}22`} stroke={COLORS[layer]} strokeWidth={1.8}
                    {...pop(at(layer, n.at, instant), instant)}
                  />
                );
              })}
            </motion.g>
          ))}
        </g>
        <g>
          {NODES.map((n) => (
            <motion.g key={n.id} {...(n.layer === "base" ? dim("base") : {})}>
              <motion.text
                textAnchor="middle" fontSize={13} fontWeight={400} style={{ fill: n.layer === "base" ? "rgb(var(--c-fg-soft))" : "rgb(var(--c-fg))" }}
                initial={{ opacity: instant ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: at(n.layer, n.at, instant) + 0.1, duration: 0.3 }}
              >
                {n.lines.map((line, i) => (
                  <tspan key={line} x={n.x} y={n.y + (n.lines.length > 1 ? (i === 0 ? -3 : 13) : 4.5)}>{line}</tspan>
                ))}
              </motion.text>
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function ProcessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", key); };
  }, [open, onClose]);

  const pill = "rounded-full border border-line px-3 py-1 text-[12px] leading-4 text-fg transition hover:bg-fg/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="process-title" onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-[1040px] flex-col gap-4 overflow-hidden rounded-xl border border-line bg-card p-4 sm:p-6"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="process-title" className="text-[14px] font-normal leading-5 text-fg">How I work</h2>
              <div className="flex gap-2">
                <button type="button" className={pill} onClick={() => setRun((r) => r + 1)}>Replay</button>
                <button type="button" ref={closeRef} className={pill} onClick={onClose}>✕ Close</button>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto">
              <Diagram key={run} instant={!!reduce} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
