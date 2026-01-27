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

  // Notebooks
  notebooks: {
    list: '/api/studio/notebooks',
    create: '/api/studio/notebooks',
    get: (id: string) => `/api/studio/notebooks/${id}`,
    delete: (id: string) => `/api/studio/notebooks/${id}`,
    file: (id: string) => `/api/studio/notebooks/${id}/file`,
    publish: (id: string) => `/api/studio/notebooks/${id}/publish`,
    unpublish: (id: string) => `/api/studio/notebooks/${id}/unpublish`,
  },

  // Analytics (Future)
  analytics: {
    overview: '/api/studio/analytics',
    notebook: (id: string) => `/api/studio/analytics/notebooks/${id}`,
  },

  // Earnings (Future)
  earnings: {
    summary: '/api/studio/earnings',
    payouts: {
      list: '/api/studio/payouts',
      request: '/api/studio/payouts/request',
    },
  },
} as const;
