// Exports the case study screens from Figma into public/case-study/*.png
// Usage:  FIGMA_TOKEN=your_personal_access_token npm run assets
// Create a token at Figma → Settings → Security → Personal access tokens (scope: file content, read-only).
import { mkdir, writeFile } from "node:fs/promises";

const FILE = "B09IDRBCF2IHnF553R4Drz";
const NODES = {
  "hero": "7:29630",
  "ss1": "7:15039",
  "ss2": "7:15041",
  "ss3": "7:15043",
  "ss4": "7:15045",
  "ss5": "7:15047",
  "signin": "7:29686",
  "getstarted": "7:29688",
  "ad1": "7:29690",
  "ad2": "7:16661",
  "ad3": "7:29694",
  "ad4": "7:29702",
  "ad5": "7:29698",
  "ad6": "7:29700",
  "camp1": "7:29704",
  "camp2": "7:29706",
  "camp3": "7:29708",
  "account": "7:29710",
  "persona1": "7:15270",
  "persona2": "7:15348",
  "testi1": "7:19142",
  "testi2": "7:19173",
  "g2": "7:19167"
};
const SCALE = 1.5;
const token = process.env.FIGMA_TOKEN;
if (!token) { console.error("Set FIGMA_TOKEN first (see the comment at the top of this file)."); process.exit(1); }

await mkdir("public/case-study", { recursive: true });
const ids = Object.values(NODES).join(",");
const res = await fetch(`https://api.figma.com/v1/images/${FILE}?ids=${encodeURIComponent(ids)}&format=png&scale=${SCALE}`, { headers: { "X-Figma-Token": token } });
if (!res.ok) { console.error("Figma API error", res.status, await res.text()); process.exit(1); }
const { images } = await res.json();

for (const [name, id] of Object.entries(NODES)) {
  const url = images[id];
  if (!url) { console.warn("skipped (no render):", name, id); continue; }
  const img = await fetch(url);
  await writeFile(`public/case-study/${name}.png`, Buffer.from(await img.arrayBuffer()));
  console.log("saved", name);
}
