// Authentication Service
import { apiClient } from '@/api';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface LoginRequest {
  username: string; // Email is used as username
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'intern' | 'company' | 'admin';
  skills?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: string;
  skills: string | null;
}

export interface EmailVerificationRequest {
  email: string;
  otp: string;
}

export interface SendVerificationOTPRequest {
  email: string;
}

export interface EmailVerificationResponse {
  message: string;
  email?: string;
  email_verified?: boolean;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    console.log('🔐 Login attempt:', { username: credentials.username, passwordLength: credentials.password.length });

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login error:', errorData);
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    console.log('✅ Login successful!');
    return data;
  },

  async register(data: RegisterRequest): Promise<EmailVerificationResponse> {
    return apiClient.post('/api/v1/auth/register', data);
  },

  async verifyEmail(data: EmailVerificationRequest): Promise<AuthResponse> {
    return apiClient.post('/api/v1/auth/verify-email', data);
  },

  async sendVerificationOTP(data: SendVerificationOTPRequest): Promise<EmailVerificationResponse> {
    return apiClient.post('/api/v1/auth/send-verification-otp', data);
  },

  async getCurrentUser(): Promise<UserProfile> {
    return apiClient.get('/api/v1/auth/me');
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  },
};
