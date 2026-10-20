# Verification record

What was actually run while rebuilding this edition, on one Windows 11 machine (Node 24.18, Edge/Chrome headless,
ffmpeg 9.0.2), and what was not.

## Environment of the test machine

| tool | status |
|---|---|
| Node.js | v24.18.0 ✔ |
| Google Chrome / Chromium | not installed |
| Microsoft Edge | **used instead** (the renderers accept it as a Chrome fallback) |
| ffmpeg / ffprobe | installed locally for the tests, not on the global PATH (`brew install ffmpeg` / `winget install Gyan.FFmpeg`) |
| Python 3 + numpy | 3.14 + numpy 2.3.5 ✔ |
| GPU | NVIDIA T400 (D3D11), but **p5.brush's shader draws nothing** on this machine (see below) |

## painted-animation

| test | result |
|---|---|
| `node scripts/new_project.mjs <dir> --keep-demo` (clean project, npm install, toolchain check) | ✔ |
| `node render.mjs --sheet=0.5,4,9,13 --cols=4` in the fresh project | ✔ 4 frames, 4–8 ms/frame |
| `node render.mjs --clip --out=out/video.mp4` in the fresh project | ✔ 336 frames, 14.0 s MP4 |
| `node render.mjs --loop=views / --loop=emotions --sheet` (model sheets) | ✔, the images in `docs/` come from these |
| `node render.mjs --frames --workers=4 && --encode` (template demo) | ✔ 336 frames, 14.0 s `docs/deepsea.mp4` (1280×720 copy kept) |
| every emotion's `mouth()` (39) called in the page | ✔ no throws |
| p5.brush probe | **fails on this machine**: the upstream kit (ClaudeAnimationBase, unmodified) rendered the same flat frames, so it is the environment, not this edition. The flat 2D fallback renders the film anyway; the watercolour look needs a machine where the probe passes (`?brush=on` forces it) |
| `scripts/beat_grid.py` on a synthetic 112 BPM click track | ✔ reports 112.35 BPM |

## kinetic-reel

| test | result |
|---|---|
| `node scripts/new_project.mjs <dir>` (clean project) | ✔ |
| `node music/score.mjs` + loudnorm encode | ✔ 19 s score, peak 0.88 normalised |
| `node render.mjs --sheet=…` / `--stills` in the project and the template | ✔ 1–100 ms/frame (WebGL layers) |
| `node render.mjs --frames --workers=4 && --encode` (template) | ✔ 540 frames, 18.0 s MP4 with AAC audio |
| `node render.mjs --encode` with no score present | ✔ warns and encodes silent |
| site-intro page in headless Chrome | ✔ reel loads (18 s), plays, end screen appears, links out; the only console errors are the site's self-hosted font files, which are not included |
| kinetic `render.mjs --page`, `--frames-dir`, `--fps` flags | ✔ (the renderer was ported from the painted one) |

## Not tested / not verifiable here

- **Real watercolour output.** p5.brush cannot paint on this GPU/driver, so the brush look itself was only exercised on
  the upstream kit's probe (which fails identically). The fallback output is what the reference films here show.
- **The score by ear.** The synthesizer's output was checked by peak/loudness and a spectrogram only; nobody listened.
- **macOS and Linux.** The scripts are Node-only and cross-platform, and `render.mjs` keeps its Chrome discovery for
  all three systems, but they were not run there.
- **Claude Code `/plugin` installation.** The manifest follows the Claude Code marketplace schema, but installing it
  through `/plugin` was not exercised (no Claude Code on the test machine).
- **The archived originals.** They are not part of this edition's render path and were not re-run.
