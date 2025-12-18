import { apiClient } from './client';
import type { AccountCreateRequest, AccountResponse } from './types';

export const accountsApi = {
  // Admin: get all accounts
  getAll: (): Promise<AccountResponse[]> =>
    apiClient.get('/accounts'),

  // Admin: get account by id
  getById: (id: number): Promise<AccountResponse> =>
    apiClient.get(`/accounts/${id}`),

  // Get account by account number
  getByAccountNumber: (accountNumber: string): Promise<AccountResponse> =>
    apiClient.get(`/accounts/number/${accountNumber}`),

  // User: get my accounts
  getMyAccounts: (): Promise<AccountResponse[]> =>
    apiClient.get('/accounts/my'),

  // User: get my account by id
  getMyAccountById: (id: number): Promise<AccountResponse> =>
    apiClient.get(`/accounts/my/${id}`),

  // Create new account
  create: (data: AccountCreateRequest): Promise<AccountResponse> =>
    apiClient.post('/accounts/create', data),
};

