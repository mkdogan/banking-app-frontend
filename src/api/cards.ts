import { apiClient } from './client';
import type { CardCreateRequest, CardResponse } from './types';

export const cardsApi = {
  // Admin: get all cards
  getAll: (): Promise<CardResponse[]> =>
    apiClient.get('/cards'),

  // Admin: get card by id
  getById: (id: number): Promise<CardResponse> =>
    apiClient.get(`/cards/${id}`),

  // User: get my cards
  getMyCards: (): Promise<CardResponse[]> =>
    apiClient.get('/cards/my'),

  // User: get my card by id
  getMyCardById: (id: number): Promise<CardResponse> =>
    apiClient.get(`/cards/my/${id}`),

  // Create new card
  create: (data: CardCreateRequest): Promise<CardResponse> =>
    apiClient.post('/cards/create', data),

  // Admin: delete card
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/cards/${id}`),
};

