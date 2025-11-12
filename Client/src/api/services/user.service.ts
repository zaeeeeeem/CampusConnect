import axiosClient from '../axiosClient';
import { User, ApiResponse } from '../../types';

export const userService = {
  // Get all users (Admin only)
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  // Get user by ID
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get(`/profile/${id}`);
    return response.data;
  },

  // Update user role (Admin only)
  updateRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put(`/profile/${userId}`, data);
    return response.data;
  },

  // Delete user (Admin only)
  delete: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/users/${userId}`);
    return response.data;
  },
};
