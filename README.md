<div align="center">

# deepseek-video-skills · 深海 · 大肥鱼

<a href="README.md"><img src="https://img.shields.io/badge/English-050D24?style=for-the-badge" alt="English"></a>
<a href="README.zh-CN.md"><img src="https://img.shields.io/badge/简体中文-2B59D8?style=for-the-badge" alt="简体中文"></a>

DeepSeek-themed video-making skills for Claude Code and compatible agents — 大肥鱼, the fat fish girl, one skill per
visual style, every frame and every note generated in code.

</div>

## Overview

Each skill teaches a coding agent to produce a complete video in one visual style: storyboarding, animation, review,
music and the final encode. All imagery and all music are generated procedurally in code; no image, video or audio
generation model is involved. Every frame is a pure function of time, rendered in headless Chrome and encoded with
ffmpeg.

This repository is a **DeepSeek edition** of [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) by
tuzhechen2005 (MIT). The engine, renderers, workflow and structure come from that project; the character, the palettes,
the demos, the examples and the documentation here were rebuilt for the DeepSeek 大肥鱼 theme. 大肥鱼 is an original
fan-made character (not the DeepSeek logo, not an official mascot).

## Styles

| Skill | Style | Typical use |
|---|---|---|
| [painted-animation](skills/painted-animation/) | Hand-painted watercolour and ink cartoon starring 大肥鱼, with character acting | Animated shorts, music videos, lyric videos with karaoke |
| [kinetic-reel](skills/kinetic-reel/) | DeepSeek 深海 kinetic typography: condensed display type, HUD micro-type, WebGL water layers | Product films, showreels, site intros |

### painted-animation

![painted-animation](skills/painted-animation/docs/views.jpg)

Draws every shot with p5.js and the p5.brush watercolour library. 大肥鱼 acts through 39 emotions, five drawn key views,
a whale tail that keeps its own beat, and hats and accessories. Example: "The last deep-sea light", a 14-second short
([MP4](skills/painted-animation/docs/deepsea.mp4)) in which she frees a tiny fish trapped in a shell and carries it up
to the surface. [Documentation](skills/painted-animation/README.md).

### The character (大肥鱼)

She is drawn entirely in code, in one file:
[`skills/painted-animation/template/src/deepseek.js`](skills/painted-animation/template/src/deepseek.js) —
`deepseeker(x, y, u, opts)` with five key views (front, 3/4, side, 3/4 back, back), 39 emotions, 12 hats, glasses, bag and
a whale tail that keeps its own beat. The design brief is [`角色设定.md`](角色设定.md); the finished model sheet and
character sheet are [`大肥鱼角色设定表.png`](大肥鱼角色设定表.png) and [`大肥鱼.png`](大肥鱼.png).

### kinetic-reel

![kinetic-reel](skills/kinetic-reel/docs/deepseek-reel.gif)

Combines a 2D type canvas with three.js layers (a particle "deep", caustic "currents", a fish mark bent from a drop of
light, a particle school) and a WebGL post pass. Shots are joined by shape-continuity transitions, and the score is
synthesized from the same timeline as the picture. Example: 深海 · 大肥鱼, an 18-second DeepSeek film
([MP4](skills/kinetic-reel/docs/deepseek-reel.mp4)). [Documentation](skills/kinetic-reel/README.md).

## Requirements

- Claude Code, or any agent that can read a Skill and run shell commands, backed by a coding-capable model
  (DeepSeek V4 and later work well; the skills are model-agnostic prompts plus Node/JS code)
- Node.js, Google Chrome (or Chromium / Edge), ffmpeg
- Python 3 with numpy (painted-animation tempo detection only)

On some GPU/driver combinations p5.brush's shader paints nothing; painted-animation detects that at start-up and renders
flat frames instead, so a video still comes out (without the watercolour texture).

## Installation

**As Claude Code plugins (recommended).** This is a Claude Code plugin marketplace: the skills install through Claude
Code's `/plugin` mechanism, which is a Claude Code feature, not something DeepSeek publishes. In Claude Code:

```
/plugin marketplace add feicai922/deepseek-video-skills
/plugin install painted-animation@deepseek-video-skills
/plugin install kinetic-reel@deepseek-video-skills
```

Install either skill or both; `/plugin update` fetches new versions. (The marketplace add points at the repository this
edition lives in; the plugin names are `painted-animation` and `kinetic-reel`, the marketplace name is
`deepseek-video-skills`.)

**As personal skills (any compatible agent).** Clone the repository once and link or copy the skill folders:

```bash
git clone https://github.com/feicai922/deepseek-video-skills ~/deepseek-video-skills
ln -s ~/deepseek-video-skills/skills/painted-animation ~/.claude/skills/painted-animation    # Claude Code
ln -s ~/deepseek-video-skills/skills/kinetic-reel ~/.claude/skills/kinetic-reel
# or copy them into your agent's skill directory
```

Updating is then a `git pull`.

> **Upgrading from `painted-animation` or `opus-video-skills`.** The previous edition's examples (the 陶喆 lyric video,
> the 84-second "Work Reel ’26") are kept where they were, in `examples/archived-*` / `examples/archived-opus-reels/`,
> unchanged and credited; they are not the examples of this edition.

## Usage

Describe the video:

> Make a 15-second hand-painted animation of 大肥鱼 trying to catch a bubble.

> Make a 45-second DeepSeek-style kinetic reel for our model launch; the demo leads.

The matching skill is selected automatically, or invoke it by name (`/painted-animation`, `/kinetic-reel`). Each skill
scaffolds a project, presents a storyboard, builds and reviews every shot, and writes the finished MP4 to the project's
`out/` directory.

## Repository Structure

| Path | Description |
|---|---|
| `.claude-plugin/marketplace.json` | Claude Code plugin marketplace manifest (one plugin per skill) |
| `skills/painted-animation/` | Watercolour animation skill: engine, 大肥鱼 character, guide, example |
| `skills/kinetic-reel/` | Kinetic-typography reel skill: engine, 深海 look, score, example |
| `NOTICE.md` | third-party notices and provenance |
| `TESTS.md` | the verification record: what was run, on which machine, and what could not be verified |

A new style is a new directory under `skills/` with a `SKILL.md`, a runnable `template/` and at least one worked example,
plus an entry in `.claude-plugin/marketplace.json`. Both existing skills share a contract: frames are pure functions of
time, `render.mjs` produces contact sheets and parallel frame renders, and every shot is reviewed from rendered images
before the final encode.

## Acknowledgements

The painted-animation engine and guide are adapted from [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
by John Heibel (MIT Licence), and the method follows his [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo). The
kinetic-reel renderer is derived from the same kit. Both skills, originally authored by tuzhechen2005 in
[opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) (MIT), were rebuilt here for the DeepSeek 大肥鱼
theme: the character module, palettes, demos, examples, model sheets and documentation. The projects use p5.js,
p5.brush, three.js, Puppeteer and ffmpeg. Details in [NOTICE.md](NOTICE.md).

## License

MIT. See [LICENSE](LICENSE).
