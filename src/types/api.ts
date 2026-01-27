// API Response Types - Backend wraps all responses in { success, data, meta?, error? }
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Pagination meta from backend
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Notebook Types
export type NotebookStatus = 'draft' | 'published' | 'archived';
export type GpuType = 'T4' | 'L4' | 'A100' | 'H100';
export type NotebookCategory = 'image' | 'text' | 'video' | 'audio' | 'other';

export interface Notebook {
  id: string;
  developerId: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  priceCredits: number;
  gpuType: GpuType;
  category: NotebookCategory;
  status: NotebookStatus;
  totalRuns: number;
  averageRating: number | null;
  notebookFileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotebookInput {
  title: string;                    // Required: 3-200 chars
  gpuType: GpuType;                 // Required
  priceCredits: number;             // Required: 1-10000
  description?: string | null;      // Optional: max 10000
  shortDescription?: string | null; // Optional: max 255
  category?: NotebookCategory;      // Optional: default 'other'
}

// Developer Types
export interface Developer {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  stripeAccountId?: string | null;
  verified: boolean;
  profileComplete: boolean;
  totalEarnings: number;
  pendingPayout: number;
  notebookCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeveloperInput {
  email: string;
  displayName?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface CompleteProfileInput {
  displayName: string;
  payoutEmail?: string;
  country?: string;
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
