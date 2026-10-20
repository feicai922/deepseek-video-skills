# Archived example: the 陶喆《小镇姑娘》 lyric video (original edition)

`STORYBOARD.md`, `xz_set.js` and `xz_shots.js` are the worked example from the original
[opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) collection by **tuzhechen2005** (MIT, © 2026):
a 31-second lyric video for one verse of 陶喆《小镇姑娘》, with the fan wordplay "大经理 → 大锦鲤".

They are kept here ~unchanged, credited to their author, because:

- they are the author's own creative work built on a copyrighted song that is not included (and cannot be);
- they are written against the previous edition's character (`clawd()`, the terracotta Clawd, and its rosy variant), so
  they no longer run against this edition's `deepseek.js` without porting the cast;
- this edition's own worked example is [`../deepsea/`](../deepsea/) ("The last deep-sea light").

## What is still worth reading in it

The timing discipline: lines measured with `scripts/beat_grid.py`, one shot per lyric line, the gag carried across the
line boundary, the doorway-piers layering trick, the karaoke pun mechanics. That method is documented in
[`../../references/music-video.md`](../../references/music-video.md) and is what to copy, not the cast.

## If you want to port it to 大肥鱼

1. `me(x, y, u, o)` in `xz_set.js` becomes a thin wrapper over `deepseeker(x, y, u, …)` with a neutral colour set.
2. `her(x, y, u, o)` becomes `deepseeker` with `hat: 'flower'` and a rosy `tint` — the flower is what identifies her.
3. The `koi()` prop (a swimming fish with her flower on its head) still works as a standalone prop; give it the whale
   palette (`PAL.fin`, `PAL.bright`).
4. Keep the song, the LRC and the sheet-music rights with the user; don't ship audio.
