// Suara Pasar Rempah: semua bunyi dibuat dari WebAudio di dalam kode,
// tanpa berkas audio dari luar. Hanya bunyi singkat saat ada kejadian,
// tidak ada musik latar terus-menerus.
const Sounds = (function () {
  let ctx = null;
  let muted = false;

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when) {
    if (muted) return;
    const ac = audio();
    if (!ac) return;
    const t = ac.currentTime + (when || 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function noise(dur, vol, when) {
    if (muted) return;
    const ac = audio();
    if (!ac) return;
    const t = ac.currentTime + (when || 0);
    const len = Math.floor(ac.sampleRate * dur);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(vol || 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    src.start(t);
  }

  return {
    isMuted() { return muted; },
    toggle() { muted = !muted; return muted; },
    click() { tone(700, 0.06, 'triangle', 0.08); },
    deal() { noise(0.12, 0.1); },
    place() { tone(180, 0.09, 'triangle', 0.18); noise(0.05, 0.06); },
    coin() { tone(1320, 0.12, 'sine', 0.14); tone(1760, 0.18, 'sine', 0.1, 0.07); },
    combo() { tone(523, 0.12, 'triangle', 0.14); tone(659, 0.12, 'triangle', 0.14, 0.1); tone(784, 0.22, 'triangle', 0.16, 0.2); },
    storm() { noise(0.5, 0.16); tone(90, 0.5, 'sawtooth', 0.08); },
    win() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.15, i * 0.13));
    },
    lose() {
      [392, 330, 262, 196].forEach((f, i) => tone(f, 0.35, 'sine', 0.13, i * 0.22));
    },
  };
})();
