"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import InteractivePortrait from "@/components/InteractivePortrait";
import CaseStudyVisual from "@/components/CaseStudyVisual";

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

// Fades and lifts content 32px into place as it scrolls into view. Skipped for reduced-motion users.
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -96px 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Dashed layout guide that draws itself in (clip reveal keeps the dash pattern steady),
// holds while the content resolves, then fades away. Mirrors the opening of a design-tool canvas.
const GUIDE_DRAW = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const GUIDE_FADE = { delay: 1.8, duration: 0.7, ease: "easeInOut" as const };

function GuideLine({ axis, className, delay = 0 }: { axis: "h" | "v"; className: string; delay?: number }) {
  const horizontal = axis === "h";
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute border-dashed border-white/20 ${horizontal ? "h-0 w-[100vw] border-t" : "w-0 border-l"} ${className}`}
      initial={{ clipPath: horizontal ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)", opacity: 1 }}
      animate={{ clipPath: "inset(0 0% 0% 0)", opacity: 0 }}
      transition={{ clipPath: { ...GUIDE_DRAW, delay }, opacity: GUIDE_FADE }}
    />
  );
}

// Intro entrance: a full-width guide above and below each block, then the block resolves
// from a blur into focus, one after another (top to bottom).
function Focus({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <div className="relative">
      <GuideLine axis="h" className="left-1/2 top-0 -translate-x-1/2" delay={0.1 + delay / 2} />
      <GuideLine axis="h" className="bottom-0 left-1/2 -translate-x-1/2" delay={0.2 + delay / 2} />
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.6 + delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Vertical guides along both column edges, drawn top to bottom.
function Guides() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      <GuideLine axis="v" className="-bottom-8 -top-8 left-0" />
      <GuideLine axis="v" className="-bottom-8 -top-8 right-0" delay={0.1} />
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
      <h2 className="text-[14px] font-normal leading-5 text-[#e0e0e0]">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {items.map((i) => <Chip key={i}>{i}</Chip>)}
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [copied, setCopied] = useState(false);

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
          <span className="text-white">GUNA</span>
          <span className="hidden size-1 bg-accent sm:block" />
          <span className="hidden whitespace-nowrap text-white/70 sm:block">PRODUCT DESIGNER</span>
        </div>
        <nav className="flex items-center gap-6 text-[12px] leading-4 text-white/70">
          <a href="#work" className="hover:text-white">WORK</a>
          <a href="#experience" className="hover:text-white">EXPERIENCE</a>
          <a href={RESUME_URL} className="hover:text-white">RESUME</a>
        </nav>
      </header>

      <main className="flex w-full max-w-[600px] flex-col gap-20 px-5 py-20 sm:px-0">
        {/* Intro */}
        <section className="relative flex flex-col gap-8">
          <Guides />
          <Focus>
            <InteractivePortrait />
          </Focus>
          <div className="flex flex-col gap-4">
          <Focus delay={0.12}>
          <div className="flex flex-col gap-1 text-[14px] leading-5">
            <h1 className="font-normal text-white">Hey there, I’m Guna</h1>
            <p className="text-muted">Product designer based in Bengaluru</p>
          </div>
          </Focus>
          <Focus delay={0.24}>
          <p className="text-[14px] leading-5 text-muted">
            Currently, product designer at <span className="text-white">The Binary Holdings.</span>
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
            <a href={RESUME_URL} className="flex w-40 items-center justify-center rounded-lg bg-white px-3 py-2 text-[16px] font-normal leading-5 text-black transition hover:bg-white/90">
              Resume
            </a>
            <button onClick={copyEmail} className="flex w-40 items-center justify-center gap-3 rounded-lg border border-line px-3 py-2 text-[16px] font-normal leading-5 text-white transition hover:bg-white/5">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="7" y="7" width="9" height="9" rx="2" /><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>
              {copied ? "Copied" : "Copy Email"}
            </button>
          </div>
          </Focus>
        </section>

        {/* Work */}
        <section id="work" className="flex scroll-mt-6 flex-col gap-4">
          <Reveal>
          <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-line transition-colors hover:border-white/30">
            <CaseStudyVisual />
            <div className="flex flex-col gap-4 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-2 text-[14px] leading-5">
                <h3 className="font-normal text-white">Redesigning Recotap’s ABM Platform</h3>
                <p className="text-muted">
                  Redesigned Recotap’s ABM platform from the ground up, helping drive +200% customer growth, 34+ companies in the pipeline, and ₹4.5 Cr ARR.
                </p>
              </div>
              <Link href="/case-studies/recotap" className="flex w-fit items-center gap-2 text-[14px] leading-5 text-white after:absolute after:inset-0 after:content-['']">
                view case study
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          </Reveal>
          <Reveal delay={0.2}>
          <div aria-disabled="true" className="relative flex cursor-not-allowed select-none flex-col gap-3 overflow-hidden rounded-xl border border-line">
            <div className="flex h-[272px] flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,rgba(80,70,200,0.12),transparent_70%)]">
              <img src="/assets/binary.png" alt="" className="size-12 rounded-lg object-cover opacity-50" />
              <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12px] leading-4 text-muted">
                <svg className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" /></svg>
                In progress
              </span>
            </div>
            <div className="flex flex-col gap-4 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-2 text-[14px] leading-5">
                <h3 className="font-normal text-white/70">The Binary Holdings</h3>
                <p className="min-h-10 text-muted">Case study from my current role. Locked until the work ships.</p>
              </div>
              <span className="flex w-fit items-center gap-2 text-[14px] leading-5 text-muted">
                coming soon
              </span>
            </div>
          </div>
          </Reveal>
        </section>

        {/* Experience */}
        <section id="experience" className="flex scroll-mt-6 flex-col gap-6">
          <Reveal><h2 className="text-[14px] font-normal leading-5 text-[#e0e0e0]">Experience</h2></Reveal>
          <div className="flex flex-col gap-3">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={i * 0.15}>
                {i > 0 && <div className="mb-3 h-px w-full bg-line" />}
                <div className="flex items-center justify-between gap-3 text-[14px] leading-5">
                  <div className="flex shrink-0 items-center gap-3 sm:w-[160px]">
                    <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
                      <img src={e.logo} alt="" className={`size-full ${e.company === "Recotap" ? "object-contain p-1" : "object-cover"}`} />
                    </div>
                    <span className="text-white">{e.company}</span>
                  </div>
                  <span className="hidden flex-1 text-muted sm:block">{e.role}</span>
                  <span className="w-[144px] shrink-0 whitespace-nowrap text-right text-muted">{e.period}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How I work */}
        <section className="flex flex-col gap-6 text-[14px] leading-5">
          <Reveal>
          <div className="flex flex-col gap-1">
            <h2 className="font-normal text-[#e0e0e0]">How I work</h2>
            <p className="text-muted">Three habits I keep coming back to.</p>
          </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-3">
            {habits.map((h, i) => (
              <Reveal key={h.n} delay={i * 0.2} className="flex flex-col gap-2">
                <span className="text-red">{h.n}</span>
                <h3 className="font-normal text-white">{h.t}</h3>
                <p className="text-muted">{h.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <Reveal><Box title="In my toolkit" items={toolkit} /></Reveal>
          <Reveal><Box title="Currently exploring" items={exploring} /></Reveal>
        </div>
      </main>

      <footer className="flex w-full max-w-[600px] gap-8 px-5 py-10 text-[14px] leading-5 text-muted sm:px-0">
        <a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a>
        <a href="https://linkedin.com/in/gunast" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
        <a href={RESUME_URL} className="hover:text-white">Resume</a>
      </footer>
    </div>
  );
}
