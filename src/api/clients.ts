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

  // Admin: soft-delete (disable) client
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/clients/${id}`),

  // Admin: re-enable client (and cascade enable accounts/cards)
  enable: (id: number): Promise<ClientResponse> =>
    apiClient.post<ClientResponse>(`/clients/${id}/enable`),
};

