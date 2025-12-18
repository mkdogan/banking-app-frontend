import { apiClient } from './client';
import type { ClientResponse } from './types';

export const clientsApi = {
  // Admin: get all clients
  getAll: (): Promise<ClientResponse[]> =>
    apiClient.get('/clients'),

  // Admin: get client by id
  getById: (id: number): Promise<ClientResponse> =>
    apiClient.get(`/clients/${id}`),

  // User: get current client profile
  getMe: (): Promise<ClientResponse> =>
    apiClient.get('/clients/me'),

  // Admin: delete client
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/clients/${id}`),
};

