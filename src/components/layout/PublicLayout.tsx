import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { processImageUrl } from '../../lib/imageUtils';

export default function PublicLayout() {
  const settings = useAppStore(state => state.settings);
  const location = useLocation();
  const logoImage = processImageUrl(settings.event_details.logoUrl);

  const navLinks = [
    { name: 'হোম (Home)', path: '/' },
    { name: 'রেজিষ্ট্রেশন (Register)', path: '/register' },
    { name: 'টিকেট (Ticket)', path: '/ticket' },
  ];

  return (
    <div className="min-h-screen mesh-bg-animated flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {logoImage && logoImage.trim() !== '' ? (
                <img src={logoImage} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-full border border-slate-100 shadow-sm" />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-inner border border-teal-500">
                  P
                </div>
              )}
              <div className="leading-tight hidden min-[400px]:block">
                <Link to="/" className="text-xl font-bold font-serif text-teal-800 hidden sm:block">
                  {settings.event_details.name}
                </Link>
                <Link to="/" className="text-[15px] font-bold font-serif text-teal-800 sm:hidden">
                  প্লাটিনাম জয়ন্তী 
                </Link>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium">শেকড়ের টানে প্রিয় প্রাঙ্গণে</div>
              </div>
            </div>
            <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-[13px] sm:text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {link.name.split(' ')[0]}
                  </Link>
                )
              })}
              <Link
                to="/admin"
                className="ml-1 sm:ml-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition shrink-0"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p className="text-white font-serif font-bold text-lg mb-1">{settings.event_details.name}</p>
              <p className="text-slate-400 text-sm">Powered by Alfaz Uddin</p>
            </div>
            <div className="text-slate-400 text-sm">
              <p className="flex items-center gap-1.5 justify-center md:justify-start">
                Contact: <MessageCircle size={16} className="text-[#25D366]" /> +8801521750367
              </p>
              <p>Email: alfaz.uddin1803@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
