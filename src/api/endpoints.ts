export const endpoints = {
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    refresh: '/auth/refresh/',
    me: '/auth/me/',
  },
  coins: {
    list: '/coins/',
    details: (id: string) => `/coins/${id}/`,
    chart: (id: string) => `/coins/${id}/chart/`,
  },
  favorites: {
    list: '/portfolio/favorites/',
    create: '/portfolio/favorites/',
    remove: (id: string | number) => `/portfolio/favorites/${id}/`,
  },
  portfolio: {
    get: '/portfolio/',
    create: '/portfolio/',
    update: (id: string) => `/portfolio/holdings/${id}/`,
    remove: (id: string) => `/portfolio/holdings/${id}/`,
  },
  alerts: {
    list: '/portfolio/alerts/',
    create: '/portfolio/alerts/',
    remove: (id: string) => `/portfolio/alerts/${id}/`,
  },
  notifications: {
    list: '/portfolio/notifications/',
    read: (id: string) => `/portfolio/notifications/${id}/read/`,
  },
  health: '/health/',
} as const;
