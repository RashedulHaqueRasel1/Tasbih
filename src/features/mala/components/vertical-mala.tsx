import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { spacing } from '@/shared/theme';

import { DEFAULT_SKIN, type MalaSkin, type MalaSkinColors } from '../data/skins';
import {
  STRAND_GEOMETRY,
  strandBead,
  strandRing,
  strandRopePath,
  strandTassel,
} from '../utils/strand-layout';
import { useMalaOffset } from './use-mala-offset';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const ROPE_PATH = strandRopePath(STRAND_GEOMETRY);
const RING = strandRing(STRAND_GEOMETRY);
const POOL = Array.from({ length: STRAND_GEOMETRY.poolSize }, (_, i) => i);

type VerticalMalaProps = {
  /** Total taps so far. The strand advances one bead per tap. */
  totalTaps: number;
  skin?: MalaSkin;
  /** Rendered next to the strand (the count). */
  children?: React.ReactNode;
};

function StrandBead({
  slot,
  offset,
  colors,
}: {
  slot: number;
  offset: SharedValue<number>;
  colors: MalaSkinColors;
}) {
  // Colors stay plain props (so a skin change re-renders); only geometry and opacity animate.
  // A pool slot is either a regular bead or the imam bead, so each gets its own circle and the
  // worklet fades the one that does not apply to zero.
  const regularProps = useAnimatedProps(() => {
    const b = strandBead(slot, offset.value, STRAND_GEOMETRY);
    return { cx: b.x, cy: b.y, r: b.r, opacity: b.isImam ? 0 : b.opacity };
  });
  const imamProps = useAnimatedProps(() => {
    const b = strandBead(slot, offset.value, STRAND_GEOMETRY);
    return { cx: b.x, cy: b.y, r: b.r, opacity: b.isImam ? b.opacity : 0 };
  });
  const shineProps = useAnimatedProps(() => {
    const b = strandBead(slot, offset.value, STRAND_GEOMETRY);
    return { cx: b.x - b.r * 0.3, cy: b.y - b.r * 0.35, r: b.r * 0.3, opacity: b.opacity * 0.38 };
  });

  return (
    <>
      <AnimatedCircle
        animatedProps={regularProps}
        fill={colors.bead}
        stroke={colors.beadEdge}
        strokeWidth={0.8}
      />
      <AnimatedCircle
        animatedProps={imamProps}
        fill={colors.imam}
        stroke={colors.imamEdge}
        strokeWidth={0.8}
      />
      <AnimatedCircle animatedProps={shineProps} fill="#ffffff" />
    </>
  );
}

function StrandTassel({ offset, color }: { offset: SharedValue<number>; color: string }) {
  const props = useAnimatedProps(() => {
    const t = strandTassel(offset.value, STRAND_GEOMETRY);
    return { d: t.d, opacity: t.opacity };
  });

  return (
    <AnimatedPath
      animatedProps={props}
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      fill="none"
    />
  );
}

export function VerticalMala({ totalTaps, skin = DEFAULT_SKIN, children }: VerticalMalaProps) {
  const colors = skin.colors[useColorScheme()];
  const offset = useMalaOffset(totalTaps);

  return (
    <View style={styles.root}>
      <View style={styles.countColumn}>{children}</View>
      <View style={styles.strandColumn}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${STRAND_GEOMETRY.width} ${STRAND_GEOMETRY.height}`}>
          <Path
            d={ROPE_PATH}
            stroke={colors.rope}
            strokeOpacity={0.5}
            strokeWidth={1.5}
            fill="none"
          />
          <StrandTassel offset={offset} color={colors.tassel} />
          {POOL.map((slot) => (
            <StrandBead key={slot} slot={slot} offset={offset} colors={colors} />
          ))}
          <Circle
            cx={RING.x}
            cy={RING.y}
            r={RING.r}
            fill="none"
            stroke={colors.imam}
            strokeWidth={3}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' },
  countColumn: { flex: 1, justifyContent: 'center', paddingRight: spacing.sm },
  strandColumn: { height: '100%', aspectRatio: STRAND_GEOMETRY.width / STRAND_GEOMETRY.height },
});
