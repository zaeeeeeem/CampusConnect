import axiosClient from '../axiosClient';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '../../types';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put('/auth/profile', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosClient.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
