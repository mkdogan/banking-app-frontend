const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async post<T>(endpoint: string, body?: unknown, includeAuth = true): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  // DELETE endpoints in our API either return no content (204)
  // or a plain text message like "Client deleted successfully".
  // Trying to parse that as JSON causes errors like:
  //   Unexpected token 'C', "Client del"... is not valid JSON
  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      // Still surface any error message from the backend
      throw new Error(await response.text());
    }
    // We deliberately ignore the response body for DELETE
    return;
  }
}

export const apiClient = new ApiClient();
