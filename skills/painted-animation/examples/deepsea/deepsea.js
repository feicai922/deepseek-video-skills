// deepsea.js: "The last deep-sea light", a 14-second example that exercises the kit, starring 大肥鱼 (the fat fish girl).
// It is one idea, not a template: don't copy its story, staging or palette into your own video (see ANIMATION_GUIDE.md).
//   Shot A (0–6.4 s): 大肥鱼 swims down through the dark towards a small light on the seabed. The light is a tiny fish
//                     trapped in a shell. She notices, gets the idea, chomps the shell open (scrunch!), and the tiny
//                     fish swims free. Bubble wipe.
//   Shot B (6.4–14 s): the tiny fish circles her tail like a little curler; she laughs, turns plum, and lets it ride on
//                     her headdress as she swims up towards the surface, where the water turns pale and gold. Iris out on
//                     the light.
// Built like a fish: her whale tail beats on every swim phase, fins flare on takes, and the eyes lead every reaction.
(() => {
  const SEA = [PAL.deep, PAL.indigo];    // wipe colours, the same on both sides of the cut

  // ---------- set pieces ----------
  // The water: a vertical depth gradient (dark bottom → pale top when the camera climbs), light rays, marine snow.
  function sea(t, o = {}) {
    const depth = clamp(o.depth ?? .75);   // 0 = the surface (pale, gold), 1 = the abyss
    boilSeed('sea');
    paint(rectPts(-600, -1200, W + 1200, 3000), { wash: mixCol(PAL.night, PAL.deep, .25 + .2 * (1 - depth)), ink: null });
    paint(ellPts(W / 2, H * (1.25 - depth * .5), W * 1.1, H * .9, 40, 16), { fill: mixCol(PAL.deep, PAL.mid, .45), fillOp: 90 + 60 * (1 - depth), bleed: .35, tex: .6, ink: null });
    if (depth < .6) paint(ellPts(W * .55, -H * .15, W * .8, H * .55, 36, 14), { fill: mixCol(PAL.sky, PAL.ochre, .35), fillOp: 150 * (1 - depth * 1.6), bleed: .4, tex: .5, ink: null });
    // light shafts from above
    for (let i = 0; i < 5; i++) {
      boilSeed('ray' + i);
      const x = W * (.12 + i * .2) + Math.sin(t * .25 + i) * 40;
      paint([[x, -400], [x + 120, -400], [x + 360 * (1 - depth * .3), H + 300], [x + 90, H + 300]],
        { fill: mixCol(PAL.cream, PAL.sky, .4), fillOp: 18 + 26 * (1 - depth), bleed: .6, tex: .3, ink: null });
    }
    // marine snow: slow white flecks that drift up
    for (let i = 0; i < 26; i++) {
      boilSeed('snow' + i);
      const y = ((hash(i) * (H + 200) - t * (10 + 16 * hash(i + 5))) % (H + 200) + H + 200) % (H + 200) - 100;
      const x = hash(i + 40) * W + Math.sin(t * .4 + i) * 14;
      paint(ellPts(x, y, 2 + 4 * hash(i + 9), 2 + 4 * hash(i + 9), 8), { wash: PAL.cream, washOp: 60 + 60 * hash(i + 3), ink: null });
    }
  }
  // the seabed: a soft mound of sand and two kelp fronds that sway
  function seabed(t, y0 = 960) {
    boilSeed('bed');
    paint(ellPts(W * .5, y0 + 150, W * .95, 260, 40, 18), { wash: mixCol(PAL.indigo, PAL.night, .35), fill: mixCol(PAL.teal, PAL.night, .55), fillOp: 90, bleed: .2, tex: .6, ink: PAL.ink, sw: .8 });
    for (const [kx, h] of [[260, 300], [1660, 240]]) {
      boilSeed('kelp' + kx);
      const P = []; for (let i = 0; i <= 7; i++) { const q = i / 7; P.push([kx + Math.sin(t * .9 + q * 3 + kx) * 26 * q, y0 + 20 - q * h]); }
      paint(ribbon(P, 34, 8), { wash: PAL.sap, fill: mixCol(PAL.teal, PAL.sap, .5), fillOp: 80, ink: PAL.ink, sw: .7 });
    }
  }
  // a shell on the sand with a tiny deep-sea fish trapped in its glow
  function shellLight(x, y, s, glowK, open) {
    boilSeed('shell');
    const g = clamp(glowK);
    if (g > .02) glow(x, y - s * .3, s * (1.6 + 1.4 * g), '#FFE9A8', .35 + .65 * g);
    push(); translate(x, y); rotate(open * .25);
    paint(ellPts(0, 0, s * .95, s * .62, 18), { wash: '#E9D8C4', fill: '#C9A882', fillOp: 80, ink: PAL.ink, sw: .8 });
    for (let i = -2; i <= 2; i++) inkLine([[i * s * .32, -s * .42], [i * s * .36, s * .34]], .7, mixCol('#C9A882', PAL.ink, .35), 'inkfine', .5);
    pop();
    if (g > .3) {   // the tiny fish inside: a dot with a little tail, its eyes hopeful
      boilSeed('tiny');
      paint(ellPts(x, y - s * .12, s * .3, s * .22, 12), { wash: mixCol(PAL.bright, PAL.pearl, .45), ink: PAL.ink, sw: .5 });
      paint([[x - s * .28, y - s * .12], [x - s * .55, y - s * .2], [x - s * .5, y - s * .02]], { wash: PAL.fin, ink: PAL.ink, sw: .4 });
      paint(ellPts(x + s * .1, y - s * .16, s * .05, s * .06, 6), { wash: PAL.ink, ink: null });
    }
  }
  // the tiny fish, free: (x, y) body centre, r its half-length; t drives the swim wave
  function tinyFish(x, y, r, t, o = {}) {
    boilSeed(o.key || 'tinyfree');
    const w = Math.sin(t * 9) * .3;
    push(); translate(x, y); rotate(o.rot || 0); if (w < 0) scale(1, -1);
    paint([[r * .6, 0], [r * 1.5, -r * .55 * (1 + w * .3)], [r * 1.35, 0], [r * 1.5, r * .55 * (1 + w * .3)]], { wash: PAL.fin, ink: PAL.ink, sw: .5 });
    paint(ellPts(0, 0, r, r * .7, 14), { wash: mixCol(PAL.bright, PAL.pearl, .5), fill: PAL.bright, fillOp: 60, ink: PAL.ink, sw: .6 });
    paint(ellPts(r * .35, -r * .12, r * .14, r * .16, 8), { wash: PAL.ink, ink: null });
    paint(ellPts(r * .36, -r * .17, r * .05, r * .05, 6), { wash: PAL.pearl, ink: null });
    pop();
  }
  // a ribbon of tiny bubbles trailing a point
  function bubbles(t, x0, y0, n, seed = 0) {
    for (let i = 0; i < n; i++) {
      boilSeed('bub' + seed + i);
      const ph = frac(t * .5 + hash(i + seed) + i * .13), r = (4 + 8 * hash(i + seed + 2)) * (1 - ph * .3);
      paint(ellPts(x0 + Math.sin(ph * 6 + i) * 26, y0 - ph * 300, r, r, 10), { wash: PAL.pearl, washOp: 90, ink: PAL.cream, sw: .5 });
    }
  }

  // ---------- shot A: the light on the seabed ----------
  const T_LAND = 3.1, T_OPEN = 4.0, T_FREE = 4.7;
  function shotA(t, lt, dur) {
    const drift = kf(t, [[0, 0], [6.4, -120]]);
    camBegin(960 + drift * .5, 560 + drift, kf(t, [[0, 1.18], [4.5, 1.06], [6.4, 1.12]]));
    sea(t, { depth: .82 });
    seabed(t);
    const shell = [1290, 700];
    // the shell's light is dim until she finds it, then flares when it opens
    const g = t < 2.4 ? .35 : t < T_OPEN ? lerp(.35, .75, seg(t, 2.4, T_OPEN)) : t < T_FREE ? 1 : .9 + .1 * Math.sin(t * 4);
    shellLight(shell[0], shell[1], 58, g, seg(t, T_OPEN, T_FREE));
    if (t > T_FREE) tinyFish(shell[0], shell[1] - 80 - 40 * Math.sin(t * 2.4), 22, t);

    // 大肥鱼: swims down from the top left, stops, notices the light, has the idea, dives in to chomp the shell open
    const glide = swim(t, .2, 2.6, 560, 980, 560, 640, 30, 70);
    let x = glide.x, y = glide.y, extra = {};
    if (t > 2.6) { const dive = ease(seg(t, 2.75, T_OPEN)); x = lerp(980, 1120, dive); y = lerp(600, 660, dive); extra = { rot: -.12 * dive, flip: false }; }
    const mood = emotions(t, [[0, 'happy'], [2.45, 'surprised', { lookX: .8, lookY: .6 }], [3.25, 'idea', { lookX: .8, lookY: .5 }],
                             [T_OPEN, 'chomp', { lookX: .6, lookY: .5 }], [T_FREE + .05, 'surprised', { lookX: .6, lookY: -.2 }]]);
    const pose = { ...mood, x: undefined, view: t < 2.6 ? glide.view : 'q', swimAmt: t < 2.6 ? glide.swimAmt : 0, swim: t * 1.8, aL: t > 3.1 && t < T_OPEN ? .8 : mood.aL, aR: mood.aR, dy: (mood.dy || 0) - .6 + (t < 2.6 ? glide.dy : 0) };
    if (t > T_FREE) pose.mouth = 'O';
    deepseeker(x, y, 30, { ...pose, ...extra, flip: t < 2.6 ? glide.flip : true });
    bubbles(t, x - 40, y - 260, 6, 1);
    const at = toScreen(lerp(x, W / 2, .45), lerp(y - 430, H / 2, .45));
    camEnd();
    boilSeed('transition');
    if (lt < .5) iris(...at, lerp(0, 1600, easeIn(lt / .5)), PAL.night);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, SEA);
  }

  // ---------- shot B: the ride up ----------
  function shotB(t, lt, dur) {
    const up = ease(seg(lt, 0, 6.0));                     // the camera climbs: the water gets pale
    camBegin(960 + 20 * Math.sin(lt * .7), 620 - up * 260, kf(lt, [[0, 1.15], [3, 1.08], [6, 1]]));
    sea(t, { depth: lerp(.82, .12, up) });
    const tx = 960 + 70 * Math.sin(lt * 1.4), ty = kf(lt, [[0, 760], [1.2, 640], [3.4, 580], [6.0, 470]]);
    // she rises with the little fish circling her tail
    const mood = emotions(lt, [[0, 'surprised'], [.7, 'love', { lookX: -.4, lookY: .4 }], [1.9, 'laugh'], [3.2, 'happy', { lookX: 1, lookY: -.7 }], [4.6, 'proud']]);
    const tailSwing = .5 + .5 * Math.sin(lt * 3.2);
    deepseeker(tx, ty, 34, { ...mood, view: lt > 2.6 ? 'q' : 'front', flip: lt > 2.6, swim: lt * 1.6, swimAmt: .3, rot: -.16 * up + .04 * Math.sin(lt * 3.2), aL: .5 + .3 * tailSwing, aR: .3 });
    // the little fish orbits her waist (where the whale tail curls), then settles on her headdress
    const orb = lt < 3.0;
    if (orb) {
      const a = lt * 4.2, fx = tx + Math.cos(a) * 150, fy = ty - 150 + Math.sin(a) * 40;
      tinyFish(fx, fy, 26, t, { key: 'orbit', rot: lt * 3 });
      for (let i = 0; i < 3; i++) { boilSeed('spark' + i); paint(starPts(tx + Math.cos(a - .3 - i * .2) * (150 + i * 22), ty - 150 + Math.sin(a - .3 - i * .2) * 40, 14 - i * 3, .3, 4), { wash: PAL.cream, ink: null }); }
    } else { const k = ease(seg(lt, 3.0, 3.5)), a = 12; tinyFish(tx + 96 * (1 - k) + 70 * k, ty - 345 - 40 * k - 6 * Math.sin(lt * 6), 24, t, { key: 'ride' }); }
    bubbles(t, tx + 40, ty + 260, 8, 7);
    // the surface: gold patches above
    if (up > .5) for (let i = 0; i < 4; i++) { boilSeed('surface' + i); paint(ellPts(tx - 400 + i * 260, 120 + Math.sin(t * .6 + i) * 16, 180, 26, 20), { wash: mixCol(PAL.cream, PAL.ochre, .3), washOp: 120 * (up - .5) * 2, ink: null }); }
    const at = toScreen(lerp(tx, W / 2, .45), lerp(ty - 380, H / 2, .45));
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, SEA);
    if (lt > dur - 1.2) {   // iris to the pair, hold, shut
      const r = lt < dur - .7 ? lerp(1600, 300, ease(seg(lt, dur - 1.2, dur - .7))) : lerp(300, 0, easeIn(seg(lt, dur - .7, dur - .02)));
      iris(at[0], at[1], r, PAL.cream);
    }
  }

  shots([[0, shotA], [6.4, shotB]]);
})();
