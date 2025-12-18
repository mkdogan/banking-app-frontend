import { apiClient } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data, false),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data, false),

  saveToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  clearToken: (): void => {
    localStorage.removeItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

