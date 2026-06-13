import { describe, expect, it } from 'vitest';
import { flagImageUrl } from './flag-utils';

describe('flag utilities', () => {
  it('turns FIFA country code into a flag image URL', () => {
    expect(flagImageUrl('MX')).toBe('https://flagcdn.com/w80/mx.png');
  });

  it('supports home nation subdivision flag images', () => {
    expect(flagImageUrl('GB-ENG')).toBe('https://flagcdn.com/w80/gb-eng.png');
  });
});
