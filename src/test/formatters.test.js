import { describe, it, expect } from 'vitest';
import { formatStatus, getBookingStatusColor, getPaymentStatusColor } from '../utils/formatters';

describe('formatters', () => {
  describe('formatStatus', () => {
    it('should format underscores as spaces and capitalize', () => {
      expect(formatStatus('hold_flight')).toBe('Hold Flight');
      expect(formatStatus('pending')).toBe('Pending');
    });

    it('should return N/A for null or undefined', () => {
      expect(formatStatus(null)).toBe('N/A');
    });
  });

  describe('getBookingStatusColor', () => {
    it('should return green for confirmed', () => {
      expect(getBookingStatusColor('confirmed')).toContain('green');
    });

    it('should return red for failed', () => {
      expect(getBookingStatusColor('failed')).toContain('red');
    });

    it('should be case insensitive', () => {
      expect(getBookingStatusColor('FAILED')).toContain('red');
    });
  });

  describe('getPaymentStatusColor', () => {
    it('should return green for paid', () => {
      expect(getPaymentStatusColor('paid')).toContain('green');
    });
  });
});
