// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Notebook Types
export type NotebookStatus = 'draft' | 'published' | 'archived';
export type GpuType = 'T4' | 'L4' | 'A100' | 'H100';
export type NotebookCategory = 'image' | 'text' | 'video' | 'audio' | 'other';

export interface Notebook {
  id: string;
  developerId: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl?: string;
  priceCredits: number;
  gpuType: GpuType;
  category: NotebookCategory;
  status: NotebookStatus;
  totalRuns: number;
  averageRating?: number;
  hasFile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotebookInput {
  title: string;
  description: string;
  shortDescription: string;
  priceCredits: number;
  gpuType: GpuType;
  category: NotebookCategory;
}

export interface UpdateNotebookInput extends Partial<CreateNotebookInput> {
  thumbnailUrl?: string;
}

// Developer Types
export interface Developer {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  earningsBalance: number;
  payoutEmail?: string;
  stripeAccountId?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeveloperInput {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  payoutEmail?: string;
}

// Analytics Types
export interface AnalyticsOverview {
  totalNotebooks: number;
  totalRuns: number;
  totalEarnings: number;
  viewsToday: number;
  runsToday: number;
}

export interface NotebookAnalytics {
  notebookId: string;
  notebookTitle: string;
  views: number;
  runs: number;
  earnings: number;
}

// Earnings Types
export interface EarningsSummary {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
}

export interface EarningsBreakdown {
  notebookId: string;
  notebookTitle: string;
  totalRuns: number;
  totalEarnings: number;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  id: string;
  developerId: string;
  amount: number;
  status: PayoutStatus;
  stripePayoutId?: string;
  createdAt: string;
  completedAt?: string;
}
