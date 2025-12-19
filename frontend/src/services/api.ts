import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  requestVerification: (email: string) => api.post('/auth/request-verification', { email }),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  requestPasswordReset: (email: string) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserById: (id: number) => api.get(`/admin/users/${id}`),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};

// Posts API
export const postsAPI = {
  getPosts: () => api.get('/posts'),
  getPostBySlug: (slug: string) => api.get(`/posts/${slug}`),
  createPost: (data: any) => api.post('/posts', data),
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getByCategory: (category: string) => api.get(`/settings/category/${category}`),
  get: (key: string) => api.get(`/settings/${key}`),
  update: (key: string, value: string) => api.put(`/settings/${key}`, { value }),
  updateMultiple: (settings: Record<string, string>) => api.put('/settings/bulk', { settings }),
  create: (data: any) => api.post('/settings', data),
  delete: (key: string) => api.delete(`/settings/${key}`),
};
