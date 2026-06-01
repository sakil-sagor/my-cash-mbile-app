export const endpoints = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
  },
  users: {
    me: '/api/v1/users/me',
  },
} as const;
