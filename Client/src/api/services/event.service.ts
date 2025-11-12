import axiosClient from '../axiosClient';
import { Event, User, ApiResponse } from '../../types';

export const eventService = {
  // Get all events
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    const response = await axiosClient.get('/events');
    return response.data;
  },

  // Get event by ID
  getById: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  },

  // Create new event (Club Admin only)
  create: async (data: Partial<Event>): Promise<ApiResponse<Event>> => {
    const response = await axiosClient.post('/events', data);
    return response.data;
  },

  // Update event
  update: async (id: string, data: Partial<Event>): Promise<ApiResponse<Event>> => {
    const response = await axiosClient.put(`/events/${id}`, data);
    return response.data;
  },

  // Delete event
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/events/${id}`);
    return response.data;
  },

  // Register for event (Student)
  register: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post(`/events/${id}/register`);
    return response.data;
  },

  // Get event participants
  getParticipants: async (id: string): Promise<ApiResponse<User[]>> => {
    const response = await axiosClient.get(`/events/${id}/participants`);
    return response.data;
  },
};
