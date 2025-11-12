# CampusConnect Frontend Development Guide

## Progress Overview

### ✅ Completed Modules

1. **Core Infrastructure** (COMPLETED)
   - ✅ Axios client with JWT interceptors
   - ✅ Auth Context with login/logout/register
   - ✅ Protected Route component
   - ✅ Environment variables setup
   - ✅ API service modules for all backend endpoints

2. **Type Definitions** (COMPLETED)
   - ✅ Updated User type with all roles
   - ✅ Certificate, Feedback, Notification types
   - ✅ Auth types (Login, Register, AuthResponse)
   - ✅ Admin & Club stats types
   - ✅ Activity Log types

3. **Authentication Pages** (COMPLETED)
   - ✅ Login page
   - ✅ Register page with role selection
   - ✅ Forgot Password page

4. **Public Pages** (COMPLETED)
   - ✅ Landing page with features
   - ✅ About page
   - ✅ 404 Not Found page
   - ✅ 403 Unauthorized page

### 📦 Required Dependencies (Need to be installed)

Run this command to install all required dependencies:

```bash
npm install axios react-hook-form zod @hookform/resolvers lucide-react date-fns recharts
```

### 🚧 Pending Modules

#### Module 5: Student Pages
- [ ] Student Dashboard (overview, upcoming events, certificates shortcut)
- [ ] All Events page with filters
- [ ] Event Details page with registration
- [ ] My Events page (registered events)
- [ ] Certificates page (download/view)
- [ ] Notifications page
- [ ] Student Profile page

#### Module 6: Faculty Pages
- [ ] Faculty Dashboard
- [ ] View Clubs page
- [ ] View Events page
- [ ] Faculty Profile page

#### Module 7: Club Admin Pages
- [ ] Club Dashboard with stats
- [ ] Club Info management
- [ ] Members management
- [ ] Events List (club's events)
- [ ] Create Event form
- [ ] Edit Event form
- [ ] Event Details (with participants & feedback)
- [ ] Generate Certificates
- [ ] Club Notifications

#### Module 8: Admin Pages
- [ ] Admin Dashboard with platform stats
- [ ] Manage Users (CRUD, role changes)
- [ ] Manage Clubs (CRUD)
- [ ] Manage Events (global CRUD)
- [ ] Manage Notifications
- [ ] Feedback Overview
- [ ] Certificates Overview
- [ ] Activity Logs

#### Module 9: Shared Components
- [ ] EventCard component
- [ ] NotificationBell component
- [ ] FeedbackStars component
- [ ] CertificateCard component
- [ ] Modal component
- [ ] Toast notifications
- [ ] Loading spinners
- [ ] Empty states

#### Module 10: Routing Setup
- [ ] Update App.tsx with all routes
- [ ] Add role-based route protection
- [ ] Add redirect logic based on user role
- [ ] Add navigation guards

#### Module 11: Integration & Testing
- [ ] Test all API integrations
- [ ] Fix any TypeScript errors
- [ ] Test role-based access
- [ ] Test responsiveness
- [ ] Add error boundaries

## File Structure Created

```
src/
├── api/
│   ├── axiosClient.ts           ✅ Axios instance with interceptors
│   ├── services/
│   │   ├── auth.service.ts      ✅ Authentication APIs
│   │   ├── club.service.ts      ✅ Club management APIs
│   │   ├── event.service.ts     ✅ Event management APIs
│   │   ├── feedback.service.ts  ✅ Feedback APIs
│   │   ├── notification.service.ts ✅ Notification APIs
│   │   ├── certificate.service.ts  ✅ Certificate APIs
│   │   ├── admin.service.ts     ✅ Admin APIs
│   │   └── index.ts             ✅ Service exports
│   ├── api.ts                   (old mock API - keep for reference)
│   └── mockData.ts              (keep for testing)
├── context/
│   └── AuthContext.tsx          ✅ Global auth state
├── components/
│   ├── ProtectedRoute.tsx       ✅ Route guard component
│   └── ui/                      (existing UI components)
├── pages/
│   ├── auth/
│   │   ├── Login.tsx            ✅
│   │   ├── Register.tsx         ✅
│   │   └── ForgotPassword.tsx   ✅
│   ├── public/
│   │   ├── Landing.tsx          ✅
│   │   ├── About.tsx            ✅
│   │   ├── NotFound.tsx         ✅
│   │   └── Unauthorized.tsx     ✅
│   ├── student/                 🚧 TO BE CREATED
│   ├── faculty/                 🚧 TO BE CREATED
│   ├── club/                    🚧 TO BE CREATED
│   └── admin/                   🚧 TO BE CREATED
└── types/
    └── index.ts                 ✅ All TypeScript types

.env                             ✅ Environment variables
.env.example                     ✅ Example env file
```

## API Services Available

All services are fully typed and ready to use:

### Auth Service
- `register(data)` - Register new user
- `login(credentials)` - User login
- `getProfile()` - Get current user
- `updateProfile(data)` - Update profile
- `logout()` - Logout user
- `uploadProfileImage(file)` - Upload avatar

### Club Service
- `getAll()` - Get all clubs
- `getById(id)` - Get club details
- `create(data)` - Create club (Admin)
- `update(id, data)` - Update club
- `delete(id)` - Delete club (Admin)
- `getMembers(id)` - Get club members
- `addMember(id, userId)` - Add member
- `removeMember(id, userId)` - Remove member

### Event Service
- `getAll()` - Get all events
- `getById(id)` - Get event details
- `create(data)` - Create event
- `update(id, data)` - Update event
- `delete(id)` - Delete event
- `register(id)` - Register for event
- `getParticipants(id)` - Get participants

### Feedback Service
- `submit(eventId, data)` - Submit feedback
- `getByEventId(eventId)` - Get event feedback
- `delete(id)` - Delete feedback (Admin)

### Notification Service
- `getAll()` - Get all notifications
- `getById(id)` - Get notification details
- `create(data)` - Create notification
- `update(id, data)` - Update notification
- `delete(id)` - Delete notification

### Certificate Service
- `generate(eventId)` - Generate certificates
- `getCertificate(userId, eventId)` - Get certificate
- `getMyCertificates()` - Get user's certificates
- `delete(id)` - Delete certificate (Admin)
- `download(url)` - Download certificate PDF

### Admin Service
- `getStats()` - Get dashboard stats
- `getLogs()` - Get activity logs
- `getAllUsers()` - Get all users
- `updateUserRole(userId, role)` - Change user role
- `deleteUser(userId)` - Delete user
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, data)` - Update user

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CampusConnect
VITE_APP_VERSION=1.0.0
```

## Usage Guide

### 1. Using Auth Context

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, hasRole } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check user role
  if (hasRole(['admin'])) {
    // Show admin content
  }

  return <div>Welcome {user?.name}</div>;
}
```

### 2. Using API Services

```tsx
import { eventService } from '../api/services';

async function loadEvents() {
  try {
    const response = await eventService.getAll();
    if (response.success) {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
}
```

### 3. Protected Routes

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## Next Steps

1. **Install Dependencies** - Run the npm install command above
2. **Create Student Module** - Start with student pages
3. **Create Shared Components** - Build reusable components
4. **Implement Routing** - Update App.tsx with all routes
5. **Create Faculty Module** - Faculty pages
6. **Create Club Admin Module** - Club management pages
7. **Create Admin Module** - Admin panel pages
8. **Testing & Integration** - Test everything together
9. **Connect to Backend** - Once backend is ready

## Role-Based Access Matrix

| Page/Feature | Student | Faculty | Club Admin | Admin |
|-------------|---------|---------|------------|-------|
| View Events | ✅ | ✅ | ✅ | ✅ |
| Register for Events | ✅ | ❌ | ❌ | ❌ |
| Create Events | ❌ | ❌ | ✅ | ✅ |
| View Clubs | ✅ | ✅ | ✅ | ✅ |
| Manage Clubs | ❌ | ❌ | ✅ (own) | ✅ (all) |
| View Certificates | ✅ (own) | ❌ | ✅ | ✅ |
| Generate Certificates | ❌ | ❌ | ✅ | ✅ |
| Give Feedback | ✅ | ❌ | ❌ | ❌ |
| View Feedback | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Send Notifications | ❌ | ❌ | ✅ (club) | ✅ (all) |

## Important Notes

- All API calls automatically include JWT token from localStorage
- 401 errors automatically redirect to login
- All types are fully defined in `src/types/index.ts`
- Backend URL is configurable via `.env`
- Auth state persists across page refreshes
- Protected routes check both authentication and authorization

## Styling

The project uses:
- **Tailwind CSS** for utility classes
- **Custom components** in `src/components/ui/`
- **Responsive design** for mobile/tablet/desktop
- **Gradient backgrounds** for auth pages
- **Consistent color scheme** (indigo primary)

## Backend Integration

When backend is ready at `http://localhost:5000/api`:

1. Update `.env` with correct backend URL
2. All API services are ready to use
3. JWT token automatically sent with requests
4. Error handling already implemented
5. TypeScript types match backend structure

---

**Status**: Foundation Complete - Ready for Module Implementation
**Last Updated**: 2024-11-12
