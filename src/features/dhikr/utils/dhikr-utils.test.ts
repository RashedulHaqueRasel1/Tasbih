import { PRESET_DHIKR } from '../data/preset-dhikr';
import { filterDhikr, sortFavoritesFirst, validateNewDhikr } from './dhikr-utils';

describe('filterDhikr', () => {
  it('returns everything for an empty query', () => {
    expect(filterDhikr(PRESET_DHIKR, '  ')).toHaveLength(PRESET_DHIKR.length);
  });

  it('matches transliteration case-insensitively', () => {
    const ids = filterDhikr(PRESET_DHIKR, 'SUBHAN').map((d) => d.id);
    expect(ids).toContain('subhanallah');
    expect(ids).not.toContain('durood');
  });

  it('matches the English meaning', () => {
    const ids = filterDhikr(PRESET_DHIKR, 'forgiveness').map((d) => d.id);
    expect(ids).toContain('astaghfirullah');
    expect(ids).not.toContain('subhanallah');
  });

  it('has a unique id for every preset', () => {
    const ids = PRESET_DHIKR.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns nothing when no dhikr matches', () => {
    expect(filterDhikr(PRESET_DHIKR, 'zzz')).toEqual([]);
  });
});

describe('sortFavoritesFirst', () => {
  it('puts favorites on top in the order they were favorited', () => {
    const sorted = sortFavoritesFirst(PRESET_DHIKR, ['durood', 'allahu-akbar']);
    expect(sorted.slice(0, 2).map((d) => d.id)).toEqual(['durood', 'allahu-akbar']);
    expect(sorted[2]?.id).toBe('subhanallah');
  });
});

describe('validateNewDhikr', () => {
  const valid = { transliteration: ' Ya Allah ', arabic: '', meaning: '', target: '50' };

  it('accepts a valid dhikr and trims fields', () => {
    const result = validateNewDhikr(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.transliteration).toBe('Ya Allah');
      expect(result.value.defaultTarget).toBe(50);
    }
  });

  it('rejects an empty name', () => {
    expect(validateNewDhikr({ ...valid, transliteration: '   ' }).ok).toBe(false);
  });

  it.each(['0', '-3', '1.5', 'abc', '', '100001'])('rejects target "%s"', (target) => {
    expect(validateNewDhikr({ ...valid, target }).ok).toBe(false);
  });
});
