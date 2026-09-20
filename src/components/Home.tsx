import React, { useState } from 'react';
import { Creator } from '../types';
import CreatorCard from './CreatorCard';
import { 
  ShieldCheck, ShieldAlert, Lock, HeartHandshake, Users, 
  Sparkles, Star, ArrowRight, Shield, Award, CalendarClock, CreditCard,
  Video, Play, Pause, EyeOff, Eye, User
} from 'lucide-react';

interface HomeProps {
  creators: Creator[];
  setActiveTab: (tab: string) => void;
  setPreselectedCreatorId: (id: string) => void;
  onViewRules: (creator: Creator) => void;
}

export default function Home({ creators, setActiveTab, setPreselectedCreatorId, onViewRules }: HomeProps) {
  const [revealedClips, setRevealedClips] = useState<{ [key: string]: boolean }>({});
  const [playingClips, setPlayingClips] = useState<{ [key: string]: boolean }>({});

  const handleBookCreator = (creatorId: string) => {
    setPreselectedCreatorId(creatorId);
    setActiveTab('book');
  };

  const toggleRevealClip = (id: string) => {
    setRevealedClips(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlayClip = (id: string) => {
    setPlayingClips(prev => ({ ...prev, [id]: !prev[id] }));
    const video = document.getElementById(`clip-${id}`) as HTMLVideoElement;
    if (video) {
      if (playingClips[id]) {
        video.pause();
      } else {
        video.play().catch(err => console.log("Video play failed:", err));
      }
    }
  };

  // Collect all real videos uploaded by the admin across all creators
  const adminVideos = creators.flatMap(creator => 
    creator.gallery
      .filter(item => item.type === 'video')
      .map(item => ({
        id: item.id,
        url: item.url,
        title: item.title,
        category: item.category,
        isAdult: item.isAdult,
        creatorName: creator.name,
        creatorId: creator.id,
        creatorImage: creator.image
      }))
  );

  // Fallback mock videos to ensure we always have exactly 8 items (4 rows x 2 columns)
  const fallbackVideos = [
    {
      id: 'mock-v1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-in-neon-light-40176-large.mp4',
      title: 'Neon Lingerie Studio Loop',
      category: 'Solo / Neon',
      isAdult: true,
      creatorName: 'Amara Vance',
      creatorId: 'amara-vance',
      creatorImage: '/images/creator1.png'
    },
    {
      id: 'mock-v2',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-woman-posing-with-a-retro-look-40097-large.mp4',
      title: 'Latex Cyberpunk Session',
      category: 'Fetish / Latex',
      isAdult: true,
      creatorName: 'Kaelen Rose',
      creatorId: 'kaelen-rose',
      creatorImage: '/images/creator2.png'
    },
    {
      id: 'mock-v3',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-with-athletic-body-posing-34304-large.mp4',
      title: 'Athletic Shower Teaser',
      category: 'Male Solo / Wet',
      isAdult: true,
      creatorName: 'Leo Sterling',
      creatorId: 'leo-sterling',
      creatorImage: '/images/creator3.png'
    },
    {
      id: 'mock-v4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-front-of-a-mirror-41641-large.mp4',
      title: 'Behind the Scenes: Mirror Check',
      category: 'Sensual / BTS',
      isAdult: false,
      creatorName: 'Amara Vance',
      creatorId: 'amara-vance',
      creatorImage: '/images/creator1.png'
    },
    {
      id: 'mock-v5',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-with-makeup-posing-in-a-studio-41639-large.mp4',
      title: 'Close-Up Sensual Portrait',
      category: 'Sensual',
      isAdult: false,
      creatorName: 'Kaelen Rose',
      creatorId: 'kaelen-rose',
      creatorImage: '/images/creator2.png'
    },
    {
      id: 'mock-v6',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-leather-jacket-34301-large.mp4',
      title: 'Leather Jacket Fetish Shoot',
      category: 'Fetish / Leather',
      isAdult: false,
      creatorName: 'Leo Sterling',
      creatorId: 'leo-sterling',
      creatorImage: '/images/creator3.png'
    },
    {
      id: 'mock-v7',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-dancing-woman-in-a-dark-room-41642-large.mp4',
      title: 'Exclusive Hotel VIP Dance',
      category: 'Solo Loop',
      isAdult: true,
      creatorName: 'Amara Vance',
      creatorId: 'amara-vance',
      creatorImage: '/images/creator1.png'
    },
    {
      id: 'mock-v8',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-colorful-neon-lights-40177-large.mp4',
      title: 'Maid Cosplay Teaser Loop',
      category: 'Cosplay / 18+',
      isAdult: true,
      creatorName: 'Kaelen Rose',
      creatorId: 'kaelen-rose',
      creatorImage: '/images/creator2.png'
    }
  ];

  // Merge admin-uploaded videos and fallback videos to form a perfect list of exactly 8 items (4x2 grid)
  const displayVideos = [...adminVideos, ...fallbackVideos].slice(0, 8);

  const steps = [
    {
      icon: Users,
      title: '1. Select Creator',
      desc: 'Browse our roster of elite, verified adult creators and select who you would love to meet.'
    },
    {
      icon: ShieldAlert,
      title: '2. Submit Safety Profile',
      desc: 'Fill out our secure form including your name, age, location, reason to meet, and ID verification.'
    },
    {
      icon: Lock,
      title: '3. Pass Vetting',
      desc: 'Our security team conducts a standard background check and verifies your 18+ legal status.'
    },
    {
      icon: CalendarClock,
      title: '4. Secure Escrow & Meet',
      desc: 'Once approved, deposit funds into escrow. Meet safely with professional security nearby.'
    }
  ];

  return (
    <div className="space-y-20 text-left">
      {/* Hero Section */}
      <div className="relative py-12 md:py-24 overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900/40 to-zinc-950 border border-zinc-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-72 w-72 rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold text-amber-500">
            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            The Gold Standard in Creator-Fan Meetups
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-white leading-[1.15]">
            Meet Your Favorite Creators,{' '}
            <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
              Safely & Securely
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Charlotte Prestige Management provides an ultra-secure, encrypted booking platform for high-profile adult film stars and content creators to meet their top supporters. Featuring mandatory 18+ ID check, full background screening, escrow protection, and physical security.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => {
                setPreselectedCreatorId(creators.length > 0 ? creators[0].id : '');
                setActiveTab('book');
              }}
              className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/15 cursor-pointer"
            >
              Book VIP Meetup
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm py-3.5 px-8 rounded-xl border border-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="h-4 w-4 text-amber-500" />
              Track Booking Status
            </button>
          </div>

          {/* Quick Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-zinc-900/60 text-xs">
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="trust-badge-text">18+ ID Verified</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Lock className="h-4 w-4 text-amber-500" />
              <span className="trust-badge-text">Encrypted Data</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <CreditCard className="h-4 w-4 text-rose-500" />
              <span className="trust-badge-text">Escrow Security</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="trust-badge-text">Vetted Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Charlotte Prestige Live Teasers & Short Clips (4 Rows, 2 Columns of Mini Boxes) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-black text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600 animate-pulse" />
              Charlotte Prestige Live Teasers &amp; Short Clips
            </h2>
            <p className="text-xs text-zinc-400">
              Exclusive short clips and loops uploaded by creator managements. Blur active for public compliance.
            </p>
          </div>
          <span className="bg-red-600 text-[10px] font-extrabold text-white px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10 shadow animate-pulse">
            18+ Explicit Live Feed
          </span>
        </div>

        {/* 4 Columns x 2 Rows Grid of Mini Boxes - 1:1 Square Micro Card View (Extra Compact Size) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
          {displayVideos.map((clip) => {
            const isExplicit = clip.isAdult;
            const isRevealed = revealedClips[clip.id] || !isExplicit;
            const isPlaying = playingClips[clip.id];

            return (
              <div 
                key={clip.id} 
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg overflow-hidden flex flex-col hover:border-red-500/30 hover:shadow-md hover:shadow-red-600/5 transition-all duration-300 p-1"
              >
                {/* Top: Video Mini Box Shape (1:1 Square aspect-square) */}
                <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center rounded-md">
                  <video
                    id={`clip-${clip.id}`}
                    src={clip.url}
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition duration-300 ${
                      isRevealed ? 'blur-0' : 'blur-xl scale-110'
                    }`}
                  />

                  {/* 18+ Blur Overlay Shield */}
                  {!isRevealed && (
                    <div 
                      onClick={() => toggleRevealClip(clip.id)}
                      className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/60 transition"
                    >
                      <EyeOff className="h-4 w-4 text-red-600 mb-0.5" />
                      <span className="text-[7px] font-black text-red-500 uppercase block tracking-wider">
                        18+ Explicit
                      </span>
                    </div>
                  )}

                  {/* Play/Pause overlay controls if revealed */}
                  {isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                      <button
                        type="button"
                        onClick={() => togglePlayClip(clip.id)}
                        className="h-6 w-6 rounded-full bg-black/80 border border-red-600/30 flex items-center justify-center text-red-500 hover:scale-105 transition shadow-lg"
                      >
                        {isPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5 fill-red-500 ml-0.5" />}
                      </button>
                    </div>
                  )}

                  {/* Blur content toggle */}
                  {isExplicit && isRevealed && (
                    <button
                      onClick={() => toggleRevealClip(clip.id)}
                      className="absolute top-1 right-1 p-0.5 bg-black/80 rounded text-[8px] text-red-500 hover:text-white transition shadow"
                      title="Blur clip"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Bottom: Details & Quick Actions */}
                <div className="pt-1 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center text-[7px]">
                      <span className="font-extrabold text-red-500 uppercase tracking-wider truncate max-w-[80px]">
                        {clip.category}
                      </span>
                      <span className="font-bold text-zinc-500 uppercase shrink-0">
                        1:1 Loop
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-white text-[9px] line-clamp-1 leading-none">
                      {clip.title}
                    </h4>
                    
                    {/* Creator avatar & name */}
                    <div className="flex items-center gap-1 pt-0.5">
                      <img 
                        src={clip.creatorImage} 
                        alt={clip.creatorName} 
                        className="h-3 w-3 rounded-full object-cover border border-red-600 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop`;
                        }}
                      />
                      <span className="text-[7px] text-zinc-400 font-bold truncate">
                        {clip.creatorName}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-1 border-t border-zinc-800/40 mt-1">
                    <button
                      onClick={() => handleBookCreator(clip.creatorId)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-[7px] font-extrabold py-0.5 rounded transition flex items-center justify-center gap-0.5 cursor-pointer shadow-sm"
                    >
                      Book Meetup
                      <ArrowRight className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet the Stars Section */}
      <div id="creators" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif font-black text-white tracking-wide">Featured Creator Roster</h2>
          <p className="text-xs text-zinc-400">
            Select a creator below to view their biography, specialties, rates, specific boundary guidelines, and request a meeting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onBook={handleBookCreator}
              onViewRules={onViewRules}
            />
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-zinc-900/20 rounded-2xl border border-zinc-850 p-8 md:p-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-serif font-black text-white">How the Booking Process Works</h2>
          <p className="text-xs text-zinc-400">
            We operate with the highest standards of safety, discretion, and legal compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl space-y-3">
                <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-lg inline-block">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-white">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creator Testimonial Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-zinc-900 p-8 rounded-2xl">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
            <Star className="h-3 w-3 fill-amber-500" />
            Creator Endorsement
          </div>
          <h3 className="text-2xl font-serif font-black text-white">"Charlotte Prestige completely changed how I interact with my fans."</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            "Before Charlotte Prestige, meeting fans at conventions or arranging business dinners was stressful and felt unsafe. The ID vetting and background check system weeds out bad actors immediately. The security escorts and escrow protection give me total peace of mind so I can focus on building genuine connections."
          </p>
          <div>
            <span className="text-xs font-bold text-white block">Amara Vance</span>
            <span className="text-[10px] text-zinc-500">Premium Content Creator & Multi-Award Winner</span>
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
          <img 
            src="/images/creator1.png" 
            alt="Amara Vance" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4 fill-emerald-400 text-zinc-950" />
            Charlotte Prestige Safety Certified Profile
          </div>
        </div>
      </div>
    </div>
  );
}
