#!/usr/bin/env node
// new_project.mjs <target-dir> [--no-install]
// Scaffolds a kinetic-reel (DeepSeek 深海) project from the skill's template, installs the libraries and checks the
// toolchain. Node-only, so it runs the same on macOS, Linux and Windows.
import { cpSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync, execSync } from "node:child_process";
import { platform } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(here, "..");
const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith("--")));
const target = args.find(a => !a.startsWith("--"));
if (!target) { console.error("usage: new_project.mjs <target-dir> [--no-install]"); process.exit(1); }
const TARGET = resolve(target);
if (existsSync(join(TARGET, "reel", "reel.js")) && !flags.has("--force")) { console.error(`error: ${TARGET} already has reel/reel.js; use --force to copy the template over it`); process.exit(1); }

mkdirSync(TARGET, { recursive: true });
const SRC = join(SKILL, "template");
// copy the sources file by file: the template's node_modules, out/ and assets/ belong to it, not to the new project
const files = ["package.json", "package-lock.json", "render.mjs", "STORYBOARD.md", ".gitignore",
  "reel/reel.js", "reel/cues.js", "reel/index.html", "music/score.mjs"];
for (const f of files) if (existsSync(join(SRC, f))) {
  mkdirSync(dirname(join(TARGET, f)), { recursive: true });
  copyFileSync(join(SRC, f), join(TARGET, f));
}
mkdirSync(join(TARGET, "out", "check"), { recursive: true });
mkdirSync(join(TARGET, "assets"), { recursive: true });
mkdirSync(join(TARGET, "docs"), { recursive: true });

if (!flags.has("--no-install")) {
  console.log("== installing puppeteer-core, three");
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
console.log(`   next: cd "${TARGET}" && node music/score.mjs && node render.mjs --sheet=1,4,7,10,13,16 --cols=3 --w=480 --out=out/check/first.jpg`);
