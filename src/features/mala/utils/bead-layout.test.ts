import {
  BEAD_COUNT,
  OVAL_GEOMETRY,
  beadPlacement,
  currentBeadRing,
  tasselPath,
} from './bead-layout';

describe('beadPlacement', () => {
  it('puts the imam bead at the front-bottom of the oval at rest', () => {
    const imam = beadPlacement(0, 0, OVAL_GEOMETRY);
    expect(imam.x).toBeCloseTo(OVAL_GEOMETRY.cx);
    expect(imam.y).toBeCloseTo(OVAL_GEOMETRY.cy + OVAL_GEOMETRY.ry);
  });

  it('moves the front beads from right to left as the offset grows', () => {
    const before = beadPlacement(0, 0, OVAL_GEOMETRY);
    const after = beadPlacement(0, 0.25, OVAL_GEOMETRY);
    expect(after.x).toBeLessThan(before.x);
  });

  it('moves every bead one slot per offset step', () => {
    const before = beadPlacement(5, 1, OVAL_GEOMETRY);
    const after = beadPlacement(6, 2, OVAL_GEOMETRY);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('returns to the start after a full revolution', () => {
    const start = beadPlacement(3, 0, OVAL_GEOMETRY);
    const lap = beadPlacement(3, BEAD_COUNT, OVAL_GEOMETRY);
    expect(lap.x).toBeCloseTo(start.x);
    expect(lap.y).toBeCloseTo(start.y);
  });

  it('draws front beads larger than back beads and the imam largest', () => {
    const front = beadPlacement(0, 0, OVAL_GEOMETRY);
    const back = beadPlacement(0, BEAD_COUNT / 2, OVAL_GEOMETRY);
    expect(front.r).toBeGreaterThan(back.r);
    expect(beadPlacement(1, 0, OVAL_GEOMETRY).r).toBeLessThan(front.r);
  });
});

describe('currentBeadRing', () => {
  it('surrounds the bead at the front of the oval', () => {
    const ring = currentBeadRing(OVAL_GEOMETRY);
    const front = beadPlacement(7, 7, OVAL_GEOMETRY);
    expect(ring.x).toBeCloseTo(front.x);
    expect(ring.y).toBeCloseTo(front.y);
    expect(ring.r).toBeGreaterThan(beadPlacement(0, 0, OVAL_GEOMETRY).r);
  });
});

describe('tasselPath', () => {
  it('builds three strands starting at the imam bead', () => {
    const path = tasselPath(beadPlacement(0, 0, OVAL_GEOMETRY));
    expect(path.match(/M/g)).toHaveLength(3);
  });
});
