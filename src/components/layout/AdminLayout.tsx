import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const location = useLocation();
  const isAdminAuthenticated = useAppStore(state => state.isAdminAuthenticated);
  const isAuthLoading = useAppStore(state => state.isAuthLoading);
  const setAdminAuthenticated = useAppStore(state => state.setAdminAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Registrations', path: '/admin/registrations' },
    { name: 'Website Content', path: '/admin/content' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch(err) {
      console.error('Sign out error', err);
    }
    setAdminAuthenticated(false);
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col pt-5 pb-4 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:shadow-xl flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-6 mb-8 lg:mb-10">
          <div className="text-xl font-bold text-teal-400">Admin Portal</div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white p-1">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 bg-slate-900 overflow-hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeSidebar}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 mt-auto space-y-3 pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center justify-center px-3 py-2.5 bg-rose-900/40 text-xs font-bold text-rose-300 rounded-xl hover:text-white hover:bg-rose-900 border border-rose-900/50 transition-all uppercase tracking-wider"
          >
            Logout
          </button>
          <Link
            to="/"
            className="group flex items-center justify-center px-3 py-2.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-xl hover:text-white hover:bg-slate-700 border border-slate-700 transition-all uppercase tracking-wider"
          >
            &larr; Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-lg font-bold text-slate-800 truncate">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
