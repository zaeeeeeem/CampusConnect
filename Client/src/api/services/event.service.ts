import axiosClient from '../axiosClient';
import { Event, User, ApiResponse } from '../../types';

// Helper function to normalize event data from backend
const normalizeEvent = (event: Partial<Event> & { _id?: string }): Event => {
  return {
    ...event,
    id: event._id || event.id || '', // Map MongoDB _id to id
    title: event.title || '',
    description: event.description || '',
    date: event.date || new Date().toISOString(),
  } as Event;
};

export const eventService = {
  // Get all events
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    const response = await axiosClient.get('/events');
    const result = response.data;

    // Handle paginated response
    if (result.success && result.data) {
      // Check if data has items (paginated) or is direct array
      const eventsArray = result.data.items || result.data;
      result.data = Array.isArray(eventsArray) ? eventsArray.map(normalizeEvent) : [];
    }

    return result;
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
