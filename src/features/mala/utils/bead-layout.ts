export const BEAD_COUNT = 33;

export type OvalGeometry = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Radius of a bead at the back (top) of the oval. */
  beadRadius: number;
  /** Extra radius for beads at the front (bottom), gives a simple depth effect. */
  depthBoost: number;
  beadCount: number;
};

export const OVAL_VIEWBOX = { width: 300, height: 340 } as const;

export const OVAL_GEOMETRY: OvalGeometry = {
  cx: 150,
  cy: 170,
  rx: 100,
  ry: 115,
  beadRadius: 6.5,
  depthBoost: 2.5,
  beadCount: BEAD_COUNT,
};

export type BeadPlacement = { x: number; y: number; r: number; angle: number };

/**
 * Where bead `index` sits when the mala has been advanced by `offset` beads.
 * Bead 0 is the imam (marker) bead.
 *
 * Runs on the UI thread as a worklet: it must only use its arguments and literals.
 * Module-level constants (even as default parameter values) do not exist there and crash.
 */
export function beadPlacement(
  index: number,
  offset: number,
  geometry: OvalGeometry,
): BeadPlacement {
  'worklet';
  // Angle grows with `offset`, so the front (bottom) beads travel from right to left.
  const angle = Math.PI / 2 + ((offset - index) * 2 * Math.PI) / geometry.beadCount;
  const x = geometry.cx + geometry.rx * Math.cos(angle);
  const y = geometry.cy + geometry.ry * Math.sin(angle);
  const depth = (y - (geometry.cy - geometry.ry)) / (2 * geometry.ry);
  const scale = index === 0 ? 1.4 : 1;
  const r = (geometry.beadRadius + depth * geometry.depthBoost) * scale;

  return { x, y, r, angle };
}

/** SVG path for the three-strand tassel hanging radially outward from the imam bead. */
export function tasselPath(imam: BeadPlacement, length: number = 38): string {
  'worklet';
  const nx = Math.cos(imam.angle);
  const ny = Math.sin(imam.angle);
  const sx = imam.x + nx * imam.r;
  const sy = imam.y + ny * imam.r;
  const tx = -ny * 5;
  const ty = nx * 5;
  const ex = sx + nx * length;
  const ey = sy + ny * length;

  return (
    `M${sx},${sy} L${ex + tx},${ey + ty} ` +
    `M${sx},${sy} L${ex + nx * 4},${ey + ny * 4} ` +
    `M${sx},${sy} L${ex - tx},${ey - ty}`
  );
}

/** The fixed ring at the front of the oval that marks the bead you are currently on. */
export function currentBeadRing(geometry: OvalGeometry): { x: number; y: number; r: number } {
  return {
    x: geometry.cx,
    y: geometry.cy + geometry.ry,
    r: (geometry.beadRadius + geometry.depthBoost) * 1.4 + 3.5,
  };
}
