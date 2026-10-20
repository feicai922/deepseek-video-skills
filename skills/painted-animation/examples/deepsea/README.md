# Example: "The last deep-sea light" (14 s)

The worked example that ships with the skill: [deepsea.js](deepsea.js) is the full scene code of the template's demo,
and `STORYBOARD.md` in the template is its storyboard.

**Logline:** 大肥鱼 drifts down to a tiny light trapped in a shell on the seabed; she chomps the shell open, the little
fish swims free, circles her whale tail and rides on her headdress as she climbs from the abyss into pale gold water.

**What it exercises:** the acted emotion timeline (`emotions()` with surprise, idea, chomp, love, laugh, proud), a
drawn glide with the whale tail leading (`swim()`), a take, a two-beat chomp with the big mouth, a tiny fish built as a
prop function with its own tail wag, the depth gradient (abyss → surface), a brush wipe in sea colours, and an iris in
and out on her face.

**To run it:** scaffold a project (or copy the template), keep `src/scenes/deepsea.js` hooked up in `studio.html`, and

```bash
node render.mjs --sheet=0.5,1.5,3,4.4,5.4,6.4,8,10,12,13.4 --cols=5 --w=420 --out=out/check/sheet.jpg
node render.mjs --clip --out=out/video.mp4
```

The encoded film is in [`../../docs/deepsea.mp4`](../../docs/deepsea.mp4) (and `deepsea.gif` beside it).

It's one idea, not a template: don't reuse its story, shell, light or shot structure in a new video.
