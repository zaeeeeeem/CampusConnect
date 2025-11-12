import axiosClient from '../axiosClient';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '../../types';

// Helper function to normalize user data from backend
const normalizeUser = (user: Partial<User> & { _id?: string; club?: string | { _id?: string; id?: string } }): User => {
  // Extract clubId - handle both string and populated object
  let clubId: string | undefined = undefined;
  if (user.clubId) {
    clubId = user.clubId;
  } else if (user.club) {
    // If club is an object (populated), extract the _id or id
    clubId = typeof user.club === 'object' ? (user.club._id || user.club.id) : user.club;
  }

  return {
    ...user,
    id: user._id || user.id || '', // Map MongoDB _id to id
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'student',
    clubId: clubId, // Handle club association (string ID only)
  };
};

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post('/auth/register', data);
    const result = response.data;

    // Normalize user data
    if (result.success && result.data?.user) {
      result.data.user = normalizeUser(result.data.user);
    }

    return result;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post('/auth/login', credentials);
    const result = response.data;

    // Normalize user data
    if (result.success && result.data?.user) {
      result.data.user = normalizeUser(result.data.user);
    }

    return result;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get('/auth/me');
    const result = response.data;

    // Normalize user data
    if (result.success && result.data) {
      result.data = normalizeUser(result.data);
    }

    return result;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put('/auth/profile', data);
    const result = response.data;

    // Normalize user data
    if (result.success && result.data) {
      result.data = normalizeUser(result.data);
    }

    return result;
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
