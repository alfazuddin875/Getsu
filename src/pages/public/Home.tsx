import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppStore } from '../../lib/store';
import { processImageUrl } from '../../lib/imageUtils';
import { Facebook, Mail, MessageCircle, Phone, Users, CalendarDays, MapPin, Ticket, Video } from 'lucide-react';

const BlogCard: React.FC<{ blog: any }> = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = blog.content && blog.content.length > 100;
  
  return (
    <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {blog.imageUrl && (
        <div className="w-full h-32 sm:h-40 bg-slate-100 shrink-0 relative overflow-hidden">
          <img src={processImageUrl(blog.imageUrl)} alt={blog.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-800 mb-1 line-clamp-1 leading-snug">{blog.title}</h3>
        <p className="text-[11px] text-slate-500 mb-2 font-medium">{new Date(blog.date).toLocaleDateString('bn-BD')} • এডমিন</p>
        <div className="flex-1 flex flex-col">
          <p className={`text-slate-600 text-[13px] whitespace-pre-wrap leading-relaxed ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
            {blog.content}
          </p>
          {isLong && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-teal-600 font-bold text-[11px] mt-2 hover:text-teal-800 transition-colors self-start pb-0.5 border-b border-transparent hover:border-teal-600"
            >
              {expanded ? 'সংকুচিত করুন' : 'আরও দেখুন'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { settings, slides, videos, blogs, sponsors } = useAppStore();
  const bannerImage = processImageUrl(settings.event_details.bannerUrl);

  const heroStyle = bannerImage && bannerImage.trim() !== ''
    ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className="space-y-12 pb-12 font-sans overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-teal-900 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]" 
        style={heroStyle}
      >
        {(!bannerImage || bannerImage.trim() === '') && (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        )}
        <div className="absolute inset-0 bg-teal-900/60 object-cover mix-blend-multiply"></div>
        <div className="relative z-10 max-w-4xl pt-8 px-4">
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-teal-950 text-xs sm:text-sm font-black px-6 py-2 rounded-full mb-6 inline-block shadow-lg shadow-amber-500/20 border border-amber-300 tracking-wide">
            শেকড়ের টানে প্রিয় প্রাঙ্গনে
          </span>
          <h1 
            className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-3 text-amber-300 leading-snug md:whitespace-nowrap"
            style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.8)" }}
          >
            {settings.event_details.name}
          </h1>
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif mb-8 text-white tracking-wide"
            style={{ textShadow: "0px 8px 25px rgba(0,0,0,0.8)" }}
          >
            পায়রাহাট মাধ্যমিক বিদ্যালয়
          </h2>
          <p className="text-base md:text-xl text-teal-50 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg bg-teal-950/40 p-5 rounded-2xl backdrop-blur-md border border-white/10">
            পুরোনো বন্ধুদের কাছে পেয়ে ফুটছে মুখে হাসি, তাইতো মনে আনন্দ আজ পুনর্মিলনীর খুশি
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-teal-800 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
            >
              রেজিস্ট্রেশন করুন (Register Now)
            </Link>
            <Link
              to="/ticket"
              className="bg-teal-600/80 border border-teal-400 text-white hover:bg-teal-600 font-bold px-8 py-3.5 rounded-full shadow-lg transition-colors backdrop-blur-sm"
            >
              টিকেট যাচাই করুন (Check Ticket)
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Highlights */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col items-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-amber-100/50 group-hover:scale-110 transition-transform duration-300">
            <CalendarDays size={32} strokeWidth={1.5} />
          </div>
          <h3 className="relative text-xl font-bold font-serif text-slate-800 mb-3 tracking-tight text-center">তারিখ ও সময়</h3>
          <p className="relative text-slate-500 text-[15px] leading-relaxed font-medium text-center">{settings.event_details.date}</p>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col items-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
            <MapPin size={32} strokeWidth={1.5} />
          </div>
          <h3 className="relative text-xl font-bold font-serif text-slate-800 mb-3 tracking-tight text-center">স্থান</h3>
          <p className="relative text-slate-500 text-[15px] leading-relaxed font-medium text-center max-w-[200px]">{settings.event_details.venue}</p>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2 lg:col-span-1 group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="w-full flex items-center gap-4 mb-6 md:mb-5 justify-center lg:flex-col lg:text-center">
            <div className="relative w-14 h-14 lg:w-16 lg:h-16 shrink-0 bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100/50 group-hover:scale-110 transition-transform duration-300">
              <Ticket size={28} className="lg:w-8 lg:h-8" strokeWidth={1.5} />
            </div>
            <h3 className="relative text-xl font-bold font-serif text-slate-800 tracking-tight">ফি (Fee)</h3>
          </div>
          <div className="relative grid md:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-3 lg:gap-y-2.5 w-full text-slate-500 text-[14px] leading-relaxed font-medium">
            <div className="flex justify-between items-center gap-4 border-b border-slate-100/80 pb-2">
              <span className="text-slate-600">প্রাক্তন শিক্ষার্থী</span>
              <span className="text-slate-800 font-bold font-mono">৬৫০ ৳</span>
            </div>
            <div className="flex justify-between items-center gap-4 border-b border-slate-100/80 pb-2">
              <span className="text-slate-600">বর্তমান শিক্ষার্থী</span>
              <span className="text-slate-800 font-bold font-mono">৩৫০ ৳</span>
            </div>
            <div className="flex justify-between items-center gap-4 border-b border-slate-100/80 pb-2 md:pb-2 lg:pb-2">
              <span className="text-slate-600">স্বামী/স্ত্রী</span>
              <span className="text-slate-800 font-bold font-mono">৬৫০ ৳</span>
            </div>
            <div className="flex justify-between items-center gap-4 border-b border-slate-100/80 pb-2 lg:pb-2 border-b-transparent md:border-b-slate-100/80 lg:border-b-slate-100/80">
              <span className="text-slate-600">সন্তান (১০ বছরের নিচে)</span>
              <span className="text-slate-800 font-bold font-mono">৩০০ ৳</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-600">সন্তান (১০ বছর+)</span>
              <span className="text-slate-800 font-bold font-mono">৩৫০ ৳</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Special Alumni */}
      {useAppStore().specialAlumni.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">বিশেষ অ্যালামনাই</h2>
            <div className="h-1 w-12 bg-teal-600 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {useAppStore().specialAlumni.map(alumni => (
              <div key={alumni.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col items-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 text-center group">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 bg-slate-100 ring-4 ring-teal-50 group-hover:ring-teal-100 transition-all">
                  {alumni.imageUrl ? (
                    <img src={alumni.imageUrl} alt={alumni.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Users size={32} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">{alumni.name}</h3>
                <p className="text-xs md:text-sm text-teal-600 font-medium mb-1">{alumni.designation}</p>
                <p className="text-[10px] md:text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full inline-block border border-slate-100">Batch: {alumni.batch}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Notice Board */}
      {blogs.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold font-serif text-amber-900 mb-6 flex items-center gap-2">
            <span>📢</span> সাম্প্রতিক নোটিশ ও ব্লগ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Slideshow */}
      {slides.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">স্মৃতির ফ্রেম</h2>
            <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x pt-2 px-4 hidden-scrollbar cursor-grab active:cursor-grabbing">
            {slides.map(slide => (
              <div key={slide.id} className="w-[85vw] sm:w-[600px] md:w-[800px] lg:w-[960px] max-w-full aspect-video snap-center shrink-0 rounded-3xl overflow-hidden shadow-xl group relative ring-1 ring-slate-200">
                <div className="w-full h-full bg-slate-200">
                  {slide.imageUrl && slide.imageUrl.trim() !== '' ? (
                    <img 
                      src={processImageUrl(slide.imageUrl)} 
                      alt={slide.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      No Image
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-bold text-lg sm:text-2xl drop-shadow-lg">{slide.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-slate-100 p-8 md:p-12 rounded-3xl space-y-8"
        >
           <h2 className="text-3xl font-bold font-serif text-center text-slate-800">ভিডিও আর্কাইভ</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {videos.map(video => (
               <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 flex flex-col">
                 <div className="aspect-video w-full bg-slate-900 relative group">
                   {video.imageUrl ? (
                     <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer" className="block w-full h-full">
                       <img src={video.imageUrl} alt={video.title} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">▶</div>
                       </div>
                     </a>
                   ) : (
                     <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      ></iframe>
                   )}
                 </div>
                 <div className="p-4">
                   <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{video.title}</h3>
                 </div>
               </div>
             ))}
           </div>
        </motion.section>
      )}

      {/* Contact & Social Links */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border text-center border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm mb-12"
      >
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-4">আমাদের সাথে যুক্ত হোন</h2>
        <p className="text-slate-500 mb-8 max-w-2xl mx-auto">পুনর্মিলনীর যেকোনো আপডেট পেতে আমাদের সোশ্যাল মিডিয়া প্লাটফর্মগুলোতে যুক্ত থাকুন অথবা সরাসরি যোগাযোগ করুন।</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {settings.contact_details.googleMeet && (
            <a href={settings.contact_details.googleMeet} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#ea4335] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#d33426] transition-colors shadow-sm">
              <Video size={20} />
              গুগল মিট
            </a>
          )}
          {settings.contact_details.facebookPage && (
            <a href={settings.contact_details.facebookPage} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1864D2] transition-colors shadow-sm">
              <Facebook size={20} />
              ফেসবুক পেইজ
            </a>
          )}
          {settings.contact_details.facebookGroup && (
            <a href={settings.contact_details.facebookGroup} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1864D2] transition-colors shadow-sm">
              <Users size={20} />
              ফেসবুক গ্রুপ
            </a>
          )}
          {settings.contact_details.whatsapp && (
            <a href={`https://wa.me/${settings.contact_details.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#20B858] transition-colors shadow-sm">
              <MessageCircle size={20} />
              হোয়াটসঅ্যাপ
            </a>
          )}
          {settings.contact_details.email && (
            <a href={`mailto:${settings.contact_details.email}`} className="flex items-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              <Mail size={20} />
              ইমেইল
            </a>
          )}
          {settings.contact_details.supportPhone && (
            <a href={`tel:${settings.contact_details.supportPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-sm">
              <Phone size={20} />
              কল করুন
            </a>
          )}
        </div>
      </motion.section>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pt-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">আমাদের গর্বিত স্পন্সর</h2>
            <p className="text-slate-500">যাদের সার্বিক সহযোগিতায় এই আয়োজন সফল হতে যাচ্ছে</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {sponsors.map(sponsor => (
              <div key={sponsor.id} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105">
                {sponsor.imageUrl && sponsor.imageUrl.trim() !== '' ? (
                  <img src={sponsor.imageUrl} alt={sponsor.name} loading="lazy" className="h-24 md:h-32 object-contain drop-shadow-sm" />
                ) : (
                   <div className="h-24 w-40 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-sm font-bold">{sponsor.name}</div>
                )}
                <span className="text-sm font-semibold text-slate-600">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
