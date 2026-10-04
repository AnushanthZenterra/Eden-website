// node scripts/build-blog.mjs
// Site root is the parent of scripts/ (the Vercel project root).
// Reads content/blog/*.html, writes blog/**, sitemap.xml, llms.txt.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { build } = require("./blog-builder.js");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = path.join(root, "content/blog");
const posts = fs.readdirSync(dir).filter((f) => f.endsWith(".html")).map((f) => ({ file: f, text: fs.readFileSync(path.join(dir, f), "utf8") }));
const out = build({ posts });
fs.rmSync(path.join(root, "blog"), { recursive: true, force: true });
for (const [rel, body] of Object.entries(out)) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
}
console.log(`Built ${posts.length} source file(s) -> ${Object.keys(out).length} output file(s).`);
