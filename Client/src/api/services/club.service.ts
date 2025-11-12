import axiosClient from '../axiosClient';
import { Club, User, ApiResponse } from '../../types';

// Helper function to normalize club data from backend
const normalizeClub = (club: Partial<Club> & { _id?: string }): Club => {
  return {
    ...club,
    id: club._id || club.id || '', // Map MongoDB _id to id
    name: club.name || '',
    description: club.description || '',
    category: club.category || 'technical',
  } as Club;
};

export const clubService = {
  // Get all clubs
  getAll: async (): Promise<ApiResponse<Club[]>> => {
    const response = await axiosClient.get('/clubs');
    const result = response.data;

    // Normalize club data
    if (result.success && Array.isArray(result.data)) {
      result.data = result.data.map(normalizeClub);
    }

    return result;
  },

  // Get club by ID
  getById: async (id: string): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.get(`/clubs/${id}`);
    const result = response.data;

    // Normalize club data
    if (result.success && result.data) {
      result.data = normalizeClub(result.data);
    }

    return result;
  },

  // Create new club (Admin only)
  create: async (data: Partial<Club>): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.post('/clubs', data);
    const result = response.data;

    // Normalize club data
    if (result.success && result.data) {
      result.data = normalizeClub(result.data);
    }

    return result;
  },

  // Update club
  update: async (id: string, data: Partial<Club>): Promise<ApiResponse<Club>> => {
    const response = await axiosClient.put(`/clubs/${id}`, data);
    const result = response.data;

    // Normalize club data
    if (result.success && result.data) {
      result.data = normalizeClub(result.data);
    }

    return result;
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
