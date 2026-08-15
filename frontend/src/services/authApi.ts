import { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "skillswap_auth_token_v1";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
  details?: any;
}

export interface MeResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  handle?: string;
  avatar?: string;
  college?: string;
  major?: string;
  year?: string;
  bio?: string;
}

export const authApi = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to persist auth token", e);
    }
  },

  clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to clear auth token", e);
    }
  },

  /**
   * Log in with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.error || "Failed to log in");
    }

    this.setToken(data.data.token);
    return data.data;
  },

  /**
   * Register a new student account
   */
  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.error || "Failed to register account");
    }

    this.setToken(data.data.token);
    return data.data;
  },

  /**
   * Fetch currently authenticated user via stored JWT Bearer token
   */
  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        this.clearToken();
        return null;
      }

      const data: MeResponse = await response.json();
      if (!response.ok || !data.success || !data.data?.user) {
        this.clearToken();
        return null;
      }

      return data.data.user;
    } catch (error) {
      console.warn("Failed to reach auth backend /api/auth/me", error);
      return null;
    }
  },

  /**
   * Log out session
   */
  async logout(): Promise<void> {
    const token = this.getToken();
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (e) {
      console.warn("Logout request failed, clearing local token anyway", e);
    } finally {
      this.clearToken();
    }
  },

  /**
   * Health check to test backend connection
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};
