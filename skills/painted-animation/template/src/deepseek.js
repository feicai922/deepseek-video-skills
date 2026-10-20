// deepseek.js: DeepSeek 大肥鱼 — now a little whale: the animal mascot/logo, painted in watercolour and ink.
//
// She is no longer a whale girl: she is a chubby baby whale, the logo itself — a round deep-blue body with a pale belly,
// two flipper fins, a small dorsal fin, a blowhole, and a two-lobed fluke that curls up behind her; big glossy eyes, a
// soft mouth and blush on the front of the body. It is an original fan-made character, not the DeepSeek logo and not an
// official DeepSeek mascot.
//
// `u` is the size unit. (x, y) is the ground point under the body; the whale is about 9.9u tall (crown at y - 10.95u)
// and 8.2u wide with the fluke out. The face sits on the front of the body: eyes at (±2.35u, -6.95u), mouth at (0, -6.1u).
//
// Body-local coordinates (the o.draw / o.faceDraw / o.armL / o.armR hooks):
//   crown (0, -10.95); widest (±4.1, -6.7); belly patch from y -5.4 down to -1.3; fluke about (3.4, -3.0);
//   fin roots at (±3.5, -5.05); fin tips about (±4.3, -6.4).
//
// Everything here draws one frame. Motion comes from what you pass in: feel() / emotions() for moods, move() for
// dances, turn() for turns, jump() / take() / stroll() from core.js, and swim() / hopWalk() from this file.
//
// ---------- colour ----------
const FISH = { col: '#5B93FF', dk: '#2F5BD0', deep: '#1E3A8A', lt: '#A9C9FF', fin: '#6FD3E0', pearl: PAL.pearl, blush: PAL.blush, dress: '#1E3A6E', dressDk: '#13245A' };
// Tints shift the body and belly colour with the mood. tint: a name here or any hex colour; tintK: 0..1 strength.
const TINT = { pale: '#DCE8F2', flush: '#F26B5E', blue: '#5B6FAE', rosy: '#F7A6C4', green: '#8FC58A', gold: '#F2C14E' };
function fishCols(o) {
  const c = { col: o.col || FISH.col, dk: o.dk || FISH.dk, deep: o.deep || FISH.deep, lt: o.lt || FISH.lt, fin: o.fin || FISH.fin,
              dress: o.dress || FISH.dress, dressDk: o.dressDk || FISH.dressDk };
  const tc = o.tint && (TINT[o.tint] || o.tint), k = clamp(o.tintK ?? 1);
  if (!tc || k <= 0) return c;
  return { ...c, col: mixCol(c.col, tc, .45 * k), dk: mixCol(c.dk, mixCol(tc, PAL.ink, .3), .4 * k), deep: mixCol(c.deep, PAL.ink, .3 * k),
           lt: mixCol(c.lt, mixCol(tc, '#FFFFFF', .45), .4 * k), fin: mixCol(c.fin, tc, .35 * k), dress: mixCol(c.dress, tc, .3 * k) };
}

// ---------- views ----------
// Turns are drawn KEY VIEWS, like a cartoon model sheet, never a rotated 3D body. Every view faces screen-right;
// flip: true mirrors it. bx/by/rx/ry: the body (hats sit on the crown at by - ry), q: depth (1 front, 0 side, -1 back)
// for the belly, the far fin and the dorsal fin; face: { cx, sx, eyes, mouth, cheek, back } places the features in body
// units; tail: where the fluke curls up behind; fins: [x, y, scale, layer] with layer 0 behind the body, 1 in front.
const VIEWS = {
  front: { bx: 0, by: -6.95, rx: 4, ry: 4, bw: 1, tailAng: 0, q: 1, tail: 3.4,
           face: { cx: 0, sx: 1, eyes: [-2.5, 2.5], mouth: [0, -6.1], cheek: [-3.6, 3.6] },
           tail: { x0: 2.4, y0: -2.6, fx: 4.15, fy: -2.75, ang: -.12, sc: 1.15 },
           fins: [[-3.15, -4.8, 1.35, 1], [3.15, -4.8, 1.35, 1]] },
  q:     { bx: .3, by: -6.95, rx: 3.9, ry: 4, bw: 1.04, tailAng: .6, q: .8, tail: 3.2,
           face: { cx: 1.1, sx: .84, eyes: [-1.35, 3.35], mouth: [1.2, -6.1], cheek: [3.7] },
           tail: { x0: 2.3, y0: -2.6, fx: 4.35, fy: -2.95, ang: -.2, sc: 1.1 },
           fins: [[-3.0, -4.85, 1.15, 0], [3.35, -4.75, 1.4, 1]] },
  side:  { bx: 0, by: -6.95, rx: 3.9, ry: 4, bw: 1.1, tailAng: Math.PI / 2, q: 0, tail: 3.0,
           face: { cx: 1.5, sx: .66, eyes: [2.0], mouth: [2.25, -6.05], cheek: [-2.2] },
           tail: { x0: 2.2, y0: -2.65, fx: 4.9, fy: -2.6, ang: -.08, sc: 1.1 },
           fins: [[3.0, -4.2, 1.35, 1]] },
  qback: { bx: -.3, by: -6.95, rx: 3.9, ry: 4, bw: 1.02, tailAng: 2.2, q: -.8, tail: 3.2,
           face: { cx: 0, sx: 1, eyes: [], mouth: null, cheek: [], back: true },
           tail: { x0: 2.2, y0: -2.65, fx: 3.95, fy: -3.05, ang: -.26, sc: 1.05 },
           fins: [[-3.1, -4.8, 1.25, 0], [3.1, -4.8, 1.25, 0]], dorsal: true },
  back:  { bx: 0, by: -6.95, rx: 4, ry: 4, bw: 1, tailAng: Math.PI, q: -1, tail: 3.4,
           face: { cx: 0, sx: 1, eyes: [], mouth: null, cheek: [], back: true },
           tail: { x0: 2.15, y0: -2.7, fx: 3.8, fy: -3.2, ang: -.3, sc: 1.0 },
           fins: [[-3.15, -4.75, 1.3, 0], [3.15, -4.75, 1.3, 0]], dorsal: true },
};
// Key view for a heading in turns: 0 = front, .25 = facing right, .5 = back, .75 (or -.25) = facing left.
// Snaps to the nearest eighth, which is how a drawn turn works: front -> q -> side, one drawing per step.
function spinView(a) {
  const K = [['front', 0], ['q', 0], ['side', 0], ['qback', 0], ['back', 0], ['qback', 1], ['side', 1], ['q', 1]];
  const [view, f] = K[((Math.round(a * 8) % 8) + 8) % 8]; return { view, flip: !!f };
}
// A turn from heading a0 to a1 (in turns) between t0 and t1. It steps through the key views and smears the in-between
// drawings. Spread it in: deepseeker(x, y, u, { ...feel('happy', t), ...turn(t, 2, 2.2, 0, .25) }).
function turn(t, t0, t1, a0, a1) {
  const k = ease(seg(t, t0, t1)), v = spinView(lerp(a0, a1, k));
  return { ...v, smear: t > t0 && t < t1 ? .55 * Math.sin(k * Math.PI) : 0, smearDir: 0 };
}

// ---------- the little whale ----------
// Options (all optional):
//   pose:    dx, dy (in u; negative dy = up), sq (squash; negative stretches), rot (pivots at the body's base), flip,
//            sx, sy, aL, aR (fin angles: 0 = resting down, + = raised out and up, - = tucked under), walk (a waddle:
//            the body rocks and the fins paddle), swim (tail-beat phase), swimAmt 0..1 (travelling: leans into the
//            motion), noShadow, noHat
//   view:    front | q | side | qback | back (see VIEWS). smear 0..1 + smearDir ±1 (0 = both sides) for fast moves
//   face:    eyes (a name, or [left, right]), mouth, lookX / lookY (-1..1), squint 0..1, blush 0..1,
//            gloom 0..1 (a dark shadow over the brow), seed (blink timing)
//   colour:  col / dk / deep / lt (body), fin (fins, fluke, belly highlight), or tint + tintK
//   extras:  bag (the little satchel), spout 0..1 (a blowhole spout), emote + emoteK + emoteAge,
//            draw(u, sw) (painted over everything), faceDraw(u, sw) (in front of the face),
//            armL / armR (u, sw) props, each called at that fin's tip
//   boil:    boilKey (a stable id for its boil seeds; defaults to call order, so set it if characters come and go)
//
// Drawing note: this engine runs in p5 WEBGL, where translate()/scale() only reach the canvas after the next
// resetMatrix(). So nothing here uses push()/translate() for the body: every part is built in body-local units (u)
// and mapped to canvas pixels by map() (scale, squash, rotation, flip, position) before it is painted.
function deepseeker(x, y, u, o = {}) {
  const id = o.boilKey ?? ++CHAR_N, rs = part => boilSeed(`deepseeker ${id} ${part}`);
  x += (o.dx || 0) * u;
  const V = VIEWS[o.view] || VIEWS.front;
  const dy = (o.dy || 0) * u, sq = clamp((o.sq || 0) + (o.take || 0), -1, 1), sm = clamp(o.smear || 0);
  const sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1), J = u * .07;
  const C = fishCols(o), back = !!(V.face && V.face.back);
  const swp = Math.sin((o.swim || 0) * TAU), swimAmt = clamp(o.swimAmt || 0);
  const sx = (o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .55) * (1 + sm * .3), syg = (o.sy ?? 1) * (1 - sq);
  const th = (o.rot || 0) + (o.swim ? -.09 * swimAmt * Math.sin(V.tailAng) : 0), ct = Math.cos(th), sn = Math.sin(th);
  const ox = x, oy = y + dy;
  // body-local (bx, by) in u -> canvas px
  function map(bx, by) { const px = bx * u * sx, py = by * u * syg; return [ox + px * ct - py * sn, oy + px * sn + py * ct]; }
  const poly = pts => pts.map(([a, b]) => map(a, b));
  // a body-local paint()/inkLine() pair: the points are mapped, so no canvas transform is involved
  function P(pts, style) { if (pts && pts.length) paint(poly(pts), style); }
  function INK(pts, weight, col = PAL.ink, brush = 'ink', curv = .5) { if (pts && pts.length > 1) inkLine(poly(pts), weight, col, brush, curv); }
  const BODY = C.col, BODYD = C.dk, BODYDEEP = C.deep, FIN = C.fin;
  const BELLY = mixCol(C.lt, '#FFFFFF', .52), BELLYD = mixCol(C.lt, C.dk, .3);
  const tipL = [0, 0], tipR = [0, 0];

  rs('shadow');
  if (!o.noShadow) {
    const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .06);
    paint(ellPts(x, y + u * .1, u * 2.55 * f, u * .58 * f, 22), { fill: PAL.ink, fillOp: 70, bleed: .28, tex: .3, border: .1, ink: null });
  }
  if (sm > .05) smearTrail(x, y - 6.2 * u + dy, u, V, sm, o.smearDir ?? (o.flip ? -1 : 1), BODY);

  // ---------- 1. the fluke, behind the body ----------
  // A whale's tail: a short stalk from under the body and two long lobes that curl up and apart, with a notch between
  // them. It keeps its own beat (swp) so the whale never looks like a stiff prop.
  rs('tail');
  {
    const T0 = V.tail, ang = T0.ang + .13 * swp - .05 * swimAmt, fx = T0.fx + .14 * swp, fy = T0.fy + .08 * swp;
    const c0 = Math.cos(ang), s0 = Math.sin(ang);
    const rot = ([px, py], k = T0.sc) => [fx + (px * c0 - py * s0) * k, fy + (px * s0 + py * c0) * k];
    // the stalk, widening where it meets the fluke
    P(ribbon(through([[T0.x0, T0.y0], [T0.x0 + (fx - T0.x0) * .5, T0.y0 + (fy - T0.y0) * .5 - .3], [fx - .2 * c0, fy - .2 * s0]], 4), 1.15 * T0.sc, .8 * T0.sc),
      { wash: FIN, fill: mixCol(FIN, BODYDEEP, .45), fillOp: 70, ink: PAL.ink, sw: sw * .8 });
    // the fluke: TWO separate lobes that spring from the stalk and sweep apart, with the notch between them
    for (const sd of [-1, 1]) {
      const la = ang + sd * .34, cl = Math.cos(la), sl = Math.sin(la);
      const lobe = through([[.04 * sd, .02], [.68 * sd, -.2], [1.45 * sd, -.5], [2.2 * sd, -.78], [2.5 * sd, -.5],
                            [2.3 * sd, -.02], [1.55 * sd, .34], [.8 * sd, .28], [.18 * sd, .12], [.12 * sd, .02]], 6)
        .map(([px, py]) => [fx + (px * cl - py * sl) * T0.sc, fy + (px * sl + py * cl) * T0.sc]);
      P(lobe, { wash: mixCol(FIN, BODYD, .18), fill: mixCol(FIN, BODYD, .42), fillOp: 80, bleed: .12, tex: .45, ink: PAL.ink, sw: sw * .85 });
      INK([rot([.55 * sd, -.12 * sd]), rot([1.75 * sd, -.55 * sd])], sw * .55, mixCol(FIN, '#FFFFFF', .6), 'inkfine', .45);
    }
  }
  // ---------- 2. the fins behind the body ----------
  const fin = ([bx, by, fs, layer], pass) => {
    if (layer !== pass) return;
    const a = bx < 0 ? (o.aL ?? .1) : (o.aR ?? .1), sd = bx < 0 ? -1 : 1;
    const r = -.05 - a * .9, c = Math.cos(r), s = Math.sin(r), base = [[-.2, -.4], [.45, -.58], [1.1, -.46], [1.55, -.02], [1.72, .52], [1.55, .88], [1.05, 1.0], [.5, .86], [.1, .45], [-.16, .02]];
    const pts = through(base.map(([px, py]) => [sd * (px * c - py * s) * fs + bx, (px * s + py * c) * fs + by]), 4);
    rs('fin'); P(pts, { wash: layer ? FIN : mixCol(FIN, BODYD, .18), fill: mixCol(FIN, BODYDEEP, .4), fillOp: 75, ink: PAL.ink, sw: sw * .8 });
    const tip = pts[Math.floor(pts.length * .72)];
    if (sd > 0) tipR.splice(0, 2, tip[0], tip[1]); else tipL.splice(0, 2, tip[0], tip[1]);
    return base;
  };
  const drawFins = pass => (V.fins || []).forEach(f => fin(f, pass));
  drawFins(0);

  // ---------- 3. the body ----------
  rs('body');
  const BODY_PTS = [
    [0, -10.95], [1.62, -10.82], [3.0, -10.02], [3.86, -8.55], [4.12, -6.75],
    [3.98, -5.0], [3.6, -3.62], [3.02, -2.72], [2.16, -2.22], [1.12, -2.08],
    [.1, -2.2], [-1.05, -2.62], [-2.24, -3.36], [-3.22, -4.52], [-3.94, -6.0],
    [-4.08, -7.4], [-3.8, -8.9], [-3.0, -10.1], [-1.6, -10.85], [0, -10.95],
  ];
  const BW = (V.bw || 1);
  P(through(BODY_PTS.map(([px, py]) => [px * BW, py]), 6), { wash: BODY, fill: BODYD, fillOp: 55, bleed: .12, tex: .55, ink: PAL.ink, sw: sw * .95 });
  // a soft rim light down the crown, so the body is not one flat fill

  // the belly: a pale patch on the front, with throat grooves
  if (V.q > -.45) {
    rs('belly');
    const BELLY_PTS = [[0, -5.5], [1.8, -5.22], [2.6, -4.35], [2.82, -3.3], [2.5, -2.62], [1.3, -2.3], [0, -2.24],
                       [-1.15, -2.55], [-2.3, -3.3], [-2.68, -4.3], [-1.8, -5.22], [0, -5.5]];
    P(through(BELLY_PTS.map(([px, py]) => [px * BW, py]), 5), { wash: BELLY, fill: BELLYD, fillOp: 35, bleed: .18, tex: .35, ink: PAL.ink, sw: sw * .5 });
  }
  // the dorsal fin: only from behind
  if (V.dorsal) {
    rs('dorsal');
    P(through([[-.62, -9.15], [-.34, -10.3], [.08, -10.62], [.46, -10.0], [.58, -9.05], [0, -8.95]], 5),
      { wash: mixCol(BODY, PAL.ink, .12), fill: BODYD, fillOp: 55, ink: PAL.ink, sw: sw * .8 });
  }
  // the blowhole: two little nostrils on the crown
  rs('blowhole');
  {
    const bx0 = V.q < .35 ? 0 : V.q < .9 ? .55 : 0, by0 = V.q < .35 ? -10.35 : -10.25;
    for (const s of [-1, 1]) P(ellPts(bx0 + s * .24, by0, .17, .11, 10, 0, s * .3), { wash: mixCol(BODYDEEP, PAL.ink, .45), ink: null });
  }
  if (o.spout !== 0) {   // the spout: a whale's clearest cue, and it costs three droplets
    const k = clamp(o.spout ?? .75), h = 1.5 + .35 * Math.sin(T * 2.2);
    for (let i = 0; i < 5; i++) {
      const ph = frac(T * 1.1 + i / 5), rs2 = (.15 + .1 * ph) * (1 - ph * .35) * k;
      P(ellPts(.02 + Math.sin(i * 1.7 + T * 1.6) * .38 * (1 + ph) * k, -10.55 - ph * h * k, rs2, rs2 * 1.25, 8), { wash: PAL.sky, fill: PAL.pearl, fillOp: 60, ink: PAL.ink, sw: sw * .35 });
    }
  }

  // ---------- 4. face: eyes, mouth, cheeks, glasses ----------
  if (!back) {
    const Fc = V.face;
    rs('eyes'); eyes(Fc, u, o, sw, sm, P, INK);
    rs('mouth'); mouth(Fc, u, o.mouth === undefined ? 'smile' : o.mouth, sw, 0, P, INK);   // undefined = the resting smile
    rs('blush'); if (o.blush) blush(u, sw, Fc, o.blush === true ? 1 : o.blush, P, INK);
    if (o.gloom > .02) gloom(V, C, u, sw, o.gloom, P, INK);
    rs('glasses'); if (o.glasses) glasses(Fc, u, sw, o.glasses, P, INK);
    if (o.faceDraw) { rs('faceDraw'); o.faceDraw(u, sw); }
  }

  // ---------- 5. the fins in front, hats, the satchel ----------
  rs('hat'); if (!o.noHat) hat(V, u, o.hat, sw, P, INK);
  drawFins(1);
  if (o.bag) { rs('bag'); drawBag(V, C, u, sw, o, map, V.bx); }
  rs('draw'); if (o.draw) o.draw(u, sw);

  // ---------- 6. the emote ----------
  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    const ex = x + dir * (top ? 0 : 5.3) * u, ey = y + dy + (top ? -14.6 : -12.4 + (o.emoteY || 0)) * u * (1 - sq);
    emote(o.emote, ex, ey, u * .95, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');   // so whatever is drawn next doesn't depend on this pose

  // the props pinned to the fins follow the fin tips
  for (const [which, tip] of [['L', tipL], ['R', tipR]]) {
    const hook = which === 'L' ? o.armL : o.armR;
    if (!hook) continue;
    const p = map(tip[0], tip[1]);
    push(); translate(p[0], p[1]); hook(u, sw); pop();
  }
}

// A smear drawing: dry-brush streaks trailing a fast move (dir ±1), or on both sides for a spin (0).
function smearTrail(x, y, u, V, k, dir, col) {
  const sides = dir === 0 ? [-1, 1] : [-dir];
  for (const s of sides) for (let i = 0; i < 4; i++) {
    const yy = y - (5.4 - i * 1.7) * u, x0 = x + s * V.rx * .7 * u, len = (3 + 3 * hash(i + 7 * s)) * u * k;
    inkLine([[x0, yy], [x0 + s * len * .5, yy + jit(u * .1)], [x0 + s * len, yy]], 2.2 * k, col, 'dry', .3);
    if (i % 2) inkLine([[x0 + s * len * .3, yy + .5 * u], [x0 + s * len * 1.1, yy + .5 * u]], .6, PAL.ink, 'inkfine', 0);
  }
}

// The satchel: a DeepSeek-blue bag slung at the whale's side, strap over the back, holding the answers.
function drawBag(V, C, u, sw, o, map, bodyCx) {
  const side = V.q < 0 ? -1 : 1, bx = side * 2.55 + V.face.cx * .35, by = -3.1, w = 1.35, h = 1.25, col = '#1D4ED8';
  const rr = (x0, y0, ww, hh, r) => rrPts(x0, y0, ww, hh, r).map(([a, b]) => map(a, b));
  if (V.q > -.4) inkLine([map(-side * 1.35, -5.9), map(side * 1.75, -4.5), map(bx, by - h * .55)], sw * 1.4, mixCol(col, PAL.ink, .25), 'ink', .5);
  paint(rr(bx - w / 2, by - h / 2, w, h, .32), { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 60, ink: PAL.ink, sw: sw * .8 });
  paint(rr(bx - w / 2, by - h / 2, w, .46, .15), { wash: mixCol(col, PAL.cream, .18), ink: PAL.ink, sw: sw * .6 });
  paint(rr(bx - .2, by - h / 2 - .1, .4, .34, .08), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .55 });
  if (o.bagNote) o.bagNote(u, sw);
}
// Blush: two soft pink circles with three hatch marks when it's strong.
function blush(u, sw, Fc, b, P, INK) {
  const eyes = Fc.eyes.length ? Fc.eyes : [Fc.cx - 2.4, Fc.cx + 2.4];
  for (const ex of eyes) {
    const cx = ex + (ex < Fc.cx ? -1.15 : 1.15) * (Fc.eyes.length === 1 ? -1 : 1), cy = -5.55;
    P(ellPts(cx, cy, .78, .36, 14), { fill: PAL.blush, fillOp: 170 * clamp(b), bleed: .2, ink: null });
    if (b > .6) for (let k = 0; k < 3; k++) INK([[cx - .4 + k * .32, cy + .15], [cx - .24 + k * .32, cy - .25]], sw * .4, mixCol(PAL.blush, PAL.ink, .35), 'inkfine', 0);
  }
}


// Gloom: a dark wash over the forehead with hanging lines (dread, despair, a guilty conscience), under the fringe.
function gloom(V, C, u, sw, g, P, INK) {
  const cx = V.face.cx;
  P(ellPts(cx, -7.6, 2.9, .7, 18), { fill: PAL.indigo, fillOp: 130 * g, bleed: .08, tex: .5, border: .6, ink: null });
  for (let i = 0; i < 4; i++) { const gx = cx - 1.8 + i * 1.2; INK([[gx, -8.05], [gx + jit(.04), -8.05 - 1.2 * g * (.7 + .3 * hash(i))]], sw * .45, PAL.ink, 'inkfine', 0); }
}
// ---------- eyes ----------
// Big glossy fish eyes, drawn around each eye's body-local centre (x in u, y = -6.95): a dark iris with two
// catchlights and a lid line over the top.
// normal, look, wide, happy, closed, sleepy, narrow, angry, determined, sad, teary, cry, squeeze, shine, scared,
// blank, spark, red, heart, x, swirl, dot, shades. o.eyes may be a pair: ['narrow', 'wide']; a profile view has one.
function eyes(Fc, u, o, sw, smear, P, INK) {
  const xs = Fc.eyes;
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const sqz = clamp(o.squint || 0);
  if (smear > .5) { for (const x of xs) P([[[x - .8, -7], [x + .8, -7]]][0], { ink: PAL.ink, sw: sw * 1.4 }); return; }
  if (sqz > .8) { for (const x of xs) P([[x - .75, -6.9], [x + .75, -6.9]], { ink: PAL.ink, sw }); return; }
  const k = sqz > 0 ? 1 - sqz : 1;
  for (let i = 0; i < xs.length; i++) eye(kinds[i] || 'normal', xs[i], u, o, sw, P, INK, k, xs.length);
}

// One eye at body-local x = ex (u), centred on y = -6.95. k = lid closure 0..1.
function eye(e, ex, u, o, sw, P, INK, k = 1, n = 2) {
  const lx = (o.lookX || 0) * .22, ly = (o.lookY || 0) * .2;
  const blinkOn = ['normal', 'look', 'wide', 'shine'].includes(e) && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
  const at = (x, y) => [ex + x, -6.95 + y];   // body-local
  const el = (cx, cy, rx, ry, nn = 16, r = 0) => ellPts(ex + cx, -6.95 + cy, rx, ry, nn, 0, r);
  const L = (pts) => pts.map(([a, b]) => at(a, b));
  if (blinkOn) { P(L([[-.8, .1], [0, .4], [.8, .1]]), { ink: PAL.ink, sw: sw * 1.1 }); return; }
  const oval = (rx, ry) => {
    P(el(lx, ly * 1.2, rx, ry * k, 18), { wash: PAL.ink, ink: null });
    if (k > .45) {
      P(el(lx - rx * .28, ly * 1.2 - ry * .36 * k, rx * .42, ry * .36 * k, 10), { wash: PAL.pearl, ink: null });
      P(el(lx + rx * .32, ly * 1.2 + ry * .4 * k, rx * .17, ry * .14 * k, 8), { wash: PAL.pearl, washOp: 200, ink: null });
    }
  };
  const lid = (drop = 0) => INK([[-.86, -.52 + drop], [-.32, -1.0 + drop], [.34, -1.0 + drop], [.88, -.48 + drop]], sw * .85, PAL.ink, 'ink', .55);
  switch (e) {
    case 'normal': oval(.72, .92); lid(); break;
    case 'look': oval(.68, .88); lid(); break;
    case 'wide': oval(.86, 1.1); lid(-.12); break;
    case 'happy': P(L([[-.85, .3], [0, -.62], [.85, .3]]), { ink: PAL.ink, sw: sw * 1.5 }); break;
    case 'closed': P(L([[-.85, -.05], [0, .42], [.85, -.05]]), { ink: PAL.ink, sw: sw * 1.3 }); break;
    case 'sleepy': oval(.56, .46); P(L([[-.85, -.02], [0, .2], [.85, -.02]]), { ink: PAL.ink, sw: sw * 1.2 }); break;
    case 'narrow': P(el(lx, -.12, .58, .28, 12), { wash: PAL.ink, ink: null }); break;
    case 'angry': case 'determined': {
      const hi = e === 'angry' ? .95 : .7, side = ex < 0 ? 1 : -1;
      P(L([[-.8, -.75], [.8, -.75 + hi * side], [.8, .55], [-.8, .55]]), { wash: PAL.ink, ink: null });
      if (e === 'determined') P(el(lx - .2, .3, .15, .17, 8), { wash: PAL.pearl, washOp: 200, ink: null });
      break;
    }
    case 'sad': case 'teary': {
      const hi = .9, side = ex < 0 ? 1 : -1;
      P(L([[-.8, -.75 + hi * side], [.8, -.75], [.8, .7], [-.8, .7]]), { wash: PAL.ink, ink: null });
      P(el(lx + .22, .28, .14, .16, 8), { wash: PAL.pearl, washOp: 200, ink: null });
      if (e === 'teary') {
        const w = Math.sin(T * 9 + ex) * .06;
        P(el(.2, 1.0 + w, .78, .32, 14), { wash: PAL.sky, washOp: 210, fill: '#FFFFFF', fillOp: 60, ink: PAL.ink, sw: sw * .4 });
      }
      break;
    }
    case 'cry': {
      const sg = ex < 0 ? -1 : 1;
      P(L([[-.8 * sg, .3], [-.3 * sg, -.05], [.3 * sg, .15], [.8 * sg, -.2]]), { ink: PAL.ink, sw: sw * 1.3 });
      const R = []; for (let j = 0; j <= 5; j++) R.push([ex + sg * .5 + Math.sin(T * 8 + j) * .1 * j / 5, -6.6 + j * .62]);
      paint(ribbon(R, .4 * u, .7 * u), { wash: PAL.sky, washOp: 230, fill: '#FFFFFF', fillOp: 70, ink: PAL.ink, sw: sw * .45 });
      for (let j = 0; j < 2; j++) {
        const ph = frac(T * 1.8 + j * .5 + (sg > 0 ? .25 : 0));
        const p = arcPt([ex + sg * .9, -6.75], [ex + sg * 3.2, -4.6], 1.2, ph);
        paint(ellPts(p[0] * u + oxOf(P), p[1] * u + oyOf(P), .2 * u * (1 - ph * .5), .28 * u * (1 - ph * .5), 8), { wash: PAL.sky, ink: PAL.ink, sw: sw * .35 });
      }
      break;
    }
    case 'squeeze': { const sg = ex < 0 ? -1 : 1; P(L([[.55 * sg, -.6], [-.55 * sg, 0], [.55 * sg, .6]]), { ink: PAL.ink, sw: sw * 1.4 }); break; }
    case 'shine':
      P(el(lx * .6, .7, .72, .94, 16), { wash: PAL.ink, ink: null });
      P(el(lx * .6 - .24, .7 - .35, .3, .32, 10), { wash: PAL.pearl, ink: null });
      P(ellPts(ex + lx * .6 + .3, -6.95 + .7 - .3, .24, .24, 4, 0, -.8), { wash: PAL.pearl, ink: null });
      break;
    case 'scared':
      P(el(0, 0, .78, .96, 16), { wash: PAL.pearl, ink: PAL.ink, sw: sw * .7 });
      P(el((o.lookX || 0) * .2 + Math.sin(T * 40) * .04, .12, .24, .34, 10), { wash: PAL.ink, ink: null });
      break;
    case 'blank': P(el(0, 0, .68, .86, 14), { wash: PAL.pearl, ink: PAL.ink, sw: sw * .8 }); break;
    case 'spark':
      P(el(0, 0, 1.3, 1.3, 18), { fill: PAL.ochre, fillOp: 90, bleed: .3, ink: null });
      P(ellPts(ex, -6.95, 1.15 * (1 + .12 * Math.sin(T * 14)), 1.15 * (1 + .12 * Math.sin(T * 14)), 10, 0, -Math.PI / 5), { wash: PAL.pearl, fill: PAL.ochre, fillOp: 80, ink: PAL.ink, sw: sw * .55 });
      break;
    case 'red':
      P(el(0, 0, 1.15, 1.15, 18), { fill: '#E0283F', fillOp: 110, bleed: .35, ink: null });
      P(el(0, 0, .52, .78, 14), { wash: '#FF2F4A', ink: PAL.ink, sw: sw * .5 });
      break;
    case 'heart': P(heartPts(ex, -6.85, .78 * (1 + .1 * pulse(T))), { wash: '#E2476E', ink: PAL.ink, sw: sw * .5 }); break;
    case 'x': P(L([[-.7, -.7], [.7, .7]]), { ink: PAL.ink, sw: sw * 1.1 }); P(L([[.7, -.7], [-.7, .7]]), { ink: PAL.ink, sw: sw * 1.1 }); break;
    case 'swirl': {
      const sp = []; for (let j = 0; j < 16; j++) { const a = j * .7 + T * 6 * (ex < 0 ? -1 : 1), r = j * .055; sp.push([ex + Math.cos(a) * r, -6.95 + Math.sin(a) * r]); }
      paint(through(sp), { ink: PAL.ink, sw: sw * .6, br: 'inkfine' }); break;
    }
    case 'dot': P(el(lx * .5, ly, .36, .44, 12), { wash: PAL.ink, ink: null }); break;
    case 'shades':
      P(L([[-1.1, -.35], [1.1, -.35], [1.0, .45], [0, .6], [-1.0, .45]]), { wash: '#22223A', ink: PAL.ink, sw: sw * .8 });
      P(L([[-.8, .05], [-.3, -.25]]), { ink: PAL.pearl, sw: sw * .45 }); break;
    default: oval(.62, .8); lid();
  }
}
// (helpers that pull the fish's origin/size back out of a mapped point are not needed: paints above map directly)
function oxOf() { return 0; } function oyOf() { return 0; }

// Round glasses: two pearl lenses with an ink rim and a bridge (reading the seabed, or a myopic fish).
function glasses(Fc, u, sw, kind, P, INK) {
  const xs = Fc.eyes.length ? Fc.eyes : [Fc.cx - 2.6, Fc.cx + 2.6];
  for (const x of xs) {
    P(ellPts(x, -6.95, 1.5, 1.35, 18), { wash: PAL.pearl, washOp: kind === 'sun' ? 210 : 60, ink: PAL.ink, sw: sw * .8 });
    INK([[x - .5, -7.7], [x - .95, -7.25]], sw * .5, PAL.pearl, 'inkfine', 0);
  }
  if (xs.length > 1) INK([[xs[0] + 1.45, -7.1], [xs[1] - 1.45, -7.1]], sw * .7, PAL.ink, 'ink', .4);
}

// ---------- mouths ----------
// A fish mouth is double-lobed and dark: a wobbly ink outline around a plum-dark fill, with a soft rose lip below.
// `chomp` 0..1 opens the big mouth (a hinge under the nose, four teeth).
// o, O, smile, grin, flat, wobble, cat, frown, smirk, laugh, open, wail, teeth, tongue, pout, yawn, yum
function mouth(Fc, u, m, sw, chomp, P, INK) {
  const [mx] = Fc.mouth, my = -5.55, dark = '#C4667C', r = .62;
  const W = (y = my - .2, w = .8) => INK([[mx - w, y], [mx - w * .45, y + .3], [mx, y + .08], [mx + w * .45, y + .3], [mx + w, y]], sw * .9, PAL.ink, 'ink', .5);   // the little soft smile
  const L = pts => pts.map(([a, b]) => [mx + a, my + b]);   // mouth-local, for the big mouths
  // the resting fish mouth: two soft lips round a dark opening
  const lips = (w = 1, h = .42) => {
    const pts = [];
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; pts.push([mx + Math.cos(a) * w * (1 + .12 * Math.sin(a * 2)), my + Math.sin(a) * h * .55]); }
    P(ellPts(mx, my + h * .1, w * .95, h * .62, 16), { wash: PAL.rose, washOp: 110, ink: null });
    P(pts, { wash: dark, ink: PAL.ink, sw: sw * .7 });
    P(ellPts(mx - w * .26, my - h * .06, w * .2, h * .14, 8), { wash: '#7A3A50', ink: null });
  };
  // A smile: a soft open mouth whose lower edge curves up into a smile (up = 1), or down into a frown (up = -1).
  const smileLip = (up = 1) => {
    // a whale's smile runs wide across the muzzle: a long jaw line whose ends curl up into cheek corners
    const MY = -5.55, w = 1.5, h = .4;
    const mouthPts = [[mx - w, MY - h * .45], [mx - w * .55, MY - h * .85], [mx, MY - h * .95], [mx + w * .55, MY - h * .85], [mx + w, MY - h * .45]];
    for (let i = 0; i <= 16; i++) { const q = i / 16; mouthPts.push([mx + (1 - q * 2) * w, MY - h * .45 + up * h * 1.25 * Math.sin(q * Math.PI)]); }
    P(mouthPts, { wash: dark, ink: PAL.ink, sw: sw * .95 });
    P(ellPts(mx, MY + h * .28, w * .3, h * .2, 10), { wash: '#C4617A', ink: null });   // the tongue, so it reads as a happy open mouth
    for (const s of [-1, 1]) {   // the mouth line carries on past the lips, then flicks up
      INK([[mx + s * (w + .02), MY - h * .35], [mx + s * (w + .62), MY - h * .1], [mx + s * (w + 1.25), MY - h * .7]], sw * .9, PAL.ink, 'ink', .6);
    }
  };
  if (chomp > .02) {
    const open = clamp(chomp), h = 1 + 2.2 * open;
    P(ellPts(mx, my + .55 * h, .92 * (1 + .3 * open), h, 20), { wash: dark, ink: PAL.ink, sw: sw * .8 });
    if (open > .3) {
      P(ellPts(mx, my + .9 * h, .5, .22, 12), { wash: PAL.rose, ink: null });
      const tw = .3 * Math.min(1, open * 1.5);
      for (const sd of [-1, 1]) {
        P([[mx + sd * .2, my + .12], [mx + sd * .6, my + .12], [mx + sd * .42, my + .12 + tw]], { wash: PAL.pearl, ink: PAL.ink, sw: sw * .4 });
        P([[mx + sd * .12, my + h * .9], [mx + sd * .5, my + h * .9], [mx + sd * .3, my + h * .9 - tw]], { wash: PAL.pearl, ink: PAL.ink, sw: sw * .4 });
      }
    }
    line([[-.9, -.35], [-.3, -.55], [.3, -.55], [.9, -.35]], 1, .6);
    return;
  }
  switch (m) {
    case 'o': lips(.42, .5); break;
    case 'O': P(ellPts(mx, my + .15, .55, .68, 16), { wash: dark, ink: PAL.ink, sw: sw * .8 }); P(ellPts(mx, my + .1, .32, .3, 10), { wash: '#7A3A50', ink: null }); break;
    case 'smile': smileLip(1); break;
    case 'yum': smileLip(1); INK([[mx - .5, my - .55], [mx, my - .95], [mx + .5, my - .55]], sw * .7, PAL.ink, 'ink', .6); P(ellPts(mx + .62, my + .72, .2, .24, 8), { wash: PAL.blush, ink: PAL.ink, sw: sw * .4 }); break;
    case 'frown': smileLip(-1); break;
    case 'grin': P(L([[-1.2, -.35], [1.2, -.35], [.85, .65], [0, .95], [-.85, .65]]), { wash: dark, ink: PAL.ink, sw: sw * .7, curv: .3 }); break;
    case 'flat': lips(.7, .3); break;
    case 'wobble': { const w = Math.sin(T * 9) * .06; P([[-.8, my + w], [-.4, my - .28 + w], [0, my + .05 + w], [.4, my - .28 - w], [.8, my + w], [.6, my + .36], [0, my + .48], [-.6, my + .36]], { wash: dark, ink: PAL.ink, sw: sw * .7, curv: .5 }); break; }
    case 'cat': P(ellPts(mx, my + .1, .55, .3, 14), { wash: dark, ink: PAL.ink, sw: sw * .7 }); INK([[mx - 1.0, my - .2], [mx - .4, my - .35], [mx + .4, my - .35], [mx + 1.0, my - .2]], sw * .8, PAL.ink, 'ink', .5); break;
    case 'smirk': { const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; pts.push([mx + .25 + Math.cos(a) * .6, my - .05 + Math.sin(a) * .26 + Math.cos(a) * .12]); } P(pts, { wash: dark, ink: PAL.ink, sw: sw * .7 }); INK([[mx - .7, my + .18], [mx + .2, my + .1]], sw * .7, PAL.ink, 'ink', .5); break; }
    case 'laugh':
      P(L([[-1.25, -.5], [0, -.25], [1.25, -.5], [1.0, .4], [0, .9], [-1.0, .4]]), { wash: dark, ink: PAL.ink, sw: sw * .7, curv: .4 });
      P(ellPts(mx, my + .6, .6, .24, 12), { wash: PAL.rose, ink: null }); break;
    case 'open':
      P(ellPts(mx, my + .1, .55, .6, 16), { wash: dark, ink: PAL.ink, sw: sw * .7 });
      P(ellPts(mx, my + .4, .32, .15, 10), { wash: PAL.rose, ink: null }); break;
    case 'wail': {
      const w = Math.sin(T * 30) * .06;
      P(L([[-1.25, -.1 + w], [-.45, -.5], [.45, -.5 - w], [1.25, -.1], [.95, 1.05], [-.95, 1.05]]), { wash: dark, ink: PAL.ink, sw: sw * .7, curv: .3 });
      P(ellPts(mx, my + .75, .62, .2, 12), { wash: PAL.rose, ink: null }); break;
    }
    case 'teeth':
      P(rrPts(mx - 1.1, my - .35, 2.2, .85, .16), { wash: PAL.pearl, ink: PAL.ink, sw: sw * .7 });
      for (const t of [-.55, 0, .55]) line([[t, -.33], [t, .48]], .5, 0);
      break;
    case 'tongue':
      P(L([[.05, .05], [.7, .05], [.68, .62], [.36, .85], [.06, .62]]), { wash: PAL.rose, ink: PAL.ink, sw: sw * .55, curv: .5 });
      W(-.35, .7); break;
    case 'pout': line([[-.42, .2], [0, -.1], [.42, .2]], 1.1, .6); line([[-.24, .45], [0, .55], [.24, .45]], .6, .6); break;
    case 'yawn':
      P(ellPts(mx, my + .3, .5, .9, 16), { wash: dark, ink: PAL.ink, sw: sw * .7 });
      P(ellPts(mx, my + .85, .3, .2, 10), { wash: PAL.rose, ink: null }); break;
  }
}

// ---------- hats (worn, not designed: the fish's tail and fins are already the look) ----------
// star, cap, sailor, crown, snorkel, headphones, bow, flower, beanie, tophat, goggles, leaf
function hat(V, u, h, sw, P, INK) {
  if (!h || (V.face && V.face.back)) return;
  const top = V.by - V.ry;   // the crown, in u
  if (h === 'star') {
    P(ellPts(0, top - .5, 1.9, 1.9, 10, 0, -Math.PI / 5), { wash: PAL.ochre, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: sw * .8 });
  } else if (h === 'cap') {
    P([[-3.5, top + .3], [-3.1, top - 1.5], [0, top - 2.3], [3.1, top - 1.5], [3.5, top + .3]], { wash: PAL.deep, fill: PAL.mid, fillOp: 70, ink: PAL.ink, sw: sw * .8 });
    P([[2.9, top + .25], [5.2, top + .45], [2.9, top + 1.1]], { wash: PAL.mid, ink: PAL.ink, sw: sw * .7 });
    P(ellPts(0, top - 2.3, .38, .38, 10), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 });
  } else if (h === 'sailor') {
    const d = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; d.push([Math.cos(a) * 3.4, top + 1 + Math.sin(a) * 2.0]); }
    P(d, { wash: PAL.pearl, fill: PAL.sky, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
    P([[-3.4, top + .35], [3.4, top + .35], [3.4, top + 1.2], [-3.4, top + 1.2]], { wash: PAL.deep, ink: PAL.ink, sw: sw * .6 });
    for (const sd of [-1, 1]) INK([[sd * 1.1, top - 1.1], [sd * 1.6, top + .3], [sd * 2.3, top + .4]], sw * .8, PAL.deep, 'ink', .5);
  } else if (h === 'crown') {
    P([[-2.3, top + .3], [-2.3, top - 1.8], [-1.15, top - .55], [0, top - 2.3], [1.15, top - .55], [2.3, top - 1.8], [2.3, top + .3]], { wash: PAL.ochre, fill: PAL.cream, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
    for (const gx of [-1.15, 0, 1.15]) P(ellPts(gx, top - .25, .26, .26, 8), { wash: gx ? PAL.bright : PAL.blush, ink: null });
  } else if (h === 'snorkel') {
    P(ellPts(0, top + .1, 2.1, .8, 16), { wash: PAL.pearl, fill: PAL.sky, fillOp: 80, ink: PAL.ink, sw: sw * .8 });
    INK([[-1.9, top + .1], [-2.5, top - 2.5], [-1.1, top - 3.0]], sw * 1.8, PAL.ochre, 'ink', .5);
    P(ellPts(-1.1, top - 3.0, .42, .42, 10), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .6 });
  } else if (h === 'headphones') {
    INK([[-3.3, top + 2.1], [-2.9, top - 1.7], [0, top - 3.1], [2.9, top - 1.7], [3.3, top + 2.1]], sw * 2.0, PAL.ink, 'ink', .6);
    for (const sd of [-1, 1]) P(rrPts(sd < 0 ? -4.4 : 3.0, top + .3, 1.35, 2.5, .55), { wash: PAL.violet, fill: PAL.blush, fillOp: 50, ink: PAL.ink, sw: sw * .7 });
  } else if (h === 'bow') {
    for (const sd of [-1, 1]) P([[2.3, top + .5], [2.3 + sd * 1.55, top - .75], [2.3 + sd * 1.55, top + 1.6]], { wash: PAL.blush, fill: '#E2476E', fillOp: 70, ink: PAL.ink, sw: sw * .6, curv: .3 });
    P(ellPts(2.3, top + .45, .4, .4, 10), { wash: '#E2476E', ink: PAL.ink, sw: sw * .5 });
  } else if (h === 'flower') {
    const fx = -2.3, fy = top - .7;
    INK([[fx, fy], [fx + .3, top + .2]], sw * .6, PAL.sap, 'ink', 0);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3; P(ellPts(fx + Math.cos(a) * .64, fy + Math.sin(a) * .64, .5, .5, 10), { wash: PAL.pearl, ink: PAL.ink, sw: sw * .4 }); }
    P(ellPts(fx, fy, .4, .4, 10), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .4 });
  } else if (h === 'beanie') {
    const d = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; d.push([Math.cos(a) * 3.6, top + .5 + Math.sin(a) * 2.3]); }
    P(d, { wash: PAL.teal, fill: PAL.bright, fillOp: 60, ink: PAL.ink, sw: sw * .8 });
    P([[-3.8, top], [3.8, top], [3.8, top + 1], [-3.8, top + 1]], { wash: mixCol(PAL.teal, PAL.ink, .25), ink: PAL.ink, sw: sw * .7 });
    P(ellPts(0, top - 1.7, .72, .72, 12), { wash: PAL.pearl, ink: PAL.ink, sw: sw * .6 });
  } else if (h === 'tophat') {
    P([[-2.2, top - 3.4], [2.2, top - 3.4], [2.2, top], [-2.2, top]], { wash: PAL.ink, ink: null });
    P([[-2.2, top - 1.2], [2.2, top - 1.2], [2.2, top - .5], [-2.2, top - .5]], { wash: PAL.blush, ink: null });
    P(ellPts(0, top + .1, 3.5, .55, 20), { wash: PAL.ink, ink: PAL.ink, sw: sw * .5 });
  } else if (h === 'goggles') {
    for (const sd of [-1, 1]) P(ellPts(sd * 2.6, -6.95, 1.45, 1.25, 16), { fill: PAL.sky, fillOp: 120, ink: PAL.ink, sw: sw * .8 });
    INK([[-1.15, -7.0], [1.15, -7.0]], sw * 1.4, PAL.ink, 'ink', 0);
  } else if (h === 'leaf') {
    paint(ribbon([[-.2 * u, (top - 2.2) * u], [-1.5 * u, (top - 1.3) * u], [-2.1 * u, (top + .1) * u]], u * .85, u * .2), { wash: PAL.sap, ink: PAL.ink, sw: sw * .7 });
  }
}
// ---------- emotes ----------
// Painted reaction marks, never lettering: ! ? !! !? zzz sweat spark heart hearts anger steam bulb dots scribble
// music swirl stars cloud bubble. k = 0..1 pop-in progress (with overshoot); age = seconds since it appeared.
const EMOTE_TOP = ['steam', 'stars', 'cloud', 'bulb', 'scribble', 'bubble'];
function emote(kind, x, y, s, k = 1, age = T) {
  const p = backOut(k); if (p < .02) return;
  const sw = clamp(s / 15, .4, 2), P = pts => pts.map(([a, b]) => [a * s, b * s]);
  const dot = (dx, col) => paint(ellPts(dx, 1.25 * s, .42 * s, .42 * s, 12), { wash: col, ink: PAL.ink, sw: sw * .7 });
  const bang = (dx, col) => {
    push(); translate(dx, 0); rotate(.1 + .08 * Math.sin(age * 16) * Math.exp(-age * 3));
    paint(P([[-.62, -2.3], [.62, -2.3], [.22, .45], [-.22, .45]]), { wash: col, fill: PAL.cream, fillOp: 70, ink: PAL.ink, sw: sw * .8, curv: .25 }); dot(0, col);
    pop();
  };
  const quest = (dx, col) => {
    push(); translate(dx, 0); rotate(-.08 + .08 * Math.sin(age * 12) * Math.exp(-age * 3));
    paint(ribbon(P([[-1, -1.3], [-.55, -2.15], [.35, -2.3], [1, -1.6], [.7, -.75], [.05, -.3], [0, .4]]), .75 * s, .5 * s), { wash: col, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: sw * .8 });
    dot(0, col); pop();
  };
  push(); translate(x, y); scale(p);
  switch (kind) {
    case '!': bang(0, PAL.ochre); break;
    case '?': quest(0, PAL.sky); break;
    case '!!': bang(-.8 * s, PAL.ochre); bang(.9 * s, PAL.ochre); break;
    case '!?': bang(-.9 * s, PAL.ochre); quest(1 * s, PAL.sky); break;
    case 'zzz': for (let i = 0; i < 3; i++) {   // painted Z shapes drifting up and away
      const ph = frac(age * .4 + i / 3), a = Math.sin(ph * Math.PI), zs = (.8 + ph * .7) * s * Math.min(1, a * 1.6);
      if (a < .12) continue;
      const zx = ph * 2.6 * s, zy = -ph * 4.2 * s, Z = [[-.6, -.6], [.6, -.6], [.6, -.28], [-.12, .3], [.6, .3], [.6, .6], [-.6, .6], [-.6, .28], [.12, -.3], [-.6, -.3]];
      push(); translate(zx, zy); rotate(-.15 + .1 * Math.sin(age * 2 + i));
      paint(Z.map(([a, b]) => [a * zs, b * zs]), { wash: PAL.cream, fill: PAL.sky, fillOp: 70, ink: PAL.ink, sw: sw * .7 });
      pop();
    } break;
    case 'sweat': for (const [dx, dy, r] of [[0, 0, 1], [1.6, 1.4, .7]])
      paint(P([[dx, dy - 1.6 * r], [dx + .9 * r, dy + .2], [dx, dy + .9 * r], [dx - .9 * r, dy + .2]]), { wash: PAL.sky, fill: '#FFFFFF', fillOp: 60, ink: PAL.ink, sw: sw * .6, curv: .7 });
      break;
    case 'spark': {
      const tw = 1 + .15 * Math.sin(age * 12);
      paint(starPts(0, 0, 1.6 * s * tw), { wash: PAL.cream, fill: PAL.ochre, fillOp: 80, ink: PAL.ink, sw: sw * .5 });
      paint(starPts(1.9 * s, 1.2 * s, .8 * s / tw), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .4 });
      break;
    }
    case 'bubble': {   // three bubbles rising and popping
      for (let i = 0; i < 3; i++) {
        const ph = frac(age * .7 + i / 3), r = (.5 + .35 * hash(i + 2)) * s * (1 - ph * .25);
        if (ph < .05 || ph > .92) continue;
        paint(ellPts(Math.sin(ph * 5 + i * 2) * .8 * s, -ph * 3.6 * s, r, r, 14), { wash: PAL.pearl, washOp: 120, fill: PAL.sky, fillOp: 40, ink: PAL.ink, sw: sw * .6 });
      }
      break;
    }
    case 'heart': paint(heartPts(0, 0, s * 1.8 * (1 + .12 * pulse(age + OFF))), { wash: '#E2476E', fill: PAL.rose, fillOp: 90, ink: PAL.ink, sw: sw * .6 }); break;
    case 'hearts': for (let i = 0; i < 3; i++) {
      const ph = frac(age * .55 + i / 3), a = Math.sin(ph * Math.PI); if (a < .1) continue;
      paint(heartPts((Math.sin(ph * 6 + i * 2) * .7 + i * .7 - .7) * s, -ph * 3.8 * s, s * (.5 + .6 * a)), { wash: '#E2476E', fill: PAL.rose, fillOp: 90, ink: PAL.ink, sw: sw * .5 });
    } break;
    case 'anger': {   // the comic "vein pop": four curved strokes, each bowed in toward the centre
      const b = 1 + .15 * pulse(age + OFF, 8);
      for (let i = 0; i < 4; i++) { push(); rotate(i * Math.PI / 2 + Math.PI / 4); scale(b); inkLine(P([140, 160, 180, 200, 220].map(d => [2.1 + 1.3 * Math.cos(d * Math.PI / 180), 1.3 * Math.sin(d * Math.PI / 180)])), sw * 1.1, '#D8394E', 'ink', .6); pop(); }
      break;
    }
    case 'steam': for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) {
      const ph = frac(age / .7 + j * .5 + (sd > 0 ? .25 : 0)), r = (.55 + ph * .9) * s, cx = sd * (3.2 + ph * 1.8) * s, cy = (1 - ph * 3) * s;
      const puff = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, bump = 1 + .22 * Math.abs(Math.sin(a * 2.5)); puff.push([cx + Math.cos(a) * r * bump, cy + Math.sin(a) * r * .8 * bump]); }
      paint(puff, { wash: PAL.cream, washOp: 255 * (1 - ph * .8), ink: ph < .6 ? PAL.ink : null, sw: sw * .5 });
    } break;
    case 'bulb': {
      const gl = .5 + .5 * Math.sin(age * 10);
      glow(0, -1.4 * s, 4.5 * s, '#FFD27A', .75 + .25 * gl);
      for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .45, r0 = 1.6 * s, r1 = (2.2 + .4 * gl) * s; inkLine([[Math.cos(a) * r0, -1.4 * s + Math.sin(a) * r0], [Math.cos(a) * r1, -1.4 * s + Math.sin(a) * r1]], sw * .8, PAL.ochre, 'ink', 0); }
      paint(ellPts(0, -1.4 * s, 1.15 * s, 1.2 * s, 16), { wash: '#FFE68A', fill: PAL.cream, fillOp: 90, ink: PAL.ink, sw: sw * .7 });
      paint(rectPts(-.5 * s, -.3 * s, s, .8 * s), { wash: '#9A93A8', ink: PAL.ink, sw: sw * .6 });
      break;
    }
    case 'dots': for (let i = 0; i < 3; i++) {
      const ph = frac(age / 1.8), q = backOut(clamp((ph - i * .22) * 6)); if (q < .02) continue;
      paint(ellPts((i - 1) * 1.3 * s, 0, .42 * s * q, .42 * s * q, 10), { wash: PAL.ink, ink: null });
    } break;
    case 'scribble': {
      const pts = []; for (let i = 0; i < 34; i++) { const a = i * .95, r = (1.1 + .5 * Math.sin(i * 1.7)) * s; pts.push([Math.cos(a) * r * 1.5 + jit(.2 * s), Math.sin(a) * r * .8 + jit(.2 * s)]); }
      inkLine(pts, sw * .8, PAL.ink, 'ink', .7); break;
    }
    case 'music': {
      const b = Math.sin(age * 5) * .3 * s;
      push(); translate(0, b); rotate(.1 * Math.sin(age * 5));
      paint(ellPts(0, 1.2 * s, .7 * s, .5 * s, 12, 0, -.3), { wash: PAL.ink, ink: null });
      inkLine(P([[.6, 1.1], [.6, -1.6], [1.6, -1]]), sw * .8, PAL.ink, 'ink', 0);
      pop();
      const b2 = Math.sin(age * 5 + 2) * .3 * s;
      paint(ellPts(2.2 * s, 2.2 * s + b2, .45 * s, .33 * s, 10, 0, -.3), { wash: PAL.ink, ink: null });
      inkLine([[2.6 * s, 2.15 * s + b2], [2.6 * s, .6 * s + b2]], sw * .6, PAL.ink, 'ink', 0);
      break;
    }
    case 'swirl': {
      const sp = []; for (let i = 0; i < 18; i++) { const a = i * .6 + age * 5, r = i * .09 * s; sp.push([Math.cos(a) * r, Math.sin(a) * r]); }
      inkLine(sp, sw * .7, PAL.violet, 'inkfine', .6); break;
    }
    case 'stars': for (let i = 0; i < 3; i++) {   // little stars circling the head
      const a = age * 5 + i * TAU / 3, d = .75 + .25 * Math.sin(a);
      paint(starPts(Math.cos(a) * 4.2 * s, Math.sin(a) * s, .75 * s * d, .45, 5, age * 3), { wash: PAL.ochre, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: sw * .5 });
    } break;
    case 'cloud': {   // a little rain cloud of its own
      const bob = Math.sin(age * 2) * .15 * s, c = [];
      for (let i = 0; i < 40; i++) {
        const a = i / 40 * TAU, up = Math.sin(a) < 0, r = up ? 1 + .38 * Math.pow(Math.abs(Math.sin(a * 3)), .6) : 1;
        c.push([Math.cos(a) * 2.8 * s * (up ? r * .92 : 1), bob - .2 * s + Math.sin(a) * (up ? 1.35 : .7) * s * r]);
      }
      for (let i = 0; i < 6; i++) { const ph = frac(age * 2.4 + hash(i)), rx = (-2 + i * .8) * s, ry = (.7 + ph * 2) * s; inkLine([[rx, ry], [rx - .12 * s, ry + .7 * s]], sw * 1.1, mixCol(PAL.sky, PAL.indigo, .3), 'ink', 0); }
      paint(c, { wash: '#9FB3CC', fill: PAL.indigo, fillOp: 70, bleed: .1, ink: PAL.ink, sw: sw * .8, curv: .4 });
      break;
    }
  }
  pop();
}
// Heart outline points, centred at (cx, cy), about 2r wide.
function heartPts(cx, cy, r, n = 22) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; p.push([cx + 16 * Math.pow(Math.sin(a), 3) * r / 16, cy - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]); } return p;
}

// ---------- emotions ----------
// Each emotion is a face AND a way of moving. body(t) returns pose offsets for deepseeker(), and every one is alive: it
// moves on its own, at its own energy, locked to the beat (PROJECT.bpm). Fins (aL/aR) take over from arms, and the tail
// keeps its own beat (swim) so the fish never looks like a stiff prop. take = how big the reaction is when it switches
// INTO this emotion. fade = the emote is a one-off that fades out instead of staying.
const _b = t => { const bp = bpOf(t), s1 = Math.sin(bp * Math.PI); return { bp, s1, ab: Math.abs(s1), hit: pulse(t), s2: Math.sin(bp * TAU), f: frac(bp) }; };
const EMO = {
  neutral:    { eyes: 'normal', swim: t => bpOf(t) * 2, take: .3, body: t => { const b = _b(t); return { dy: -.25 * b.ab - .3, sq: .03 * b.hit, aL: .1 + .05 * b.s1, aR: .1 - .05 * b.s1 }; } },
  happy:      { eyes: 'happy', mouth: 'smile', blush: .3, swim: t => bpOf(t) * 2, take: .6, body: t => { const b = _b(t); return { dy: -1.2 * b.ab - .5, sq: .1 * b.hit, aL: .45 + .35 * b.s1, aR: .45 - .35 * b.s1 }; } },
  excited:    { eyes: 'wide', mouth: 'open', emote: 'spark', swim: t => bpOf(t) * 3, take: 1, body: t => { const b = _b(t), h = Math.abs(b.s2); return { dy: -2.4 * h - .4, sq: .16 * pulse2(t) - .06 * h, aL: 1 + .5 * Math.sin(b.bp * TAU * 2), aR: 1 - .5 * Math.sin(b.bp * TAU * 2) }; } },
  laugh:      { eyes: 'squeeze', mouth: 'laugh', blush: .45, take: .8, body: t => { const c = Math.abs(Math.sin(t * TAU * 5)); return { dy: -.45 * c - .4, sq: .08 * c - .04, rot: -.06 + .03 * Math.sin(t * TAU * 5), aL: -.3 + .12 * c, aR: -.3 + .12 * c }; } },
  love:       { eyes: 'heart', mouth: 'cat', blush: .8, tint: 'rosy', tintK: .45, emote: 'hearts', swim: t => bpOf(t) * 1.5, take: .7, body: t => { const b = _b(t), s = Math.sin(b.bp * Math.PI / 2); return { rot: .07 * s, dx: .5 * s, dy: -.6 * b.ab - .5, sq: .05 * b.hit, aL: .3 + .15 * b.s1, aR: .3 - .15 * b.s1 }; } },
  shy:        { eyes: 'look', mouth: 'wobble', blush: 1, take: .3, body: t => { const b = _b(t), s = Math.sin(b.bp * Math.PI / 2); return { lookX: -.7, lookY: .8, sq: .06, rot: -.05 + .02 * s, dx: .15 * s, aL: -.45 + .15 * Math.sin(t * TAU * 1.5), aR: -.5 - .12 * Math.sin(t * TAU * 1.5) }; } },
  proud:      { eyes: 'closed', mouth: 'smile', tint: 'gold', tintK: .25, emote: 'spark', take: .5, body: t => { const b = _b(t); return { sq: -.1 - .03 * b.ab, dy: -.3 * b.hit - .6, aL: 1.15, aR: 1.15, rot: .02 * b.s1 }; } },
  smug:       { eyes: 'narrow', mouth: 'smirk', take: .4, body: t => { const b = _b(t), s = Math.sin(b.bp * Math.PI / 2); return { lookX: .4, rot: -.06 + .03 * s, dy: -.2 * b.ab - .3, aL: -.4, aR: .55 + .15 * s }; } },
  relieved:   { eyes: 'closed', mouth: 'smile', emote: 'sweat', take: .4, body: t => { const b = _b(t), br = Math.sin(t * TAU * .35); return { sq: .05 + .05 * br, dy: -.15 * b.ab - .4, aL: -.55 + .1 * br, aR: -.55 + .1 * br }; } },
  sad:        { eyes: 'sad', mouth: 'frown', tint: 'blue', tintK: .35, gloom: .35, emote: 'cloud', take: .3, body: t => { const b = _b(t), s = Math.sin(b.bp * Math.PI / 4); return { sq: .08 + .02 * s, rot: .03 * s, aL: -.65, aR: -.65, lookY: .5, dy: -.1 }; } },
  cry:        { eyes: 'cry', mouth: 'wail', tint: 'blue', tintK: .2, take: .8, body: t => { const b = _b(t), sob = Math.sin(b.f * Math.PI) * Math.exp(-b.f * 2); return { sq: .14 * sob - .02, dy: -.7 * sob, aL: .8 + .15 * Math.sin(t * TAU * 6), aR: .8 - .15 * Math.sin(t * TAU * 6), rot: .03 * b.s1 }; } },
  angry:      { eyes: 'angry', mouth: 'teeth', tint: 'flush', tintK: .45, emote: 'anger', take: .8, body: t => { const b = _b(t); return { dx: .1 * Math.sin(t * TAU * 18), sq: .12 * b.hit, aL: -.2 + .1 * b.hit, aR: -.2 + .1 * b.hit }; } },
  furious:    { eyes: 'red', mouth: 'teeth', chomp: t => .1 + .06 * Math.sin(t * TAU * 4), tint: 'flush', tintK: .8, emote: 'steam', swim: t => bpOf(t) * 4, take: 1.2, body: t => { const b = _b(t); return { dx: .22 * Math.sin(t * TAU * 20), rot: .025 * Math.sin(t * TAU * 13), sq: .2 * b.hit, dy: -.8 * Math.sin(b.f * Math.PI) * (1 - b.f), aL: 1 + .2 * Math.sin(t * TAU * 9), aR: 1 - .2 * Math.sin(t * TAU * 9) }; } },
  scared:     { eyes: 'scared', mouth: 'wobble', tint: 'pale', tintK: .6, emote: 'sweat', take: 1.1, body: t => ({ dx: .1 * Math.sin(t * TAU * 22), sq: -.06, aL: 1 + .08 * Math.sin(t * TAU * 17), aR: 1 + .08 * Math.sin(t * TAU * 19), lookX: .6 * Math.sign(Math.sin(t * 2.3)) }) },
  surprised:  { eyes: 'wide', mouth: 'O', emote: '!', fade: true, take: 1.3, body: t => { const b = _b(t); return { sq: -.12, dy: -.3 - .15 * b.ab, aL: 1.1 + .05 * b.s2, aR: 1.1 - .05 * b.s2 }; } },
  confused:   { eyes: ['narrow', 'wide'], mouth: 'wobble', emote: '?', take: .6, body: t => { const b = _b(t); return { rot: .1 * Math.sin(b.bp * Math.PI / 4), aL: .1, aR: 1.35 + .15 * Math.sin(t * TAU * 3), dy: -.15 * b.ab }; } },
  thinking:   { eyes: 'look', mouth: 'flat', emote: 'dots', swim: t => bpOf(t) * .5, take: .4, body: t => { const b = _b(t); return { lookX: .5, lookY: -.8, rot: .05, aR: .9, aL: -.3 + .25 * Math.sin(b.f * Math.PI), dy: -.1 * b.ab }; } },
  idea:       { eyes: 'shine', mouth: 'grin', emote: 'bulb', take: 1.1, body: t => { const b = _b(t); return { dy: -1 * b.ab - .5, sq: -.05 + .1 * b.hit, aR: 1.5 + .1 * b.s2, aL: .2 + .2 * b.s1 }; } },
  determined: { eyes: 'determined', mouth: 'flat', take: .7, body: t => { const b = _b(t), p1 = Math.sin(b.f * Math.PI), p2 = Math.abs(Math.cos(b.f * Math.PI)); return { rot: .05, sq: -.04 + .06 * b.hit, dy: -.3 * b.ab, aL: .1 + .7 * p1, aR: .1 + .7 * p2 }; } },
  sleepy:     { eyes: 'sleepy', mouth: 'o', emote: 'zzz', swim: t => bpOf(t) * .4, take: .2, body: t => { const br = Math.sin(t * TAU * .3); return { sq: .05 + .05 * br, rot: .06 * Math.sin(t * .8), aL: -.55, aR: -.55 }; } },
  bored:      { eyes: 'narrow', mouth: 'flat', take: .2, body: t => { const f = frac(bpOf(t) / 4), sigh = f < .3 ? ease(f / .3) : 1 - ease((f - .3) / .7); return { lookX: -.3, lookY: .4, sq: .08 - .14 * sigh, rot: -.04, aL: -.75 + .05 * Math.sin(t * 2), aR: -.75 - .05 * Math.sin(t * 2) }; } },
  nervous:    { eyes: 'look', mouth: 'wobble', tint: 'pale', tintK: .2, emote: 'sweat', take: .5, body: t => { const b = _b(t); return { lookX: beatN(t) % 2 ? .8 : -.8, dx: .3 * b.s1, sq: .04, aL: -.1 + .2 * Math.sin(t * TAU * 5), aR: -.1 + .2 * Math.sin(t * TAU * 5 + 1) }; } },
  suspicious: { eyes: 'narrow', mouth: 'flat', take: .4, body: t => { const s = Math.sin(t * TAU * .25); return { lookX: s, rot: -.08 * s, dx: .4 * s, sq: .04, aL: -.4, aR: -.4 }; } },
  disgusted:  { eyes: 'squeeze', mouth: 'wobble', tint: 'green', tintK: .5, take: .8, body: t => { const a = frac(bpOf(t) / 2) * BEAT * 2, sh = Math.exp(-a * 6) * Math.sin(a * 45); return { rot: -.1, dx: -.3 + .15 * sh, sq: .05, aL: .7 + .2 * sh, aR: .7 - .2 * sh }; } },
  dizzy:      { eyes: 'swirl', mouth: 'wobble', emote: 'stars', take: .7, body: t => { const a = t * TAU * .8; return { rot: .12 * Math.sin(a), dx: .7 * Math.sin(a), dy: -.3 * Math.abs(Math.cos(a)), aL: .3 + .6 * Math.sin(a * 1.3), aR: .3 - .6 * Math.sin(a * 1.3) }; } },
  cool:       { eyes: 'shades', mouth: 'smirk', emote: 'music', swim: t => bpOf(t) * 2, take: .4, body: t => { const b = _b(t); return { rot: .04 * b.hit, dy: -.35 * b.hit, sq: .06 * b.hit, aL: -.4, aR: .7 + .1 * b.s1 }; } },
  'shades':   { eyes: 'shades', mouth: 'smirk', take: .4, body: t => { const b = _b(t); return { dy: -.35 * b.hit, aL: 1.0 + .2 * b.s1, aR: .1, glasses: 'sun' }; } },
  starstruck: { eyes: 'spark', mouth: 'open', tint: 'gold', tintK: .25, take: 1, body: t => { const b = _b(t), h = Math.abs(b.s2); return { dy: -1.6 * h - .4, sq: .1 * pulse2(t), aL: 1.1 + .35 * Math.sin(b.bp * TAU * 2), aR: 1.1 + .35 * Math.sin(b.bp * TAU * 2) }; } },
  ko:         { eyes: 'x', mouth: 'wobble', tint: 'pale', tintK: .3, emote: 'stars', take: 1, body: t => ({ sq: .26 + .02 * Math.sin(t * 3), rot: .1, aL: -1, aR: -.9 }) },
  playful:    { eyes: 'wink', mouth: 'tongue', take: .6, body: t => { const b = _b(t), side = beatN(t) % 2 ? 1 : -1, k = lerp(-side, side, easeOut(clamp(b.f * 3))); return { dx: .8 * k, dy: -1.4 * b.ab - .4, rot: .1 * k, sq: .1 * b.hit, aL: .65 + .55 * k, aR: .65 - .55 * k }; } },
  mischief:   { eyes: 'narrow', mouth: 'grin', gloom: .28, take: .5, body: t => { const r = Math.sin(t * TAU * 4); return { lookX: .3, sq: .07, rot: .04, aL: -.05 + .15 * r, aR: -.05 - .15 * r, dy: -.1 * Math.abs(r) }; } },
  hopeful:    { eyes: 'shine', mouth: 'cat', blush: .35, take: .5, body: t => { const b = _b(t); return { sq: -.06 - .02 * b.ab, dy: -.25 * b.ab - .5, lookY: -.4, aL: .5 + .05 * b.s1, aR: .5 - .05 * b.s1, rot: .03 * Math.sin(b.bp * Math.PI / 2) }; } },
  chomp:      { eyes: 'determined', mouth: 'teeth', chomp: t => .5 + .45 * Math.sin(t * TAU * 2.4), take: .8, body: t => { const b = _b(t); return { sq: -.05 * Math.abs(Math.sin(t * TAU * 2.4)) + .04 * b.hit, dy: -.2 * b.ab - .3, aL: .3, aR: .3, rot: .04 * Math.sin(t * TAU * 1.2) }; } },
  bubblegum:  { eyes: 'happy', mouth: 'o', emote: 'bubble', blush: .5, swim: t => bpOf(t) * 2, take: .6, body: t => { const b = _b(t); return { dy: -.4 * b.ab - .5, sq: .05 * b.hit, aL: .3 + .2 * b.s1, aR: .3 - .2 * b.s1, rot: .03 * b.s1 }; } },
};

// One emotion, alive at time t: face, colour and body motion together. Spread it into deepseeker():
//   deepseeker(x, y, u, feel('happy', t))       deepseeker(x, y, u, { ...feel('sad', t), view: 'q', hat: 'beanie' })
function feel(name, t, over = {}) {
  const E = EMO[name] || EMO.neutral;
  return { eyes: E.eyes, mouth: E.mouth, tint: E.tint, tintK: E.tintK ?? 1, blush: E.blush || 0, gloom: E.gloom || 0,
           chomp: typeof E.chomp === 'function' ? E.chomp(t) : (E.chomp || 0), glasses: E.glasses, emote: E.emote,
           swim: E.swim ? E.swim(t) : undefined, ...(E.body ? E.body(t) : {}), ...over };
}

// An emotion timeline with ACTED changes: keys = [[t0, 'neutral'], [t1, 'surprised'], [t2, 'happy', { emote: 'music' }]].
// Around each change the eyes squeeze shut and the body squashes just before (anticipation), and the face swaps
// under the squint. Then a take fires (a squash-stretch the size of the new emotion's `take`), the body settles into
// its new motion with overshoot, colour, blush and gloom cross-fade, and the new emote pops in. o.take scales every take.
// Spread the result into deepseeker() and add any other pose: deepseeker(x, y, u, { ...emotions(t, keys), view: 'q' }).
function emotions(t, keys, o = {}) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [tc, name, over] = keys[i], age = t - tc, cur = feel(name, t, over);
  const tn = i + 1 < keys.length ? keys[i + 1][0] : Infinity, tkS = o.take ?? 1;
  const E = EMO[name] || EMO.neutral;
  let squint = cur.squint || 0;
  if (tn - t < .1) squint = Math.max(squint, 1 - (tn - t) / .1);
  if (i > 0 && age < .14) squint = Math.max(squint, 1 - age / .14);
  const prev = i > 0 ? feel(keys[i - 1][1], t, keys[i - 1][2]) : null;
  if (prev && age < .5) {
    const base = { dy: 0, sq: 0, aL: .1, aR: .1, rot: 0, dx: 0, lookX: 0, lookY: 0, chomp: 0 };
    const k = backOut(seg(age, 0, .4)), kc = ease(seg(age, 0, .3));
    for (const f in base) cur[f] = lerp(prev[f] ?? base[f], cur[f] ?? base[f], k);
    const a = fishCols(prev), b = fishCols(cur);
    cur.col = mixCol(a.col, b.col, kc); cur.dk = mixCol(a.dk, b.dk, kc); cur.lt = mixCol(a.lt, b.lt, kc); cur.fin = mixCol(a.fin, b.fin, kc); cur.tint = null;
    for (const f of ['blush', 'gloom']) cur[f] = lerp(prev[f] || 0, cur[f] || 0, kc);
  }
  // takes: the one this key fires, plus the anticipation squash of the next one
  const t1 = prev ? take(t, tc, (E.take ?? .6) * tkS) : { sq: 0, dy: 0 };
  const En = i + 1 < keys.length ? EMO[keys[i + 1][1]] || EMO.neutral : null, t2 = En ? take(t, tn, (En.take ?? .6) * tkS) : { sq: 0, dy: 0 };
  cur.sq = (cur.sq || 0) + t1.sq + t2.sq; cur.dy = (cur.dy || 0) + t1.dy + t2.dy;
  cur.squint = squint;
  // the emote pops in after the swap (it carries on if the emote didn't change); one-off emotes fade out
  const same = prev && prev.emote === cur.emote;
  cur.emoteK = same ? 1 : seg(age, .06, .32) * (E.fade && !(over && over.emote) ? 1 - seg(age, 1.4, 1.8) : 1);
  cur.emoteAge = age;
  return cur;
}

// ---------- moves ----------
// Beat-locked dances: bounce, hop, roof (fins up), sway, spin (a drawn spin through the key views, once a bar), wave,
// walk, run, idle, stomp, shimmy, swish (a tail-led flourish), mix (changes every two bars). Returns pose offsets; spread
// into deepseeker(). `walk` drives the side fins (a waddle on land), `swim` always keeps the tail going.
function move(style, t, seed = 0) {
  const bp = bpOf(t), bi = Math.floor(bp), bf = bp - bi, hit = Math.max(0, 1 - bf * 3.5), s1 = Math.sin(bp * Math.PI), ab = Math.abs(s1);
  const o = { dy: 0, sq: 0, aL: .1, aR: .1, rot: 0, walk: null, dx: 0, swim: bp * 2 };
  if (style === 'mix') style = ['bounce', 'roof', 'sway', 'spin', 'hop', 'wave'][(Math.floor(bp / 8) + seed) % 6];
  switch (style) {
    case 'bounce': o.dy = -ab * 1.6 - .3; o.sq = hit * .12; o.aL = .4 + s1; o.aR = .4 - s1; break;
    case 'hop': o.dy = -ab * 4; o.sq = hit * .18; o.aL = o.aR = .3 + ab * 1.1; o.swim = bp * 3; break;
    case 'roof': o.dy = -ab * 1.2 - .3; o.sq = hit * .1; o.aL = o.aR = 1.25 + .3 * Math.sin(bp * TAU); break;
    case 'sway': o.dx = s1 * 3; o.rot = s1 * .12; o.aL = .5 + .6 * s1; o.aR = .5 - .6 * s1; o.sq = hit * .08; break;
    case 'spin': {
      const ph = (((bi % 4) + 4) % 4 === 3) ? bf : 0;
      Object.assign(o, spinView(ph)); o.smear = ph > .1 && ph < .9 ? .5 : 0; o.smearDir = 0;
      o.dy = -Math.sin(ph * Math.PI) * 3 - ab; o.aL = o.aR = .6 + ph; o.sq = hit * .1; o.swim = bp * 3; break;
    }
    case 'wave': o.dy = -ab - .3; o.aL = 1.1 + .5 * Math.sin(bp * TAU * 2); o.aR = -.2; o.sq = hit * .08; break;
    case 'walk': o.walk = bp / 2; o.dy = -ab * .6; o.aL = .3 * s1; o.aR = -o.aL; break;
    case 'run': o.walk = bp * 1.5; o.dy = -Math.abs(Math.sin(bp * TAU)) - .2; o.aL = .8 * Math.sin(bp * TAU * 1.5); o.aR = -o.aL; o.rot = -.08; o.swim = bp * 3; break;
    case 'idle': o.dy = -ab * .5 - .2; o.sq = hit * .05; break;
    case 'stomp': o.dy = -Math.max(0, Math.sin(bp * TAU)) * 1.4; o.sq = hit * .2; o.rot = (bi % 2 ? 1 : -1) * .06 * hit; o.aL = o.aR = -.3 + hit * .9; break;
    case 'shimmy': o.dx = Math.sin(bp * TAU * 2) * .6; o.rot = Math.sin(bp * TAU * 2) * .05; o.aL = .9 + .4 * Math.sin(bp * TAU * 2); o.aR = .9 - .4 * Math.sin(bp * TAU * 2); o.dy = -ab * .5; break;
    case 'swish': o.swim = bp * 2; o.swimAmt = .6; o.rot = Math.sin(bp * TAU * .5) * .18; o.dy = -Math.abs(Math.sin(bp * TAU * .5)) * 1.4; o.aL = .7 + .3 * s1; o.aR = .35 - .2 * s1; break;
  }
  return o;
}
function dancer(x, y, u, style, t, extra = {}) { deepseeker(x, y, u, { ...move(style, t, extra.seed || 0), ...extra }); }

// ---------- locomotion made for a fish ----------
// swim(t, t0, t1, x0, x1, y0, y1, u, arc = 0): glides from (x0, y0) to (x1, y1) on an arc between t0 and t1, tail leading,
// facing the way it goes (flip handles reversing). Returns { x, y, view, flip, swimAmt, swim, dy } for deepseeker().
function swim(t, t0, t1, x0, x1, y0 = 700, y1 = y0, u = 20, arc = 60) {
  const k = ease(seg(t, t0, t1)), moving = t > t0 && t < t1;
  const p = arcPt([x0, y0], [x1, y1], arc, k), dirX = Math.sign(x1 - x0) || 1;
  return { x: p[0], y: p[1], view: Math.abs(x1 - x0) > 1.5 * u ? 'side' : 'front', flip: dirX < 0,
           swimAmt: moving ? .55 : 0, swim: (t - t0) * 2.2, dy: moving ? Math.sin((t - t0) * TAU * 1.1) * .18 : 0 };
}
// hopWalk(t, t0, t1, x0, x1, u): a waddling walk on the side fins between t0 and t1 (eased), facing the way it goes and
// facing front when it stops. Returns { x, walk, view, flip, dy, swim } for deepseeker().
function hopWalk(t, t0, t1, x0, x1, u) {
  const x = lerp(x0, x1, ease(seg(t, t0, t1))), d = Math.abs(x - x0) / (4 * u), moving = t > t0 && t < t1;
  return { x, walk: d, view: moving ? 'q' : 'front', flip: x1 < x0, dy: moving ? -Math.abs(Math.sin(d * Math.PI)) * .45 - .15 : -.2, swim: d * 2 };
}
