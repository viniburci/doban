import { parseDateString } from './date-utils';

describe('parseDateString', () => {
  it('should return null for null', () => {
    expect(parseDateString(null)).toBeNull();
  });

  it('should return null for undefined', () => {
    expect(parseDateString(undefined)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(parseDateString('')).toBeNull();
  });

  it('should parse a valid ISO date string', () => {
    const result = parseDateString('2024-03-15');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
  });

  it('should extract only the date part from a datetime string', () => {
    const result = parseDateString('2024-06-20T10:30:00');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
  });

  it('should return null for an invalid date string', () => {
    expect(parseDateString('not-a-date')).toBeNull();
  });

  it('should return null for a malformed date like 9999-99-99', () => {
    expect(parseDateString('9999-99-99')).toBeNull();
  });
});
