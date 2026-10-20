<div align="center">

# painted-animation · 大肥鱼

<a href="README.md"><img src="https://img.shields.io/badge/English-1E3A8A?style=for-the-badge" alt="English"></a>
<a href="README.zh-CN.md"><img src="https://img.shields.io/badge/简体中文-5B93FF?style=for-the-badge" alt="简体中文"></a>

A Claude Code skill for producing hand-painted animation and lyric videos with DeepSeek 大肥鱼.
Part of [deepseek-video-skills](../../README.md).

</div>

![大肥鱼 model sheets](docs/views.jpg)

## Overview

The skill produces complete animated videos in code: storyboarding, character animation, camera work, transitions,
music synchronisation and (opt-in) karaoke subtitles. All imagery is drawn procedurally with p5.js and the
[p5.brush](https://github.com/acamposuribe/p5.brush) watercolour library; no image generation model is involved. Every
frame is a pure function of time, rendered in headless Chrome and encoded with ffmpeg.

The cast is **大肥鱼**: the chibi whale-fish girl drawn for this kit from the collection's `角色设定.md` — a big round
head, deep-blue wavy hair with an ahoge, whale-fin ears, big blue eyes, a soft smile, a white maid headband, a navy and
white maid outfit and a whale tail whose fluke curls out beside her hip. She has 39 emotions, five drawn key views,
hats and accessories, and dance / walk / swim helpers. She is an original fan-made character, **not** the DeepSeek logo
and not an official DeepSeek mascot.

## How It Works

1. **Storyboard.** The agent writes a shot list (setting, palette, her emotion arc, transitions) and, for every shot,
   the timed "reads": what the viewer must understand, and when.
2. **Drawing.** Each shot is a JavaScript function that paints the whole frame with `paint()` / `inkLine()`. Turns go
   through drawn key views, never 3D.
3. **Review.** Contact sheets, frame strips and close-up crops are rendered in headless Chrome; the agent looks at them
   and revises until every shot reads.
4. **Output.** Frames render in parallel (or in one stream) and ffmpeg encodes the MP4, muxing in audio if given.

## Characteristics

- **One drawing function per character,** so the design is identical in every shot (`deepseeker(x, y, u, options)`).
- **Frame-accurate timing:** moods change through `emotions()`, which builds in anticipation, a take and overshoot;
  actions can be aligned to beats or to sung syllables.
- **Locomotion made for her:** `swim()` glides with the tail leading, `hopWalk()` waddles on the side fins.
- **Animation principles built in:** `jump`, `take`, `spring`, `ring`, arcs, smears on fast turns.
- **Works where p5.brush doesn't:** if the GPU/driver renders p5.brush's shader as nothing, the engine detects it and
  paints the same frames flat on a 2D canvas, so a video still comes out.

## Example: "The last deep-sea light" (14 s)

<p align="center"><img src="docs/deepsea.gif" width="640" alt="大肥鱼 and the little deep-sea light"></p>

The template's demo, `template/src/scenes/deepsea.js`: 大肥鱼 drifts down to a tiny light trapped in a shell on the
seabed, gets the idea, dives and chomps the shell open, and the little fish swims free, circles her whale tail and
rides on her headdress as she climbs from the abyss into pale gold water. It exercises the acted emotion timeline, a
drawn glide, a take, a chomp, a brush wipe and an iris. The encoded film is
[docs/deepsea.mp4](docs/deepsea.mp4); the storyboard is in the guide's "About the demo".

## Requirements

- Claude Code (or any agent that can read this Skill and run commands) with access to a coding-capable DeepSeek model
- Node.js, Google Chrome (or Chromium / Edge), ffmpeg
- Python 3 with numpy (tempo detection only)

## Installation

See the [collection README](../../README.md#installation). As a Claude Code plugin:

```
/plugin marketplace add <you>/deepseek-video-skills
/plugin install painted-animation@deepseek-video-skills
```

or copy/link this folder into `~/.claude/skills/painted-animation` (or `.claude/skills/` in a project).

## Usage

Describe the video, for example:

> Make a 15-second hand-painted animation of 大肥鱼 trying to catch a bubble.

> Make a lyric video for this song (with the audio and an LRC file attached).

or invoke it directly with `/painted-animation`. It scaffolds a project, presents a storyboard, builds and reviews each
shot, and writes `out/video.mp4`.

## Directory Structure

| path | description |
|---|---|
| `SKILL.md` | the workflow and rules the agent follows |
| `template/` | the engine: `src/deepseek.js` (大肥鱼), `src/core.js`, `src/timeline.js`, `src/sheets.js`, `src/karaoke.js`, the demo, `render.mjs`, `studio.html`, `ANIMATION_GUIDE.md` |
| `scripts/new_project.mjs` | project scaffolding and toolchain check (Node, cross-platform) |
| `scripts/beat_grid.py` | tempo and beat-phase detection, with LRC alignment |
| `references/music-video.md` | guidelines for music videos and longer productions |
| `references/upstream/clawd-kit/` | the untouched original kit this engine derives from (John Heibel, MIT), for provenance |
| `docs/` | model sheets, the demo film and its GIF |

## Acknowledgements

The engine, the renderer and the general method are adapted from [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
by John Heibel (MIT, © 2026; see `template/LICENSE`) and his [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo).
This DeepSeek edition is derived from the [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills)
collection by tuzhechen2005 (MIT, © 2026). The 大肥鱼 character module, palette, demo, model sheets and documentation of
this edition are new work for this edition. The original kit, unchanged, is kept in `references/upstream/clawd-kit/`.

## License

MIT. See the repository [LICENSE](../../LICENSE) and [NOTICE.md](../../NOTICE.md).
