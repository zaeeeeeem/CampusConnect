import axiosClient from '../axiosClient';
import { User, AdminStats, ActivityLog, ApiResponse } from '../../types';

export const adminService = {
  // Get dashboard stats
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await axiosClient.get('/admin/stats');
    return response.data;
  },

  // Get activity logs
  getLogs: async (): Promise<ApiResponse<ActivityLog[]>> => {
    const response = await axiosClient.get('/admin/logs');
    return response.data;
  },

  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get(`/profile/${userId}`);
    return response.data;
  },

  // Update user profile by ID
  updateUserProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosClient.put(`/profile/${userId}`, data);
    return response.data;
  },
};
