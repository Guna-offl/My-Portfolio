# Guna — Portfolio (Next.js + Tailwind + Framer Motion)

```bash
npm install
npm run dev        # http://localhost:3000   ·   case study: /case-studies/recotap
```

## Case study images
The Recotap case study uses screens exported from Figma. Run once (and again whenever the design changes):

```bash
FIGMA_TOKEN=your_personal_access_token npm run assets
```
Create the token in Figma → Settings → Security → Personal access tokens (read-only file content).
Images are saved to `public/case-study/`.

Everything else is local: resume at `public/resume.pdf`, logos in `public/assets`, portrait poses in `public/poses`.
Deploy: push to GitHub and import in Vercel.
