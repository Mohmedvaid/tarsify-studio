import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string to a human-readable format
 * @example formatDate('2024-01-15T10:30:00Z') // 'Jan 15, 2024'
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date string to include time
 * @example formatDateTime('2024-01-15T10:30:00Z') // 'Jan 15, 2024 at 10:30 AM'
 */
export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Format a date as a relative time string
 * @example formatRelativeTime('2024-01-15T10:30:00Z') // '2 days ago'
 */
export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format credits with proper formatting
 * @example formatCredits(1500) // '1,500 credits'
 */
export function formatCredits(credits: number): string {
  return `${credits.toLocaleString()} credits`;
}

/**
 * Format currency (cents to dollars)
 * @example formatCurrency(2500) // '$25.00'
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

/**
 * Format a number with proper formatting
 * @example formatNumber(1500) // '1,500'
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a number with compact notation for large numbers
 * @example formatCompactNumber(15000) // '15K'
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Truncate text to a maximum length
 * @example truncateText('Hello world', 5) // 'Hello...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from a name
 * @example getInitials('John Doe') // 'JD'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
