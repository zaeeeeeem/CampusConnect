import { Announcement, Event, Club, User, ApiResponse, PaginatedResponse } from '../types';
import { mockAnnouncements, mockEvents, mockClubs, mockUsers } from './mockData';

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export const api = {
  // Announcements
  announcements: {
    getAll: async (): Promise<ApiResponse<Announcement[]>> => {
      await delay(300);
      return {
        data: mockAnnouncements,
        success: true,
      };
    },

    getById: async (id: string): Promise<ApiResponse<Announcement>> => {
      await delay(300);
      const announcement = mockAnnouncements.find(a => a.id === id);
      if (!announcement) {
        return {
          data: {} as Announcement,
          success: false,
          message: 'Announcement not found',
        };
      }
      return {
        data: announcement,
        success: true,
      };
    },

    getByCategory: async (category: string): Promise<ApiResponse<Announcement[]>> => {
      await delay(300);
      const filtered = mockAnnouncements.filter(a => a.category === category);
      return {
        data: filtered,
        success: true,
      };
    },
  },

  // Events
  events: {
    getAll: async (): Promise<ApiResponse<Event[]>> => {
      await delay(300);
      return {
        data: mockEvents,
        success: true,
      };
    },

    getById: async (id: string): Promise<ApiResponse<Event>> => {
      await delay(300);
      const event = mockEvents.find(e => e.id === id);
      if (!event) {
        return {
          data: {} as Event,
          success: false,
          message: 'Event not found',
        };
      }
      return {
        data: event,
        success: true,
      };
    },

    getUpcoming: async (): Promise<ApiResponse<Event[]>> => {
      await delay(300);
      const now = new Date();
      const upcoming = mockEvents
        .filter(e => new Date(e.startDate) > now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      return {
        data: upcoming,
        success: true,
      };
    },

    rsvp: async (eventId: string, userId: string): Promise<ApiResponse<boolean>> => {
      await delay(300);
      return {
        data: true,
        success: true,
        message: 'RSVP successful',
      };
    },
  },

  // Clubs
  clubs: {
    getAll: async (): Promise<ApiResponse<Club[]>> => {
      await delay(300);
      return {
        data: mockClubs,
        success: true,
      };
    },

    getById: async (id: string): Promise<ApiResponse<Club>> => {
      await delay(300);
      const club = mockClubs.find(c => c.id === id);
      if (!club) {
        return {
          data: {} as Club,
          success: false,
          message: 'Club not found',
        };
      }
      return {
        data: club,
        success: true,
      };
    },

    getByCategory: async (category: string): Promise<ApiResponse<Club[]>> => {
      await delay(300);
      const filtered = mockClubs.filter(c => c.category === category);
      return {
        data: filtered,
        success: true,
      };
    },

    join: async (clubId: string, userId: string): Promise<ApiResponse<boolean>> => {
      await delay(300);
      return {
        data: true,
        success: true,
        message: 'Successfully joined club',
      };
    },
  },

  // Users
  users: {
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
      await delay(300);
      return {
        data: mockUsers[0], // Return first user as current user
        success: true,
      };
    },

    getById: async (id: string): Promise<ApiResponse<User>> => {
      await delay(300);
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        return {
          data: {} as User,
          success: false,
          message: 'User not found',
        };
      }
      return {
        data: user,
        success: true,
      };
    },
  },
};

// When backend is ready, replace with real API calls:
/*
export const api = {
  announcements: {
    getAll: async () => {
      const response = await fetch('/api/announcements');
      return response.json();
    },
    // ... other methods
  },
  // ... other resources
};
*/
