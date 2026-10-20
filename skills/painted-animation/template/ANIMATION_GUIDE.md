# Animating 大肥鱼 (the DeepSeek little whale)

Read this whole file before you draw anything. It covers how to make a short, hand-painted cartoon starring 大肥鱼
(DeepSeek's little whale mascot) or any character you design: the rules and animation principles that make it look
good, the workflow that catches mistakes, and the full reference for the character and the engine.

The person prompting you decides **what** the video is about. This guide decides **how** it's made. If they ask for
something the rules below forbid (a caption, a 3D spin), do what they ask.

**No design here is final.** 大肥鱼, her outfits, the emotions and the props are a starting point. Change any of them
and add whatever new characters, props or emotions the idea needs, drawing them with the same tools and rules so they
belong with the rest. Keep her on model within one video: the same face, belly, flippers, blowhole and fluke in every
shot.

Look at the model sheets first:
- [docs/emotions.jpg](docs/emotions.jpg): every emotion (all 34 of them), alive.
- [docs/views.jpg](docs/views.jpg): the five key views, the motion helpers, the hats and the colour tints.

---

## The three goals

Every rule below serves one of three goals.

- **Handmade.** The video should look like someone painted it by hand, frame by frame. That means brush strokes, ink
  lines that boil, flat 2D and no lettering.
- **Alive.** Something is always moving and something is always happening. Faces act instead of snapping, tails swish,
  and characters are big enough to feel.
- **One piece.** It's one short film, not a pile of clips. Plan it before you draw it, and link every scene to the next.

Underneath all three, the viewer has to be able to follow it. Timing (rule 4) is the rule models get wrong most often.

## The rules

### 1. The medium is solid: brush strokes, flat 2D, boil

- **Paint everything with p5.brush through `paint()` and `inkLine()`.** Characters get flat `wash` colour plus an ink
  outline. Backgrounds get soft watercolour `fill` shapes, usually with no outline or a thin one. Never use plain p5
  shapes (`rect`, `ellipse`, `fill()`): they look like 2000s Flash.
- **The linework boils.** `jit()` and `random()` are reseeded 12 times a second (`BOIL`), so every drawing wobbles
  slightly, like hand-drawn animation. That's the look; don't fight it. For anything that must stay put from frame to
  frame (star positions, tuft heights), use `hash(i)`. Give each separate element its own seed with `boilSeed(key)`
  (see Engine), or one moving thing makes everything drawn after it jitter.
- **Everything is flat 2D. Never project 3D.** Don't rotate a box in perspective, don't use `rotateY` or WEBGL 3D and
  don't fake depth with math. 大肥鱼 turns through **drawn key views** (front → 3/4 → profile → back 3/4 → back),
  exactly like a cartoon model sheet: see `turn()` and `spinView()`. Depth comes from overlap, scale and colour
  (farther = smaller, bluer, paler), never from a projection.
- **Light is the one exception.** p5.brush mixes colour like pigment, so a yellow glow painted over blue turns green,
  and a thin wash over it turns grey. Use `glow()` for anything that shines: it adds real light, under the paper grain.
- **Deep-sea palette, no pure black or white.** Use `PAL.ink` for black and `PAL.pearl` (or `PAL.cream`) for white. The
  DeepSeek blues (`PAL.deep`, `PAL.mid`, `PAL.bright`), the underwater teal (`PAL.fin`, `PAL.teal`) and a soft paper
  (`PAL.paper`) carry the whole look. Keep 大肥鱼 clearly readable against the water: her body is deep blue, her
  bright blue, her headband white.

### 2. No text

- **Show it, don't write it.** Models overuse text. No captions, no titles, no labels on objects, no signs, no speech
  bubbles with words, no words on screens, no "ZZZ" typed in a font.
- **大肥鱼's reactions are painted marks, never letters**: `!`, `?`, zzz, sweat, hearts, a bulb, a rain cloud, bubbles
  (the `bubblegum` mood). Use the emotes (see the reference).
- **A sign that repeats the story is the classic failure.** If she holds a sign saying "I'm lost", the shot has failed.
  Show her being lost: looking left, then right, the map upside down, a sweat drop.
- If the prompt truly needs a word (a name, a shop sign that is the joke), use `letter()`. Paint it into the scene, keep
  it to one or two words and use it once.

### 3. Something happens in every scene

- **Every shot needs an event:** something changes between its first frame and its last. She wants something, finds
  something, tries, fails, reacts or gets it. "大肥鱼 floats in blue water being cute" is not a shot.
- **One focal action at a time.** Stage it with a clear silhouette and nothing competing for attention, so it reads at
  a glance.
- **Cause, then reaction.** When something happens, she reacts to it: a take, an emotion change, a turn toward it, a
  tail flick. The reaction is often the funniest part, so give it time.
- **Pay it off.** Whatever you set up in a shot (a shell, a light, a strange bubble) gets resolved on screen, in that
  shot or a later one.

### 4. Timing: model the viewer

Timing turns a set of drawings into a story. It's also where generated animation fails most often: everything moves at
one brisk speed, events pile on top of each other, and moments are over before anyone understands them.

You know what happens because you wrote the code. The viewer doesn't: they see it once, at full speed, for the first
time. **For every moment, ask what the viewer needs to understand and how long that will take them, and time it for
that.**

- **Write the reads.** For each shot, list in order what the viewer has to understand. Each item is a *read*. Every read
  needs time for the eye to find it, time to understand it, and a moment to register before the next thing starts.
- **One read at a time.** Don't start a new read while the viewer is still taking in the last one. Put a cause and its
  reaction in sequence, not on top of each other.
- **Fast actions, slow meanings.** A motion can be very quick if it's anticipated, but what it means needs held time.
- **Lead the eye.** The viewer looks at whatever moves, is bright, is big or is being looked at. Before an important
  read, get their eye to the right place (she looks at it, the camera moves to it, it lights up first).
- **Let the reads set the length.** A shot is as long as its reads need. That includes the last shot: its final read
  needs time to land before the video ends.

### 5. Alive

- **Nothing is ever still.** Every emotion has its own idle motion (`feel()`), and her whale tail keeps beating on its
  own `swim` phase; cameras drift or push, kelp sways, marine snow drifts and the linework boils.
- **Faces act, they never snap.** Change moods with `emotions()`. It does anticipation, a squint, a take and overshoot
  around every change. Never swap `eyes`/`mouth` by hand between two frames.
- **Move like a cartoon, not a machine.** Every move follows the animation principles in the next section.
- **She is big.** In a medium shot, `u` is about 26–40 (she is about 10.9u tall). In a close-up it's 60–90. Tiny fish
  (u < 14) are for wide establishing shots only.
- **Everything moves on a beat.** `PROJECT.bpm` drives every idle, dance and tail beat, so the whole film shares one
  pulse. Put the hits on beats (`pulse()`, `beatN()`), even with no music.

### 6. Transitions always

- **Every seam gets a transition:** into the first shot, between every pair of shots and out of the last one.
- **Pick a transition that belongs to the story**, and don't default to the same one every time:
  - a brush wipe in sea colours (`brushWipe(p, [PAL.deep, PAL.indigo])`)
  - an iris or shaped iris (`iris`, `irisShape`), e.g. an iris out on her face
  - a whip pan with a smear; a match cut (the same shape or motion across the cut)
  - a cut on action; a camera move that carries through into the next shot; a fade or push from water
- **Changes inside a shot are transitions too:** emotions go through `emotions()` and turns through `turn()`. Props
  arrive and leave on arcs, never popping in.

### 7. One piece: a vision before any code

- **Storyboard first**, in writing, before you write any scene code (the workflow below has the format). If you're
  working with a person, show them the storyboard and let them react before you build.
- **One world.** Pick a palette and a setting that carries through, with a colour arc across the video (the demo goes
  from the dark abyss to a pale gold surface).
- **One thread.** The story has a beginning, a middle and an end, and her emotional arc follows it. Plan the emotion
  keys across the whole video, not per shot.
- **Rhyme the ending with the opening:** the same place, pose or motif, changed.
- **Link scenes:** motion continues across cuts, and screen direction stays consistent.

---

## Animation principles

These are the classic principles of character animation, as they apply here. Most of them fix one problem: motion
written as code comes out mechanical, because code moves every part at once, on the same curve, by the same amount.

- **Anticipation.** Before a big move, make a small move the opposite way: a crouch before a jump, a wind-up before a
  throw, a squint before a take. `jump()` and `emotions()` build it in.
- **Squash and stretch.** Bodies squash on impact and stretch when they move fast, keeping their volume (`sq`).
- **Slow in, slow out.** Almost nothing moves at a constant speed. A plain `lerp` over time looks mechanical, so run
  its progress through an easing (`ease`, `easeIn`, `easeOut`, `backOut`).
- **Weight.** A chibi has a big head: it lags a beat behind the body on starts and stops, and settles last.
- **Arcs.** Living things move on arcs: thrown props, hops, arm swings, tail sweeps (`arcPt`, `ribbon`).
- **Overlapping action and follow-through.** Don't move every part at once. The eyes lead, the head follows, the body
  lands, and the flippers, the spout droplets and the **tail** drag behind and settle last (use
  `spring`, `ring` and `backOut`).
- **Avoid twinning.** Give one arm the action and the other something smaller, offset blink timings with `seed`, and
  give each fish its own `boilKey` so they don't boil in sync.
- **Exaggeration.** Push poses, takes, squash and leans further than feels natural. In a short cartoon, subtle reads as
  nothing.
- **Strong key poses.** Each shot's storytelling poses should read as stills, with a clear silhouette.
- **Show the thought.** She notices, thinks, then acts, and the eyes move first.
- **Secondary action.** Small actions that support the main one (a tail flick, an emote popping, bubbles drifting) add
  life, but never compete with it.

---

## Workflow

### 1. Storyboard

Write `STORYBOARD.md` before any scene code:

```
Logline: one sentence. 大肥鱼 wants ___, but ___, so ___.
World: setting, a small palette, light, how the colour changes across the video (e.g. abyss → surface).
Motif: the thing that recurs and pays off.
Her arc: the emotion keys across the whole video.
Shots:
  A  start–end  [transition in: ___]  what's seen · the EVENT · her reaction · camera
     reads:  start–end  the first thing the viewer must understand
             start–end  the next one (where is the viewer's eye when it starts?)
  B  start–end  [transition: ___]  ...
  [transition out: ___]
```

Check the storyboard against the rules: an event in every shot? every read given time? a transition at every seam? any
text anywhere? does the ending rhyme with the opening?

### 2. Build

- Set `duration` (and `bpm`) in [src/config.js](src/config.js).
- Put your scene in a new file (e.g. `src/scenes/my_video.js`), wrapped in an IIFE, and end it with `shots([...])`. In
  [studio.html](studio.html), **replace** the `deepsea.js` script tag with yours.
- Build and check one shot at a time: block the key poses, check them as stills, then add the motion.

```js
// src/scenes/my_video.js
(() => {
  function pool(t, lt, dur) {                  // t = video time, lt = time in this shot, dur = shot length
    camBegin(960 + 20 * Math.sin(lt * .6), 560, 1 + .02 * lt);            // slow drift: the camera is never dead
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: PAL.indigo, ink: null });
    paint(ellPts(960, 1080, 1200, 260, 40, 10), { fill: PAL.fin, fillOp: 70, bleed: .3, ink: null });   // a pool of light
    const mood = emotions(lt, [[0, 'sleepy'], [1.2, 'surprised'], [1.7, 'excited']]);   // acted changes
    const hop = jump(lt, 2.2, 2.7, 3);                                                   // poses compose by spreading
    deepseeker(960, 900, 32, { ...mood, swim: bpOf(lt) * 2, dy: mood.dy + hop.dy, sq: mood.sq + hop.sq });
    const at = toScreen(960, 900 - 500);                                  // her screen position, for the iris
    camEnd();
    if (lt < .45) iris(...at, lerp(0, 1500, easeIn(lt / .45)));           // transition in
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [PAL.deep, PAL.indigo]);
  }
  shots([[0, pool] /*, [3.5, nextShot], ... */]);
})();
```

### 3. Look at it: the review loop

You can't see motion by reading code. Render and look at every shot, several times, at three zoom levels:

```bash
node render.mjs --sheet=0.1,0.8,1.6,2.4,3.1,3.9 --cols=6 --w=320 --out=out/check/sheet.jpg   # the whole piece
node render.mjs --strip=2.1:2.6 --cols=6 --w=320 --out=out/check/strip.jpg                     # every frame of a moment
node render.mjs --sheet=2.3,2.4 --crop=760,420,500,400 --w=500 --out=out/check/face.jpg        # full-res face
node render.mjs --strip=2.1:2.6 --crop-at=960,780,500,400 --out=out/check/feet.jpg             # follows a world point
```

Check: is the event of each shot clear from its sheet alone? Is she big enough and does she separate from the water?
Is the whale tail visible and does it move on its own beat? Timing: count the frames each read gets (24 = 1 s). Motion:
anticipation and follow-through, no pops? Boil: still things must not re-boil (give them their own `boilSeed`).
Contacts: does the flipper meet the body, does a held prop touch the flipper tip, does the fluke meet its stalk? Transitions at
every seam? Any text, any 3D, any muddy glows?

Fix and look again. **Budget:** at least one sheet per shot, a strip per key motion and transition, a crop per face.

### 4. Render the video

```bash
node render.mjs --clip --out=out/video.mp4                        # straight to MP4 (one worker)
node render.mjs --frames --workers=4 && node render.mjs --encode --out=out/video.mp4 [--audio=assets/song.mp3]
```

Report the output path, length and ms/frame. Offer `open out/video.mp4`.

---

## Engine

### Files

| file | what's in it |
|---|---|
| `src/config.js` | `PROJECT = { duration, bpm, offset, audio? }` |
| `src/core.js` | canvas, palette, timing and motion helpers, `paint()`, camera, full-frame effects, `glow()`, lettering, paper, render hooks, the brush probe and its 2D fallback |
| `src/deepseek.js` | 大肥鱼: key views, the face, the body, flippers, the fluke, emotions, moves, `swim()` / `hopWalk()` |
| `src/timeline.js` | `shots()`, `LOOPS`, `brushWipe()` |
| `src/sheets.js` | the model sheets as loops (`?loop=emotions`, `?loop=views`) |
| `src/scenes/deepsea.js` | the 14-second demo ("The last deep-sea light"). **Don't copy it** |
| `studio.html` | open it in Chrome to scrub the video (`?t=2.5`, `?loop=emotions`); page errors show in a red bar |
| `render.mjs` | headless renderer: sheets, strips, crops, stills, PNG loops, MP4 |

### Frames are pure functions of time

- **Frames render in parallel and out of order.** A shot is `fn(t, lt, dur)` and must draw the same frame for the same
  `t`. No state carried between frames, no counters, no `Math.random()`, no per-frame physics.
- Randomness: `hash(i)` for stable per-object values, and `jit(a)` / `random()` for boil (12 times a second).
- **Seed each element with `boilSeed(key)`** (each background layer, prop and effect). `deepseeker()` seeds itself and
  each of its parts, then reseeds, so nothing drawn after it depends on its pose. Its key is its call order; set
  `boilKey` when characters come and go mid-shot.
- Each shot paints the whole frame; the paper is under everything and the grain multiplies over the top.
- Canvas 1920×1080, origin top-left, y down. `LOOPS.name = t => {...}; LOOPS.name.len = 4;` makes a standalone loop.

### Painting

`paint(pts, o)` paints one shape from a point list:

| option | meaning |
|---|---|
| `wash, washOp` | flat colour (opacity 0–255, default 255). For characters, props, anything solid. |
| `fill, fillOp, bleed, tex, border` | watercolour fill with bleeding edges and pigment texture. For water, rocks, shadows. |
| `hatch: { d, a, o, b, c, w }` | hatching, sparingly. |
| `ink, sw, br` | outline colour (default `PAL.ink`), weight (~.4–2), brush. **`ink: null` means no outline.** |
| `curv` | 0–1: smooth the outline through the points. |

- **Lines:** `inkLine(pts, sw, colour, brush = 'ink', curvature)`. Brushes: `'ink'`, `'inkfine'`, `'dry'` (and
  p5.brush's `'2B'`, `'HB'`, `'charcoal'`, `'marker'`, `'pen'`, `'cpencil'`, `'rotring'`, `'spray'`).
- **Shapes:** `rectPts(x, y, w, h, j)`, `ellPts(cx, cy, rx, ry, n, j, rot)`, `rrPts(x, y, w, h, r, j)`,
  `starPts(cx, cy, r, inner, n, rot)`, `heartPts(cx, cy, r)`, `through(P)` (smooth curve), `ribbon(P, w0, w1)` (a
  tapered ribbon: tails, hair, fins, trails).
- **One shape, one outline.** A tail lobe is one `ribbon`/polygon, not five circles.
- **Light:** `glow(x, y, r, colour, a)`, additive, drawn before whatever sits in front of the light.
- **Palette** `PAL`: `paper, ink, deep, mid, bright, fin, pearl, blush, night, indigo, rose, ochre, sap, teal, violet,
  cream, sky` (plus `clay/clayDk/clayLt`, kept as aliases of the blues for old scenes). `mixCol(a, b, k)` mixes two hex
  colours.
- **p5.brush quirks:** colours mix like pigment; `wash` at 255 is exact; strokes far from the origin collapse under a
  zoomed camera (`paint()`/`inkLine()` centre each shape, but keep huge shapes as outlines no bigger than the canvas);
  outline weight is in world units, so scale `sw` down in close-ups; a `NaN` in a point list throws
  `Failed to construct 'OffscreenCanvas'`; cost is fills and strokes (aim ≤ 2–3 s/frame, the log prints ms/frame).

### p5.brush on this machine: the probe and the flat fallback

On some GPU/driver combinations p5.brush's shader compiles but paints nothing, and every frame comes out as bare
paper. `setup()` probes it once by painting a red test square and reading the pixel back:

- **Probe passes:** everything renders as described above.
- **Probe fails:** `paint()` and `inkLine()` record their shapes, and each frame is drawn into a 2D canvas as flat fills
  and strokes (exact wash and ink colours; watercolour fills, hatching and brush texture are lost). The studio console
  prints `[painter] p5.brush draws nothing on this GPU/driver …`. The film still renders and encodes; to get the
  watercolour look, run it on a machine with a working Chrome/GPU, or force the brush with `?brush=on`.
- Force either mode with `?brush=off` / `?brush=on` in the URL, or set `window.BRUSH = 'off'` before `setup()`.

### Time and motion (all pure functions of t)

- **Progress and keys:** `seg(t, a, b)`, `kf(t, [[t0, v0], [t1, v1], ...], ease)`, `lerp`, `clamp`, `frac`,
  `wob(t, freq, phase)`, `TAU`.
- **Easing:** `ease`, `easeIn`, `easeOut`, `backOut`, `elasticOut`.
- **Rhythm:** `BEAT`, `bpOf(t)`, `beatN(t)`, `pulse(t, k)`, `pulse2(t, k)`.
- **Acting:** `jump(t, t0, t1, h)` → `{dy, sq}`; `take(t, t0, amt)` → `{sq, dy}`; `spring(t, t0, k, w)`;
  `ring(t, [t0, t1, ...])`; `arcPt(p0, p1, h, k)`; `onTwos(t)`.
- **Fish locomotion:** `swim(t, t0, t1, x0, x1, y0, y1, u, arc)` → `{x, y, view, flip, swimAmt, swim, dy}` (a glide
  with a bending arc); `hopWalk(t, t0, t1, x0, x1, u)` → `{x, walk, view, flip, dy, swim}` (a waddle on the side
  fins, facing the way she goes, facing front when she stops).
- **Camera:** `camBegin(cx, cy, zoom, rot)` … `camEnd()`; `toScreen(x, y)`; `shakeXY(t, amount)`.
- **Full-frame effects** (screen space, after `camEnd()`): `brushWipe(p, [c1, c2])`, `iris(cx, cy, r, colour)`,
  `irisShape(pts, colour)`, `flash(k, colour)`.
- **Lettering** (only if you must): `letter(txt, x, y, size, colour, {pop, rot, alpha, screen})`,
  `sfx(txt, x, y, size, colour, age)`; both composite at `flushLetters()`.

---

## 大肥鱼

She is DeepSeek's **little whale**, drawn as this kit's own character from the prompt's 角色设定.md: an animal mascot, not
a girl. One round deep-blue body (no head/body split, no arms, legs, hair or clothes), a pearl belly patch, two paddle
flippers, a small dorsal fin, a paired blowhole with a three-droplet spout, and a two-lobed fluke that sweeps out behind
her and keeps its own beat. Big glossy eyes, a wide whale smile and blush sit on the front of the body. She may carry a
little satchel (`bag: true`). Because there are no hands, emotions read from eyes + mouth + body bounce + flipper angle
+ tail speed — the tail is the main actor.

```js
deepseeker(x, y, u, options)   // (x, y) = ground point under the body; u = size unit
```

**Sizes:** about 10.9u tall (crown to the bottom of the body), 4.1u half-width; the fluke reaches ~7u out when it sweeps.

| shot | u | on screen |
|---|---|---|
| wide | 12–18 | small in the water |
| medium | 26–40 | the usual acting size |
| close-up | 60–90 | face acting |
| extreme close-up | 120+ | camera pushed in on the eyes |

### Options

| group | options |
|---|---|
| pose | `dx`, `dy` (in u; −dy = up), `sq` (squash; negative stretches), `rot` (pivots at the body's base), `flip`, `sx`, `sy`, `aL`, `aR` (flipper angle: 0 = resting down, + = raised out and up, − = tucked; ±1.4 is vertical), `walk` (a waddle: the body rocks and the flippers paddle), `swim` (tail-beat phase), `swimAmt` 0..1 (leans into travel), `noShadow`, `noHat` |
| view | `view`: front, q, side, qback, back. `smear` 0..1 + `smearDir` ±1 (0 = both sides) for fast moves |
| face | `eyes`, `mouth`, `lookX`/`lookY` (−1..1), `squint` 0..1, `blush` 0..1, `gloom` 0..1, `seed` (blink timing) |
| colour | `tint` (pale, flush, blue, rosy, green, gold, or any hex) + `tintK`, or `col`/`dk`/`lt` (body), `fin` (flippers, fluke, dorsal) |
| extras | `hat`, `bag`, `spout` (0 = no blowhole spout, default .75), `emote` + `emoteK` (0..1 pop) + `emoteAge`, `draw(u, sw)` (over everything), `faceDraw(u, sw)` (in front of the face), `armL(u, sw)` / `armR(u, sw)` (props at the flipper tips) |
| boil | `boilKey`: a stable id for its boil seeds (default: call order) |

Options compose by spreading: `deepseeker(x, y, u, { ...feel('happy', t), ...turn(t, 1, 1.15, 0, .25), hat: 'star' })`.
Later spreads win, so put the emotion first and the pose after it. If both an emotion and a pose move the same field
(`dy`, `sq`), add them.

### Views and turns

Drawn key views; every view faces screen-right, add `flip: true` to face left.

| view | what you see |
|---|---|
| `front` | the face, both flippers, the spout, the fluke sweeping out behind |
| `q` | 3/4: the face shifted toward the heading, the near flipper in front, the fluke |
| `side` | profile: one eye, one flipper, the tail trailing behind |
| `qback` | 3/4 from behind: the back, the dorsal fin, the fluke |
| `back` | no face: the back, the dorsal fin, the blowhole, the fluke |

- **Turn with `turn(t, t0, t1, a0, a1)`.** Headings are in turns: 0 = front, .25 = facing right, .5 = back, −.25 =
  facing left. It steps through the views over 0.12–0.25 s with smears. For one heading use `spinView(a)`.
- **Upright vs swimming:** standing, use `turn`/`hopWalk` and let `swim` keep the tail alive. Swimming, use
  `swimAmt: .5–1` so she leans into the motion, and `swimAmt: 0` when she stops to look at something.

### Emotions

34 emotions. Each is a face AND a way of moving, locked to the beat. `feel(name, t, over)` returns all of it at time t:

```js
deepseeker(x, y, u, feel('happy', t));                                            // one emotion, alive
deepseeker(x, y, u, feel('sad', t, { view: 'q', lookX: -1 }));                    // with overrides
deepseeker(x, y, u, emotions(t, [[0, 'sleepy'], [1.9, 'surprised', { lookX: .8 }], [2.5, 'idea']]));   // acted changes
```

| family | emotions |
|---|---|
| joy | happy, excited, laugh, love, proud, starstruck, playful, hopeful, relieved, bubblegum |
| sly | smug, cool, mischief, suspicious, shades |
| low | sad, cry, bored, sleepy, ko |
| hot | angry, furious, determined, disgusted, chomp |
| alarm | scared, nervous, surprised, confused, dizzy |
| mind | neutral, thinking, idea, shy |

- **`emotions(t, keys)`** is how moods change in a shot: anticipation, a squint, a take sized to the new emotion, the
  body settling with overshoot, the colour cross-fading and the new emote popping in. `emotions(t, keys, { take: .5 })`
  scales every take; the third element of a key overrides fields for that stretch (e.g. `{ lookX: .8, emote: 'music' }`).
- To make a new emotion, add an entry to `EMO` in `deepseek.js`: eyes, mouth, optional tint/blush/gloom/emote, `take`
  (reaction size), an optional `swim`, an optional `chomp`, and `body(t)` (its idle motion, locked to the beat).

### Parts

- **Eyes:** normal, look, wide, happy, closed, sleepy, narrow, angry, determined, sad, teary, cry, squeeze, shine,
  scared, blank, spark, red, heart, x, swirl, dot, shades. A pair gives mismatched eyes (`['narrow', 'wide']`).
  `lookX`/`lookY` aim the pupils; `squint` closes the eyes from any shape.
- **Mouths:** a soft open smile by default (`mouth` undefined in a `feel()` result draws the resting smile); then
  `o, O, smile, grin, flat, wobble, cat, frown, smirk, laugh, open, wail, teeth, tongue, pout, yawn, yum`. The big
  mouth is `chomp` 0..1 (used by the `chomp` emotion: teeth in a wide open mouth).
- **Hats:** star, cap, sailor, crown, snorkel, headphones, bow, flower, beanie, tophat, goggles, leaf, worn over the
  headband. **Accessories:** `bag` (the blue satchel), `glasses` (`'sun'` for sunglasses).
- **Emotes** pop in by the head: `!` `?` `!!` `!?` zzz, sweat, spark, heart, hearts, anger, steam, bulb, dots,
  scribble, music, swirl, stars, cloud, bubble. `emoteK` is the 0..1 pop and `emoteAge` drives the looping ones.
- **Colour:** `tint` shifts the body and fins with the mood: pale (fear), flush (anger), blue (sadness), rosy (love),
  green (disgust), gold (pride). `gloom` adds a dark forehead with hanging lines; `blush` adds cheeks.

### Hooks: props and accessories

- **`draw(u, sw)`** paints in body-local space, over everything (hat, near arm). It squashes, flips and moves with her.
  Body-local reference (front view, in u): head centre (0, −6.75) with radius 4.3; eyes at (±2.35, −6.95); mouth at
  (0, −6.0); belly patch from y −5.1 down to −2.2; flipper roots about (±3.2, −4.8) with tips near (±5.4, −3.7); the fluke at about (4.2, −2.8).
- **`faceDraw(u, sw)`** is the same, in front of the face only (glasses, a mask, tears).
- **`armL(u, sw)` / `armR(u, sw)`** are called at the hand, so a held prop just draws around (0, 0) and follows the arm:

```js
deepseeker(x, y, 30, { ...feel('proud', t), aR: 1.2, armR: (u, sw) => paint(starPts(0, -u * 1.2, u * 1.4, .5, 5), { wash: '#FFE27A', ink: PAL.ink, sw }) });
```

- Anything the hands can't carry (a big object overhead, the tiny fish in the demo) is drawn separately at a point
  computed from the same pose. Make sure it touches: check it with a crop.

### Dances and moves

`move(style, t, seed)` returns beat-locked pose offsets: bounce, hop, roof (arms up), sway, spin (a drawn spin through
the key views once a bar), wave, walk, run, idle, stomp, shimmy, swish (a tail-led flourish, `swimAmt` on), and `mix`
(changes every two bars). `dancer(x, y, u, style, t, extra)` is `deepseeker` + `move`. Combine with a face:
`{ ...move('bounce', t), eyes: 'happy', mouth: 'grin' }`.

---

## Music (optional)

1. Set `bpm` to the song's tempo in [src/config.js](src/config.js) and `offset` to the time of its first downbeat.
   Every idle, dance, tail beat and `pulse()` then locks to the song.
2. Put the audio in `assets/` and set `PROJECT.audio` (or pass `--audio=`). `--clip` and `--encode` mux it in.
3. Land hits, cuts and takes on beats (`beatN`, `pulse`). Cut on bar lines for big changes.
4. **Lyrics are not text.** Don't put words on screen. Act the meaning of a line instead (a lyric feature, karaoke, is
   in `src/karaoke.js` for when the user explicitly wants a lyric video).

## Common failures

These are the things that make a 大肥鱼 video look generated. Check your storyboard and sheets against them:

- signs, captions, labels or speech bubbles with words
- 大肥鱼 floating in place while nothing happens, with the same expression for the whole shot
- everything moving at one brisk speed, with events stacked and no holds
- moments that are over before the viewer understands them
- a tiny character in a big empty sea for the whole video
- faces that snap from one expression to another; a tail that never moves
- mechanical motion: linear moves, every part moving at once, both arms in sync
- timid poses and takes that barely read
- jittery linework: still things re-boiling because something moving before them shifted the stream (`boilSeed`)
- hard cuts everywhere, or a video that just starts and stops
- 3D rotation, perspective boxes or projected turns
- plain p5 shapes mixed into the paint (use `paint`/`inkLine`/`glow`)
- props floating near a hand instead of touching it
- every shot a different world with nothing linking them

## About the demo

[src/scenes/deepsea.js](src/scenes/deepsea.js) ("The last deep-sea light", 14 s) exists to show the kit working: an
acted emotion timeline, a drawn glide with the tail leading, a take, a chomp, a little fish that orbits her waist and
rides on her back, a climb from the abyss to the surface, a brush wipe and an iris in and out. **It's one idea, not
a template.** Don't reuse its story, shell, light or shot structure. Replace its script tag in `studio.html` with yours.

### Worked example: how the demo times its ending

The last shots, in video time:

| time | read | why it's timed this way |
|---|---|---|
| 4.0–4.7 | she dives and chomps the shell open | fast motion, anticipated by the idea and the crouch |
| 4.7–5.4 | the little fish swims free and she blinks in surprise | the payoff; nothing else moves while the eye follows the fish |
| 6.4–7.2 | the fish circles her tail | a new action, her reaction (love) only after the viewer sees it |
| 9.6–10.4 | she laughs, the fish settles on her back | cause then effect, held |
| 12.4–14 | she rises into the pale water, iris on her face and the fish, hold, shut | the last read gets time to land before the video ends |
