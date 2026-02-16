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
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================
// Developer Types
// ============================================

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
  modelCount: number;
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

// ============================================
// Base Model Types (Platform-provided)
// ============================================

export type BaseModelCategory = 'IMAGE' | 'AUDIO' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
export type OutputType = 'IMAGE' | 'AUDIO' | 'TEXT' | 'JSON' | 'VIDEO' | 'FILE';

export interface BaseModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: BaseModelCategory;
  inputSchema: InputSchema;
  outputType: OutputType;
  outputFormat: string;
  estimatedSeconds: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// JSON Schema for input parameters
export interface InputSchema {
  type: 'object';
  required?: string[];
  properties: Record<string, InputSchemaProperty>;
}

export interface InputSchemaProperty {
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array';
  title?: string;
  description?: string;
  default?: unknown;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

// ============================================
// Tars Model Types (Developer-created)
// ============================================

export type TarsModelStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TarsModel {
  id: string;
  developerId: string;
  title: string;
  slug: string;
  description: string | null;
  status: TarsModelStatus;
  configOverrides: ConfigOverrides | null;
  priceCredits: number;
  totalRuns: number;
  baseModel: BaseModelSummary;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface BaseModelSummary {
  id: string;
  slug: string;
  name: string;
  category: BaseModelCategory;
  outputType: OutputType;
}

export interface ConfigOverrides {
  defaultInputs?: Record<string, unknown>;
  lockedInputs?: Record<string, unknown>;
  hiddenFields?: string[];
  promptPrefix?: string;
  promptSuffix?: string;
}

export interface CreateTarsModelInput {
  baseModelId: string;
  title: string;
  slug: string;
  description?: string;
  priceCredits?: number;
  configOverrides?: ConfigOverrides;
}

export interface UpdateTarsModelInput {
  title?: string;
  slug?: string;
  description?: string;
  priceCredits?: number;
  configOverrides?: ConfigOverrides;
}

export type PublishAction = 'publish' | 'archive';

export interface PublishTarsModelInput {
  action: PublishAction;
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface DashboardStats {
  totalModels: number;
  publishedModels: number;
  draftModels: number;
  totalRuns: number;
  totalEarnings: number;
}
