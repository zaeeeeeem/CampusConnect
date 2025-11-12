# CampusConnect Frontend - Quick Start Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Option A: Use setup script
chmod +x setup.sh
./setup.sh

# Option B: Manual installation
npm install axios react-hook-form zod @hookform/resolvers lucide-react date-fns recharts
```

### 2. Configure Environment
```bash
# Create .env file (already exists, but update if needed)
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_STATUS.md` | Current progress, file structure, what's done/pending |
| `DEVELOPMENT_GUIDE.md` | Detailed guide with API usage, code examples, role matrix |
| `README_QUICKSTART.md` | This file - quick reference |
| `setup.sh` | Automated setup script |

---

## ✅ What's Already Built (40% Complete)

### Infrastructure & Services ✅
- Full API client with authentication
- 7 API service modules (auth, clubs, events, feedback, notifications, certificates, admin)
- Auth Context with login/logout/register
- Protected Route component
- TypeScript types for all data models

### Pages ✅
- **Auth**: Login, Register, Forgot Password
- **Public**: Landing, About, 404, Unauthorized

### Components ✅
- EventCard, ClubCard
- NotificationBell with dropdown
- FeedbackStars (interactive)
- LoadingSpinner, EmptyState, Modal

---

## 🚧 What Needs to Be Built (60% Remaining)

### Student Module (7 pages)
1. Dashboard
2. All Events (with filters)
3. Event Details
4. My Events
5. Certificates
6. Notifications
7. Profile

### Faculty Module (4 pages)
1. Dashboard
2. View Clubs
3. View Events
4. Profile

### Club Admin Module (11 pages)
1. Dashboard
2. Club Info
3. Manage Members
4. Events List
5. Create Event
6. Edit Event
7. Event Details (Admin View)
8. Participants List
9. Generate Certificates
10. Notifications
11. Profile

### Admin Module (9 pages)
1. Dashboard
2. Manage Users
3. Manage Clubs
4. Manage Events
5. Manage Notifications
6. Feedback Overview
7. Certificates Overview
8. System Logs
9. Profile

### Routing & Integration
- Update App.tsx with all routes
- Role-based navigation
- Testing & bug fixes

---

## 🎨 Tech Stack

- **Framework**: React 19 + TypeScript
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **Charts**: Recharts

---

## 🔑 User Roles & Access

| Role | Access Level |
|------|-------------|
| **Student** | View events, register, give feedback, view own certificates |
| **Faculty** | View events and clubs |
| **Club Admin** | Manage own club, create events, generate certificates |
| **Admin** | Full platform access - manage users, clubs, events |

---

## 📝 Quick Code Examples

### Using Auth Context
```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, hasRole } = useAuth();

  if (hasRole(['admin'])) {
    // Show admin content
  }
}
```

### Using API Services
```tsx
import { eventService } from './api/services';

async function loadEvents() {
  const response = await eventService.getAll();
  if (response.success) {
    console.log(response.data);
  }
}
```

### Protected Routes
```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## 📂 Key Directories

```
src/
├── api/services/        # All API calls
├── components/
│   ├── shared/         # Reusable components
│   └── ui/             # Basic UI components
├── context/            # React Context (Auth)
├── pages/
│   ├── auth/          # Login, Register
│   ├── public/        # Landing, About, 404
│   ├── student/       # 🚧 To be created
│   ├── faculty/       # 🚧 To be created
│   ├── club/          # 🚧 To be created
│   └── admin/         # 🚧 To be created
└── types/             # TypeScript definitions
```

---

## 🎯 Next Steps

1. ✅ Dependencies installed
2. ✅ Environment configured
3. ⏳ Update `App.tsx` with routing
4. ⏳ Create Student module
5. ⏳ Create other modules
6. ⏳ Test & integrate with backend

---

## 🐛 Common Issues & Solutions

### Network timeout during npm install
```bash
# Try with longer timeout
npm install --timeout=120000
```

### TypeScript errors
```bash
# Rebuild TypeScript
npm run build
```

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## 📞 Need Help?

- Check `DEVELOPMENT_GUIDE.md` for detailed documentation
- Check `PROJECT_STATUS.md` for current progress
- Review component files for usage examples

---

**Status**: Foundation Complete (40%)
**Next**: Start building Student module
