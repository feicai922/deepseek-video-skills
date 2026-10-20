# 大肥鱼 · painted animation template

The project template behind the **painted-animation** skill of the DeepSeek video-skill collection. It renders a
hand-painted cartoon frame by frame in headless Chrome: every frame is a pure function of time, painted with
[p5.js](https://p5js.org) and [p5.brush](https://github.com/acamposuribe/p5.brush) watercolour, and encoded with ffmpeg.

The star is **大肥鱼**, the chibi whale-fish girl drawn for this kit (see [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md),
"大肥鱼"): big round head, deep-blue wavy hair with an ahoge, whale-fin ears, a white maid headband, a navy-and-white
maid outfit and a whale tail. She is an original fan-made character, not the DeepSeek logo and not an official mascot.

## Run it

You need Node.js, Google Chrome (or Chromium / Edge) and ffmpeg.

```bash
npm install                       # p5, p5.brush, puppeteer-core
node render.mjs --sheet=0.5,2,4,6,8,10,12 --cols=7 --w=320 --out=out/check/sheet.jpg   # look at key frames
node render.mjs --clip --out=out/video.mp4                                             # the 14 s demo
```

Open [studio.html](studio.html) in Chrome to scrub the video; add `?loop=emotions` or `?loop=views` for the model
sheets. If Chrome is not in a standard place, pass `--chrome=<path>` or set `CHROME_PATH`.

When you scaffold a project with the skill's `scripts/new_project.mjs`, the libraries are installed in the project. This
template also works in place: `studio.html` falls back to `deps/node_modules` (run `npm install` in `deps/` once).

**No working GPU?** On some GPU/driver combinations p5.brush's shader draws nothing; the engine detects that at start-up
and renders the frames flat on a 2D canvas instead, so the video still comes out (without the watercolour texture). The
studio console says `[painter] p5.brush draws nothing on this GPU/driver …` when that happens.

On Linux, `render.mjs` starts Chrome with `--no-sandbox` and also finds a Playwright Chromium. With no GPU at all, add
`--soft-gl`; on a headless Linux machine with an NVIDIA GPU, add `--gpu-angle=gl-egl` (or `vulkan`). `gpu_probe.mjs`
shows which renderer each flag set gets.

## What's here

| path | what it is |
|---|---|
| [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | the rules, the workflow and the full API. Read it first |
| [src/deepseek.js](src/deepseek.js) | 大肥鱼: key views, face, outfit, whale tail, emotions, moves, locomotion |
| [src/core.js](src/core.js) | painting, timing, motion helpers, camera, light, paper, the brush probe |
| [src/timeline.js](src/timeline.js) | shots, loops and the brush-wipe transition |
| [src/config.js](src/config.js) | length, tempo, audio |
| [src/sheets.js](src/sheets.js) | the model sheets as loops |
| [src/scenes/deepsea.js](src/scenes/deepsea.js) | the 14 s demo. **Don't copy it** |
| [src/karaoke.js](src/karaoke.js) | word-by-word karaoke for lyric videos (opt-in) |
| [render.mjs](render.mjs) | headless renderer: contact sheets, strips, crops, stills, PNG loops, MP4 |
| [docs/](docs/) | the model sheets: [emotions](docs/emotions.jpg), [views, motion and hats](docs/views.jpg). The demo film, rendered from this template, sits in the painted-animation skill's docs folder, two levels up (`docs/deepsea.mp4`, `docs/deepsea.gif`) |

## Upstream

The engine, the renderer and the structure are adapted from [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
(MIT, © John Heibel), through the [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) collection
(MIT, © tuzhechen2005). See [LICENSE](LICENSE) and the repository `NOTICE.md`; the original kit, with its Clawd
character, is kept in `../references/upstream/clawd-kit/`.
