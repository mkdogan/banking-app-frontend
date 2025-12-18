import type { AuthResponse, LoginRequest, RegisterRequest } from './types';
import api from './axios';

// In-memory token storage (for current session)
let accessToken: string | null = null;

export const authService = {
  getToken(): string | null {
    if (accessToken) return accessToken;
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    accessToken = token;
    localStorage.setItem('token', token);
  },

  clearToken(): void {
    accessToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const authData = response.data;
    this.setToken(authData.token);
    this.setUser(authData);
    return authData;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const authData = response.data;
    this.setToken(authData.token);
    this.setUser(authData);
    return authData;
  },

  logout(): void {
    this.clearToken();
  },
};

