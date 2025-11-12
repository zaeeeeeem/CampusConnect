import axiosClient from '../axiosClient';
import { Club, User, ApiResponse } from '../../types';

export const clubService = {
  // Get all clubs
  getAll: async (): Promise<ApiResponse<Club[]>> => {
    const response = await axiosClient.get('/clubs');
    return response.data;
  },

  // Get club by ID
  getById: async (id: string): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.get(`/clubs/${id}`);
    return response.data;
  },

  // Create new club (Admin only)
  create: async (data: Partial<Club>): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.post('/clubs', data);
    return response.data;
  },

  // Update club
  update: async (id: string, data: Partial<Club>): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.put(`/clubs/${id}`, data);
    return response.data;
  },

  // Delete club (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/clubs/${id}`);
    return response.data;
  },

  // Get club members
  getMembers: async (id: string): Promise<ApiResponse<User[]>> => {
    const response = await axiosClient.get(`/clubs/${id}/members`);
    return response.data;
  },

  // Add member to club
  addMember: async (id: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post(`/clubs/${id}/add-member`, { userId });
    return response.data;
  },

  // Remove member from club
  removeMember: async (id: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/clubs/${id}/remove-member/${userId}`);
    return response.data;
  },
};
