// Publishes the tenant bootstrap config into `public/` so `next build`
// emits it to `out/config.json`, where the browser fetches it at runtime.
//
// `configuration/config.json` is the canonical SOURCE in the repo.
// `public/config.json` is generated (gitignored) and overwritten on every
// build. On the deployed host you edit `out/config.json` to re-point the
// tenant without a rebuild.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "configuration", "config.json");
const dest = join(root, "public", "config.json");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-config] ${src} -> ${dest}`);
