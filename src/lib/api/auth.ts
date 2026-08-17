import apiClient from '../api-client';
import {
  AuthResponse,
  ChildAuthResponse,
  RegisterRequest,
  LoginRequest,
  ChildLoginRequest,
  OtpRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
} from '@/types/api';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  async childLogin(data: ChildLoginRequest): Promise<ChildAuthResponse> {
    const response = await apiClient.post<ChildAuthResponse>('/api/auth/child/login', data);
    return response.data;
  },

  async sendVerification(data: OtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/send-verification', data);
    return response.data;
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/verify-email', data);
    return response.data;
  },

  async sendResetOtp(data: OtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/send-reset-otp', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/reset-password', data);
    return response.data;
  },
};