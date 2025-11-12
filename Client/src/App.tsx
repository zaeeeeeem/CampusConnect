import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { LoadingSpinner } from './components/shared';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Public Pages
import { Landing } from './pages/public/Landing';
import { About } from './pages/public/About';
import { NotFound } from './pages/public/NotFound';
import { Unauthorized } from './pages/public/Unauthorized';

// Student Pages
import {
  StudentDashboard,
  AllEvents,
  EventDetails,
  MyEvents,
  Certificates,
  Notifications,
  StudentProfile,
} from './pages/student';

// Faculty Pages
import {
  FacultyDashboard,
  FacultyEvents,
  FacultyClubs,
  FacultyProfile,
} from './pages/faculty';

// Club Admin Pages
import {
  ClubDashboard,
  ClubInfo,
  ManageMembers,
  ClubEvents,
  CreateEvent,
  EditEvent,
  EventParticipants,
  GenerateCertificates,
  ClubNotifications,
  ClubProfile,
} from './pages/club';

// Admin Pages
import {
  AdminDashboard,
  ManageUsers,
  ManageClubs,
  ManageEvents,
  ManageNotifications,
  FeedbackOverview,
  CertificatesOverview,
  AdminProfile,
} from './pages/admin';

function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading CampusConnect..." />;
  }

  // Dashboard redirect based on role
  const DashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    switch (user.role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'faculty':
        return <Navigate to="/faculty/dashboard" replace />;
      case 'club_admin':
        return <Navigate to="/club/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="events" element={<AllEvents />} />
                  <Route path="events/:id" element={<EventDetails />} />
                  <Route path="my-events" element={<MyEvents />} />
                  <Route path="certificates" element={<Certificates />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<StudentProfile />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<FacultyDashboard />} />
                  <Route path="clubs" element={<FacultyClubs />} />
                  <Route path="events" element={<FacultyEvents />} />
                  <Route path="profile" element={<FacultyProfile />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Club Admin Routes */}
        <Route
          path="/club/*"
          element={
            <ProtectedRoute allowedRoles={['club_admin']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<ClubDashboard />} />
                  <Route path="info" element={<ClubInfo />} />
                  <Route path="members" element={<ManageMembers />} />
                  <Route path="events" element={<ClubEvents />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/edit/:id" element={<EditEvent />} />
                  <Route path="events/:id/participants" element={<EventParticipants />} />
                  <Route path="certificates" element={<GenerateCertificates />} />
                  <Route path="notifications" element={<ClubNotifications />} />
                  <Route path="profile" element={<ClubProfile />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="clubs" element={<ManageClubs />} />
                  <Route path="events" element={<ManageEvents />} />
                  <Route path="notifications" element={<ManageNotifications />} />
                  <Route path="feedback" element={<FeedbackOverview />} />
                  <Route path="certificates" element={<CertificatesOverview />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
