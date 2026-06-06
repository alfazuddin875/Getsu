import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';

export default function AdminContent() {
  const { slides, updateSlide, videos, updateVideo, blogs, updateBlog, sponsors, updateSponsor, specialAlumni, addSpecialAlumni, updateSpecialAlumni, removeSpecialAlumni, coupons, addCoupon, updateCoupon, removeCoupon, addSlide, removeSlide, addVideo, removeVideo, addBlog, removeBlog, addSponsor, removeSponsor } = useAppStore();

  const [newSponsor, setNewSponsor] = useState({ name: '', imageUrl: '' });
  const [newSpecialAlumni, setNewSpecialAlumni] = useState({ name: '', designation: '', batch: '', imageUrl: '' });
  const [newSlide, setNewSlide] = useState({ title: '', imageUrl: '' });
  const [newVideo, setNewVideo] = useState({ title: '', youtubeId: '', imageUrl: '' });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', imageUrl: '' });
  const [newCoupon, setNewCoupon] = useState({ code: '', discountAmount: 0, isActive: true, expiryDate: '' });
  
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingBlogData, setEditingBlogData] = useState({ title: '', content: '', imageUrl: '' });

  const [editingSpecialAlumniId, setEditingSpecialAlumniId] = useState<string | null>(null);
  const [editingSpecialAlumniData, setEditingSpecialAlumniData] = useState({ name: '', designation: '', batch: '', imageUrl: '' });

  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editingSponsorData, setEditingSponsorData] = useState({ name: '', imageUrl: '' });

  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editingSlideData, setEditingSlideData] = useState({ title: '', imageUrl: '' });

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoData, setEditingVideoData] = useState({ title: '', youtubeId: '', imageUrl: '' });

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
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
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

  const handleEditBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setEditingBlogData({ title: blog.title, content: blog.content, imageUrl: blog.imageUrl || '' });
  };

  const handleUpdateBlog = () => {
    if (editingBlogId) {
      updateBlog(editingBlogId, editingBlogData);
      setEditingBlogId(null);
    }
  };

  const handleEditSponsor = (sponsor: any) => {
    setEditingSponsorId(sponsor.id);
    setEditingSponsorData({ name: sponsor.name, imageUrl: sponsor.imageUrl });
  };

  const handleUpdateSponsor = () => {
    if (editingSponsorId) {
      updateSponsor(editingSponsorId, editingSponsorData);
      setEditingSponsorId(null);
    }
  };

  const handleEditSpecialAlumni = (alumni: any) => {
    setEditingSpecialAlumniId(alumni.id);
    setEditingSpecialAlumniData({ name: alumni.name, designation: alumni.designation, batch: alumni.batch, imageUrl: alumni.imageUrl || '' });
  };

  const handleUpdateSpecialAlumni = () => {
    if (editingSpecialAlumniId) {
      updateSpecialAlumni(editingSpecialAlumniId, editingSpecialAlumniData);
      setEditingSpecialAlumniId(null);
    }
  };

  const handleEditSlide = (slide: any) => {
    setEditingSlideId(slide.id);
    setEditingSlideData({ title: slide.title, imageUrl: slide.imageUrl });
  };

  const handleUpdateSlide = () => {
    if (editingSlideId) {
      updateSlide(editingSlideId, editingSlideData);
      setEditingSlideId(null);
    }
  };

  const handleEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setEditingVideoData({ title: video.title, youtubeId: video.youtubeId, imageUrl: video.imageUrl || '' });
  };

  const handleUpdateVideo = () => {
    if (editingVideoId) {
      updateVideo(editingVideoId, editingVideoData);
      setEditingVideoId(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Website Content</h1>
      </div>

      {/* Special Alumni */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-6">Special Alumni (বিশেষ অ্যালামনাই)</h2>
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Name" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSpecialAlumni.name} onChange={e => setNewSpecialAlumni({...newSpecialAlumni, name: e.target.value})} />
            <input type="text" placeholder="Designation" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSpecialAlumni.designation} onChange={e => setNewSpecialAlumni({...newSpecialAlumni, designation: e.target.value})} />
            <input type="text" placeholder="Batch" className="border px-3 py-2.5 rounded-xl text-sm w-full sm:w-32" value={newSpecialAlumni.batch} onChange={e => setNewSpecialAlumni({...newSpecialAlumni, batch: e.target.value})} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Image URL (optional)" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSpecialAlumni.imageUrl} onChange={e => setNewSpecialAlumni({...newSpecialAlumni, imageUrl: e.target.value})} />
            <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewSpecialAlumni({...newSpecialAlumni, imageUrl: base64}))} />
            </label>
            <button onClick={() => { addSpecialAlumni(newSpecialAlumni); setNewSpecialAlumni({name: '', designation: '', batch: '', imageUrl: ''}); }} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all">Add Alumni</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialAlumni.map(s => (
            <div key={s.id} className="border rounded-xl p-4 relative group bg-slate-50 hover:bg-white transition-colors flex gap-4">
              {editingSpecialAlumniId === s.id ? (
                <div className="space-y-2 w-full">
                  <input type="text" placeholder="Name" className="w-full text-xs border px-2 py-1 rounded" value={editingSpecialAlumniData.name} onChange={e => setEditingSpecialAlumniData({...editingSpecialAlumniData, name: e.target.value})} />
                  <input type="text" placeholder="Designation" className="w-full text-xs border px-2 py-1 rounded" value={editingSpecialAlumniData.designation} onChange={e => setEditingSpecialAlumniData({...editingSpecialAlumniData, designation: e.target.value})} />
                  <input type="text" placeholder="Batch" className="w-full text-xs border px-2 py-1 rounded" value={editingSpecialAlumniData.batch} onChange={e => setEditingSpecialAlumniData({...editingSpecialAlumniData, batch: e.target.value})} />
                  <div className="flex gap-1 w-full">
                    <input type="text" placeholder="Image URL" className="flex-1 text-xs border px-2 py-1 rounded" value={editingSpecialAlumniData.imageUrl} onChange={e => setEditingSpecialAlumniData({...editingSpecialAlumniData, imageUrl: e.target.value})} />
                    <label className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded cursor-pointer font-bold shrink-0 flex items-center justify-center">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setEditingSpecialAlumniData({...editingSpecialAlumniData, imageUrl: base64}))} />
                    </label>
                  </div>
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditingSpecialAlumniId(null)} className="text-[10px] bg-slate-200 px-2 py-1 rounded">Cancel</button>
                    <button onClick={handleUpdateSpecialAlumni} className="text-[10px] bg-teal-600 text-white px-2 py-1 rounded">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                    {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" /> : <span className="text-slate-400 text-xs text-center leading-tight">No Photo</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500 truncate">{s.designation}</p>
                    <p className="text-xs text-teal-600 font-medium">Batch: {s.batch}</p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditSpecialAlumni(s)} className="text-[10px] font-bold text-teal-600 hover:text-teal-800">EDIT</button>
                      <button onClick={() => removeSpecialAlumni(s.id)} className="text-[10px] font-bold text-rose-600 hover:text-rose-800">DELETE</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-6">Sponsors (স্পন্সর)</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="text" placeholder="Sponsor Name" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSponsor.name} onChange={e => setNewSponsor({...newSponsor, name: e.target.value})} />
          <div className="flex-1 flex gap-2">
            <input type="text" placeholder="Logo Image URL" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSponsor.imageUrl} onChange={e => setNewSponsor({...newSponsor, imageUrl: e.target.value})} />
            <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
              Upload File
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewSponsor({...newSponsor, imageUrl: base64}))} />
            </label>
          </div>
          <button onClick={() => { addSponsor(newSponsor); setNewSponsor({name: '', imageUrl: ''}); }} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all">Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map(s => (
            <div key={s.id} className="border rounded-xl p-3 relative group bg-slate-50 hover:bg-white transition-colors">
              {editingSponsorId === s.id ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full text-xs border px-2 py-1 rounded" 
                    value={editingSponsorData.name} 
                    onChange={e => setEditingSponsorData({...editingSponsorData, name: e.target.value})} 
                  />
                  <div className="flex gap-1 w-full">
                    <input 
                      type="text" 
                      placeholder="Logo URL" 
                      className="flex-1 text-xs border px-2 py-1 rounded" 
                      value={editingSponsorData.imageUrl} 
                      onChange={e => setEditingSponsorData({...editingSponsorData, imageUrl: e.target.value})} 
                    />
                    <label className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded cursor-pointer font-bold shrink-0 flex items-center justify-center">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setEditingSponsorData({...editingSponsorData, imageUrl: base64}))} />
                    </label>
                  </div>
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEditingSponsorId(null)} className="text-[10px] bg-slate-200 px-2 py-1 rounded">Cancel</button>
                    <button onClick={handleUpdateSponsor} className="text-[10px] bg-teal-600 text-white px-2 py-1 rounded">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-24 w-full flex items-center justify-center p-2 mb-2 bg-white rounded-lg">
                    {s.imageUrl && s.imageUrl.trim() !== '' ? (
                      <img src={s.imageUrl} alt={s.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-[10px] text-slate-400">No Image</div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-center text-slate-700 truncate mb-2">{s.name}</p>
                  <div className="flex gap-2 justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditSponsor(s)}
                      className="text-[10px] font-bold text-teal-600 hover:text-teal-800"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => removeSponsor(s.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                    >
                      DELETE
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Slider */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-6">Image Slider (স্লাইডার ছবি)</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="text" placeholder="Caption/Title" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} />
          <div className="flex-1 flex gap-2">
            <input type="text" placeholder="Image URL" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newSlide.imageUrl} onChange={e => setNewSlide({...newSlide, imageUrl: e.target.value})} />
            <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
              Upload File
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewSlide({...newSlide, imageUrl: base64}))} />
            </label>
          </div>
          <button onClick={() => { addSlide(newSlide); setNewSlide({title: '', imageUrl: ''}); }} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all">Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slides.map(s => (
            <div key={s.id} className="border rounded-2xl overflow-hidden relative group shadow-sm bg-white">
              {editingSlideId === s.id ? (
                <div className="p-4 space-y-3">
                  <input type="text" className="w-full text-sm border rounded-lg p-2" value={editingSlideData.title} onChange={e => setEditingSlideData({...editingSlideData, title: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 text-sm border rounded-lg p-2" value={editingSlideData.imageUrl} onChange={e => setEditingSlideData({...editingSlideData, imageUrl: e.target.value})} />
                    <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setEditingSlideData({...editingSlideData, imageUrl: base64}))} />
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingSlideId(null)} className="px-3 py-1.5 text-xs bg-slate-100 rounded-lg font-bold">Cancel</button>
                    <button onClick={handleUpdateSlide} className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg font-bold">Save Changes</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
                    {s.imageUrl && s.imageUrl.trim() !== '' ? (
                      <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-slate-400 font-mono italic">No Image Preview</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-slate-800 mb-3 truncate">{s.title}</p>
                    <div className="flex gap-4 opacity-100 md:opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditSlide(s)} className="text-[10px] font-bold text-teal-600 flex items-center gap-1 uppercase tracking-wide">✏️ Edit</button>
                      <button onClick={() => removeSlide(s.id)} className="text-[10px] font-bold text-rose-600 flex items-center gap-1 uppercase tracking-wide">🗑️ Delete</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-6">Videos (ভিডিও)</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="text" placeholder="Title" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
          <input type="text" placeholder="YouTube ID" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newVideo.youtubeId} onChange={e => setNewVideo({...newVideo, youtubeId: e.target.value})} />
          <div className="flex-1 flex gap-2">
            <input type="text" placeholder="Thumbnail URL" className="flex-1 border px-3 py-2.5 rounded-xl text-sm" value={newVideo.imageUrl} onChange={e => setNewVideo({...newVideo, imageUrl: e.target.value})} />
            <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewVideo({...newVideo, imageUrl: base64}))} />
            </label>
          </div>
          <button onClick={() => { addVideo(newVideo); setNewVideo({title: '', youtubeId: '', imageUrl: ''}); }} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all">Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => (
            <div key={v.id} className="border rounded-2xl overflow-hidden relative group p-4 bg-slate-50">
              {editingVideoId === v.id ? (
                <div className="space-y-3">
                  <input type="text" className="w-full text-sm border rounded-lg p-2" value={editingVideoData.title} onChange={e => setEditingVideoData({...editingVideoData, title: e.target.value})} />
                  <input type="text" className="w-full text-sm border rounded-lg p-2" value={editingVideoData.youtubeId} onChange={e => setEditingVideoData({...editingVideoData, youtubeId: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 text-sm border rounded-lg p-2" value={editingVideoData.imageUrl} onChange={e => setEditingVideoData({...editingVideoData, imageUrl: e.target.value})} placeholder="Thumbnail URL" />
                    <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setEditingVideoData({...editingVideoData, imageUrl: base64}))} />
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingVideoId(null)} className="px-3 py-1.5 text-xs bg-slate-200 rounded-lg font-bold">Cancel</button>
                    <button onClick={handleUpdateVideo} className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg font-bold">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900 aspect-video rounded-xl overflow-hidden flex flex-col items-center justify-center text-white text-[10px] mb-3 relative border border-slate-800">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="font-bold text-teal-400 mb-1 uppercase tracking-widest text-[9px]">YouTube</div>
                        <div className="truncate w-full font-mono text-center px-3">{v.youtubeId}</div>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800 mb-3 truncate px-1">{v.title}</p>
                  <div className="flex gap-4 opacity-100 md:opacity-40 group-hover:opacity-100 transition-opacity px-1">
                    <button onClick={() => handleEditVideo(v)} className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">✏️ Edit</button>
                    <button onClick={() => removeVideo(v.id)} className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">🗑️ Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Blogs */}
      <section id="blog-management" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">Blog & Notices (ব্লগ ও নোটিশ)</h2>
        
        {/* New Blog Form */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">নতুন পোস্ট লিখুন</h3>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Post Title" className="border px-3 py-2 rounded-lg bg-white" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
            <div className="flex gap-2">
              <input type="text" placeholder="Cover Image URL (optional)" className="flex-1 border px-3 py-2 rounded-lg bg-white" value={newBlog.imageUrl} onChange={e => setNewBlog({...newBlog, imageUrl: e.target.value})} />
              <label className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewBlog({...newBlog, imageUrl: base64}))} />
              </label>
            </div>
            <textarea placeholder="Content..." rows={3} className="border px-3 py-2 rounded-lg bg-white" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})}></textarea>
            <button onClick={() => { addBlog(newBlog); setNewBlog({title: '', content: '', imageUrl: ''}); }} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg self-end transition-colors font-semibold">Post Notice</button>
          </div>
        </div>

        <div className="space-y-4">
          {blogs.map(b => (
            <div key={b.id} className="border rounded-xl p-5 relative group hover:border-teal-200 transition-colors bg-white">
              {editingBlogId === b.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <input 
                    type="text" 
                    className="w-full border px-3 py-2 rounded-lg font-bold text-lg" 
                    value={editingBlogData.title} 
                    onChange={e => setEditingBlogData({...editingBlogData, title: e.target.value})} 
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Cover Image URL"
                      className="flex-1 border px-3 py-2 rounded-lg text-sm" 
                      value={editingBlogData.imageUrl} 
                      onChange={e => setEditingBlogData({...editingBlogData, imageUrl: e.target.value})} 
                    />
                    <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-center font-bold tracking-tight shrink-0 transition-colors">
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setEditingBlogData({...editingBlogData, imageUrl: base64}))} />
                    </label>
                  </div>
                  <textarea 
                    rows={4} 
                    className="w-full border px-3 py-2 rounded-lg text-sm" 
                    value={editingBlogData.content} 
                    onChange={e => setEditingBlogData({...editingBlogData, content: e.target.value})}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingBlogId(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button onClick={handleUpdateBlog} className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg">Update Post</button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    {b.imageUrl && (
                      <div className="sm:w-1/3 aspect-video sm:h-32 rounded-lg overflow-hidden shrink-0">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3 pr-20">
                        <div>
                          <h3 className="font-bold text-xl text-slate-800 mb-1">{b.title}</h3>
                          <p className="text-xs text-slate-500">{new Date(b.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{b.content}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => handleEditBlog(b)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest flex items-center gap-1.5 py-1"
                    >
                      <span>✏️</span> এডিট করুন
                    </button>
                    <button 
                      onClick={() => removeBlog(b.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 uppercase tracking-widest flex items-center gap-1.5 py-1"
                    >
                      <span>🗑️</span> ডিলিট করুন
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {blogs.length === 0 && <p className="text-center text-slate-400 py-8 italic">কোন পোস্ট পাওয়া যায়নি।</p>}
        </div>
      </section>

      {/* Coupons */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">Coupons (কুপন কোড)</h2>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px] flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Coupon Code</span>
              <input 
                type="text" 
                placeholder="Code (e.g. EARLYBIRD)" 
                className="w-full border px-3 py-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-500" 
                value={newCoupon.code} 
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} 
              />
            </div>
            
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Discount (৳)</span>
              <input 
                type="number" 
                placeholder="Amount (৳)" 
                className="w-full border px-3 py-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-500" 
                value={newCoupon.discountAmount || ''} 
                onChange={e => setNewCoupon({...newCoupon, discountAmount: Number(e.target.value)})} 
              />
            </div>

            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Expiry (Optional)</span>
              <input 
                type="date"
                className="w-full border px-3 py-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-500"
                value={newCoupon.expiryDate}
                onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
              />
            </div>
            
            <div className="flex-none">
              <label className="flex items-center justify-center gap-2 cursor-pointer bg-white px-4 py-2 h-[42px] rounded-lg border hover:bg-slate-50">
                <input 
                  type="checkbox" 
                  checked={newCoupon.isActive} 
                  onChange={e => setNewCoupon({...newCoupon, isActive: e.target.checked})} 
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-bold text-slate-700">Active</span>
              </label>
            </div>
            
            <div className="flex-none w-full sm:w-auto">
              <button 
                onClick={() => { 
                  if(newCoupon.code && newCoupon.discountAmount > 0) {
                    addCoupon(newCoupon); 
                    setNewCoupon({code: '', discountAmount: 0, isActive: true, expiryDate: ''}); 
                  }
                }} 
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 h-[42px] rounded-lg transition-colors font-semibold shadow-sm"
              >
                Add Coupon
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coupons.map(c => (
             <div key={c.id} className={`border rounded-lg p-4 relative group transition-colors ${c.isActive ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                <div className="flex justify-between items-start mb-2">
                   <div className="flex flex-col">
                     <h3 className="font-bold text-lg font-mono tracking-wider text-slate-800">{c.code}</h3>
                     {c.expiryDate && <span className="text-[10px] text-slate-500 font-medium">Expires: {new Date(c.expiryDate).toLocaleDateString('en-GB')}</span>}
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                     {c.isActive ? 'Active' : 'Inactive'}
                   </span>
                </div>
                <p className="text-slate-600 font-bold mb-4">Discount: <span className="text-emerald-700">৳{c.discountAmount}</span></p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => c.id && updateCoupon(c.id, { isActive: !c.isActive })}
                     className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${c.isActive ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                   >
                     {c.isActive ? 'Deactivate' : 'Activate'}
                   </button>
                   <button 
                     onClick={() => c.id && removeCoupon(c.id)}
                     className="px-3 text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition-colors"
                   >
                     Delete
                   </button>
                </div>
             </div>
          ))}
          {coupons.length === 0 && <p className="text-center text-slate-400 py-8 italic col-span-full">কোন কুপন পাওয়া যায়নি।</p>}
        </div>
      </section>

    </div>
  );
}
