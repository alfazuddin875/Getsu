import React, { forwardRef } from 'react';
import { Registration } from '../../lib/types';
import { processImageUrl } from '../../lib/imageUtils';

interface Props {
  registration: Registration;
}

export const CongratulationsCard = forwardRef<HTMLDivElement, Props>(({ registration }, ref) => {
  const profileImage = processImageUrl(registration.photo_url);

  // We are not relying entirely on settings for the text matching the exact image 
  // because the user wants this specific image to become the template.

  return (
    <div 
      ref={ref} 
      className="w-[800px] h-[1066px] relative overflow-hidden flex flex-col font-sans"
      style={{
        background: 'linear-gradient(180deg, #4c1d95 0%, #1e1b4b 100%)', // Very deep purple
      }}
    >
      {/* Blurred background building overlay simulation */}
      <div className="absolute top-16 inset-x-0 h-[480px] opacity-40 mix-blend-soft-light pointer-events-none">
          <div className="w-full h-full bg-[#e11d48] blur-[80px] transform scale-125"></div>
      </div>
      <div className="absolute top-32 inset-x-0 h-[300px] opacity-30 bg-[#a855f7] blur-[50px]"></div>

      {/* Orange Diagonal Lines Top Right */}
      <div className="absolute -top-16 -right-16 w-80 h-80 border-t-[24px] border-r-[24px] border-[#f59e0b] rounded-lg transform rotate-45 z-0 opacity-90 shadow-lg"></div>
      <div className="absolute top-12 right-20 w-80 h-80 border-t-[12px] border-r-[12px] border-[#fbbf24] rounded-lg transform rotate-45 z-0 opacity-80 shadow-lg"></div>

      {/* Top Circular Decoration on Left */}
      <div className="absolute top-12 left-16 z-20 w-[400px]">
         {/* "Obhinondon" Custom styling with layered stroke mechanism via textShadow for wide support */}
         <div className="relative">
             <div className="text-[110px] font-black text-[#e11d48] tracking-tighter transform -rotate-12 select-none" 
                  style={{
                    WebkitTextStroke: '6px white',
                    paintOrder: 'stroke fill',
                    textShadow: '4px 6px 0px rgba(0,0,0,0.3)',
                    fontFamily: `'System-ui', sans-serif` // Fallback, looks bold
                  }}>
                 অভিনন্দন
             </div>
             {/* Small stars around the text to replicate the burst */}
             <div className="absolute top-8 -left-4 text-[#facc15] text-4xl transform -rotate-12 filter drop-shadow-md">⭐</div>
             <div className="absolute -top-4 right-16 text-[#f472b6] text-3xl filter drop-shadow-md">⭐</div>
             <div className="absolute bottom-4 right-4 text-[#facc15] text-4xl filter drop-shadow-md">⭐</div>
             {/* Sparkle lines */}
             <div className="absolute -top-6 left-32 flex justify-center items-center opacity-80">
                <div className="w-2.5 h-16 bg-[#ef4444] absolute rounded-full transform rotate-12"></div>
                <div className="w-2.5 h-16 bg-white absolute rounded-full transform -rotate-45 ml-16 mt-8"></div>
                <div className="w-2.5 h-12 bg-[#facc15] absolute rounded-full transform rotate-45 -ml-16 mt-12"></div>
             </div>
         </div>
      </div>

      {/* Top Right: Profile Picture */}
      <div className="absolute top-10 right-10 z-20">
        <div className="w-[360px] h-[360px] rounded-full border-[14px] border-[#fbbf24] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] bg-[#e2e8f0]">
           {profileImage && profileImage !== 'https://via.placeholder.com/150' ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#94a3b8] bg-[#f1f5f9]">
                 <svg className="w-48 h-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
              </div>
            )}
        </div>
      </div>

      {/* Middle curved separator (White and Dark Purple zones) */}
      <div className="absolute top-[480px] w-[150%] h-[300px] -left-[25%] transform -rotate-[5deg] z-10">
         {/* The thick white curve */}
         <div className="w-full h-[150px] bg-white rounded-t-[100%] border-t-[16px] border-[#fbbf24] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"></div>
         {/* The dark purple body below it */}
         <div className="w-full h-[600px] bg-[#2e093b] rounded-b-[100%] transform -translate-y-4"></div>
      </div>

      {/* Fill the bottom with the dark purple color to cover everything below the curve */}
      <div className="absolute top-[580px] inset-x-0 bottom-0 bg-[#2e093b] z-0"></div>

      {/* Middle Left: Logo Badge */}
      <div className="absolute top-[350px] left-8 z-30">
        <div className="w-44 h-44 rounded-full border-[6px] border-[#16a34a] bg-white overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center relative">
            <div className="text-center">
                <div className="text-[10px] text-[#1e3a8a] font-bold px-4 leading-tight mb-1">
                   পায়রাহাট মাধ্যমিক বিদ্যালয়
                </div>
                <div className="text-5xl font-black text-[#dc2626] tracking-tighter">
                   ৭৫<span className="text-sm tracking-normal absolute mt-1">বছর পূর্তি</span>
                </div>
                <div className="text-xs text-[#1e3a8a] font-extrabold mt-4 px-2">
                   পুনর্মিলনী
                </div>
                <div className="bg-[#1e3a8a] text-white text-[8px] mx-2 mt-1 py-0.5 rounded-full font-bold">
                   প্লাটিনাম জয়ন্তী - ২০২৬
                </div>
            </div>
        </div>
      </div>

      {/* User Info Tags */}
      <div className="absolute top-[420px] w-full flex flex-col z-30">
          
          {/* Name Plate */}
          <div className="flex justify-start ml-48">
              <div className="bg-gradient-to-b from-[#2563eb] to-[#1e3a8a] rounded-[50px] px-16 py-4 shadow-[0_15px_25px_rgba(0,0,0,0.6)] border-2 border-[#60a5fa] border-b-8 border-b-[#1e3a8a]">
                  <div className="text-[44px] font-black text-[#ef4444]" style={{ 
                      WebkitTextStroke: '2.5px white', 
                      paintOrder: 'stroke fill',
                      textShadow: '3px 3px 0px rgba(0,0,0,0.4)'
                  }}>
                      {registration.personal_info.fullName}
                  </div>
              </div>
          </div>

          {/* Batch Plate */}
          <div className="flex justify-end mr-32 mt-6">
               <div className="bg-gradient-to-b from-[#f5f5f4] to-[#a8a29e] rounded-[40px] px-14 py-3 shadow-[0_15px_25px_rgba(0,0,0,0.6)] border border-white border-b-4 border-b-[#78716c]">
                  <div className="text-[36px] font-black text-[#dc2626]" style={{ 
                      WebkitTextStroke: '2px white', 
                      paintOrder: 'stroke fill',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.3)'
                  }}>
                      {registration.studentType === 'current' ? `শ্রেণী: ${registration.studentClass || '-'}` : `এসএসসি ব্যাচ : ${registration.personal_info.sscBatch || '-'}`}
                  </div>
              </div>
          </div>
      </div>

      {/* Bottom Text Area */}
      <div className="absolute bottom-28 w-full px-16 z-20 flex justify-center text-center">
          <div className="text-[36px] font-black leading-[1.6] text-[#fbbf24]" style={{ textShadow: '2px 3px 6px rgba(0,0,0,0.8)' }}>
              <p>পায়রাহাট মাধ্যমিক বিদ্যালয়ের প্লাটিনাম</p>
              <p>জয়ন্তী অনুষ্ঠানে আপনার রেজিস্ট্রেশনের জন্য</p>
              <p>আন্তরিক ধন্যবাদ ও কৃতজ্ঞতা জানাই।</p>
              <p>আপনার অংশগ্রহণই এই মহোৎসবকে</p>
              <p>আরও স্মরণীয় করে তুলবে।</p>
          </div>
      </div>

      {/* Decorative Balloons and Gifts */}
      {/* Bottom Left */}
      <div className="absolute bottom-6 left-6 z-30" style={{ filter: 'drop-shadow(6px 6px 8px rgba(0,0,0,0.6))' }}>
          <span className="text-8xl">🎁</span>
          <span className="text-[90px] absolute -bottom-4 left-16">🎈</span>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-6 right-8 z-30" style={{ filter: 'drop-shadow(6px 6px 8px rgba(0,0,0,0.6))' }}>
          <span className="text-[90px] absolute -bottom-4 -left-16">🎈</span>
          <span className="text-8xl relative z-10">🎁</span>
      </div>
    </div>
  );
});

CongratulationsCard.displayName = 'CongratulationsCard';

