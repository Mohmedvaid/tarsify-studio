// Studio API Endpoints

export const endpoints = {
  // Authentication
  auth: {
    register: '/api/studio/auth/register',
    me: '/api/studio/auth/me',
    profile: '/api/studio/auth/profile',
    completeProfile: '/api/studio/auth/complete-profile',
  },

  // Developer Profile (alias to auth for clarity)
  developers: {
    me: '/api/studio/auth/me',
    update: '/api/studio/auth/profile',
    completeProfile: '/api/studio/auth/complete-profile',
  },

  // Tars Models
  tarsModels: {
    baseModels: '/api/studio/tars-models/base-models',
    list: '/api/studio/tars-models',
    create: '/api/studio/tars-models',
    get: (id: string) => `/api/studio/tars-models/${id}`,
    update: (id: string) => `/api/studio/tars-models/${id}`,
    delete: (id: string) => `/api/studio/tars-models/${id}`,
    publish: (id: string) => `/api/studio/tars-models/${id}/publish`,
    testRun: (id: string) => `/api/studio/tars-models/${id}/test-run`,
  },
} as const;
