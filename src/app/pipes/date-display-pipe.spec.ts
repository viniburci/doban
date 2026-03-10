import { DateDisplayPipe } from './date-display-pipe';

describe('DateDisplayPipe', () => {
  let pipe: DateDisplayPipe;

  beforeEach(() => {
    pipe = new DateDisplayPipe();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format ISO date to DD/MM/YYYY', () => {
    expect(pipe.transform('2024-03-15')).toBe('15/03/2024');
  });

  it('should pad single digit day and month with zeros', () => {
    expect(pipe.transform('2024-01-05')).toBe('05/01/2024');
  });

  it('should handle end of year date correctly', () => {
    expect(pipe.transform('2024-12-31')).toBe('31/12/2024');
  });

  it('should handle beginning of year date correctly', () => {
    expect(pipe.transform('2024-01-01')).toBe('01/01/2024');
  });
});
