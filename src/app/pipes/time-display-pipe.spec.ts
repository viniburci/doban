import { TimeDisplayPipe } from './time-display-pipe';

describe('TimeDisplayPipe', () => {
  let pipe: TimeDisplayPipe;

  beforeEach(() => {
    pipe = new TimeDisplayPipe();
  });

  it('should return default value N/D for null', () => {
    expect(pipe.transform(null)).toBe('N/D');
  });

  it('should return default value N/D for undefined', () => {
    expect(pipe.transform(undefined)).toBe('N/D');
  });

  it('should return default value N/D for empty string', () => {
    expect(pipe.transform('')).toBe('N/D');
  });

  it('should accept custom default value', () => {
    expect(pipe.transform(null, '--')).toBe('--');
  });

  it('should truncate seconds from HH:MM:SS', () => {
    expect(pipe.transform('12:30:00')).toBe('12:30');
  });

  it('should truncate seconds from time with non-zero seconds', () => {
    expect(pipe.transform('08:05:45')).toBe('08:05');
  });

  it('should return HH:MM unchanged when already without seconds', () => {
    expect(pipe.transform('12:30')).toBe('12:30');
  });

  it('should return short string unchanged', () => {
    expect(pipe.transform('12')).toBe('12');
  });
});
