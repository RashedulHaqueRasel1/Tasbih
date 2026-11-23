import { OvalMala, VerticalMala, getSkin } from '@/features/mala';
import { useSettingsStore } from '@/features/settings';

type BeadDisplayProps = {
  totalTaps: number;
  children: React.ReactNode;
};

/** The mala the user picked in settings (style and skin), with the count rendered inside it. */
export function BeadDisplay({ totalTaps, children }: BeadDisplayProps) {
  const malaStyle = useSettingsStore((s) => s.malaStyle);
  const skin = getSkin(useSettingsStore((s) => s.skinId));
  const Mala = malaStyle === 'vertical' ? VerticalMala : OvalMala;

  return (
    <Mala totalTaps={totalTaps} skin={skin}>
      {children}
    </Mala>
  );
}
