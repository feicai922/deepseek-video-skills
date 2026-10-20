# Style guide: the DeepSeek 深海 look

## Palette (`K` in reel.js)
| token | hex | use |
|---|---|---|
| `abyss` | `#050D24` | the default dark ground (the deep) |
| `navy` | `#0B1B4A` | nodes, cards, panels on the abyss |
| `deep` | `#0F2360` | second dark ground, darker chapter |
| `blue` | `#2B59D8` | DeepSeek blue: the mark's disc, one full-bleed ground per reel |
| `light` | `#5B93FF` | light blue: particles, secondary emphasis |
| `aqua` | `#6FD3E0` | THE accent: the chosen item, the "OK" state, the answer, the CTA |
| `foam` | `#F5FBFF` | light ground / type on dark |
| `red` | `#E8412F` | danger/rejection only, and the full stop in a headline |
| `grey`/`mid` | `#7E90B8` / `#4C5F8A` | dimmed type |

Rotate grounds between shots (abyss → blue → foam → deep …) so every cut is a visible change. Keep the aqua for one
thing per frame; it is the eye's target.

## Typography (`F` in reel.js)
- Headlines: `font(F.cond, 130–300)`, one or two lines, ending in a full stop. Colour the key word (aqua on dark, blue
  on foam) or just the full stop (red).
- Slams: `font(F.wide, 172–250)` (Archivo Black) for one-word statements, with outlined echoes stacked above and below.
- The Chinese line: `font(F.zh, 150–200, 700)` on its own line under the English, or `font(F.zh, 20–34, 500)` as the
  quiet counterweight in the HUD.
- Voice line: `italic 118px ${F.serif}` over the current layer, word by word on beats.
- Labels, HUD, chips, tables: `font(F.mono, 14–26, 700)` with 2–8 px letter-spacing.
- Numbers: `F.cond` at 84–420 px. Counters roll (`count()` expo) or flip (`odometer()`).

## Layout
- Canvas 1920×1080. Left margin **140**, right edge **1780**. Headline baselines around y 250–470.
- The HUD owns the four corners: brackets at 40 px, micro-type at (58, 63) / (1862, 63) / (58, 1022) / (1862, 1022),
  one optional Chinese line at y ≈ 988, the segmented progress bar at y 1050. Keep content out of y > 950.
- Put stats in a row at y ≈ 900 or stacked in a right column at x ≈ 1400–1540. Never two stats in the same 300 px
  band at the same height.

## Motion vocabulary (all in reel.js)
| helper | what it does |
|---|---|
| `dropWord(s, x, y, font, t0, t, {fall, stag, fillAt, align})` | letters fall in with expo-out and a stagger; `fillAt(i)` recolours one letter |
| `letters(s, x, y, o, fn)` | per-letter transform (dy, r, s, a, fill): build your own entrances |
| `chip(s, x, y, {k, bg, fg})` | a label that wipes in; returns its width so chips can be laid out in a row |
| `stat(v, label, x, y, {k, size, col})` | a big number with its label |
| `count(t, t0, t1, v0, v1)`, `odometer(v0, v1, k, x, y, font, col)` | number roll / per-digit flip |
| `arrow`, `line`, `circle`, `rrect`, `starburst`, `asterisk`, `arrowNE`, `jelly` | shapes |
| `circlish(cx, cy, r, col, t)` | the fish mark: a circle, a tail wedge, an eye. Use it where a logo would go |
| `redacted(x, y, w, h, seed, col)` | "text" as rounded blocks: never invent real content |
| `thread(p0, p1, k, col)` | a cubic "citation" line drawn up to k |
| `texWindow(draw, src)` | letters as windows onto a shader layer |
| `tape(t, y, rot, col, fg, words, speed, dir, k)` | a diagonal scrolling tape with ✳ / ↗ separators |
| `glitchIn(lt, seed)` | slice + RGB split on a hard cut in (auto-disabled during transitions) |
| `hud(t, {tl, tr, bl, br, zh, dark, brackets})` | the corner system + segmented progress bar |

## GL layers (render into `glA`, then `glShot()` draws it into the 2D frame)
- `terrain(t, {fade, amp, push, camY, tint})`: the **deep** — an additive particle wave seen from just above it. For
  openings and chapter titles on the abyss.
- `liquid(t, {zoom, seed, strips, stripAmt})`: the **current** — blue/aqua/foam domain-warped bands that read as
  caustics or currents. The one "principle" shot, and a low-opacity ground for diagrams (`glShot(liquid(...), .15)`).
  With `strips` it becomes a vertical-slice glitch for exits.
- `knot(t, {x, y, s})`: the **mark object** — a chrome-blue torus knot with a dark hull, for "form"/"tool" moments.
  Use the flat `circlish()` mark for logo moments; the knot is for when you want a 3D object.
- `pod(t, {k, rot, x, y, s, hi})`: the **school** — 9k particles morphing from a drifting shell (k 0) to a school of
  fish (k 1). `cloud.project(i, t, o)` returns a point's screen position, so 2D lines can hit real 3D points.
  Swap the silhouette's `inside(x, y)` for your subject.
- Post pass (`FX`): `split` (RGB offset), `slice` (row glitch), `grain`, `vign`, `flash`. `flashCol` defaults to white;
  pass `K.aqua` for a wet flash.

## Transitions (the `TR` map: `key: [duration, fn]`)
| fn | use it when | example |
|---|---|---|
| `trZoom(rect or () => rect)` | the eye is on a UI element or a mark: zoom *through* it into the next shot | the mark's disc → the name |
| `trIris(cx, cy, ring)` | something just lit up / a dot / a node: the next shot grows out of it | the dot of light → the mark |
| `trPush(dx, dy)` | a change of topic at the same level; add nothing else | title → diagram |
| `trWipe(col)` | a scan / sweep already moving across the screen | a scan line → the next shot |
| `trSlats(n)` | a "reveal" beat, rhythmically, on a bar | pipeline → pipeline |
| `trGrid(cols, rows, col)` | ending a section on a grid-like image | the diagram → the current |

Scenes register the rect they'll be zoomed through in `RECT` while they draw (A is rendered frozen on its last frame,
then B live; A's FX are dropped). Keep each transition 0.45–0.6 s and vary them: never three of one kind in a row.

## Recurring devices that work
- An **index/contents** card that states the order of emphasis (with each chapter's role and duration).
- The **trace** device: a segmented progress bar per chapter, and a finale that lays the whole reel out as a span
  waterfall ("STATUS OK").
- A **mark** that recurs (start: a dot becomes the mark; end: the mark next to the name; the reel collapses to a dot).
- The **water**: one layer per depth level — the deep (particles), the current (caustics), the pod (school). Use depth
  as your chapter structure when the story is abstract.
- Red for exactly the failures the system catches (a blocked request, a failed gate).
