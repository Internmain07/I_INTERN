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

    const requestUrl = `${API_URL}/api/v1/auth/login`;
    
    console.log('🔐 Login attempt:', { 
      username: credentials.username, 
      passwordLength: credentials.password.length,
      apiUrl: requestUrl,
      timestamp: new Date().toISOString()
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // Important for cookies
        body: formData,
      });

      console.log('📡 Response received:', { 
        status: response.status, 
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('❌ Login error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestUrl
        });
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error(errorData.detail || 'Incorrect email or password');
        } else if (response.status === 403) {
          throw new Error(errorData.detail || 'Email not verified. Please verify your email first.');
        } else {
          throw new Error(errorData.detail || 'Login failed');
        }
      }

      const data = await response.json();
      console.log('✅ Login successful!', { 
        hasToken: !!data.access_token,
        tokenType: data.token_type 
      });
      return data;
    } catch (error: any) {
      // Log network errors
      if (error.message === 'Failed to fetch') {
        console.error('❌ Network error:', {
          message: 'Cannot connect to backend server',
          apiUrl: requestUrl,
          possibleCauses: [
            'Backend server is not running',
            'Wrong API URL in .env file',
            'CORS issues',
            'Network connectivity'
          ]
        });
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
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
