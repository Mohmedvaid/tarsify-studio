import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber, formatCredits } from '@/lib/utils/format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly (cents to dollars)', () => {
      // formatCurrency takes cents and converts to dollars
      expect(formatCurrency(100000)).toBe('$1,000.00'); // 100000 cents = $1000
      expect(formatCurrency(9999)).toBe('$99.99'); // 9999 cents = $99.99
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative values', () => {
      expect(formatCurrency(-10000)).toBe('-$100.00'); // -10000 cents = -$100
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });
  });

  describe('formatCredits', () => {
    it('formats credits correctly', () => {
      expect(formatCredits(1500)).toBe('1,500 credits');
      expect(formatCredits(1)).toBe('1 credits');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      // Date format depends on locale, but should contain Jan 15
      expect(formatted).toContain('15');
    });
  });
});
