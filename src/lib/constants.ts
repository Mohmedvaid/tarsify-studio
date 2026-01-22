// App constants

export const APP_NAME = 'Tarsify Studio';
export const APP_DESCRIPTION = 'Developer portal for Tarsify AI marketplace';
export const APP_URL = 'https://studio.tarsify.com';

// Navigation items
export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Notebooks', href: '/notebooks', icon: 'BookOpen' },
  { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { name: 'Earnings', href: '/earnings', icon: 'DollarSign' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

// GPU types with display info
export const GPU_TYPES = [
  { value: 'T4', label: 'NVIDIA T4', description: 'Entry-level GPU, good for most tasks' },
  { value: 'L4', label: 'NVIDIA L4', description: 'Mid-range GPU, faster inference' },
  { value: 'A100', label: 'NVIDIA A100', description: 'High-performance GPU for large models' },
  { value: 'H100', label: 'NVIDIA H100', description: 'Top-tier GPU for demanding workloads' },
] as const;

// Notebook categories
export const NOTEBOOK_CATEGORIES = [
  { value: 'image', label: 'Image', description: 'Image generation and manipulation' },
  { value: 'text', label: 'Text', description: 'Text generation and processing' },
  { value: 'video', label: 'Video', description: 'Video generation and editing' },
  { value: 'audio', label: 'Audio', description: 'Audio generation and processing' },
  { value: 'other', label: 'Other', description: 'Other AI applications' },
] as const;

// Notebook status badges
export const NOTEBOOK_STATUS_CONFIG = {
  draft: { label: 'Draft', variant: 'secondary' as const },
  published: { label: 'Published', variant: 'default' as const },
  archived: { label: 'Archived', variant: 'outline' as const },
} as const;

// Payout status badges
export const PAYOUT_STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  processing: { label: 'Processing', variant: 'default' as const },
  completed: { label: 'Completed', variant: 'default' as const },
  failed: { label: 'Failed', variant: 'destructive' as const },
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

// File upload
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_FILE_TYPES = ['.ipynb'];

// Payout threshold (in cents)
export const MIN_PAYOUT_AMOUNT = 1000; // $10.00
