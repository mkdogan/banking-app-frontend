// ==================== Request Types ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address: string;
}

export interface AccountCreateRequest {
  clientId: number;
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
}

export interface CardCreateRequest {
  accountNumber: string;
  cardType: 'DEBIT' | 'CREDIT';
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
}

// ==================== Response Types ====================

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ClientResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface AccountResponse {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
  clientUsername: string;
}

export interface CardResponse {
  id: number;
  cardNumber: string;
  cardType: string;
  status: string;
  accountNumber: string;
  createdAt: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  type: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  description: string;
  createdAt: string;
}

