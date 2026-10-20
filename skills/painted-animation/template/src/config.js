// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. 大肥鱼 always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   audio:    optional path to the soundtrack (relative to the project); --clip / --encode mux it in.
const PROJECT = { duration: 14, bpm: 112, offset: 0, audio: 'assets/score.m4a' };
