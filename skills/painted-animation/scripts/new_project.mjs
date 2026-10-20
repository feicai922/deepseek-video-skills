#!/usr/bin/env node
// new_project.mjs <target-dir> [--keep-demo] [--no-install]
// Scaffolds a painted-animation (大肥鱼) project from the skill's template, installs the browser libraries and checks the
// toolchain. Node-only, so it runs the same on macOS, Linux and Windows.
//
//   node <skill>/scripts/new_project.mjs my-video                    # a clean project, demo unhooked
//   node <skill>/scripts/new_project.mjs demo --keep-demo            # keep the 14 s 大肥鱼 demo hooked up
//   node <skill>/scripts/new_project.mjs my-video --no-install       # copy only (run npm install yourself)
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync, execSync } from "node:child_process";
import { homedir, platform } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(here, "..");
const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith("--")));
const target = args.find(a => !a.startsWith("--"));
if (!target) { console.error("usage: new_project.mjs <target-dir> [--keep-demo] [--no-install]"); process.exit(1); }
const TARGET = resolve(target);
if (existsSync(join(TARGET, "studio.html")) && !flags.has("--force")) { console.error(`error: ${TARGET} already has a studio.html; use --force to copy the template over it`); process.exit(1); }

mkdirSync(TARGET, { recursive: true });
cpSync(join(SKILL, "template"), TARGET, {
  recursive: true,
  filter: (src) => !/[\\/](node_modules|deps|out)([\\/]|$)/.test(src.slice(SKILL.length)),
});
mkdirSync(join(TARGET, "assets"), { recursive: true });
mkdirSync(join(TARGET, "out", "check"), { recursive: true });

// The demo is an example, not a template: unless asked, unhook it so the new video starts clean.
const studio = join(TARGET, "studio.html");
if (!flags.has("--keep-demo")) {
  const html = readFileSync(studio, "utf8").replace('<script src="src/scenes/deepsea.js"></script>', '<!-- <script src="src/scenes/deepsea.js"></script>  (the example only) -->');
  writeFileSync(studio, html);
}

if (!flags.has("--no-install")) {
  console.log("== installing p5, p5.brush, puppeteer-core");
  const npm = "npm";
  // Windows: npm.cmd needs a shell (Node 20+ refuses to spawn .cmd files otherwise); a fixed command string, no user input
  const r = spawnSync("npm install --no-audit --no-fund", { cwd: TARGET, stdio: "inherit", shell: true, windowsHide: true });   // one fixed command string: nothing from argv is interpolated
  if (r.error) console.log("!! could not start npm:", r.error.message);
  if (r.status !== 0) console.log("!! npm install failed; render.mjs cannot run without it. Run `npm install` in the project and check your network / npm registry.");
}

console.log("== toolchain");
try { console.log("node  ", execSync("node -v").toString().trim()); } catch { console.log("MISSING: node"); }
let ff = false;
try { execSync("ffmpeg -version", { stdio: "ignore" }); ff = true; } catch { /* not on PATH */ }
console.log(ff ? "ffmpeg ok" : "MISSING: ffmpeg (brew install ffmpeg / winget install Gyan.FFmpeg / apt install ffmpeg)");
const chrome = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].find(p => p && existsSync(p));
console.log(chrome ? `chrome ${chrome}` : "MISSING: Chrome/Chromium/Edge (install one, or pass --chrome=<path> to render.mjs)");
console.log(`== ready: ${TARGET}`);
console.log(`   next: cd "${TARGET}" && node render.mjs --sheet=0.5,2,4 --cols=3 --w=480 --out=out/check/first.jpg`);
