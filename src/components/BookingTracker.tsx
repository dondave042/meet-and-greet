import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { creators } from '../data/creators';
import { 
  Search, Shield, MapPin, Calendar, Clock, DollarSign, 
  MessageSquare, Send, CheckCircle2, AlertTriangle, AlertCircle, 
  Download, QrCode, Clipboard, Check, Lock, ShieldCheck
} from 'lucide-react';

interface BookingTrackerProps {
  bookings: Booking[];
  preselectedBookingId?: string;
  onAddMessage: (bookingId: string, sender: 'fan', text: string) => void;
}

export default function BookingTracker({ bookings, preselectedBookingId, onAddMessage }: BookingTrackerProps) {
  const [searchId, setSearchId] = useState(preselectedBookingId || '');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Search booking when ID changes or is preselected
  useEffect(() => {
    if (searchId) {
      const found = bookings.find(b => b.id.toUpperCase().trim() === searchId.toUpperCase().trim());
      setActiveBooking(found || null);
    } else {
      setActiveBooking(null);
    }
  }, [searchId, bookings]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = bookings.find(b => b.id.toUpperCase().trim() === searchId.toUpperCase().trim());
    setActiveBooking(found || null);
    if (!found) {
      alert("Booking ID not found. Please check the spelling (e.g. CPM-8392-VIP).");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeBooking) return;

    // We pass the actual string in App.tsx, but here we trigger the state update
    onAddMessage(activeBooking.id, 'fan', chatMessage);
    setChatMessage('');
  };

  const handleCopyId = () => {
    if (activeBooking) {
      navigator.clipboard.writeText(activeBooking.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Find the creator associated with the active booking
  const activeCreator = activeBooking 
    ? creators.find(c => c.id === activeBooking.creatorId) 
    : null;

  // Determine stage index
  // pending -> under_review -> approved/declined
  const getStageIndex = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 1;
      case 'id_verified': return 2;
      case 'bg_checked': return 3;
      case 'under_review': return 4;
      case 'approved': return 5;
      case 'declined': return -1;
      default: return 1;
    }
  };

  const currentStage = activeBooking ? getStageIndex(activeBooking.status) : 1;

  const timelineSteps = [
    { label: 'Submitted', desc: 'Meetup request registered in Aura secure ledger.' },
    { label: 'ID Verified', desc: 'Government-issued ID checked for 18+ compliance.' },
    { label: 'Background Check', desc: 'Standard criminal & safety vetting completed.' },
    { label: 'Creator Review', desc: 'Creator evaluates proposal, details, and itinerary.' },
    { label: 'Scheduled', desc: 'Meetup approved. Escrow locked. Co-ordinates shared.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-xl font-serif font-black text-white">Track Your Booking Status</h2>
          <p className="text-xs text-zinc-400">
            Enter your secure Booking ID (e.g. <span className="font-mono text-amber-500">CPM-8392-VIP</span>) to view real-time safety vetting progress and communicate with security.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Enter Booking ID (CPM-XXXX-VIP)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold text-xs px-5 rounded-xl hover:opacity-90 transition"
          >
            Lookup
          </button>
        </form>
      </div>

      {activeBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Progress Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 space-y-6">
              {/* Header with Creator */}
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  {activeCreator && (
                    <img
                      src={activeCreator.image}
                      alt={activeCreator.name}
                      className="h-12 w-12 rounded-full object-cover border border-zinc-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop`;
                      }}
                    />
                  )}
                  <div>
                    <h3 className="font-serif font-bold text-white">Booking with {activeBooking.creatorName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-mono text-amber-500 font-bold">{activeBooking.id}</span>
                      <button
                        onClick={handleCopyId}
                        className="text-zinc-500 hover:text-white transition"
                        title="Copy ID"
                      >
                        {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Escrow Budget</span>
                  <span className="text-sm font-black text-amber-400">${activeBooking.budget}</span>
                </div>
              </div>

              {/* Status Warning Banner */}
              {activeBooking.status === 'declined' ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-3 items-start text-left">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Booking Request Declined</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      This request has been flagged or declined by the security team or the creator. Typical reasons include safety protocol failures, lack of valid ID, or scheduling conflicts. Your escrow deposit has been released back to your payment method.
                    </p>
                  </div>
                </div>
              ) : activeBooking.status === 'approved' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 items-start text-left">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Booking Confirmed & Active</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      Your meetup is officially approved! Your digital pass has been generated. Please download your verified pass below and review the safety coordinates. Keep your Booking ID strictly private.
                    </p>
                    <button
                      onClick={() => setShowPass(true)}
                      className="mt-3 bg-emerald-500 text-black text-xs font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition flex items-center gap-1"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      View Verified Meet Pass
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex gap-3 items-start text-left">
                  <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Vetting Process In Progress</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      Our secure system is currently verifying your identity and conducting a standard public safety background check. The creator will review your proposal as soon as background check returns green.
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Tracker (Timeline) */}
              {activeBooking.status !== 'declined' && (
                <div className="space-y-6 pt-2 text-left">
                  <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block">Vetting Timeline</span>
                  <div className="relative pl-6 border-l border-zinc-800 space-y-6 ml-3">
                    {timelineSteps.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = currentStage >= stepNum || (activeBooking.status === 'approved' && stepNum === 5);
                      const isCurrent = currentStage === stepNum && activeBooking.status !== 'approved';

                      return (
                        <div key={idx} className="relative">
                          {/* Circle Indicator */}
                          <div className={`absolute -left-[31px] top-0 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : isCurrent
                              ? 'bg-amber-500 border-amber-500 text-black animate-pulse'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            ) : (
                              <span className="text-[8px] font-black">{stepNum}</span>
                            )}
                          </div>

                          {/* Step Text */}
                          <div>
                            <h4 className={`text-xs font-bold ${isCompleted ? 'text-white' : isCurrent ? 'text-amber-400' : 'text-zinc-500'}`}>
                              {step.label}
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Meeting Details Summary Card */}
              <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-4 space-y-3 text-left text-xs">
                <span className="text-[9px] font-extrabold tracking-wider text-zinc-500 uppercase block">Registered Itinerary Parameters</span>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Meeting City</span>
                      <span className="text-white font-semibold">{activeBooking.fanCity}, {activeBooking.fanState}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Date</span>
                      <span className="text-white font-semibold">{activeBooking.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Time & Duration</span>
                      <span className="text-white font-semibold">{activeBooking.time} ({activeBooking.duration})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Format & Escrow</span>
                      <span className="text-white font-semibold capitalize">{activeBooking.meetingType} / ${activeBooking.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Reason to meet */}
                <div className="pt-3 border-t border-zinc-900">
                  <span className="text-[9px] text-zinc-500 block font-bold uppercase mb-1">Your Submission Statement</span>
                  <p className="text-[11px] text-zinc-400 italic line-clamp-3 leading-relaxed">
                    "{activeBooking.reasonToMeet}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Communication/Chat (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col h-full">
              <div className="bg-zinc-950/40 px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Vetting Chat</span>
                </div>
                <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-rose-400">
                  <Lock className="h-2.5 w-2.5" />
                  Encrypted
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[400px] min-h-[300px] bg-zinc-950/10 text-xs">
                {activeBooking.messages.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 italic">
                    No communication logs found. Your security detail will reach out if additional verification is needed.
                  </div>
                ) : (
                  activeBooking.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'fan' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          msg.sender === 'creator' 
                            ? 'text-amber-400' 
                            : msg.sender === 'security' 
                            ? 'text-rose-400' 
                            : 'text-zinc-500'
                        }`}>
                          {msg.sender === 'creator' ? activeBooking.creatorName : msg.sender === 'security' ? 'Security' : 'You (Fan)'}
                        </span>
                        <span className="text-[8px] text-zinc-600">
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl leading-relaxed ${
                        msg.sender === 'fan'
                          ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                          : msg.sender === 'security'
                          ? 'bg-rose-950/30 text-rose-200 border border-rose-900/40 rounded-tl-none'
                          : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Compose */}
              <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950/40 border-t border-zinc-900 flex gap-2">
                <input
                  type="text"
                  placeholder={activeBooking.status === 'declined' ? "Chat disabled" : "Type a secure message..."}
                  disabled={activeBooking.status === 'declined'}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={activeBooking.status === 'declined' || !chatMessage.trim()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-xl transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/20 rounded-2xl border border-zinc-850 p-12 text-center text-zinc-500 text-sm flex flex-col items-center justify-center">
          <Shield className="h-12 w-12 text-zinc-800 mb-3" />
          <p className="font-bold text-white mb-1">No Active Booking Loaded</p>
          <p className="text-xs max-w-sm mx-auto">
            Please enter your Booking ID in the search box above to inspect status, chat with security, and retrieve your Meet Pass.
          </p>
        </div>
      )}

      {/* POPUP: Verified Meet Pass Modal */}
      {showPass && activeBooking && activeBooking.status === 'approved' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-amber-500/5 animate-in zoom-in-95 duration-200">
            {/* Hologram Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Pass Header */}
            <div className="border-b border-zinc-900 pb-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-amber-500 block">CPM VIP MEETINGS</span>
              <h3 className="text-lg font-serif font-black text-white mt-1">VERIFIED MEETING PASS</h3>
            </div>

            {/* QR Code & ID */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl inline-block border-4 border-amber-500">
                <QrCode className="h-32 w-32 text-black" />
              </div>
              <div className="font-mono text-sm font-black text-amber-400 tracking-wider">
                {activeBooking.id}
              </div>
            </div>

            {/* Pass details */}
            <div className="text-left bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Creator:</span>
                <span className="text-white font-bold">{activeBooking.creatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Fan:</span>
                <span className="text-white font-bold">{activeBooking.fanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Scheduled:</span>
                <span className="text-white font-bold">{activeBooking.date} @ {activeBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Location:</span>
                <span className="text-emerald-400 font-bold">Revealed via secure chat</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 mt-1">
                <span className="text-zinc-500">Security Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 fill-emerald-400 text-zinc-950" />
                  CLEARED
                </span>
              </div>
            </div>

            {/* Pass Warning */}
            <p className="text-[9px] text-zinc-500 leading-relaxed">
              This pass is non-transferable. Physical ID matching your submitted profile is required at the security checkpoint. Do not share this pass or QR code.
            </p>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition border border-zinc-800 flex items-center justify-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Print Pass
              </button>
              <button
                onClick={() => setShowPass(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:opacity-90 transition"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
