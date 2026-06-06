import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Registration } from '../../lib/types';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TicketStatus() {
  const location = useLocation();
  const settings = useAppStore(state => state.settings);
  
  const [searchPhone, setSearchPhone] = useState(location.state?.phone || '');
  const [result, setResult] = useState<Registration | null>(null);
  const [searched, setSearched] = useState(!!location.state?.phone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searched && searchPhone) {
      handleSearch(null); // Initial trigger if phone was passed via state
    }
  }, []);

  const handleSearch = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (!searchPhone) return;
    
    setLoading(true);
    setSearched(true);
    try {
      // The registration ID is the phone number
      const docRef = doc(db, 'registrations', searchPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResult({ id: docSnap.id, ...docSnap.data() } as Registration);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error("Error fetching registration:", err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* Search Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">টিকেট ও স্ট্যাটাস যাচাই</h2>
        <p className="text-slate-500 mb-6 text-sm">আপনার রেজিস্ট্রেশনের বর্তমান অবস্থা জানতে ফোন নাম্বার প্রদান করুন।</p>
        
        <form onSubmit={handleSearch} className="flex max-w-sm mx-auto">
          <input
            type="tel"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="01XXX-XXXXXX"
            className="flex-1 border border-slate-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-r-lg transition-colors shadow-sm"
          >
            সার্চ
          </button>
        </form>
      </div>

      {/* Result Card */}
      {searched && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
             <div className="bg-slate-50 text-slate-500 p-6 rounded-xl border border-slate-200 text-center font-medium animate-pulse">
               খোঁজা হচ্ছে... (Searching...)
             </div>
          ) : !result ? (
             <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center font-medium">
               দুঃখিত, এই নম্বরে কোন রেজিস্ট্রেশন পাওয়া যায়নি।
             </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Registration ID</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-mono font-bold text-slate-800 uppercase">{result.id}</p>
                    {result.status === 'approved' && result.serialNo && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                        Serial: #{result.serialNo}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full font-bold text-sm border shadow-sm ${statusColors[result.status]}`}>
                  {result.status.toUpperCase()}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                 {/* Status Messages */}
                 {result.status === 'pending' && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800 text-sm">
                      <strong>⏳ যাচাইকরণের অপেক্ষায়:</strong> আপনার ফি এবং ট্রানজেকশন আইডি অ্যাডমিন দ্বারা ম্যানুয়ালি চেক করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।
                    </div>
                 )}
                 
                 {result.status === 'approved' && (
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-emerald-800 text-sm flex flex-col items-start gap-4">
                      <div>
                        <strong>✅ অভিনন্দন!</strong> আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে। কর্তৃপক্ষ আপনার তথ্য যাচাই করে অনুমোদন দিয়েছে।
                      </div>
                      
                      {result.congratulationsUrl ? (
                        <div className="w-full mt-2">
                           <p className="font-semibold mb-3 text-emerald-900 border-b border-emerald-200 pb-2">আপনার অভিনন্দন পত্র (Congratulations Paper):</p>
                           <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                             <img 
                               src={result.congratulationsUrl} 
                               alt="Congratulations Paper" 
                               className="w-32 sm:w-48 h-auto object-contain rounded border border-slate-200"
                             />
                             <div className="flex-1 text-center sm:text-left">
                               <h4 className="font-bold text-slate-800 mb-2">অভিনন্দন পত্র প্রস্তুত!</h4>
                                 <a 
                                   href={result.congratulationsUrl}
                                   download={`Congratulations_Paper_${result.serialNo || result.id}.jpg`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors text-sm items-center gap-2"
                                 >
                                   <span>📥</span> ডাউনলোড করুন (Download)
                                 </a>
                             </div>
                           </div>
                        </div>
                      ) : (
                        <div className="mt-2 w-full bg-orange-50 text-orange-800 p-4 rounded-lg border border-orange-200 text-center">
                          <strong>⏳ অভিনন্দন পত্র প্রস্তুত হচ্ছে:</strong> এডমিন প্যানেল থেকে আপনার অভিনন্দন পত্রটি দ্রুতই আপলোড করা হবে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেক করুন।
                        </div>
                      )}
                    </div>
                 )}

                 {/* Information Snapshot */}
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2 flex items-center gap-4 border-b border-slate-100 pb-4">
                      {result.photo_url && result.photo_url !== 'https://via.placeholder.com/150' ? (
                        <img src={result.photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                           </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">প্রাইমারি নাম (Name)</p>
                        <p className="font-semibold text-slate-800 text-lg">{result.personal_info.fullName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ব্যাচ (Batch)</p>
                      <p className="font-semibold text-slate-800">{result.personal_info.sscBatch}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">মোট অতিথি (Total Guests)</p>
                      <p className="font-semibold text-slate-800">{result.guests.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">পরিশোধিত ফি (Paid Fee)</p>
                      <p className="font-semibold text-slate-800">{result.payment.totalAmount} ৳</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 mb-1">ট্রানজেকশন আইডি (TrxID)</p>
                      <p className="font-mono bg-slate-100 px-2 py-1 inline-block rounded text-sm text-slate-700">{result.payment.trxId}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
