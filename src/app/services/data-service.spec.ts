import { TestBed } from '@angular/core/testing';
import { DataService } from './data-service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  describe('convertISOToDateBR', () => {
    it('should return empty string for null', () => {
      expect(service.convertISOToDateBR(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(service.convertISOToDateBR(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(service.convertISOToDateBR('')).toBe('');
    });

    it('should convert YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(service.convertISOToDateBR('2024-03-15')).toBe('15/03/2024');
    });

    it('should pad single digit day and month', () => {
      expect(service.convertISOToDateBR('2024-01-05')).toBe('05/01/2024');
    });

    it('should return empty string for non-ISO format', () => {
      expect(service.convertISOToDateBR('15/03/2024')).toBe('');
    });
  });

  describe('convertDateToISO', () => {
    it('should return empty string for empty input', () => {
      expect(service.convertDateToISO('')).toBe('');
    });

    it('should convert DD/MM/YYYY to YYYY-MM-DD', () => {
      expect(service.convertDateToISO('15/03/2024')).toBe('2024-03-15');
    });

    it('should convert DDMMYYYY (only digits) to YYYY-MM-DD', () => {
      expect(service.convertDateToISO('15032024')).toBe('2024-03-15');
    });

    it('should return empty string when digits count is not 8', () => {
      expect(service.convertDateToISO('1503')).toBe('');
    });

    it('should ignore non-numeric characters', () => {
      expect(service.convertDateToISO('15-03-2024')).toBe('2024-03-15');
    });
  });

  describe('convertToLocalTime', () => {
    it('should return null for null', () => {
      expect(service.convertToLocalTime(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(service.convertToLocalTime(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(service.convertToLocalTime('')).toBeNull();
    });

    it('should return HH:MM from HH:MM:SS', () => {
      expect(service.convertToLocalTime('12:30:00')).toBe('12:30');
    });

    it('should return HH:MM unchanged', () => {
      expect(service.convertToLocalTime('08:15')).toBe('08:15');
    });
  });

  describe('formatTimeForBackend', () => {
    it('should return null for null', () => {
      expect(service.formatTimeForBackend(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(service.formatTimeForBackend(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(service.formatTimeForBackend('')).toBeNull();
    });

    it('should append :00 to HH:MM format', () => {
      expect(service.formatTimeForBackend('08:00')).toBe('08:00:00');
    });

    it('should format 4-digit string to HH:MM', () => {
      expect(service.formatTimeForBackend('0800')).toBe('08:00');
    });

    it('should return null for unrecognized format', () => {
      expect(service.formatTimeForBackend('abc')).toBeNull();
    });
  });
});
