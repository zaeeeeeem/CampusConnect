export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'faculty' | 'club_admin' | 'admin';
  department?: string;
  year?: number;
  bio?: string;
  interests?: string[];
  clubId?: string; // For club_admin role
  createdAt?: string;
  updatedAt?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'social';
  members: User[];
  admins: User[];
  logo?: string;
  coverImage?: string;
  foundedDate: string;
  contactEmail: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  category: 'academic' | 'event' | 'administrative' | 'club' | 'general';
  createdAt: string;
  isPinned: boolean;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: User | Club;
  startDate: string;
  endDate: string;
  location: string;
  category: 'academic' | 'sports' | 'cultural' | 'technical' | 'social';
  maxAttendees?: number;
  attendees: User[];
  imageUrl?: string;
  tags: string[];
}

export interface Message {
  id: string;
  sender: User;
  recipient: User;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: Message;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'announcement' | 'system' | 'club';
  clubId?: string;
  eventId?: string;
  createdBy: string;
  createdAt: string;
  read?: boolean;
}

// Certificate types
export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  userName: string;
  issuedDate: string;
  certificateUrl: string;
}

// Feedback types
export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
}

export interface FeedbackSummary {
  eventId: string;
  averageRating: number;
  totalFeedback: number;
  feedbacks: Feedback[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'club_admin';
  department?: string;
  year?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Admin Dashboard Stats
export interface AdminStats {
  totalUsers: number;
  totalClubs: number;
  totalEvents: number;
  totalFeedback: number;
  recentUsers: User[];
  recentEvents: Event[];
}

// Club Dashboard Stats
export interface ClubStats {
  totalEvents: number;
  totalMembers: number;
  averageFeedback: number;
  upcomingEvents: Event[];
  recentFeedback: Feedback[];
}

// Event Registration
export interface EventRegistration {
  eventId: string;
  userId: string;
  registeredAt: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'event' | 'club' | 'user' | 'feedback';
  entityId: string;
  timestamp: string;
  details?: Record<string, any>;
}
