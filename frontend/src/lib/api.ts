import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterData, Feed, Article } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    const response = await api.post<AuthResponse>('/api/auth/login', formData);
    return response.data;
  },
};

export const feedsApi = {
  getAll: async () => {
    const response = await api.get<Feed[]>('/api/feeds/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Feed>(`/api/feeds/${id}`);
    return response.data;
  },

  create: async (data: Partial<Feed>) => {
    const response = await api.post<Feed>('/api/feeds/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Feed>) => {
    const response = await api.put<Feed>(`/api/feeds/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/feeds/${id}`);
  },

  refresh: async (id: number) => {
    const response = await api.post(`/api/feeds/${id}/refresh`);
    return response.data;
  },
};

export const articlesApi = {
  getAll: async (params?: {
    feed_id?: number;
    is_read?: boolean;
    is_starred?: boolean;
    search?: string;
    skip?: number;
    limit?: number;
  }) => {
    const response = await api.get<Article[]>('/api/articles/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Article>(`/api/articles/${id}`);
    return response.data;
  },

  markRead: async (id: number, is_read: boolean) => {
    const response = await api.post<Article>(`/api/articles/${id}/read`, { is_read });
    return response.data;
  },

  markStarred: async (id: number, is_starred: boolean) => {
    const response = await api.post<Article>(`/api/articles/${id}/star`, { is_starred });
    return response.data;
  },
};

export default api;
