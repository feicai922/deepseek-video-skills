# Example: a reel as a site's entry page

How the DeepSeek 深海 reel ships as a site's entry page: the reel plays full-screen, then the end screen offers "Enter
the site" and "Watch again". The look is the reel's: abyss navy, foam, DeepSeek blue and aqua, Anton + JetBrains Mono,
HUD corners and beat-timed motion at 120 BPM — one beat is 0.5 s.

| File | What it does |
|---|---|
| `index.html` | The page: `<video>`, skip + sound pills, the end screen, the exit iris |
| `css/intro-reel.css` | The reel's look in CSS: the deep-sea palette, fonts, HUD corners, beat-timed motion |
| `js/intro-reel.js` | Autoplay with sound, then muted, then a "start" screen. Skip / Esc / M, replay, magnetic CTAs, a 2D dot-field "deep" background, the exit iris |
| `worker.js` | A Cloudflare Worker that answers Range requests with 206. Workers static assets return the whole file, which breaks seeking and Safari playback. Route only the video path through it with `assets.run_worker_first` |

To adapt it: encode the reel with the skill's `render.mjs`, plus a web copy (e.g. 1600×900 at ~1.3 Mbps and 960×540 at
~0.6 Mbps, `-movflags +faststart`), put the files under `assets/reel/` (`deepseek-reel.mp4`,
`deepseek-reel-540.mp4`, a `poster.jpg`) and set their names in `js/intro-reel.js` (`v.src`). Change the name, the
tagline and the links in `index.html`, and `HOME` in `intro-reel.js`. Self-host Anton and JetBrains Mono (both SIL
OFL, from Google Fonts) under `fonts/`, or let the CSS fall back to system fonts.

The original version of this example (with the Work Reel ’26 film and the author's own name and links) is kept, unchanged
and credited, at [`../archived-opus-reels/`](../archived-opus-reels/) in the original repository history; this folder is
the DeepSeek re-theme of it.
