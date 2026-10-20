# Third-party and provenance notices

This repository (`deepseek-video-skills`) is a **DeepSeek-themed derivative** of the MIT-licensed project
[opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) by **tuzhechen2005** (© 2026). Its skills,
engine, renderers, documentation and examples are adapted from that project; the character design, palettes, demo
videos, examples and the English/Chinese documentation were rewritten for this fork. See `LICENSE` for the full terms.

## Upstream of opus-video-skills

The painted-animation engine, its renderer and its general approach are adapted from
[JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) by **John Heibel** (MIT; see
`skills/painted-animation/template/LICENSE` and `skills/painted-animation/references/upstream/clawd-kit/LICENSE`), which
generalises his 156-second music video [I'm Upping My P(doom)](https://github.com/JohnHeibel/PDoomVideo). The
kinetic-reel renderer is derived from the same kit. An unmodified copy of that original kit (including its Clawd
character and model sheets) is kept in `skills/painted-animation/references/upstream/` so the original work and its
credit stay intact.

## Third-party libraries

| library | licence | used for |
|---|---|---|
| [p5.js](https://p5js.org) | LGPL-2.1 | the painted-animation canvas |
| [p5.brush](https://github.com/acamposuribe/p5.brush) | MIT | watercolour and ink brushes |
| [three.js](https://threejs.org) | MIT | the kinetic-reel WebGL layers |
| [Puppeteer](https://pptr.dev) (puppeteer-core) | Apache-2.0 | headless rendering |
| [ffmpeg](https://ffmpeg.org) | LGPL/GPL (as built) | encoding |

## Fonts

The renderers fetch fonts from Google Fonts at render time: Anton, Archivo Black, Instrument Serif, JetBrains Mono and
Noto Sans SC (SIL Open Font License), Permanent Marker (Apache-2.0), Shantell Sans (SIL OFL) and Ma Shan Zheng (SIL OFL).

## Brand and characters

"DeepSeek" is a trademark of its owner. The 大肥鱼 (the little whale) in this repository is an **original fan-made cartoon
character** built from the brief in `角色设定.md`; it is not the DeepSeek logo, not an official DeepSeek mascot, and this
repository is not an official DeepSeek product. Claude and Claude Code are trademarks of Anthropic; they appear here
only where the Claude Code plugin/Skill mechanism is named as the compatibility layer this repository installs into.
