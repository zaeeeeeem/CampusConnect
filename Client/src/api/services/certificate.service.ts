import axiosClient from '../axiosClient';
import { Certificate, ApiResponse } from '../../types';

export const certificateService = {
  // Generate certificates for event participants (Club Admin/Admin)
  generate: async (eventId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post(`/certificates/generate/${eventId}`);
    return response.data;
  },

  // Get user's certificate for specific event
  getCertificate: async (userId: string, eventId: string): Promise<ApiResponse<Certificate>> => {
    const response = await axiosClient.get(`/certificates/${userId}/${eventId}`);
    return response.data;
  },

  // Get all certificates for logged-in user
  getMyCertificates: async (): Promise<ApiResponse<Certificate[]>> => {
    const response = await axiosClient.get('/certificates');
    return response.data;
  },

  // Delete certificate (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(`/certificates/${id}`);
    return response.data;
  },

  // Download certificate
  download: async (certificateUrl: string): Promise<Blob> => {
    const response = await axiosClient.get(certificateUrl, {
      responseType: 'blob',
    });
    return response.data;
  },
};
