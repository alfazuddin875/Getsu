import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Registration } from '../../lib/types';

export default function RegistrationManager() {
  const registrations = useAppStore(state => state.registrations);
  const updateRegistrationStatus = useAppStore(state => state.updateRegistrationStatus);
  const updateRegistrationCongratulationsUrl = useAppStore(state => state.updateRegistrationCongratulationsUrl);
  const addSpecialAlumni = useAppStore(state => state.addSpecialAlumni);
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [uploadingCard, setUploadingCard] = useState(false);

  const filteredRegistrations = registrations.filter(r => filter === 'all' || r.status === filter).reverse();

  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedReg) return;
    
    setUploadingCard(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      await updateRegistrationCongratulationsUrl(selectedReg.id, base64Url);
      setSelectedReg(prev => prev ? { ...prev, congratulationsUrl: base64Url } : null);
      setUploadingCard(false);
    };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] min-h-[500px]">
      {/* Left List */}
      <div className={`
        w-full lg:w-1/3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all
        ${selectedReg ? 'hidden lg:flex' : 'flex'}
      `}>
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto hidden-scrollbar">
           {['pending', 'approved', 'rejected', 'all'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-3 py-1.5 text-[10px] font-bold rounded-full capitalize whitespace-nowrap transition-colors ${
                 filter === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
               }`}
             >
               {f} ({registrations.filter(r => f === 'all' || r.status === f).length})
             </button>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto w-full">
           {filteredRegistrations.length === 0 ? (
             <div className="p-8 text-center text-slate-500 text-sm italic">No {filter} items found.</div>
           ) : (
             <ul className="divide-y divide-slate-100">
               {filteredRegistrations.map(reg => (
                 <li 
                   key={reg.id} 
                   className={`p-4 cursor-pointer transition-colors ${selectedReg?.id === reg.id ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                   onClick={() => setSelectedReg(reg)}
                 >
                   <div className="flex justify-between items-start mb-1 gap-2">
                     <p className="font-bold text-sm text-slate-800 truncate">{reg.personal_info.fullName}</p>
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        reg.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        reg.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                       }`}>
                        {reg.status}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] text-slate-500">
                     <span>Batch: {reg.personal_info.sscBatch}</span>
                     <span>
                       {reg.status === 'approved' && reg.serialNo && (
                         <span className="mr-2 text-teal-600 font-bold">#{reg.serialNo}</span>
                       )}
                       <span className="font-bold text-slate-600">৳{reg.payment.totalAmount}</span>
                     </span>
                   </div>
                 </li>
               ))}
             </ul>
           )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className={`
        flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto transition-all
        ${selectedReg ? 'flex' : 'hidden lg:flex'}
      `}>
        {selectedReg ? (
          <div className="p-5 md:p-8 space-y-6 w-full">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
              <button 
                onClick={() => setSelectedReg(null)}
                className="lg:hidden text-teal-600 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                &larr; Back to List
              </button>
              
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 break-words">{selectedReg.personal_info.fullName}</h2>
                  <p className="text-slate-500 text-xs mt-1">ID: <span className="font-mono bg-slate-100 px-1 rounded truncate inline-block max-w-[150px] align-bottom">{selectedReg.id}</span></p>
                  {selectedReg.status === 'approved' && selectedReg.serialNo && (
                    <p className="text-teal-600 font-bold text-sm mt-1">Serial: #{selectedReg.serialNo}</p>
                  )}
                  <p className="text-slate-400 text-[10px] mt-1">{new Date(selectedReg.createdAt).toLocaleString('bn-BD')}</p>
                </div>
                
                {selectedReg.photo_url && selectedReg.photo_url !== 'https://via.placeholder.com/150' && (
                  <a href={selectedReg.photo_url} target="_blank" rel="noopener noreferrer" className="shrink-0 group relative block" title="View full size">
                    <img src={selectedReg.photo_url} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-slate-200 shadow-sm transition group-hover:border-teal-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                       <span className="text-white text-xs font-bold">View</span>
                    </div>
                  </a>
                )}
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  {selectedReg.status !== 'approved' && (
                    <button 
                      onClick={() => updateRegistrationStatus(selectedReg.id, 'approved')}
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition"
                    >
                      Approve
                    </button>
                  )}
                  {selectedReg.status !== 'rejected' && (
                    <button 
                      onClick={() => updateRegistrationStatus(selectedReg.id, 'rejected')}
                      className="flex-1 sm:flex-none bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      Reject
                    </button>
                  )}
                  {selectedReg.status !== 'pending' && (
                    <button 
                      onClick={() => updateRegistrationStatus(selectedReg.id, 'pending')}
                      className="flex-1 sm:flex-none bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      Pend
                    </button>
                  )}
                  {(!selectedReg.studentType || selectedReg.studentType === 'alumni') && (
                    <button 
                      onClick={() => {
                        addSpecialAlumni({
                          name: selectedReg.personal_info.fullName,
                          designation: selectedReg.personal_info.occupation || 'Alumni',
                          batch: selectedReg.personal_info.sscBatch || 'N/A',
                          imageUrl: selectedReg.photo_url && selectedReg.photo_url !== 'https://via.placeholder.com/150' ? selectedReg.photo_url : ''
                        });
                        alert('Added to Special Alumni successfully!');
                      }}
                      className="flex-1 sm:flex-none bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap"
                    >
                      ★ Add to Home Page
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               {/* Payment Info */}
               <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                 <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-4 text-sm">💳 পেমেন্ট তথ্য (Payment)</h3>
                 <div className="grid grid-cols-2 gap-4 text-xs">
                   <div className="col-span-2 sm:col-span-1">
                     <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">TrxID</p>
                     <p className="font-mono font-bold text-slate-800 uppercase break-all">{selectedReg.payment.trxId}</p>
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Method & Sender</p>
                     <p className="font-bold text-slate-800 uppercase">{selectedReg.payment.paymentMethod || 'bKash'} - {selectedReg.payment.bKashNumber}</p>
                   </div>
                   {selectedReg.payment.couponCode && (
                     <div className="col-span-2 bg-white/50 p-2 rounded border border-amber-200/50">
                       <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Applied Coupon</p>
                       <p className="font-bold text-slate-800 uppercase">{selectedReg.payment.couponCode} <span className="text-emerald-600 ml-2">(-৳{selectedReg.payment.discountAmount})</span></p>
                     </div>
                   )}
                   <div className="col-span-2">
                     <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Total Amount</p>
                     <p className="font-extrabold text-teal-800 text-2xl">৳{selectedReg.payment.totalAmount}</p>
                   </div>
                 </div>
              </div>

               {/* Guests */}
               <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm">👥 মেহমান (Guests - {selectedReg.guests.length})</h3>
                 {selectedReg.guests.length === 0 ? (
                   <p className="text-xs text-slate-400 italic">No guests joined.</p>
                 ) : (
                   <ul className="space-y-3">
                     {selectedReg.guests.map((g, i) => (
                       <li key={i} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-700">{g.relation}</span>
                           <span className="text-[10px] text-slate-500">Size: {g.tshirt}</span>
                         </div>
                         <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">৳{g.fee}</span>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>

               {/* Personal Info */}
               <div className="space-y-4">
                 <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">👤 Personal Data</h3>
                 <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                     <div>
                      <p className="text-xs text-slate-500">Student Type</p>
                      <div className="capitalize mt-0.5 space-y-0.5">
                        <p>{selectedReg.studentType === 'alumni' ? 'Alumni' : 'Current Student'}</p>
                        {selectedReg.studentType === 'current' && (
                          <p className="text-[10px] text-slate-500">
                            Class: {selectedReg.studentClass || '-'} | Session: {selectedReg.studentSession || '-'} | Roll: {selectedReg.studentRoll || '-'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div><p className="text-xs text-slate-500">Email Address</p><p className="break-all">{selectedReg.contact_info.email || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Phone</p><p>{selectedReg.contact_info.phone}</p></div>
                    <div><p className="text-xs text-slate-500">WhatsApp</p><p>{selectedReg.contact_info.whatsapp || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Religion</p><p>{selectedReg.personal_info.religion || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Date of Birth</p><p>{selectedReg.personal_info.dob || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Blood Group</p><p>{selectedReg.personal_info.bloodGroup || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Batch</p><p>{selectedReg.personal_info.sscBatch}</p></div>
                    <div><p className="text-xs text-slate-500">T-Shirt Size</p><p>{selectedReg.tshirt_size}</p></div>
                    <div><p className="text-xs text-slate-500">Father's Name</p><p>{selectedReg.personal_info.fathersName}</p></div>
                    <div><p className="text-xs text-slate-500">Mother's Name</p><p>{selectedReg.personal_info.mothersName}</p></div>
                    <div className="col-span-2"><p className="text-xs text-slate-500">Occupation</p><p>{selectedReg.personal_info.occupation || '-'}</p></div>
                 </div>
               </div>

               {/* Address Info */}
               <div className="space-y-4">
                 <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">📍 Address</h3>
                 <div className="space-y-3 text-sm">
                    <div><p className="text-xs text-slate-500">Present</p><p>{selectedReg.contact_info.presentAddress}</p></div>
                    <div><p className="text-xs text-slate-500">Permanent</p><p>{selectedReg.contact_info.permanentAddress}</p></div>
                 </div>
               </div>

               {/* Feedback Info */}
               {selectedReg.feedback && (
                 <div className="space-y-4 col-span-1 md:col-span-2">
                   <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">💬 Feedback / Comments</h3>
                   <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                     {selectedReg.feedback}
                   </div>
                 </div>
               )}

               {/* Congratulations Paper Upload */}
               {selectedReg.status === 'approved' && (
                 <div className="col-span-1 md:col-span-2 bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                   <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-4 text-sm">🎉 Congratulations Paper Upload</h3>
                   <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                     {selectedReg.congratulationsUrl ? (
                        <div className="relative group shrink-0">
                          <img src={selectedReg.congratulationsUrl} alt="Congratulations Paper" className="w-32 h-auto rounded border border-emerald-200 shadow-sm" />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded cursor-pointer transition-opacity">
                            <span className="text-white text-xs font-bold w-full text-center px-2">Change Image</span>
                            <input type="file" accept="image/*" onChange={handleCardUpload} disabled={uploadingCard} className="hidden" />
                          </label>
                        </div>
                     ) : (
                        <div className="shrink-0">
                          <label className={`flex flex-col items-center justify-center w-32 h-32 md:-40 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-emerald-50 transition-colors ${uploadingCard ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-emerald-600">
                               <span className="text-2xl mb-2">📤</span>
                               <p className="text-xs font-semibold">Upload Image</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleCardUpload} disabled={uploadingCard} className="hidden" />
                          </label>
                        </div>
                     )}
                     
                     <div className="flex-1">
                       <p className="text-sm text-emerald-800 mb-2">
                         Upload the finalized congratulatory certificate/paper for this participant here.
                       </p>
                       <p className="text-xs text-emerald-600">
                         <strong>Optimal ratio:</strong> Vertical image (e.g. A4 size). Max 1-2MB. The user will be able to download this image from their Ticket checking portal.
                       </p>
                       {uploadingCard && <p className="text-sm font-bold text-emerald-600 mt-2 animate-pulse">Uploading...</p>}
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 p-8 flex-col gap-2">
            <span className="text-4xl text-slate-200">🔍</span>
            <p>Select a registration from the list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
