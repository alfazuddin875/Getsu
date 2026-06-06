import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAppStore } from './lib/store';
import PublicLayout from './components/layout/PublicLayout';

const Home = lazy(() => import('./pages/public/Home'));
const Register = lazy(() => import('./pages/public/Register'));
const TicketStatus = lazy(() => import('./pages/public/TicketStatus'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const RegistrationManager = lazy(() => import('./pages/admin/RegistrationManager'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

const CenteredLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const initSync = useAppStore(state => state.initSync);

  useEffect(() => {
    initSync();
  }, [initSync]);

  return (
    <Router>
      <Suspense fallback={<CenteredLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="ticket" element={<TicketStatus />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="registrations" element={<RegistrationManager />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
