/* Draws the app icon (a ring of 33 prayer beads and a crescent). Run: node scripts/generate-icons.js */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const OUT = path.join(__dirname, '..', 'assets', 'images');
const BG = [23, 18, 14];
const BG_LIGHT = [44, 33, 24];
const GOLD = [212, 175, 55];
const AMBER = [224, 163, 90];
const BEADS = 33;
const SS = 3;

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** Returns the colour [r,g,b,a] of the artwork at (u,v) in -1..1 space, or null for background. */
function art(u, v, mode) {
  const ringR = 0.62;
  const r = Math.hypot(u, v);
  let best = null;

  for (let i = 0; i < BEADS; i += 1) {
    const ang = (i / BEADS) * Math.PI * 2 - Math.PI / 2;
    const cx = ringR * Math.cos(ang);
    const cy = ringR * Math.sin(ang);
    const imam = i === 0;
    const rad = imam ? 0.1 : 0.062;
    const d = Math.hypot(u - cx, v - cy);
    if (d <= rad) {
      // Soft highlight so each bead reads as a sphere.
      const hl = Math.max(0, 1 - Math.hypot(u - cx + rad * 0.35, v - cy + rad * 0.35) / rad);
      const base = imam ? GOLD : mix(AMBER, [150, 95, 45], i / BEADS);
      best = [...mix(base, [255, 245, 215], hl * 0.55), 1];
    }
  }
  if (best) return mode === 'mono' ? [255, 255, 255, 1] : best;

  // Thin guide ring behind the beads.
  if (Math.abs(r - ringR) < 0.006 && mode !== 'mono') return [...mix(BG, AMBER, 0.35), 1];

  // Crescent: a disc with a shifted disc cut out of it.
  const disc = Math.hypot(u + 0.0, v - 0.02) <= 0.3;
  const cut = Math.hypot(u - 0.14, v + 0.02) <= 0.26;
  if (disc && !cut) return mode === 'mono' ? [255, 255, 255, 1] : [...GOLD, 1];
  return null;
}

function render(size, mode, { scale = 1, file }) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let sy = 0; sy < SS; sy += 1) {
        for (let sx = 0; sx < SS; sx += 1) {
          const u = (((x + (sx + 0.5) / SS) / size) * 2 - 1) / scale;
          const v = (((y + (sy + 0.5) / SS) / size) * 2 - 1) / scale;
          let px = mode === 'bg' ? null : art(u, v, mode);
          if (!px && (mode === 'full' || mode === 'bg')) {
            const k = Math.min(Math.hypot(u, v) / 1.2, 1);
            px = [...mix(BG_LIGHT, BG, k), 1];
          }
          if (px) {
            r += px[0];
            g += px[1];
            b += px[2];
            a += px[3];
          }
        }
      }
      const n = SS * SS;
      const o = (y * size + x) * 4;
      png.data[o] = a ? r / a : 0;
      png.data[o + 1] = a ? g / a : 0;
      png.data[o + 2] = a ? b / a : 0;
      png.data[o + 3] = Math.round((a / n) * 255);
    }
  }
  fs.writeFileSync(path.join(OUT, file), PNG.sync.write(png));
  console.log('wrote', file);
}

render(1024, 'full', { file: 'icon.png' });
render(512, 'bg', { file: 'android-icon-background.png' });
render(512, 'fg', { scale: 1.45, file: 'android-icon-foreground.png' });
render(432, 'mono', { scale: 1.45, file: 'android-icon-monochrome.png' });
render(512, 'fg', { scale: 1.1, file: 'splash-icon.png' });
render(96, 'full', { file: 'favicon.png' });
