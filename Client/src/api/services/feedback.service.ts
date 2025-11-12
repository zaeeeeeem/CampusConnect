import axiosClient from '../axiosClient';
import { Feedback, FeedbackSummary, ApiResponse } from '../../types';

export const feedbackService = {
  // Submit feedback for an event
  submit: async (eventId: string, data: { rating: number; comment: string }): Promise<ApiResponse<Feedback>> => {
    const response = await axiosClient.post(`/events/${eventId}/feedback`, data);
    return response.data;
  },

  // Get feedback for an event
  getByEventId: async (eventId: string): Promise<ApiResponse<FeedbackSummary>> => {
    const response = await axiosClient.get(`/events/${eventId}/feedback`);
    return response.data;
  },

  // Delete feedback (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/feedback/${id}`);
    return response.data;
  },
};
