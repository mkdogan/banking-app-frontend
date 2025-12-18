import { apiClient } from './client';
import type { TransactionResponse, TransferRequest } from './types';

export const transactionsApi = {
  // Admin: get all transactions
  getAll: (): Promise<TransactionResponse[]> =>
    apiClient.get('/transactions'),

  // User: get my transactions
  getMyTransactions: (): Promise<TransactionResponse[]> =>
    apiClient.get('/transactions/my'),

  // Get transactions for specific account
  getByAccount: (accountNumber: string): Promise<TransactionResponse[]> =>
    apiClient.get(`/transactions/account/${accountNumber}`),

  // Deposit money
  deposit: (accountNumber: string, amount: number, description?: string): Promise<void> => {
    const params = new URLSearchParams({
      accountNumber,
      amount: amount.toString(),
    });
    if (description) params.append('description', description);
    return apiClient.post(`/transactions/deposit?${params.toString()}`);
  },

  // Withdraw money
  withdraw: (accountNumber: string, amount: number, description?: string): Promise<void> => {
    const params = new URLSearchParams({
      accountNumber,
      amount: amount.toString(),
    });
    if (description) params.append('description', description);
    return apiClient.post(`/transactions/withdraw?${params.toString()}`);
  },

  // Transfer money between accounts
  transfer: (data: TransferRequest): Promise<void> =>
    apiClient.post('/transactions/transfer', data),
};

