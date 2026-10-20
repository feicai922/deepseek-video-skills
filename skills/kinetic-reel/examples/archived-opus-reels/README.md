# Archived reels from the original collection

Both examples in this folder come from the project this DeepSeek edition derives from:
[opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) by **tuzhechen2005** (MIT, © 2026). They are that
author's own work and personal career material (résumé figures, employer names, contact details), so they are kept here
**unchanged and credited**, not rewritten for this edition.

- `work-reel-26/` — the 84-second "Work Reel ’26" portfolio reel (Microsoft → UW–Madison Surgery → Enterprise RAG). Read
  it for pacing, chapter emphasis, the trace finale and the transition choices inside a chapter. It will not render
  as-is from this repository: its `reel.js` imports three.js from the author's own site folder and its `score.mjs`
  reads `../kinetic/cues.js`. To run it, change those two paths to `../node_modules/three/build/three.module.js` (after
  `npm install` in a scaffolded project) and `../reel/cues.js`, and remove the personal facts from the on-screen text.
- `site-intro/` — the portfolio's entry page for that reel: the original HTML/CSS/JS with the author's name, role,
  e-mail, GitHub link and the Work Reel ’26 film paths, plus the Cloudflare Worker that adds HTTP Range support.

The DeepSeek edition's own reel is the template itself: `../../template/` (see `STORYBOARD.md` there), and its entry
page is [`../site-intro/`](../site-intro/), re-themed for the 深海 · 大肥鱼 reel.
