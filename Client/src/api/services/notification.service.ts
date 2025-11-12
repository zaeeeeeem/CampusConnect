import axiosClient from '../axiosClient';
import { Notification, ApiResponse } from '../../types';

export const notificationService = {
  // Get all notifications
  getAll: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await axiosClient.get('/notifications');
    return response.data;
  },

  // Get notification by ID
  getById: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await axiosClient.get(`/notifications/${id}`);
    return response.data;
  },

  // Create notification (Admin/Club Admin)
  create: async (data: Partial<Notification>): Promise<ApiResponse<Notification>> => {
    const response = await axiosClient.post('/notifications', data);
    return response.data;
  },

  // Update notification
  update: async (id: string, data: Partial<Notification>): Promise<ApiResponse<Notification>> => {
    const response = await axiosClient.put(`/notifications/${id}`, data);
    return response.data;
  },

  // Delete notification
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/notifications/${id}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
  },
};
