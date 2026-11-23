export type Dhikr = {
  id: string;
  /** Empty for custom dhikr without Arabic text. */
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningBn: string;
  defaultTarget: number;
  isCustom: boolean;
};
