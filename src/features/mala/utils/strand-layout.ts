export type StrandGeometry = {
  width: number;
  height: number;
  /** Centre line the strand wiggles around. */
  cx: number;
  amplitude: number;
  wavelength: number;
  /** Y of the current bead: the fixed spot marked by the ring. */
  baseline: number;
  spacing: number;
  /** Number of bead components that are recycled along the strand. */
  poolSize: number;
  /** Slot (in beads, relative to the offset) of the lowest visible bead; slots above it follow. */
  firstSlot: number;
  beadRadius: number;
  /** Every n-th bead is the imam bead. */
  imamEvery: number;
  /** Distance from the top/bottom edge over which beads fade out. */
  fade: number;
  tasselLength: number;
};

export const STRAND_GEOMETRY: StrandGeometry = {
  width: 120,
  height: 520,
  cx: 60,
  amplitude: 18,
  wavelength: 460,
  baseline: 320,
  spacing: 36,
  poolSize: 17,
  firstSlot: -6.5,
  beadRadius: 15,
  imamEvery: 33,
  fade: 40,
  tasselLength: 40,
};

export type StrandBead = {
  x: number;
  y: number;
  r: number;
  isImam: boolean;
  opacity: number;
};

function fadeAt(y: number, g: StrandGeometry): number {
  'worklet';
  const edge = Math.min(y, g.height - y);
  return Math.max(0, Math.min(1, edge / g.fade));
}

/** Beads already counted (below the ring) are dimmed; the current bead and upcoming ones are solid. */
function dimAt(slot: number): number {
  'worklet';
  if (slot >= 0) {
    return 1;
  }
  return slot <= -1 ? 0.5 : 0.5 + 0.5 * (slot + 1);
}

function xAt(y: number, g: StrandGeometry): number {
  'worklet';
  return g.cx + g.amplitude * Math.sin((y / g.wavelength) * 2 * Math.PI);
}

/**
 * Pool slot `slot` shows an ever-increasing bead number `n` so that it always sits inside the
 * visible window. Bead number `n` is the bead you are on after `n` taps: it sits in the ring
 * when `offset === n`. As `offset` grows the beads slide down through the ring, counted beads
 * below it and upcoming beads above it. A bead leaving the bottom is recycled at the top.
 * Worklet: only uses its arguments, no module-level values.
 */
export function strandBead(slot: number, offset: number, g: StrandGeometry): StrandBead {
  'worklet';
  const n = slot + g.poolSize * Math.ceil((offset + g.firstSlot - slot) / g.poolSize);
  const relative = n - offset;
  const y = g.baseline - relative * g.spacing;
  const isImam = ((n % g.imamEvery) + g.imamEvery) % g.imamEvery === 0;

  return {
    x: xAt(y, g),
    y,
    r: g.beadRadius * (isImam ? 1.3 : 1),
    isImam,
    opacity: fadeAt(y, g) * dimAt(relative),
  };
}

/** Tassel hanging from the imam bead, plus its visibility. */
export function strandTassel(offset: number, g: StrandGeometry): { d: string; opacity: number } {
  'worklet';
  const n = g.imamEvery * Math.ceil((offset + g.firstSlot) / g.imamEvery);
  const relative = n - offset;
  if (relative >= g.poolSize + g.firstSlot) {
    return { d: 'M0,0', opacity: 0 };
  }
  const y = g.baseline - relative * g.spacing;
  // Hangs from the lower-left of the imam bead and trails to the left, clear of the next bead.
  const sx = xAt(y, g) - g.beadRadius * 0.8;
  const sy = y + g.beadRadius;
  const ex = sx - 20;
  const ey = sy + g.tasselLength;

  return {
    d: `M${sx},${sy} L${ex - 7},${ey - 4} M${sx},${sy} L${ex},${ey} M${sx},${sy} L${ex + 7},${ey - 4}`,
    opacity: fadeAt(y, g) * dimAt(relative),
  };
}

/** The fixed ring that marks the bead you are currently on. */
export function strandRing(g: StrandGeometry): { x: number; y: number; r: number } {
  return {
    x: g.cx + g.amplitude * Math.sin((g.baseline / g.wavelength) * 2 * Math.PI),
    y: g.baseline,
    r: g.beadRadius * 1.3 + 6,
  };
}

/** Static rope the beads sit on, sampled along the same curve. */
export function strandRopePath(g: StrandGeometry): string {
  const points: string[] = [];
  for (let y = 0; y <= g.height; y += 8) {
    const x = g.cx + g.amplitude * Math.sin((y / g.wavelength) * 2 * Math.PI);
    points.push(`${points.length === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return points.join(' ');
}
