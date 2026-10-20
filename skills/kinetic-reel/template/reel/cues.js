// reel/cues.js: THE timeline. The page (reel.js) and the score (music/score.mjs) both read it, so every hit in the
// music lands on its frame. 120 BPM: a beat is 0.5 s, a bar 2 s. Put cuts on beats; put chapter changes on bars.
// This template is the "DeepSeek" cut: dark water → the mark → deepseek meets 大肥鱼 → a signal crossing the deep →
// one principle → the name.
var KCUE = (() => {
  const B = n => +(n * 0.5).toFixed(4);                    // B(n) = time of beat n
  const S = { open: 0, mark: 3, title: 6, flow: 10, quote: 13, end: 15 };   // scene starts (s)
  return {
    bpm: 120, fps: 30, dur: 18, B, S,
    // chapters: drive the segmented progress bar in the HUD (names starting with a digit count as sections)
    CH: [['OPEN', 0, 3], ['01 MARK', 3, 6], ['02 SIGNAL', 6, 10], ['03 DEEPSEEK', 10, 13], ['END', 13, 18]],
    hits: {
      dot: 1, ring: 2, mark: 3,
      title: 6.1, sub: 6.6, chips: 7.5,
      nodes: [10.1, 10.35, 10.6], hops: [11, 11.5, 12, 12.5], answer: 12.6,
      words: [13.1, 13.5, 13.9],
      name: 15, glitch: 17.1, endDot: 17.5,
    },
  };
})();
if (typeof module !== 'undefined') module.exports = KCUE;
