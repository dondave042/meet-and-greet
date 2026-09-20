import { Booking } from '../types';

export const mockBookings: Booking[] = [
  {
    id: 'CPM-8392-VIP',
    creatorId: 'amara-vance',
    creatorName: 'Amara Vance',
    fanName: 'Jonathan Mercer',
    fanAge: 34,
    fanCountry: 'United States',
    fanState: 'California',
    fanCity: 'San Francisco',
    fanEmail: 'j.mercer@techcorp.io',
    fanPhone: '+1 (555) 382-9921',
    fanSocials: {
      twitter: '@jmercer_sf',
      instagram: '@jonathan.mercer'
    },
    meetingType: 'dinner',
    reasonToMeet: 'I am a long-time member of Amara\'s exclusive club and would love to book a VIP dinner during the AVN Expo in Las Vegas. I want to discuss potential business collaboration for my brand and personally thank her for her incredible work. I will cover all dining costs at a Michelin-star restaurant of her choice and have arranged for a private dining room.',
    date: '2025-01-23',
    time: '19:30',
    duration: '2 Hours',
    budget: 2500,
    idVerified: true,
    idImageName: 'passport_j_mercer.png',
    selfieImageName: 'selfie_j_mercer.png',
    backgroundCheckAgreed: true,
    termsAgreed: true,
    status: 'approved',
    createdAt: '2025-01-05T14:22:00.000Z',
    notes: 'Verified VIP. Background check clear. Private room at Joel Robuchon confirmed. Security detail will accompany.',
    messages: [
      {
        id: 'msg-1',
        sender: 'security',
        text: 'Hello Jonathan, your ID verification and background check have been successfully processed and cleared. We are reviewing your venue proposal.',
        timestamp: '2025-01-05T16:45:00.000Z'
      },
      {
        id: 'msg-2',
        sender: 'creator',
        text: 'Hi Jonathan! I look forward to meeting you at Joel Robuchon in Las Vegas. I would love to hear about your collaboration ideas. See you soon!',
        timestamp: '2025-01-06T10:15:00.000Z'
      },
      {
        id: 'msg-3',
        sender: 'fan',
        text: 'Thank you so much Amara! I have finalized the booking and sent the security team the reservation details. Can\'t wait!',
        timestamp: '2025-01-06T11:30:00.000Z'
      }
    ]
  },
  {
    id: 'CPM-4710-VIP',
    creatorId: 'kaelen-rose',
    creatorName: 'Kaelen Rose',
    fanName: 'Hiroshi Tanaka',
    fanAge: 27,
    fanCountry: 'Japan',
    fanState: 'Tokyo',
    fanCity: 'Shibuya',
    fanEmail: 'tanaka.hiro@gamingjp.net',
    fanPhone: '+81 90-1234-5678',
    fanSocials: {
      twitter: '@hiro_cosplay_fan',
      onlyfans: '@hiro_supporter'
    },
    meetingType: 'convention',
    reasonToMeet: 'I am traveling to San Diego Comic-Con and would love to book a 1-on-1 photo session and autograph meet with Kaelen. I have been supporting her cosplay streams for 3 years. I want to present a custom 3D-printed replica of her main character\'s sword that I crafted, and take professional photos together at the cosplay lounge.',
    date: '2025-07-25',
    time: '14:00',
    duration: '1 Hour',
    budget: 800,
    idVerified: true,
    idImageName: 'japan_id_tanaka.png',
    selfieImageName: 'selfie_tanaka.png',
    backgroundCheckAgreed: true,
    termsAgreed: true,
    status: 'under_review',
    createdAt: '2025-01-10T08:12:00.000Z',
    notes: 'ID verified. Background check in progress. Gift item (3D sword) needs to be checked by security at the booth entrance.',
    messages: [
      {
        id: 'msg-4',
        sender: 'security',
        text: 'Hi Hiroshi, thank you for your submission. Please note that the 3D-printed sword replica must be submitted to our security booth at Comic-Con for scanning before the meeting. No metal cores are allowed.',
        timestamp: '2025-01-10T09:30:00.000Z'
      },
      {
        id: 'msg-5',
        sender: 'fan',
        text: 'Understood perfectly! It is made entirely of lightweight PLA plastic and foam, no metal parts at all. I am happy to hand it over for inspection.',
        timestamp: '2025-01-10T10:05:00.000Z'
      }
    ]
  },
  {
    id: 'CPM-9051-VIP',
    creatorId: 'leo-sterling',
    creatorName: 'Leo Sterling',
    fanName: 'Marcus Vance',
    fanAge: 42,
    fanCountry: 'United States',
    fanState: 'Texas',
    fanCity: 'Austin',
    fanEmail: 'marcus_v@vancehomes.com',
    fanPhone: '+1 (512) 998-1122',
    fanSocials: {
      instagram: '@marcus_vance_fit'
    },
    meetingType: 'cafe',
    reasonToMeet: 'I want to hire Leo for a private physical training session in my home gym. I will pay $1,500 for a 3-hour session. I want him to analyze my form, design a custom bodybuilding routine, and film a workout video for my Instagram.',
    date: '2025-03-12',
    time: '10:00',
    duration: '3 Hours',
    budget: 1500,
    idVerified: true,
    idImageName: 'texas_dl_marcus.png',
    selfieImageName: 'selfie_marcus.png',
    backgroundCheckAgreed: true,
    termsAgreed: true,
    status: 'pending',
    createdAt: '2025-01-12T19:40:00.000Z',
    notes: 'New request. Reviewing if home gym fits within safe meeting protocols. Leo usually prefers public commercial gyms or hotel fitness centers.',
    messages: []
  },
  {
    id: 'CPM-1204-VIP',
    creatorId: 'amara-vance',
    creatorName: 'Amara Vance',
    fanName: 'David Miller',
    fanAge: 19,
    fanCountry: 'United Kingdom',
    fanState: 'England',
    fanCity: 'London',
    fanEmail: 'davidmiller99@gmail.com',
    fanPhone: '+44 7911 123456',
    fanSocials: {},
    meetingType: 'custom',
    reasonToMeet: 'I want to meet Amara at her hotel room for a private party. We can hang out, drink, and have fun. I have cash.',
    date: '2025-05-18',
    time: '23:00',
    duration: 'All Night',
    budget: 5000,
    idVerified: false,
    idImageName: '',
    selfieImageName: '',
    backgroundCheckAgreed: false,
    termsAgreed: true,
    status: 'declined',
    createdAt: '2025-01-11T23:15:00.000Z',
    notes: 'Declined automatically due to safety protocol violation. Requesting meeting in hotel room, late night, and refused ID verification/background check.',
    messages: [
      {
        id: 'msg-6',
        sender: 'security',
        text: 'Your request has been declined. Aura VIP does not facilitate private hotel room meetings, overnight bookings, or bookings without full ID verification and background check clearance.',
        timestamp: '2025-01-12T08:00:00.000Z'
      }
    ]
  }
];
