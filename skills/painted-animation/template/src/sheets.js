// sheets.js: 大肥鱼's model sheets, as standalone loops. They're reference for you (and the model), not part of a video,
// so they're the one place labels are fine. Scrub them at studio.html?loop=views or ?loop=emotions, or render:
//   node render.mjs --loop=emotions --sheet=1 --cols=1 --w=1920 --out=docs/emotions.jpg
//   node render.mjs --loop=views --sheet=1 --cols=1 --w=1920 --out=docs/views.jpg
(() => {
  const label = (txt, x, y, size = 20) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const floor = (y, x0 = 0, x1 = W) => inkLine([[x0 + 40, y + 6], [W / 2, y + 4], [x1 - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);

  // Every emotion in EMO, alive. Order follows EMO.
  LOOPS.emotions = t => {
    const names = Object.keys(EMO), cols = 8, cw = W / cols, ch = H / 5;
    names.forEach((name, i) => {
      const cx = cw * (i % cols) + cw / 2, gy = ch * Math.floor(i / cols) + ch - 30;
      deepseeker(cx, gy, 7.6, feel(name, t, { seed: i }));
      label(name, cx, gy + 22, 17);
    });
    for (let r = 0; r < 5; r++) floor(ch * r + ch - 30);
  };
  LOOPS.emotions.len = 4;

  // Row 1: the five key views. Row 2: motion helpers. Row 3: the outfits and props.
  LOOPS.views = t => {
    const views = ['front', 'q', 'side', 'qback', 'back'];
    views.forEach((v, i) => { const x = 240 + i * 360; deepseeker(x, 390, 13.5, { ...feel('neutral', t, { seed: i }), view: v }); label(v, x, 428, 22); });
    floor(390);
    const y2 = 672, u2 = 9.6, row = [
      ['walk (side)', x => deepseeker(x, y2, u2, { ...move('walk', t), view: 'side' })],
      ['turn / spinView', x => deepseeker(x, y2, u2, { ...feel('happy', t), ...spinView(Math.floor(t * 2) / 8) })],
      ['swim (smear)', x => deepseeker(x, y2, u2, { ...feel('excited', t), view: 'side', smear: .8, smearDir: 1, dx: Math.sin(t * TAU / 2) * .3, swimAmt: .5 })],
      ['jump', x => { const k = t % 1.5; deepseeker(x, y2, u2, { ...feel('happy', t), ...jump(k, .35, .95, 3) }); }],
      ['take', x => deepseeker(x, y2, u2, { ...feel('surprised', t), ...take(t % 2, .5, 1.2), emoteAge: (t % 2) - .5, emoteK: seg(t % 2, .5, .7) })],
      ['bag', x => deepseeker(x, y2, u2, { ...feel('happy', t), bag: true })],
    ];
    row.forEach(([name, f], i) => { const x = 180 + i * 312; f(x); label(name, x, y2 + 30, 17); });
    floor(y2);
    // row 3: hats (props the maid can wear over her headdress) and the two palette shifts
    const hats = ['star', 'cap', 'sailor', 'crown', 'snorkel', 'headphones', 'bow', 'flower', 'beanie', 'tophat', 'goggles', 'leaf'];
    hats.forEach((h, i) => { const x = 96 + i * 118; deepseeker(x, 966, 6.2, { ...feel('neutral', t, { seed: i }), hat: h }); label(h, x, 992, 13); });
    deepseeker(1560, 966, 6.2, { ...feel('happy', t), tint: 'rosy', tintK: .5 }); label('rosy tint', 1560, 992, 13);
    deepseeker(1700, 966, 6.2, { ...feel('proud', t), tint: 'gold', tintK: .4 }); label('gold tint', 1700, 992, 13);
    deepseeker(1840, 966, 6.2, { ...feel('happy', t), hat: 'star', view: 'side' }); label('side + star', 1840, 992, 13);
    floor(966);
  };
  LOOPS.views.len = 4;
})();
