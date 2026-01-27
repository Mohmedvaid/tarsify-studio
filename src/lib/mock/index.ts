/**
 * Mock Data Utilities
 * 
 * This file provides mock data generators for development.
 * TODO: Remove when real API is integrated (see DEVELOPMENT.md)
 */

import type {
  Notebook,
  NotebookStatus,
  GpuType,
  NotebookCategory,
  AnalyticsOverview,
  NotebookAnalytics,
  EarningsSummary,
  EarningsBreakdown,
  Payout,
  Developer,
} from '@/types/api';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Set to false when real API is ready
 * This flag controls whether hooks use mock or real data
 */
export const USE_MOCK_DATA = true;

/**
 * Simulated API delay range (ms)
 */
const MIN_DELAY = 300;
const MAX_DELAY = 800;

/**
 * Simulate API latency
 */
export const mockDelay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY))
  );

/**
 * Simulate occasional API errors (10% chance)
 */
export const maybeThrowError = (errorRate = 0) => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated API error');
  }
};

// ============================================================================
// Mock Data Generators
// ============================================================================

const notebookTitles = [
  'Stable Diffusion XL Image Generator',
  'GPT-4 Text Summarizer',
  'Video Style Transfer',
  'Voice Cloning Studio',
  'Background Remover Pro',
  'AI Image Upscaler',
  'Text-to-Speech Engine',
  'Code Assistant Bot',
  'Image Colorization',
  'Face Swap AI',
];

const categories: NotebookCategory[] = ['image', 'text', 'video', 'audio', 'other'];
const gpuTypes: GpuType[] = ['T4', 'L4', 'A100', 'H100'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// ============================================================================
// Mock Notebooks
// ============================================================================

export const mockNotebooks: Notebook[] = notebookTitles.map((title, index) => ({
  id: `nb_${index + 1}`,
  developerId: 'dev_001',
  title,
  description: `This is a detailed description for ${title}. It includes information about how the model works, what inputs it accepts, and what outputs it produces. Perfect for AI enthusiasts and professionals alike.`,
  shortDescription: `AI-powered ${title.toLowerCase()} with state-of-the-art performance.`,
  thumbnailUrl: index % 3 === 0 ? null : `https://picsum.photos/seed/${index}/400/300`,
  priceCredits: randomBetween(5, 100) * 10,
  gpuType: randomFrom(gpuTypes),
  category: randomFrom(categories),
  status: index < 5 ? 'published' : index < 8 ? 'draft' : 'archived',
  totalRuns: index < 5 ? randomBetween(100, 5000) : 0,
  averageRating: index < 5 ? 3.5 + Math.random() * 1.5 : null,
  notebookFileUrl: index < 7 ? `uploads/notebooks/nb_${index + 1}.ipynb` : null,
  createdAt: generateDate(randomBetween(7, 90)),
  updatedAt: generateDate(randomBetween(0, 6)),
}));

export function getMockNotebooks(params?: {
  page?: number;
  limit?: number;
  status?: NotebookStatus;
  search?: string;
}) {
  let filtered = [...mockNotebooks];

  if (params?.status) {
    filtered = filtered.filter((n) => n.status === params.status);
  }

  if (params?.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(search) ||
        (n.shortDescription?.toLowerCase().includes(search) ?? false)
    );
  }

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

export function getMockNotebook(id: string): Notebook | undefined {
  return mockNotebooks.find((n) => n.id === id);
}

// ============================================================================
// Mock Analytics
// ============================================================================

export function getMockAnalyticsOverview(): AnalyticsOverview {
  return {
    totalNotebooks: mockNotebooks.filter((n) => n.status === 'published').length,
    totalRuns: mockNotebooks.reduce((sum, n) => sum + n.totalRuns, 0),
    totalEarnings: mockNotebooks.reduce((sum, n) => sum + n.totalRuns * n.priceCredits * 0.7, 0),
    viewsToday: randomBetween(50, 500),
    runsToday: randomBetween(10, 100),
  };
}

export function getMockNotebookAnalytics(notebookId: string): NotebookAnalytics | undefined {
  const notebook = mockNotebooks.find((n) => n.id === notebookId);
  if (!notebook) return undefined;

  return {
    notebookId: notebook.id,
    notebookTitle: notebook.title,
    views: randomBetween(500, 10000),
    runs: notebook.totalRuns,
    earnings: notebook.totalRuns * notebook.priceCredits * 0.7,
  };
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface AnalyticsTrends {
  runs: TimeSeriesDataPoint[];
  earnings: TimeSeriesDataPoint[];
  views: TimeSeriesDataPoint[];
}

export function getMockAnalyticsTrends(days: number = 30): AnalyticsTrends {
  const runs: TimeSeriesDataPoint[] = [];
  const earnings: TimeSeriesDataPoint[] = [];
  const views: TimeSeriesDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0] ?? '';

    // Generate realistic looking data with some variance
    const baseRuns = 50 + Math.sin(i / 5) * 20;
    const dailyRuns = Math.max(0, Math.floor(baseRuns + (Math.random() - 0.5) * 30));
    
    runs.push({ date: dateStr, value: dailyRuns });
    earnings.push({ date: dateStr, value: dailyRuns * randomBetween(20, 50) });
    views.push({ date: dateStr, value: dailyRuns * randomBetween(3, 8) });
  }

  return { runs, earnings, views };
}

export interface TopNotebook {
  notebookId: string;
  title: string;
  runs: number;
  earnings: number;
}

export function getMockTopNotebooks(limit: number = 5): TopNotebook[] {
  return mockNotebooks
    .filter((n) => n.status === 'published')
    .sort((a, b) => b.totalRuns - a.totalRuns)
    .slice(0, limit)
    .map((n) => ({
      notebookId: n.id,
      title: n.title,
      runs: n.totalRuns,
      earnings: n.totalRuns * n.priceCredits * 0.7,
    }));
}

export interface RecentRun {
  id: string;
  notebookId: string;
  notebookTitle: string;
  creditsEarned: number;
  runAt: string;
  duration: number; // seconds
}

export function getMockRecentRuns(limit: number = 10): RecentRun[] {
  const runs: RecentRun[] = [];
  const publishedNotebooks = mockNotebooks.filter((n) => n.status === 'published');

  for (let i = 0; i < limit; i++) {
    const notebook = randomFrom(publishedNotebooks);
    const date = new Date();
    date.setMinutes(date.getMinutes() - randomBetween(1, 1440)); // Within last 24 hours

    runs.push({
      id: `run_${i + 1}`,
      notebookId: notebook.id,
      notebookTitle: notebook.title,
      creditsEarned: notebook.priceCredits * 0.7,
      runAt: date.toISOString(),
      duration: randomBetween(30, 300),
    });
  }

  return runs.sort((a, b) => new Date(b.runAt).getTime() - new Date(a.runAt).getTime());
}

// ============================================================================
// Mock Earnings
// ============================================================================

export function getMockEarningsSummary(): EarningsSummary {
  const overview = getMockAnalyticsOverview();
  return {
    availableBalance: Math.floor(overview.totalEarnings * 0.6), // 60% available
    pendingBalance: Math.floor(overview.totalEarnings * 0.2), // 20% pending
    totalEarned: Math.floor(overview.totalEarnings),
  };
}

export function getMockEarningsBreakdown(): EarningsBreakdown[] {
  return mockNotebooks
    .filter((n) => n.status === 'published' && n.totalRuns > 0)
    .map((n) => ({
      notebookId: n.id,
      notebookTitle: n.title,
      totalRuns: n.totalRuns,
      totalEarnings: Math.floor(n.totalRuns * n.priceCredits * 0.7),
    }))
    .sort((a, b) => b.totalEarnings - a.totalEarnings);
}

export function getMockPayouts(): Payout[] {
  const payouts: Payout[] = [];

  for (let i = 0; i < 5; i++) {
    const status = i === 0 ? 'pending' : i === 1 ? 'processing' : 'completed';
    const date = new Date();
    date.setDate(date.getDate() - i * 14); // Every 2 weeks

    payouts.push({
      id: `payout_${i + 1}`,
      developerId: 'dev_001',
      amount: randomBetween(100, 1000) * 100, // In cents
      status,
      stripePayoutId: status === 'completed' ? `po_${Date.now()}_${i}` : undefined,
      createdAt: date.toISOString(),
      completedAt: status === 'completed' ? generateDate(i * 14 - 2) : undefined,
    });
  }

  return payouts;
}

// ============================================================================
// Mock Developer
// ============================================================================

export function getMockDeveloper(): Developer {
  return {
    id: 'dev_001',
    firebaseUid: 'firebase_uid_001',
    email: 'developer@example.com',
    displayName: 'Alex Developer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'AI enthusiast building the future of machine learning tools.',
    totalEarnings: getMockEarningsSummary().totalEarned,
    pendingPayout: getMockEarningsSummary().availableBalance,
    notebookCount: 5,
    profileComplete: true,
    stripeAccountId: undefined, // Not connected yet
    verified: true,
    createdAt: generateDate(180),
    updatedAt: generateDate(5),
  };
}
