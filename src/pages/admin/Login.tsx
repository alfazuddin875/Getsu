import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { auth, db } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [error, setError] = useState('');
  const isAdminAuthenticated = useAppStore(state => state.isAdminAuthenticated);
  const isAuthLoading = useAppStore(state => state.isAuthLoading);
  const setAdminAuthenticated = useAppStore(state => state.setAdminAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated && !isAuthLoading) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, isAuthLoading, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      
      // Verify if the user is an admin
      try {
        await getDoc(doc(db, '_admin_verification', 'ping'));
        setAdminAuthenticated(true);
        navigate('/admin');
      } catch (adminErr: any) {
        console.error("Admin verification failed:", adminErr);
        await signOut(auth);
        setAdminAuthenticated(false);
        setError(`দুঃখিত, আপনার এই প্যানেলে প্রবেশাধিকার নেই (Email: ${result.user.email})। শুধুমাত্র অনুমোদিত এডমিনরাই লগইন করতে পারবেন।`);
      }
    } catch (err: any) {
      console.error("Login popup error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('আপনি লগইন সম্পূর্ণ না করেই পপআপটি কেটে দিয়েছেন। দয়া করে আবার চেষ্টা করুন। পপআপ ব্লকার থাকলে বন্ধ করুন।');
      } else {
        setError('লগইন ব্যর্থ হয়েছে (Login failed): ' + err.message);
      }
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-inner">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-800">এডমিন লগইন</h1>
          <p className="text-slate-500 text-sm mt-1">কন্ট্রোল প্যানেলে গুগল একাউন্ট দিয়ে প্রবেশ করুন</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
            <span>Google দিয়ে লগইন করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
}
