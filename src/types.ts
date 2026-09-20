export interface Creator {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  image: string;
  rates: {
    hourly: number;
    event: number;
    VIPDinner: number;
  };
  specialties: string[];
  upcomingEvents: {
    name: string;
    date: string;
    location: string;
  }[];
  boundaries: string[];
  stats: {
    totalMeetups: number;
    rating: number;
    responseTime: string;
  };
  gallery: {
    id: string;
    type: 'image' | 'video';
    url: string;
    title: string;
    category: string;
    isAdult: boolean;
  }[];
}

export interface Booking {
  id: string;
  creatorId: string;
  creatorName: string;
  fanName: string;
  fanAge: number;
  fanCountry: string;
  fanState: string;
  fanCity: string;
  fanEmail: string;
  fanPhone: string;
  fanSocials: {
    twitter?: string;
    instagram?: string;
    onlyfans?: string;
  };
  meetingType: 'convention' | 'dinner' | 'lounge' | 'cafe' | 'appearance' | 'custom' | 'content_shoot' | 'fetish_session';
  reasonToMeet: string;
  date: string;
  time: string;
  duration: string;
  budget: number;
  idVerified: boolean;
  idImageName: string;
  selfieImageName: string;
  backgroundCheckAgreed: boolean;
  termsAgreed: boolean;
  status: 'pending' | 'id_verified' | 'bg_checked' | 'under_review' | 'approved' | 'declined';
  createdAt: string;
  notes: string;
  messages: {
    id: string;
    sender: 'creator' | 'fan' | 'security';
    text: string;
    timestamp: string;
  }[];
}

export interface FanProfile {
  name: string;
  age: number;
  country: string;
  state: string;
  city: string;
  profilePicture: string; // Base64 data URL or stock URL
  email: string;
  password?: string;
}
