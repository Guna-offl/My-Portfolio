# Guna's portfolio — project brief for Claude Code

Next.js 15 + Tailwind + Framer Motion. Run `npm install` then `npm run dev` (http://localhost:3000).

## Workflow rules
- After each change Guna approves: commit with a clear message and push to the GitHub repo **Portfolio**.
- Edit only what is asked. Don't regenerate whole files or restyle sections that weren't mentioned.
- All spacing (padding, margin, gap, sizes) in multiples of 4.

## Pages
- `/` — homepage (`app/page.tsx`). Geist light weights, 600px column, colors in `tailwind.config.ts`.
  - Portrait (`components/InteractivePortrait.tsx`): swaps between 9 pose photos in `public/poses/` to follow the cursor. One photo visible at a time.
  - Case study card links to `/case-studies/recotap` (whole card is clickable).
  - Resume: `public/resume.pdf`. Copy Email: gunast96@gmail.com.
- `/case-studies/recotap` — Recotap case study (`app/case-studies/recotap/`), built from Figma.

## Design source: the code
Guna designs directly in code. **The code is the source of truth.** Figma is a reference only — don't re-sync from it or undo code changes to match it, unless Guna asks.
- Case study reference: https://www.figma.com/design/B09IDRBCF2IHnF553R4Drz/Untitled?node-id=7-14802 (frame "Case study", 1440 wide, 1040 content column).
- **Fonts:** **Geist** everywhere (Figma's Mabry Pro → Geist). Keep the handwriting font (Gochi Hand) where it's used: sticky notes, persona quotes, screen labels, side notes, header annotation, "Thank You…".
- Keep shared values (colors, spacing, type sizes) in one place — tailwind.config.ts for the homepage, the `:root` variables in case-study.css for the case study — so one change updates everywhere.
- **Images:** screens are placeholders until exported. Either run `FIGMA_TOKEN=... npm run assets` (scripts/fetch-figma-assets.mjs) or drop PNGs into `public/case-study/` with the names used in `page.tsx`.
- Figma MCP is limited on Guna's Starter plan — use the exact specs below instead of re-reading Figma.

### Figma specs collected (reference only — apply only if Guna asks)
**Testimonial card** (508 wide): bg rgba(255,255,255,.08); border 1px rgba(255,72,43,.12); radius 12; padding 32; column gap 32.
- Header (gap 16): avatar 87px **circle**; name Medium 24/36 white; role + company size Light 14/20 rgba(255,255,255,.6) (gap 4). Quote ("Love it") Medium 16/20 white — not handwriting.
- Body (gap 16): 5 stars #DFB300 (21.7×20.5, gap 7) + "5/5" SemiBold 16/20; question Medium 20/28 white; text Light 16/28 rgba(255,255,255,.6) with key phrase in white; tags Regular 12/20 .6, bg .04, border .5px rgba(255,255,255,.12), radius 4, padding 4/8, gap 12.
- G2 badge 56px, absolute right 23 / top −29.

**Impact** (1040): border 1px rgba(255,255,255,.2); radius 12; bg linear-gradient(108deg, rgba(3,47,83,.04) 0%, rgba(6,107,96,.12) 33%, rgba(9,167,108,.18) 99%). 2×2 cells, 136 tall, padding 32, gap 32, 1px rgba(255,255,255,.12) dividers. Icon 72×72 image. Number Medium 32/44 **#09a76c**; label Light 20/28 .6. "25M ⟶ 45M" and "5 ⟶ 1 Clicks" use a 32px arrow line with gap 12.

**Learned & faced:** header | content, gap 60. 4 items gap 24, each gap 12: title Medium 20/28 white, letter-spacing −0.2px (emoji prefix); body Light 16/28 rgba(255,255,255,.5), letter-spacing −0.16px.

**What makes Recotap different:** handwriting side note 20/32 rgba(255,255,255,.7), right-aligned, 32 above the grid. Grid bg rgba(255,255,255,.04); border 1px rgba(255,255,255,.08); radius 16; 2×2 cells 520×200, padding 32, gap 12; 1px dividers. Title Medium 20/32 white; body Light 16/28 .5. Hand-drawn arrow decoration near top right.

**Persona card** (508): padding 72 24 24; gap 32; radius 12. Avatar 128px circle, white ring, at left 24 / top −80.
- Persona 2 bg: linear-gradient(56.78deg, rgb(24,23,26) 60.08%, rgb(31,28,38) 82.13%, rgb(37,30,51) 99.07%, rgb(51,38,75) 113.97%, rgb(90,66,126) 126.23%); chip border #3c2166.
- Name Medium 32/44; role Light 16/28 .7 (gap 4); chips Regular 16/20 .7, bg .04, border .5px, radius 4, padding 4/8, gap 12; quote handwriting 24/32 white.
- Blocks gap 16; label row gap 16 with 32px icon, Medium 16/20 white underlined; items gap 8 with 4px dot, Light 16/28 .6. "How recotap helps" row gap 12.

**Product Hunt award:** handwriting line 24/32 white, 24 above. Card border 1px #ea532a; radius 12; padding 20 24; gap 16; bg linear-gradient(250.88deg, rgba(255,67,16,.2) 38.25%, rgba(231,231,233,.2) 91.28%). Medal icon 20×32; text #ea532a: "PRODUCT HUNT" Regular 12/16, "#1 Product of the Week" Medium 20/28.

**Thank You:** handwriting ~226px. "Thank" white; "You..." offset right 214 / down 178, gradient text linear-gradient(123deg, rgb(15,110,255) 11.7%, rgb(61,138,255) 74.7%). Small yellow-orange pin icon below.

**Already applied:** 80px between sections; 436px header column + 60 gap; hero → info row 40; competitor table 88 header / 60 rows / 160 columns.
