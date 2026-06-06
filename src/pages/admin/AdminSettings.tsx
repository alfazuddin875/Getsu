import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Trash2, UserPlus } from 'lucide-react';

export default function AdminSettings() {
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const admins = useAppStore(state => state.admins);
  const addAdmin = useAppStore(state => state.addAdmin);
  const removeAdmin = useAppStore(state => state.removeAdmin);

  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) return;
    addAdmin(newAdminEmail.trim().toLowerCase());
    setNewAdminEmail('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.src = event.target.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.8));
        };
      }
    };
    e.target.value = '';
  };

  const handleChange = (section: keyof typeof settings, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Settings (সেটিংস)</h1>
        <button 
          onClick={handleSave}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
        >
          {saved ? 'Successfully Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
        <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🎨</span> Branding (লোগো ও ব্যানার)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Logo URL (Optional)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.event_details.logoUrl || ''} 
                onChange={(e) => handleChange('event_details', 'logoUrl', e.target.value)}
                className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://..." 
              />
              <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleChange('event_details', 'logoUrl', base64))} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Banner Image URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.event_details.bannerUrl || ''} 
                onChange={(e) => handleChange('event_details', 'bannerUrl', e.target.value)}
                className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://..." 
              />
              <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleChange('event_details', 'bannerUrl', base64))} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Certificate Template Background URL (অভিনন্দন পত্রের টেমপ্লেট)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.event_details.cardTemplateUrl || ''} 
                onChange={(e) => handleChange('event_details', 'cardTemplateUrl', e.target.value)}
                className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://..." 
              />
              <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleChange('event_details', 'cardTemplateUrl', base64))} />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-1">If provided, this image will be used as the custom background design for the Congratulations Card (800x1000px recommended).</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
        <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📅</span> Event Details (ইভেন্টের তথ্য)
        </h2>
        <div className="grid gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Event Name</label>
            <input 
              type="text" 
              value={formData.event_details.name} 
              onChange={(e) => handleChange('event_details', 'name', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Date</label>
              <input 
                type="text" 
                value={formData.event_details.date} 
                onChange={(e) => handleChange('event_details', 'date', e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Venue</label>
              <input 
                type="text" 
                value={formData.event_details.venue} 
                onChange={(e) => handleChange('event_details', 'venue', e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
        <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📞</span> Contact Information (যোগাযোগ)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Support Email</label>
            <input 
              type="email" 
              value={formData.contact_details.email} 
              onChange={(e) => handleChange('contact_details', 'email', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Support Phone</label>
            <input 
              type="text" 
              value={formData.contact_details.supportPhone} 
              onChange={(e) => handleChange('contact_details', 'supportPhone', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">WhatsApp Number</label>
            <input 
              type="text" 
              value={formData.contact_details.whatsapp || ''} 
              onChange={(e) => handleChange('contact_details', 'whatsapp', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Facebook Page Link</label>
            <input 
              type="text" 
              value={formData.contact_details.facebookPage} 
              onChange={(e) => handleChange('contact_details', 'facebookPage', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Facebook Group Link</label>
            <input 
              type="text" 
              value={formData.contact_details.facebookGroup || ''} 
              onChange={(e) => handleChange('contact_details', 'facebookGroup', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Google Meet Link</label>
            <input 
              type="text" 
              value={formData.contact_details.googleMeet || ''} 
              onChange={(e) => handleChange('contact_details', 'googleMeet', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
        <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📲</span> Payment Numbers (পেমেন্ট নম্বর)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">bKash Number</label>
            <input 
              type="text" 
              value={formData.payment_numbers.bkash} 
              onChange={(e) => handleChange('payment_numbers', 'bkash', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Nagad Number</label>
            <input 
              type="text" 
              value={formData.payment_numbers.nagad} 
              onChange={(e) => handleChange('payment_numbers', 'nagad', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Rocket Number</label>
            <input 
              type="text" 
              value={formData.payment_numbers.rocket} 
              onChange={(e) => handleChange('payment_numbers', 'rocket', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Cellfin Info</label>
            <input 
              type="text" 
              value={formData.payment_numbers.cellfin} 
              onChange={(e) => handleChange('payment_numbers', 'cellfin', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">NexusPay Info</label>
            <input 
              type="text" 
              value={formData.payment_numbers.nexuspay} 
              onChange={(e) => handleChange('payment_numbers', 'nexuspay', e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
        <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>👥</span> Admin Management (অ্যাডমিন প্যানেল এক্সেস)
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2 max-w-sm">
            <input 
              type="email" 
              value={newAdminEmail} 
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="new_admin@gmail.com"
              className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-teal-500 outline-none" 
              onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
            />
            <button 
              onClick={handleAddAdmin}
              disabled={!newAdminEmail}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm transition-colors"
            >
              <UserPlus size={16} /> Add Admin
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-w-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Admin Email</th>
                  <th className="px-4 py-3 w-20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                    alfaz.uddin1803@gmail.com <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Super Admin</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-slate-400 cursor-not-allowed" title="Super admin cannot be removed">
                      <Trash2 size={16} className="mx-auto" />
                    </span>
                  </td>
                </tr>
                {admins.map(admin => (
                  <tr key={admin.id} className="bg-white group">
                    <td className="px-4 py-3 text-slate-700">{admin.email}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => removeAdmin(admin.id)}
                        className="text-rose-400 hover:text-rose-600 opacity-50 group-hover:opacity-100 transition-opacity"
                        title="Remove admin"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">
                No additional admins added yet.
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Admins added here can login to the admin panel using their Google Account to review registrations and update content.
          </p>
        </div>
      </div>
    </div>
  );
}
