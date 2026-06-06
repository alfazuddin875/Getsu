export type Status = 'pending' | 'approved' | 'rejected';
export type Role = 'admin' | 'user';

export interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Slide {
  id: string;
  imageUrl: string;
  title: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  imageUrl?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface Admin {
  id: string; // which is the email
  email: string;
  createdAt?: string;
}

export interface SpecialAlumni {
  id?: string;
  name: string;
  designation: string;
  batch: string;
  imageUrl?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountAmount: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface Registration {
  id: string;
  status: Status;
  personal_info: {
    fullName: string;
    fathersName: string;
    mothersName: string;
    dob: string;
    bloodGroup: string;
    religion: string;
    sscBatch: string;
    occupation: string;
  };
  contact_info: {
    phone: string;
    whatsapp: string;
    email: string;
    presentAddress: string;
    permanentAddress: string;
  };
  studentType: 'alumni' | 'current';
  studentClass?: string;
  studentSession?: string;
  studentRoll?: string;
  feedback?: string;
  tshirt_size: string;
  photo_url: string;
  guests: Guest[];
  payment: {
    totalAmount: number;
    paymentMethod: string;
    bKashNumber: string;
    trxId: string;
    couponCode?: string;
    discountAmount?: number;
  };
  createdAt: string;
  serialNo?: number;
  congratulationsUrl?: string;
}

export interface Guest {
  id?: string;
  relation: string;
  fee: number;
  tshirt: string;
}

export interface AppSettings {
  event_details: {
    name: string;
    date: string;
    venue: string;
    ticket_instructions: string;
    logoUrl?: string;
    bannerUrl?: string;
    cardTemplateUrl?: string;
  };
  contact_details: {
    supportPhone: string;
    email: string;
    facebookPage: string;
    facebookGroup?: string;
    whatsapp?: string;
    googleMeet?: string;
  };
  payment_numbers: {
    bkash: string;
    nagad: string;
    rocket: string;
    cellfin: string;
    nexuspay: string;
  };
}
