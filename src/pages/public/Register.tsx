import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { ImageCropper } from '../../components/common/ImageCropper';

export default function Register() {
  const addRegistration = useAppStore(state => state.addRegistration);
  const settings = useAppStore(state => state.settings);
  const navigate = useNavigate();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '', fathersName: '', mothersName: '', dob: '', bloodGroup: '', religion: '',
      studentType: 'alumni', studentClass: '', studentSession: '', studentRoll: '',
      sscBatch: '', occupation: '',
      phone: '', whatsapp: '', email: '', presentAddress: '', permanentAddress: '',
      tshirt_size: '', photo_url: '',
      guests: [], paymentMethod: 'bkash', bKashNumber: '', trxId: '', sameAsPresent: false,
      feedback: ''
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "guests" });
  
  const guestsWatch = watch("guests") || [];
  const studentTypeWatch = watch("studentType") || 'alumni';
  const baseFee = studentTypeWatch === 'current' ? 350 : 650;
  const guestsFee = guestsWatch.reduce((sum, guest) => sum + (Number(guest.fee) || 0), 0);
  const totalAmount = baseFee + guestsFee;

  const sameAsPresentWatch = watch("sameAsPresent");
  const presentAddressWatch = watch("presentAddress");
  const paymentMethodWatch = watch("paymentMethod") || 'bkash';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const [photoToCrop, setPhotoToCrop] = useState<string | null>(null);

  const coupons = useAppStore(state => state.coupons);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (studentTypeWatch === 'current') {
      setValue('guests', []);
    }
  }, [studentTypeWatch, setValue]);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('কুপন কোড প্রবেশ করুন');
      return;
    }
    const validCoupon = coupons.find(c => {
      if (c.code !== couponInput.trim().toUpperCase() || !c.isActive) return false;
      if (c.expiryDate) {
        const expiry = new Date(c.expiryDate);
        expiry.setHours(23, 59, 59, 999);
        if (new Date() > expiry) return false;
      }
      return true;
    });
    if (validCoupon) {
      setAppliedCoupon({ code: validCoupon.code, discount: validCoupon.discountAmount });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const finalTotalAmount = Math.max(0, totalAmount - (appliedCoupon?.discount || 0));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload a valid image file');
      return;
    }

    setPhotoError('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setPhotoToCrop(event.target?.result as string);
    };
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = (croppedImage: string) => {
    setPhotoBase64(croppedImage);
    setPhotoToCrop(null);
  };

  const onSubmit = (data: any) => {
    if (!photoBase64) {
      setPhotoError('আপনার ছবি দিন (Please upload your photo)');
      return;
    }
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(async () => {
      try {
        const paymentData: any = {
          totalAmount: Number(finalTotalAmount),
          paymentMethod: String(data.paymentMethod || 'bkash'),
          bKashNumber: String(data.bKashNumber || ''),
          trxId: String(data.trxId || '')
        };
        if (appliedCoupon) {
          paymentData.couponCode = appliedCoupon.code;
          paymentData.discountAmount = appliedCoupon.discount;
        }

        await addRegistration({
          personal_info: {
            fullName: data.fullName,
            fathersName: data.fathersName,
            mothersName: data.mothersName,
            dob: data.dob,
            bloodGroup: data.bloodGroup,
            religion: data.religion,
            sscBatch: data.sscBatch,
            occupation: data.occupation,
          },
          contact_info: {
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            presentAddress: data.presentAddress,
            permanentAddress: data.sameAsPresent ? data.presentAddress : data.permanentAddress,
          },
          studentType: data.studentType,
          studentClass: data.studentClass,
          studentSession: data.studentSession,
          studentRoll: data.studentRoll,
          feedback: data.feedback,
          tshirt_size: data.tshirt_size,
          photo_url: photoBase64,
          guests: data.guests.map((g: any) => ({
            relation: String(g.relation || ''),
            tshirt: String(g.tshirt || ''),
            fee: Number(g.fee) || 0
          })),
          payment: paymentData
        });
        navigate('/ticket', { state: { phone: data.phone } });
      } catch (err: any) {
        console.error("Failed to add registration:", err);
        alert("Registration failed: " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-teal-700 text-white p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">রেজিস্ট্রেশন ফর্ম (Registration Form)</h1>
        <p className="text-teal-50 opacity-90">Please fill in all the required fields marked with an asterisk (*).</p>
      </div>

      {photoToCrop && (
        <ImageCropper 
          imageSrc={photoToCrop} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setPhotoToCrop(null)} 
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-10">
        
        {/* Section 1: Personal Info */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-800">ব্যক্তিগত তথ্য (Personal Information)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2 mt-2">
              <label className="block text-sm font-semibold text-slate-700">অংশগ্রহণের ধরণ (Participant Type) <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 py-3 px-4 rounded-xl flex-1 hover:bg-teal-50 hover:border-teal-200 transition-colors">
                  <input type="radio" value="alumni" {...register("studentType", { required: true })} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                  <span className="font-medium text-slate-700">প্রাক্তন শিক্ষার্থী (Alumni - 650৳)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 py-3 px-4 rounded-xl flex-1 hover:bg-teal-50 hover:border-teal-200 transition-colors">
                  <input type="radio" value="current" {...register("studentType", { required: true })} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                  <span className="font-medium text-slate-700">বর্তমান শিক্ষার্থী (Current - 350৳)</span>
                </label>
              </div>
            </div>

            {studentTypeWatch === 'current' && (
              <div className="md:col-span-2 bg-orange-50 border border-orange-200 p-4 rounded-xl space-y-4">
                <p className="text-xs text-orange-700 font-medium">⚠️ কর্তৃপক্ষ আপনার প্রদত্ত তথ্য কঠোরভাবে যাচাই করবে। মিথ্যা বা ভুল তথ্য প্রদান করলে কোনো রিফান্ড ছাড়া রেজিস্ট্রেশন সরাসরি বাতিল করা হবে। বর্তমান শিক্ষার্থীদের অবশ্যই বৈধ প্রমাণ সাথে রাখতে হবে।</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">শ্রেণী (Class) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. একাদশ / দ্বাদশ / স্নাতক" {...register("studentClass", { required: studentTypeWatch === 'current' })} className="w-full border border-orange-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">সেশন (Session) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. 2023-2024" {...register("studentSession", { required: studentTypeWatch === 'current' })} className="w-full border border-orange-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">রোল নম্বর (Roll No) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. 12345" {...register("studentRoll", { required: studentTypeWatch === 'current' })} className="w-full border border-orange-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">পূর্ণ নাম (Full Name) <span className="text-red-500">*</span></label>
              <input {...register("fullName", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
              {errors.fullName && <span className="text-xs text-red-500">This field is required</span>}
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">পিতার নাম (Father's Name) <span className="text-red-500">*</span></label>
              <input {...register("fathersName", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">মাতার নাম (Mother's Name) <span className="text-red-500">*</span></label>
              <input {...register("mothersName", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">জন্ম তারিখ (Date of Birth) <span className="text-red-500">*</span></label>
              <input type="date" {...register("dob", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">ধর্ম (Religion)</label>
              <select {...register("religion")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                <option value="">নির্বাচন করুন</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Christianity">Christianity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2 mt-2 border border-slate-200 rounded-xl p-4 bg-slate-50">
              <label className="block text-sm font-semibold text-slate-700">আপনার ছবি (Your Photo) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4 mt-2">
                {photoBase64 ? (
                   <img src={photoBase64} alt="Preview" className="w-20 h-20 object-cover rounded-full border-2 border-teal-500 shadow-sm" />
                ) : (
                   <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 border border-slate-300">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                   </div>
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer" />
                  <p className="text-xs text-slate-500 mt-1">Maximum 5MB (JPG, PNG)</p>
                  {photoError && <p className="text-xs text-red-500 mt-1 font-medium">{photoError}</p>}
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">রক্তের গ্রুপ (Blood Group)</label>
              <select {...register("bloodGroup")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                <option value="">নির্বাচন করুন</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Contact & School Info */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-800">যোগাযোগ ও অন্যান্য তথ্য (Contact Info)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">মোবাইল নম্বর (Phone) <span className="text-red-500">*</span></label>
              <input type="tel" {...register("phone", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">হোয়াটসঅ্যাপ (WhatsApp Number)</label>
              <input type="tel" {...register("whatsapp")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">ইমেইল (Email)</label>
              <input type="email" {...register("email")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">এসএসসি ব্যাচ (SSC Batch) <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. 2015" {...register("sscBatch", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">পেশা (Occupation)</label>
              <input type="text" {...register("occupation")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1.5">
               <label className="block text-sm font-semibold text-slate-700">টি-শার্ট সাইজ (T-shirt Size) <span className="text-red-500">*</span></label>
               <select {...register("tshirt_size", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                 <option value="">নির্বাচন করুন</option>
                 {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
          <div className="space-y-1.5 mt-4">
             <label className="block text-sm font-semibold text-slate-700">বর্তমান ঠিকানা (Present Address) <span className="text-red-500">*</span></label>
             <textarea {...register("presentAddress", { required: true })} rows={2} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none resize-none" />
          </div>
          <div className="space-y-1.5">
             <div className="flex justify-between items-center">
               <label className="block text-sm font-semibold text-slate-700">স্থায়ী ঠিকানা (Permanent Address) <span className="text-red-500">*</span></label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" {...register("sameAsPresent")} className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                 <span className="text-sm text-slate-600">Same as Present</span>
               </label>
             </div>
             <textarea disabled={sameAsPresentWatch} value={sameAsPresentWatch ? presentAddressWatch : undefined} {...register("permanentAddress", { required: !sameAsPresentWatch })} rows={2} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none resize-none disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
        </section>

        {/* Section 3: Family/Guests */}
        {studentTypeWatch === 'alumni' && (
          <section className="space-y-4">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">অতিথি যোগ করুন (Add Family/Guests)</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">স্বামী/স্ত্রী: ৬৫০ টাকা | সন্তান (১০ বছরের নিচে): ৩০০ টাকা | সন্তান (১০ বছর বা তার বেশি): ৩৫০ টাকা</p>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="w-full sm:flex-1 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">সম্পর্ক (Relation)</label>
                  <select 
                    {...register(`guests.${index}.relation` as const, {
                      onChange: (e) => {
                        const rel = e.target.value;
                        let fee = 650;
                        if (rel === 'সন্তান (১০ বছরের নিচে)') fee = 300;
                        else if (rel === 'সন্তান (১০ বছর বা তার বেশি)') fee = 350;
                        setValue(`guests.${index}.fee` as const, fee, { shouldValidate: true, shouldDirty: true });
                      }
                    })} 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="স্বামী">স্বামী (Husband)</option>
                    <option value="স্ত্রী">স্ত্রী (Wife)</option>
                    <option value="সন্তান (১০ বছরের নিচে)">সন্তান (১০ বছরের নিচে)</option>
                    <option value="সন্তান (১০ বছর বা তার বেশি)">সন্তান (১০ বছর বা তার বেশি)</option>
                  </select>
                </div>
                <div className="w-full sm:w-28 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">ফি (Fee ৳)</label>
                  <input type="number" readOnly {...register(`guests.${index}.fee` as const, { valueAsNumber: true })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-100 font-bold text-slate-700" />
                </div>
                <button type="button" onClick={() => remove(index)} className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium border border-red-200 w-full sm:w-auto">
                  Remove
                </button>
              </div>
            ))}
            
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={() => append({ relation: 'স্ত্রী', fee: 650, tshirt: 'M' })} className="text-sm font-medium px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors">
                + স্বামী/স্ত্রী যোগ করুন (650৳)
              </button>
              <button type="button" onClick={() => append({ relation: 'সন্তান (১০ বছরের নিচে)', fee: 300, tshirt: 'S' })} className="text-sm font-medium px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors">
                + সন্তান (১০ বছরের নিচে) (300৳)
              </button>
              <button type="button" onClick={() => append({ relation: 'সন্তান (১০ বছর বা তার বেশি)', fee: 350, tshirt: 'S' })} className="text-sm font-medium px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors">
                + সন্তান (১০ বছর বা তার বেশি) (350৳)
              </button>
            </div>
          </section>
        )}

        {/* Section 4: Payment */}
        <section className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">পেমেন্ট (Payment)</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-white p-5 rounded-xl border border-teal-100 shadow-sm w-full md:w-80">
              <div className="text-center">
                <span className="block text-slate-500 text-sm font-medium mb-1">মোট ফি (Total Amount)</span>
                <span className="block text-4xl font-black text-teal-700">{finalTotalAmount}৳</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs text-slate-500 space-y-2">
                <div className="flex justify-between"><span>নিজের ফি:</span> <span>{baseFee}৳</span></div>
                {guestsWatch.length > 0 && (
                  <div className="flex justify-between"><span>অতিথি ফি ({guestsWatch.length} জন):</span> <span>{guestsFee}৳</span></div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-50 pt-1">
                    <span>কুপন ডিসকাউন্ট ({appliedCoupon.code}):</span> 
                    <span>-{appliedCoupon.discount}৳</span>
                  </div>
                )}
              </div>
              
              <div className="mt-5 pt-5 border-t border-slate-100">
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 rounded-lg text-xs font-bold flex justify-between items-center">
                    <span>✅ কুপন যুক্ত হয়েছে: {appliedCoupon.code}</span>
                    <button type="button" onClick={removeCoupon} className="text-rose-500 hover:text-rose-700">বাতিল</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-rose-500 font-medium">{couponError}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 max-w-sm space-y-4">
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <label className="block text-sm font-semibold text-slate-700">পেমেন্ট মেথড (Payment Method) <span className="text-red-500">*</span></label>
                  <select {...register("paymentMethod")} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none">
                    <option value="bkash">bKash (বিকাশ)</option>
                    <option value="nagad">Nagad (নগদ)</option>
                    <option value="rocket">Rocket (রকেট)</option>
                    <option value="cellfin">Cellfin (সেলফিন)</option>
                    <option value="nexuspay">NexusPay (নেক্সাসপে)</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700 font-medium text-center mb-4">নিচের নম্বরে Send Money করুন:</p>
                <div className="flex flex-wrap justify-center gap-6 text-center font-mono">
                  {paymentMethodWatch === 'bkash' && settings.payment_numbers.bkash && (
                    <div>
                      <span className="block text-xs text-pink-600 font-bold uppercase mb-1">bKash</span>
                      <span className="font-bold text-slate-800">{settings.payment_numbers.bkash}</span>
                    </div>
                  )}
                  {paymentMethodWatch === 'nagad' && settings.payment_numbers.nagad && (
                    <div>
                      <span className="block text-xs text-orange-600 font-bold uppercase mb-1">Nagad</span>
                      <span className="font-bold text-slate-800">{settings.payment_numbers.nagad}</span>
                    </div>
                  )}
                  {paymentMethodWatch === 'rocket' && settings.payment_numbers.rocket && (
                    <div>
                      <span className="block text-xs text-purple-600 font-bold uppercase mb-1">Rocket</span>
                      <span className="font-bold text-slate-800">{settings.payment_numbers.rocket}</span>
                    </div>
                  )}
                  {paymentMethodWatch === 'cellfin' && settings.payment_numbers.cellfin && (
                    <div>
                      <span className="block text-xs text-blue-600 font-bold uppercase mb-1">Cellfin</span>
                      <span className="font-bold text-slate-800">{settings.payment_numbers.cellfin}</span>
                    </div>
                  )}
                  {paymentMethodWatch === 'nexuspay' && settings.payment_numbers.nexuspay && (
                    <div>
                      <span className="block text-xs text-green-600 font-bold uppercase mb-1">NexusPay</span>
                      <span className="font-bold text-slate-800">{settings.payment_numbers.nexuspay}</span>
                    </div>
                  )}
                  {!settings.payment_numbers[paymentMethodWatch as keyof typeof settings.payment_numbers] && (
                     <div className="text-slate-500 text-sm">
                        এই মাধ্যমটির নাম্বার এখনও যুক্ত করা হয়নি।
                     </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">যে নম্বর থেকে টাকা পাঠানো হয়েছে (Sender Number) <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="01XXX-XXXXXX" {...register("bKashNumber", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">ট্রানজেকশন আইডি (TrxID) <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. 9J4A9F2K" {...register("trxId", { required: true })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none font-mono uppercase" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Feedback / Comments */}
        <section className="bg-white border text-center border-slate-200 p-6 rounded-xl space-y-4">
          <label className="block text-sm font-semibold text-slate-700 md:text-left">মতামত / মন্তব্য (Feedback / Comments) - Optional</label>
          <textarea 
            {...register("feedback")} 
            rows={3} 
            placeholder="আপনার কোনো মতামত বা পরামর্শ থাকলে লিখতে পারেন..."
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none resize-none" 
          />
        </section>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-200">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">প্রসেসিং হচ্ছে... (Processing)</span>
            ) : (
              <span>সাবমিট করুন (Submit Registration)</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
