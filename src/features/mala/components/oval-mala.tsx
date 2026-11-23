import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';

import { DEFAULT_SKIN, type MalaSkin, type MalaSkinColors } from '../data/skins';
import {
  BEAD_COUNT,
  OVAL_GEOMETRY,
  OVAL_VIEWBOX,
  beadPlacement,
  currentBeadRing,
  tasselPath,
} from '../utils/bead-layout';
import { useMalaOffset } from './use-mala-offset';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type OvalMalaProps = {
  /** Total taps so far. The mala advances one bead per tap. */
  totalTaps: number;
  skin?: MalaSkin;
  /** Rendered in the middle of the oval (the count). */
  children?: React.ReactNode;
};

type BeadProps = {
  index: number;
  offset: SharedValue<number>;
  colors: MalaSkinColors;
};

function Bead({ index, offset, colors }: BeadProps) {
  const isImam = index === 0;

  const bodyProps = useAnimatedProps(() => {
    const p = beadPlacement(index, offset.value, OVAL_GEOMETRY);
    return { cx: p.x, cy: p.y, r: p.r };
  });
  const shineProps = useAnimatedProps(() => {
    const p = beadPlacement(index, offset.value, OVAL_GEOMETRY);
    return { cx: p.x - p.r * 0.3, cy: p.y - p.r * 0.35, r: p.r * 0.3 };
  });

  return (
    <>
      <AnimatedCircle
        animatedProps={bodyProps}
        fill={isImam ? colors.imam : colors.bead}
        stroke={isImam ? colors.imamEdge : colors.beadEdge}
        strokeWidth={0.8}
      />
      <AnimatedCircle animatedProps={shineProps} fill="#ffffff" fillOpacity={0.38} />
    </>
  );
}

function Tassel({ offset, color }: { offset: SharedValue<number>; color: string }) {
  const props = useAnimatedProps(() => ({
    d: tasselPath(beadPlacement(0, offset.value, OVAL_GEOMETRY)),
  }));

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

const RING = currentBeadRing(OVAL_GEOMETRY);
const BEAD_INDEXES = Array.from({ length: BEAD_COUNT }, (_, i) => i);

export function OvalMala({ totalTaps, skin = DEFAULT_SKIN, children }: OvalMalaProps) {
  const colors = skin.colors[useColorScheme()];
  const offset = useMalaOffset(totalTaps);

  const { cx, cy, rx, ry } = OVAL_GEOMETRY;

  return (
    <View style={styles.root}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${OVAL_VIEWBOX.width} ${OVAL_VIEWBOX.height}`}>
        <Ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={colors.rope}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <Tassel offset={offset} color={colors.tassel} />
        {BEAD_INDEXES.map((i) => (
          <Bead key={i} index={i} offset={offset} colors={colors} />
        ))}
        <Circle
          cx={RING.x}
          cy={RING.y}
          r={RING.r}
          fill="none"
          stroke={colors.imam}
          strokeWidth={2.5}
        />
      </Svg>
      <View pointerEvents="none" style={styles.center}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignSelf: 'stretch', maxHeight: 420 },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
