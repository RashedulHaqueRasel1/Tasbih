import {
  STRAND_GEOMETRY as G,
  strandBead,
  strandRing,
  strandRopePath,
  strandTassel,
} from './strand-layout';

const visibleBeads = (offset: number) =>
  Array.from({ length: G.poolSize }, (_, slot) => strandBead(slot, offset, G));

describe('strandBead', () => {
  it('puts the bead you are on inside the ring, imam first', () => {
    const imam = visibleBeads(0).find((b) => b.isImam);
    expect(imam?.y).toBeCloseTo(G.baseline);
    expect(imam?.opacity).toBe(1);
  });

  it('puts bead number n in the ring after n taps', () => {
    const inRing = visibleBeads(5).filter((b) => Math.abs(b.y - G.baseline) < 0.001);
    expect(inRing).toHaveLength(1);
  });

  it('slides beads down as the offset grows', () => {
    const before = strandBead(3, 0, G);
    const after = strandBead(3, 0.5, G);
    expect(after.y).toBeGreaterThan(before.y);
  });

  it('shifts a bead by exactly one spacing per tap', () => {
    const a = strandBead(8, 2, G);
    const b = strandBead(8, 3, G);
    expect(b.y - a.y).toBeCloseTo(G.spacing);
  });

  it('keeps beads evenly spaced inside the window', () => {
    const ys = visibleBeads(7.3)
      .map((b) => b.y)
      .sort((a, b) => a - b);
    expect(ys[0]).toBeGreaterThan(G.baseline - (G.firstSlot + G.poolSize) * G.spacing - 0.001);
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]! - ys[i - 1]!).toBeCloseTo(G.spacing);
    }
  });

  it('marks exactly the 33rd bead as the imam', () => {
    expect(visibleBeads(0).filter((b) => b.isImam)).toHaveLength(1);
    expect(visibleBeads(20).filter((b) => b.isImam)).toHaveLength(0);
    expect(visibleBeads(33).filter((b) => b.isImam)).toHaveLength(1);
  });

  it('fades beads out past the edges', () => {
    visibleBeads(0)
      .filter((b) => b.y < 0 || b.y > G.height)
      .forEach((b) => expect(b.opacity).toBe(0));
  });

  it('keeps upcoming beads solid and dims the ones already counted', () => {
    const beads = visibleBeads(0);
    const upcoming = beads.find((b) => b.y > 150 && b.y < G.baseline - 1);
    const counted = beads.find((b) => b.y > G.baseline + G.spacing && b.y < 440);
    expect(upcoming?.opacity).toBe(1);
    expect(counted?.opacity).toBeCloseTo(0.5);
  });
});

describe('strandRing', () => {
  it('sits exactly where the current bead is drawn', () => {
    const ring = strandRing(G);
    const current = visibleBeads(9).find((b) => Math.abs(b.y - G.baseline) < 0.001)!;
    expect(ring.x).toBeCloseTo(current.x);
    expect(ring.y).toBeCloseTo(current.y);
    expect(ring.r).toBeGreaterThan(current.r);
  });
});

describe('strandTassel', () => {
  it('is visible while the imam bead is in the window', () => {
    expect(strandTassel(0, G).opacity).toBeGreaterThan(0);
  });

  it('hangs below the imam bead', () => {
    const imam = visibleBeads(0).find((b) => b.isImam)!;
    const ys = [...strandTassel(0, G).d.matchAll(/,(-?[\d.]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThan(imam.y);
  });

  it('is hidden when the imam bead is far away', () => {
    expect(strandTassel(20, G).opacity).toBe(0);
  });
});

describe('strandRopePath', () => {
  it('starts with a move command and covers the full height', () => {
    const path = strandRopePath(G);
    expect(path.startsWith('M')).toBe(true);
    expect(path.split('L').length).toBeGreaterThan(40);
  });
});
