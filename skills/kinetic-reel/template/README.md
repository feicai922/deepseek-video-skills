# 深海 · 大肥鱼 · kinetic reel template

The project template behind the **kinetic-reel** skill of the DeepSeek video-skill collection: a DeepSeek "shallow
water" motion reel, rendered frame by frame in headless Chrome with canvas 2D + three.js + a WebGL post pass, scored by
a Node synthesizer, and encoded with ffmpeg.

## Run it

```bash
npm install
node music/score.mjs                                   # the score (music/score.wav)
ffmpeg -y -i music/score.wav -af "highpass=f=30,equalizer=f=250:t=q:w=1:g=-2,loudnorm=I=-14:TP=-1.2:LRA=8" -c:a aac -b:a 192k assets/score.m4a
node render.mjs --sheet=1,4,7,10,13,16 --cols=3 --w=480 --out=out/check/sheet.jpg     # look at key frames
node render.mjs --frames --workers=4 && node render.mjs --encode --audio=assets/score.m4a --out=out/reel.mp4
node render.mjs --clip --out=out/clip.mp4              # or straight to MP4 in one worker
```

Open `reel/index.html` in Chrome to scrub the reel (`?t=6.5` jumps to a time). Without a score in `assets/`, `--encode`
warns and writes a silent film.

| path | what it is |
|---|---|
| `reel/cues.js` | the timeline: scene starts, hits, chapters, duration |
| `reel/reel.js` | the page: WebGL layers, 2D type, post pass, scenes, transitions |
| `music/score.mjs` | the synthesizer (reads `cues.js`) |
| `render.mjs` | headless renderer: sheets, strips, stills, frames, MP4 |
| `STORYBOARD.md` | how the bundled 18 s film times itself |
| `docs/` | a contact sheet of the film (`deepseek-reel-sheet.jpg`) and its preview GIF |

The engine, the renderer and the general approach are adapted from [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
(MIT, © John Heibel) through [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) (MIT,
© tuzhechen2005). See the repository `NOTICE.md`.
