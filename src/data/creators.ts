import { Creator } from '../types';

export const creators: Creator[] = [
  {
    id: 'amara-vance',
    name: 'Amara Vance',
    tagline: 'Premium Content Creator & Multi-Award Winning Entertainer',
    bio: 'Amara is an internationally acclaimed adult performer, content creator, and entrepreneur. Known for her elegant style and captivating presence, she has built a massive global fanbase over her 6-year career. Amara loves meeting her VIP supporters in secure, upscale environments to share conversations, business networking, or memorable dinners.',
    image: '/images/creator1.png',
    rates: {
      hourly: 500,
      event: 3500,
      VIPDinner: 1500,
    },
    specialties: ['Luxury Dining', 'Business Mentorship', 'Convention VIP Meetups', 'Private Content Shoots'],
    upcomingEvents: [
      { name: 'AVN Expo 2025', date: 'Jan 22-25, 2025', location: 'Las Vegas, NV' },
      { name: 'Exxxotica Expo Chicago', date: 'April 11-13, 2025', location: 'Chicago, IL' },
      { name: 'Aura Premium VIP Dinner Event', date: 'May 18, 2025', location: 'Miami, FL' }
    ],
    boundaries: [
      'Strictly professional and platonic public/semi-private meetups only.',
      'No physical contact beyond a polite hug, handshake, or posed photo.',
      'No unauthorized photography or recording during private discussions.',
      'Security escort will be present at all high-profile or private venue bookings.'
    ],
    stats: {
      totalMeetups: 142,
      rating: 4.98,
      responseTime: '< 4 hours'
    },
    gallery: [
      {
        id: 'amara-g1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        title: 'Behind the Scenes: Red Lingerie Shoot',
        category: 'Lingerie / Solo',
        isAdult: true
      },
      {
        id: 'amara-g2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop',
        title: 'Exclusive Studio Portrait',
        category: 'Sensual',
        isAdult: false
      },
      {
        id: 'amara-g3',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-in-neon-light-40176-large.mp4',
        title: 'Teaser: Neon Light Solo Session',
        category: 'Hardcore Teaser',
        isAdult: true
      },
      {
        id: 'amara-g4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        title: 'AVN Awards Red Carpet Dress',
        category: 'Red Carpet',
        isAdult: false
      }
    ]
  },
  {
    id: 'kaelen-rose',
    name: 'Kaelen Rose',
    tagline: 'Top 0.1% Cosplay Creator & Interactive Streamer',
    bio: 'Kaelen is a dynamic content creator, streamer, and professional cosplayer. Combining her love for anime, gaming, and alternative fashion, she has taken the digital entertainment world by storm. Kaelen is energetic, friendly, and incredibly passionate about her community. Meet Kaelen at major comic conventions, gaming expos, or exclusive cafe dates.',
    image: '/images/creator2.png',
    rates: {
      hourly: 400,
      event: 2800,
      VIPDinner: 1200,
    },
    specialties: ['Cosplay Photo Sessions', 'Gaming Convention VIP', 'Cafe Meet & Greets', 'Fetish & BDSM Sessions'],
    upcomingEvents: [
      { name: 'San Diego Comic-Con', date: 'July 24-27, 2025', location: 'San Diego, CA' },
      { name: 'TwitchCon 2025', date: 'Sept 19-21, 2025', location: 'San Diego, CA' },
      { name: 'Exxxotica New Jersey', date: 'Oct 24-26, 2025', location: 'Edison, NJ' }
    ],
    boundaries: [
      'All bookings must take place in pre-approved public or convention spaces.',
      'No unsolicited gifts (all gifts must be scanned by security).',
      'Cosplay outfits are not consent. Respectful distance must be maintained.',
      'No stalking, following, or unscheduled visits to hotel rooms.'
    ],
    stats: {
      totalMeetups: 89,
      rating: 5.0,
      responseTime: '< 2 hours'
    },
    gallery: [
      {
        id: 'kaelen-g1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
        title: 'Naughty Maid Cosplay Shoot',
        category: 'Cosplay / 18+',
        isAdult: true
      },
      {
        id: 'kaelen-g2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
        title: 'Playful Pink Hair Portrait',
        category: 'Casual',
        isAdult: false
      },
      {
        id: 'kaelen-g3',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-woman-posing-with-a-retro-look-40097-large.mp4',
        title: 'Video Teaser: Cyberpunk Latex Session',
        category: 'Fetish / Latex Teaser',
        isAdult: true
      }
    ]
  },
  {
    id: 'leo-sterling',
    name: 'Leo Sterling',
    tagline: 'Award-Winning Fitness Model & Male Entertainer',
    bio: 'Leo is a prominent male adult entertainer, fitness model, and wellness coach. With a background in competitive sports and athletic training, Leo brings charisma, professionalism, and high energy to all his public appearances and fan meetups. Book Leo for fitness consultations, convention signings, VIP mixers, or personal appearances.',
    image: '/images/creator3.png',
    rates: {
      hourly: 450,
      event: 3000,
      VIPDinner: 1300,
    },
    specialties: ['Fitness Coaching & Audits', 'Convention Signings', 'VIP Mixers', 'Private Content Collaborations'],
    upcomingEvents: [
      { name: 'AVN Expo 2025', date: 'Jan 22-25, 2025', location: 'Las Vegas, NV' },
      { name: 'Mr. Olympia Expo', date: 'Oct 10-12, 2025', location: 'Las Vegas, NV' },
      { name: 'Aura VIP London Meetup', date: 'Nov 14, 2025', location: 'London, UK' }
    ],
    boundaries: [
      'Professional demeanor is mandatory at all times.',
      'No drug use or excessive drinking permitted during bookings.',
      'No filming or streaming of the meeting without prior written consent and contract.',
      'All meeting locations must be verified by management 48 hours in advance.'
    ],
    stats: {
      totalMeetups: 64,
      rating: 4.95,
      responseTime: '< 6 hours'
    },
    gallery: [
      {
        id: 'leo-g1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
        title: 'Shirtless Studio Workout',
        category: 'Athletic / Male Solo',
        isAdult: true
      },
      {
        id: 'leo-g2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
        title: 'Suit & Tie Premium Look',
        category: 'Formal',
        isAdult: false
      },
      {
        id: 'leo-g3',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-with-athletic-body-posing-34304-large.mp4',
        title: 'Video Teaser: Shower Body Oil Session',
        category: 'Male Solo / Explicit Teaser',
        isAdult: true
      }
    ]
  }
];
