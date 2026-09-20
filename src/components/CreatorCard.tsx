import React, { useState } from 'react';
import { Creator } from '../types';
import { 
  Calendar, Star, ShieldAlert, DollarSign, Clock, Users, 
  ArrowRight, Image, Video, Eye, EyeOff, X, Play, Pause, ShieldAlert as AlertIcon
} from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onBook: (creatorId: string) => void;
  onViewRules: (creator: Creator) => void;
}

export default function CreatorCard({ creator, onBook, onViewRules }: CreatorCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [revealedMedia, setRevealedMedia] = useState<{ [key: string]: boolean }>({});
  const [playingVideo, setPlayingVideo] = useState<{ [key: string]: boolean }>({});

  const toggleReveal = (id: string) => {
    setRevealedMedia(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleVideoPlay = (id: string) => {
    setPlayingVideo(prev => ({ ...prev, [id]: !prev[id] }));
    const videoElement = document.getElementById(`video-${id}`) as HTMLVideoElement;
    if (videoElement) {
      if (playingVideo[id]) {
        videoElement.pause();
      } else {
        videoElement.play().catch(err => console.log("Video play failed:", err));
      }
    }
  };

  return (
    <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-red-500/30 transition-all duration-300 flex flex-col group hover:shadow-xl hover:shadow-red-500/5">
      {/* Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <img
          src={creator.image}
          alt={creator.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          <span className="bg-black/75 backdrop-blur-md text-red-500 border border-red-500/30 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-red-500 text-red-500" />
            Top 0.1% Creator
          </span>
          <span className="bg-black/75 backdrop-blur-md text-red-400 border border-red-500/30 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 text-red-400" />
            18+ Certified
          </span>
        </div>

        {/* Bottom overlay with name */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-black text-white font-serif tracking-wide">{creator.name}</h3>
            <p className="text-xs text-zinc-300 font-medium line-clamp-1">{creator.tagline}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-zinc-950/50 rounded-xl border border-zinc-800/60 text-center mb-4">
            <div>
              <span className="text-xs text-zinc-500 block">Meetups</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                <Users className="h-3.5 w-3.5 text-red-500" />
                {creator.stats.totalMeetups}+
              </span>
            </div>
            <div className="border-x border-zinc-800/60">
              <span className="text-xs text-zinc-500 block">Rating</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                {creator.stats.rating}
              </span>
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">Response</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                {creator.stats.responseTime}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-3">
            {creator.bio}
          </p>

          {/* Specialties */}
          <div className="mb-4">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-1.5">Preferred Meeting Types</span>
            <div className="flex flex-wrap gap-1.5">
              {creator.specialties.map((spec, i) => (
                <span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700/50">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Rates */}
          <div className="mb-4 bg-zinc-950/30 p-3 rounded-xl border border-zinc-800/40">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-2">Base Booking Rates</span>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <span className="text-[10px] text-zinc-400 block">Hourly Rate</span>
                <span className="text-xs font-bold text-red-400">${creator.rates.hourly}/hr</span>
              </div>
              <div className="border-l border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">VIP Dinner</span>
                <span className="text-xs font-bold text-red-400">${creator.rates.VIPDinner}</span>
              </div>
              <div className="border-l border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Day Event</span>
                <span className="text-xs font-bold text-red-400">${creator.rates.event}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Appearances */}
          {creator.upcomingEvents.length > 0 && (
            <div className="mb-6 bg-red-500/5 border border-red-500/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Next Confirmed Appearance</span>
              </div>
              <div className="text-xs">
                <div className="text-white font-semibold">{creator.upcomingEvents[0].name}</div>
                <div className="text-zinc-400 text-[11px] flex justify-between mt-0.5">
                  <span>{creator.upcomingEvents[0].date}</span>
                  <span>{creator.upcomingEvents[0].location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-2">
          {/* Gallery Trigger Button */}
          <button
            onClick={() => setShowGallery(true)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Image className="h-3.5 w-3.5" />
            View Premium 18+ Portfolio ({creator.gallery.length})
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onViewRules(creator)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition border border-zinc-700/50"
            >
              Guidelines
            </button>
            <button
              onClick={() => onBook(creator.id)}
              className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 text-white hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              Request Meetup
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Premium 18+ Gallery */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80">
              <div>
                <h3 className="text-xl font-serif font-black text-white flex items-center gap-2">
                  <AlertIcon className="h-5 w-5 text-red-600 animate-pulse" />
                  {creator.name} — Premium 18+ Content Portfolio
                </h3>
                <p className="text-xs text-zinc-400">Explicit content for verified 18+ members only. Click blurred images to reveal.</p>
              </div>
              <button 
                onClick={() => setShowGallery(false)}
                className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {creator.gallery.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-zinc-500 text-xs italic">
                  No portfolio files uploaded yet.
                </div>
              ) : (
                creator.gallery.map((item) => {
                  const isExplicit = item.isAdult;
                  const isRevealed = revealedMedia[item.id] || !isExplicit;
                  const isPlaying = playingVideo[item.id];

                  return (
                    <div 
                      key={item.id} 
                      className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden flex flex-col text-left relative group"
                    >
                      {/* Media Container */}
                      <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className={`w-full h-full object-cover transition duration-300 ${
                              isRevealed ? 'blur-0 scale-100' : 'blur-2xl scale-110'
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full relative">
                            <video
                              id={`video-${item.id}`}
                              src={item.url}
                              loop
                              muted
                              playsInline
                              className={`w-full h-full object-cover transition duration-300 ${
                                isRevealed ? 'blur-0' : 'blur-2xl'
                              }`}
                            />
                            {isRevealed && (
                              <button
                                onClick={() => toggleVideoPlay(item.id)}
                                className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black/80 border border-red-600/30 flex items-center justify-center text-red-500 hover:scale-105 transition"
                              >
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-red-500 ml-0.5" />}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Blur Overlay Shield */}
                        {!isRevealed && (
                          <div 
                            onClick={() => toggleReveal(item.id)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-black/50 transition"
                          >
                            <EyeOff className="h-8 w-8 text-red-600 mb-2 animate-bounce" />
                            <span className="text-xs font-black text-red-500 tracking-wider uppercase block">
                              18+ EXPLICIT MEDIA
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-1 block">
                              Click to verify age & reveal content
                            </span>
                          </div>
                        )}

                        {/* Revealed controls overlay */}
                        {isExplicit && isRevealed && (
                          <button
                            onClick={() => toggleReveal(item.id)}
                            className="absolute top-2.5 right-2.5 p-1.5 bg-black/80 rounded-lg text-zinc-400 hover:text-white transition"
                            title="Blur content"
                          >
                            <Eye className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>

                      {/* Info Panel */}
                      <div className="p-4 space-y-1 bg-zinc-950/40 border-t border-zinc-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold tracking-wider text-red-500 uppercase">
                            {item.category}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-500 flex items-center gap-1">
                            {item.type === 'image' ? <Image className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-white text-sm truncate">{item.title}</h4>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 text-center">
              <button
                onClick={() => setShowGallery(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-6 rounded-xl transition"
              >
                Close Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
