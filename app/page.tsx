"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import InteractivePortrait from "@/components/InteractivePortrait";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import RevealGrid from "@/components/RevealGrid";
import ProcessModal from "@/components/ProcessModal";
import { ThemeToggle } from "@/components/theme";

const EMAIL = "gunast96@gmail.com";
const RESUME_URL = "/resume.pdf"; // drop your resume at public/resume.pdf

const experience = [
  { company: "Binary Holdings", logo: "/assets/binary.png", role: "Product Designer", period: "July 2025 - present" },
  { company: "Recotap", logo: "/assets/recotap.png", role: "Product Designer", period: "Dec 2023 - May 2025" },
  { company: "Geekstack", logo: "/assets/geekstack.png", role: "UI/UX Designer", period: "July 2022 - Dec 2023" },
  { company: "Altisource", logo: "/assets/altisource.png", role: "Associate (Junior UX Designer)", period: "Dec 2020 - July 2022" },
];

const habits = [
  { n: "01", t: "Start with the Confusion", d: "I find where people hesitate, talk to the people closest to the problem, and map the system before I draw." },
  { n: "02", t: "Design the decision", d: "A screen should show what needs attention and what to do next, not every data point the product has." },
  { n: "03", t: "Turn work into a system", d: "Good patterns become components, so the next feature ships faster and feels like the same product." },
];

const toolkit = ["Figma", "Framer", "Claude", "After effects", "Illustrator", "Notion", "Photoshop", "Rive"];
const exploring = ["AI-assisted design", "Prototyping in code", "Motion & interaction"];

// Page-wide entrance. A dashed guide draws in above and below each block, the block resolves from
// a blur into focus, then the guides fade away. The first screen plays on load and later blocks
// play as they scroll into view. Skipped for reduced-motion users.
const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -96px 0px" };

// One shared scroll flag: the first scroll hides every guide, so none ever linger behind a moving page.
let scrolled = false;
const scrollListeners = new Set<() => void>();
function onScroll() {
  if (scrolled || window.scrollY < 4) return;
  scrolled = true;
  scrollListeners.forEach((l) => l());
}
function subscribeScroll(l: () => void) {
  if (scrollListeners.size === 0) window.addEventListener("scroll", onScroll, { passive: true });
  scrollListeners.add(l);
  return () => {
    scrollListeners.delete(l);
    if (scrollListeners.size === 0) window.removeEventListener("scroll", onScroll);
  };
}
const useScrolled = () => useSyncExternalStore(subscribeScroll, () => scrolled, () => false);

type GuideProps = { axis: "h" | "v"; className: string; delay?: number; inView?: boolean; draw?: number; hold?: number };

// The clip reveal keeps the dash pattern steady while the line grows.
function GuideLine({ axis, className, delay = 0, inView = false, draw = 0.6, hold = 1.2 }: GuideProps) {
  const horizontal = axis === "h";
  const gone = useScrolled();
  const target = { clipPath: "inset(0 0% 0% 0)", opacity: 0 };
  const trigger = inView ? { whileInView: target, viewport: IN_VIEW } : { animate: target };
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-200" style={{ opacity: gone ? 0 : 1 }}>
      <motion.div
        className={`absolute border-dashed border-fg/20 ${horizontal ? "h-0 w-[100vw] border-t" : "w-0 border-l"} ${className}`}
        initial={{ clipPath: horizontal ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)", opacity: 1 }}
        {...trigger}
        transition={{ clipPath: { duration: draw, delay, ease: EASE }, opacity: { delay: hold, duration: 0.4, ease: "easeOut" } }}
      />
    </div>
  );
}

function Focus({ children, delay = 0, inView = false, className }: { children: React.ReactNode; delay?: number; inView?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const lead = inView ? 0.2 : 0.6;
  const hold = inView ? 0.6 : 1.3;
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const trigger = inView ? { whileInView: shown, viewport: IN_VIEW } : { animate: shown };
  return (
    <div className="relative">
      <GuideLine axis="h" className="left-1/2 top-0 -translate-x-1/2" delay={delay / 2} inView={inView} hold={hold} />
      <GuideLine axis="h" className="bottom-0 left-1/2 -translate-x-1/2" delay={0.1 + delay / 2} inView={inView} hold={hold} />
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
        {...trigger}
        transition={{ duration: 0.7, delay: lead + delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Vertical guides down both column edges, drawn top to bottom across the whole page.
function Guides() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      <GuideLine axis="v" className="inset-y-0 left-5 sm:left-0" draw={1} hold={1.3} />
      <GuideLine axis="v" className="inset-y-0 right-5 sm:right-0" draw={1} delay={0.1} hold={1.3} />
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line px-3 py-2 text-[14px] leading-5 text-muted">{children}</span>
  );
}

function Box({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-line p-4">
      <h2 className="text-[14px] font-normal leading-5 text-fg-soft">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((i) => <Chip key={i}>{i}</Chip>)}
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [copied, setCopied] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const processBtn = useRef<HTMLButtonElement>(null);
  const closeProcess = useCallback(() => { setProcessOpen(false); processBtn.current?.focus(); }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center overflow-x-clip">
      {/* Nav */}
      <header className="flex w-full max-w-[600px] items-center justify-between px-5 py-6 sm:px-0">
        <div className="flex items-center gap-4 text-[12px] leading-4">
          <span className="text-fg">GUNA</span>
          <span className="hidden size-1 bg-accent sm:block" />
          <span className="hidden whitespace-nowrap text-fg/70 sm:block">PRODUCT DESIGNER</span>
        </div>
        <nav className="flex items-center gap-6 text-[12px] leading-4 text-fg/70">
          <a href="#work" className="hover:text-fg">WORK</a>
          <a href="#experience" className="hover:text-fg">EXPERIENCE</a>
          <a href={RESUME_URL} className="hover:text-fg">RESUME</a>
          <ThemeToggle />
        </nav>
      </header>

      <main className="relative flex w-full max-w-[600px] flex-col gap-20 px-5 py-20 sm:px-0">
        <Guides />
        {/* Intro */}
        <section className="relative flex flex-col gap-8">
          <RevealGrid className="-top-36 bottom-0 left-1/2 w-screen -translate-x-1/2 [-webkit-mask-image:linear-gradient(to_bottom,#000_60%,transparent)] [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]" />
          <Focus>
            <InteractivePortrait />
          </Focus>
          <div className="flex flex-col gap-4">
          <Focus delay={0.12}>
          <div className="flex flex-col gap-1 text-[14px] leading-5">
            <h1 className="font-normal text-fg">Hey there, I’m Guna</h1>
            <p className="text-muted">Product designer based in Bengaluru</p>
          </div>
          </Focus>
          <Focus delay={0.24}>
          <p className="text-[14px] leading-5 text-muted">
            Currently, product designer at <span className="text-fg">The Binary Holdings.</span>
          </p>
          </Focus>
          <Focus delay={0.36}>
          <p className="text-[14px] leading-5 text-muted">
            Previously, product designer at Recotap, redesigning its ABM platform as customers grew 200% in six months and ARR reached ₹4.5 Cr.
          </p>
          </Focus>
          </div>
          <Focus delay={0.48}>
          <div className="flex gap-4">
            <a href={RESUME_URL} className="flex w-40 items-center justify-center rounded-lg bg-fg px-3 py-2 text-[16px] font-normal leading-5 text-bg transition hover:bg-fg/90">
              Resume
            </a>
            <button onClick={copyEmail} className="flex w-40 items-center justify-center gap-3 rounded-lg border border-line px-3 py-2 text-[16px] font-normal leading-5 text-fg transition hover:bg-fg/5">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="7" y="7" width="9" height="9" rx="2" /><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>
              {copied ? "Copied" : "Copy Email"}
            </button>
          </div>
          </Focus>
        </section>

        {/* Work */}
        <section id="work" className="flex scroll-mt-6 flex-col gap-4">
          <Focus inView>
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-line transition-colors hover:border-fg/30">
            <CaseStudyVisual />
            <div className="flex flex-col gap-4 bg-fg/[0.04] p-4">
              <div className="flex flex-col gap-2 text-[14px] leading-5">
                <h3 className="font-normal text-fg">Redesigning Recotap’s ABM Platform</h3>
                <p className="text-muted">
                  Redesigned Recotap’s ABM platform from the ground up, helping drive +200% customer growth, 34+ companies in the pipeline, and ₹4.5 Cr ARR.
                </p>
              </div>
              <Link href="/case-studies/recotap" className="flex w-fit items-center gap-2 text-[14px] leading-5 text-fg after:absolute after:inset-0 after:content-['']">
                view case study
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          </Focus>
          <Focus inView delay={0.2}>
          <div aria-disabled="true" className="relative flex cursor-not-allowed select-none flex-col overflow-hidden rounded-xl border border-line">
            <div className="flex h-[272px] flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,rgba(80,70,200,0.12),transparent_70%)]">
              <img src="/assets/binary.png" alt="" className="size-12 rounded-lg object-cover opacity-50" />
              <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12px] leading-4 text-muted">
                <svg className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" /></svg>
                In progress
              </span>
            </div>
            <div className="flex flex-col gap-4 bg-fg/[0.04] p-4">
              <div className="flex flex-col gap-2 text-[14px] leading-5">
                <h3 className="font-normal text-fg/70">The Binary Holdings</h3>
                <p className="min-h-10 text-muted">Case study from my current role. Locked until the work ships.</p>
              </div>
              <span className="flex w-fit items-center gap-2 text-[14px] leading-5 text-muted">
                coming soon
              </span>
            </div>
          </div>
          </Focus>
        </section>

        {/* Experience */}
        <section id="experience" className="flex scroll-mt-6 flex-col gap-8">
          <Focus inView><h2 className="text-[14px] font-normal leading-5 text-fg-soft">Experience</h2></Focus>
          <div className="flex flex-col gap-4">
            {experience.map((e, i) => (
              <Focus inView key={e.company} delay={i * 0.15}>
                {i > 0 && <div className="mb-4 h-px w-full bg-line" />}
                <div className="flex items-center justify-between gap-3 text-[14px] leading-5">
                  <div className="flex shrink-0 items-center gap-3 sm:w-[160px]">
                    <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
                      <img src={e.logo} alt="" className={`size-full ${e.company === "Recotap" ? "object-contain p-1" : "object-cover"}`} />
                    </div>
                    <span className="text-fg">{e.company}</span>
                  </div>
                  <span className="hidden flex-1 text-muted sm:block">{e.role}</span>
                  <span className="w-[144px] shrink-0 whitespace-nowrap text-right text-muted">{e.period}</span>
                </div>
              </Focus>
            ))}
          </div>
        </section>

        {/* How I work */}
        <section className="flex flex-col gap-6 text-[14px] leading-5">
          <Focus inView>
          <div className="flex flex-col gap-1">
            <h2 className="font-normal text-fg-soft">How I work</h2>
            <p className="text-muted">Three habits I keep coming back to.</p>
          </div>
          </Focus>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-6">
            {habits.map((h, i) => (
              <Focus inView key={h.n} delay={i * 0.2} className="flex flex-col gap-2">
                <span className="text-red">{h.n}</span>
                <h3 className="font-normal text-fg">{h.t}</h3>
                <p className="text-muted">{h.d}</p>
              </Focus>
            ))}
          </div>
          <Focus inView>
            <button
              ref={processBtn} type="button" onClick={() => setProcessOpen(true)}
              className="group flex w-fit items-center gap-2 rounded-lg border border-line px-3 py-2 text-[14px] leading-5 text-fg transition hover:bg-fg/5"
            >
              See how the process really moves
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </Focus>
        </section>
        <ProcessModal open={processOpen} onClose={closeProcess} />

        <div className="flex flex-col gap-4">
          <Focus inView><Box title="In my toolkit" items={toolkit} /></Focus>
          <Focus inView><Box title="Currently exploring" items={exploring} /></Focus>
        </div>
      </main>

      <footer className="flex w-full max-w-[600px] gap-8 px-5 pb-10 text-[14px] leading-5 text-muted sm:px-0">
        <a href={`mailto:${EMAIL}`} className="hover:text-fg">{EMAIL}</a>
        <a href="https://linkedin.com/in/gunast" target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
        <a href={RESUME_URL} className="hover:text-fg">Resume</a>
      </footer>
    </div>
  );
}
