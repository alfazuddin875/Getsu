import { create } from 'zustand';
import { Registration, AppSettings, Sponsor, Slide, Video, Blog, Coupon, Admin, SpecialAlumni } from './types';
import { db, auth } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

interface AppState {
  registrations: Registration[];
  settings: AppSettings;
  sponsors: Sponsor[];
  specialAlumni: SpecialAlumni[];
  slides: Slide[];
  videos: Video[];
  blogs: Blog[];
  coupons: Coupon[];
  admins: Admin[];
  isAdminAuthenticated: boolean;
  isAuthLoading: boolean;
  addRegistration: (reg: Omit<Registration, 'id' | 'status' | 'createdAt'>) => void;
  updateRegistrationStatus: (id: string, status: Registration['status']) => void;
  updateRegistrationCongratulationsUrl: (id: string, url: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setAdminAuthenticated: (status: boolean) => void;
  
  // Content Actions
  addAdmin: (email: string) => void;
  removeAdmin: (email: string) => void;
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  updateSponsor: (id: string, sponsor: Partial<Omit<Sponsor, 'id'>>) => void;
  removeSponsor: (id: string) => void;
  addSpecialAlumni: (alumni: Omit<SpecialAlumni, 'id'>) => void;
  updateSpecialAlumni: (id: string, alumni: Partial<Omit<SpecialAlumni, 'id'>>) => void;
  removeSpecialAlumni: (id: string) => void;
  addSlide: (slide: Omit<Slide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<Omit<Slide, 'id'>>) => void;
  removeSlide: (id: string) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  updateVideo: (id: string, video: Partial<Omit<Video, 'id'>>) => void;
  removeVideo: (id: string) => void;
  addBlog: (blog: Omit<Blog, 'id' | 'date'>) => void;
  updateBlog: (id: string, blog: Partial<Omit<Blog, 'id' | 'date'>>) => void;
  removeBlog: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, coupon: Partial<Omit<Coupon, 'id'>>) => void;
  removeCoupon: (id: string) => void;
  initSync: () => void;
}

const defaultSettings: AppSettings = {
  event_details: {
    name: 'প্লাটিনাম জয়ন্তী ও পুনর্মিলনী ২০২৬',
    date: '২৬-২৭ ডিসেম্বর, ২০২৬',
    venue: 'পায়রাহাট মাধ্যমিক বিদ্যালয় প্রাঙ্গণ',
    ticket_instructions: 'অনুগ্রহ করে টিকেট ডাউনলোড করে সাথে আনুন',
  },
  contact_details: {
    supportPhone: '+880 1711-000000',
    email: 'info@payrahat2026.com',
    facebookPage: 'https://facebook.com/payrahat',
    facebookGroup: 'https://facebook.com/groups/payrahat',
    whatsapp: '+8801711000000',
    googleMeet: 'https://meet.google.com/xxx-xxxx-xxx',
  },
  payment_numbers: {
    bkash: '01711223344 (Personal)',
    nagad: '01911223344 (Personal)',
    rocket: '',
    cellfin: '',
    nexuspay: '',
  },
};

export const useAppStore = create<AppState>()((set, get) => ({
  registrations: [],
  sponsors: [],
  specialAlumni: [],
  slides: [],
  videos: [],
  blogs: [],
  coupons: [],
  admins: [],
  settings: defaultSettings,
  isAdminAuthenticated: false,
  isAuthLoading: true,
  
  setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status, isAuthLoading: false }),

  addAdmin: async (email: string) => {
    try {
      await setDoc(doc(db, 'admins', email), { email, createdAt: new Date().toISOString() });
    } catch (e: any) {
      console.error("Error adding admin:", e);
      alert('Error adding admin: ' + e.message);
    }
  },
  removeAdmin: async (email: string) => {
    try {
      await deleteDoc(doc(db, 'admins', email));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting admin: ' + e.message);
    }
  },

  addSponsor: async (sponsor) => {
    const id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'sponsors', id), sponsor);
  },
  updateSponsor: async (id, sponsor) => {
    await updateDoc(doc(db, 'sponsors', id), sponsor);
  },
  removeSponsor: async (id) => {
    try {
      await deleteDoc(doc(db, 'sponsors', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting sponsor: ' + e.message);
    }
  },

  addSpecialAlumni: async (alumni) => {
    const id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'special_alumni', id), alumni);
  },
  updateSpecialAlumni: async (id, alumni) => {
    await updateDoc(doc(db, 'special_alumni', id), alumni);
  },
  removeSpecialAlumni: async (id) => {
    try {
      await deleteDoc(doc(db, 'special_alumni', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting alumni: ' + e.message);
    }
  },

  addSlide: async (slide) => {
    const id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'slides', id), slide);
  },
  updateSlide: async (id, slide) => {
    await updateDoc(doc(db, 'slides', id), slide);
  },
  removeSlide: async (id) => {
    try {
      await deleteDoc(doc(db, 'slides', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting slide: ' + e.message);
    }
  },

  addVideo: async (video) => {
    const id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'videos', id), video);
  },
  updateVideo: async (id, video) => {
    await updateDoc(doc(db, 'videos', id), video);
  },
  removeVideo: async (id) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting video: ' + e.message);
    }
  },

  addBlog: async (blog) => {
    const id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'blogs', id), { ...blog, date: new Date().toISOString() });
  },
  updateBlog: async (id, blog) => {
    await updateDoc(doc(db, 'blogs', id), blog);
  },
  removeBlog: async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting blog: ' + e.message);
    }
  },

  addCoupon: async (coupon) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'coupons', id), coupon);
    } catch (e: any) {
      console.error("Error adding coupon:", e, e.message);
      alert('Error adding coupon: ' + e.message);
    }
  },
  updateCoupon: async (id, coupon) => {
    try {
      await updateDoc(doc(db, 'coupons', id), coupon);
    } catch (e: any) {
      console.error("Error updating coupon:", e, e.message);
      alert('Error updating coupon: ' + e.message);
    }
  },
  removeCoupon: async (id) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting coupon: ' + e.message);
    }
  },

  addRegistration: async (reg) => {
    const id = reg.contact_info.phone;
    await setDoc(doc(db, 'registrations', id), {
      ...reg,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  },
  updateRegistrationStatus: async (id, status) => {
    let updateData: any = { status };
    if (status === 'approved') {
      const currentReg = get().registrations.find(r => r.id === id);
      if (currentReg && !currentReg.serialNo) {
        const maxSerial = get().registrations.reduce((max, r) => r.serialNo ? Math.max(max, r.serialNo) : max, 0);
        updateData.serialNo = maxSerial + 1;
      }
    }
    await updateDoc(doc(db, 'registrations', id), updateData);
  },
  updateRegistrationCongratulationsUrl: async (id, congratulationsUrl) => {
    await updateDoc(doc(db, 'registrations', id), { congratulationsUrl });
  },
  updateSettings: async (newSettings) => {
    await setDoc(doc(db, 'settings', 'global'), newSettings);
  },

  initSync: () => {
    // Sync settings
    onSnapshot(
      doc(db, 'settings', 'global'), 
      (docSnap) => {
        if (docSnap.exists()) {
          set({ settings: docSnap.data() as AppSettings });
        }
      },
      (error) => {
        console.error("Firestore error syncing settings:", error);
      }
    );

    // Sync public collections
    onSnapshot(collection(db, 'sponsors'), (snapshot) => {
      set({ sponsors: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sponsor)) });
    }, (error) => console.error("Firestore error syncing sponsors:", error));

    onSnapshot(collection(db, 'special_alumni'), (snapshot) => {
      set({ specialAlumni: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SpecialAlumni)) });
    }, (error) => console.error("Firestore error syncing special alumni:", error));

    onSnapshot(collection(db, 'slides'), (snapshot) => {
      set({ slides: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Slide)) });
    }, (error) => console.error("Firestore error syncing slides:", error));

    onSnapshot(collection(db, 'videos'), (snapshot) => {
      set({ videos: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Video)) });
    }, (error) => console.error("Firestore error syncing videos:", error));

    onSnapshot(collection(db, 'blogs'), (snapshot) => {
      set({ blogs: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Blog)) });
    }, (error) => console.error("Firestore error syncing blogs:", error));

    onSnapshot(collection(db, 'coupons'), (snapshot) => {
      set({ coupons: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon)) });
    }, (error) => console.error("Firestore error syncing coupons:", error));

    let unsubRegistrations: (() => void) | null = null;
    let unsubAdmins: (() => void) | null = null;

    // Read admin collections if auth changes
    auth.onAuthStateChanged(async (user) => {
      set({ isAuthLoading: true });
      
      if (unsubRegistrations) {
        unsubRegistrations();
        unsubRegistrations = null;
      }
      if (unsubAdmins) {
        unsubAdmins();
        unsubAdmins = null;
      }

      if (user) {
        try {
          await getDoc(doc(db, '_admin_verification', 'ping'));
          set({ isAdminAuthenticated: true, isAuthLoading: false });
          
          unsubRegistrations = onSnapshot(collection(db, 'registrations'), (snapshot) => {
            set({ registrations: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Registration)) });
          }, (error) => console.error("Firestore error syncing registrations:", error));

          unsubAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
            set({ admins: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Admin)) });
          }, (error) => console.error("Firestore error syncing admins:", error));
        } catch (err) {
          // Not an admin
          console.warn("User is not an admin, ignoring registrations sync", err);
          set({ isAdminAuthenticated: false, isAuthLoading: false, registrations: [], admins: [] });
        }
      } else {
        set({ isAdminAuthenticated: false, isAuthLoading: false, registrations: [], admins: [] });
      }
    });
  }
}));
