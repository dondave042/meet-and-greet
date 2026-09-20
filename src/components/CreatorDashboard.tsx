import React, { useState } from 'react';
import { Booking, Creator } from '../types';
import { creators } from '../data/creators';
import { 
  Users, CheckCircle, XCircle, Clock, DollarSign, Search, Filter, 
  MapPin, Eye, ShieldCheck, ShieldAlert, MessageSquare, Save, ChevronRight, 
  Settings, Calendar, UserCheck, Trash2
} from 'lucide-react';

interface CreatorDashboardProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: Booking['status'], notes?: string) => void;
  onAddMessage: (bookingId: string, sender: 'creator' | 'security', text: string) => void;
  onDeleteBooking?: (bookingId: string) => void;
}

export default function CreatorDashboard({ bookings, onUpdateBookingStatus, onAddMessage, onDeleteBooking }: CreatorDashboardProps) {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(creators[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    bookings.length > 0 ? bookings.filter(b => b.creatorId === creators[0].id)[0]?.id || bookings[0].id : null
  );
  
  // Message composing state
  const [messageText, setMessageText] = useState('');
  const [messageSender, setMessageSender] = useState<'creator' | 'security'>('creator');

  // Internal security notes state
  const [tempNotes, setTempNotes] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);

  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [minHourly, setMinHourly] = useState(creators[0].rates.hourly);
  const [vacationMode, setVacationMode] = useState(false);

  const activeCreator = creators.find(c => c.id === selectedCreatorId) || creators[0];

  // Filter bookings based on creator, status, and search query
  const filteredBookings = bookings.filter(b => {
    const matchesCreator = b.creatorId === selectedCreatorId;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = 
      b.fanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fanCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fanState.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fanCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.reasonToMeet.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCreator && matchesStatus && matchesSearch;
  });

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Stats calculation
  const creatorBookings = bookings.filter(b => b.creatorId === selectedCreatorId);
  const pendingCount = creatorBookings.filter(b => b.status === 'pending' || b.status === 'under_review').length;
  const approvedCount = creatorBookings.filter(b => b.status === 'approved').length;
  const declinedCount = creatorBookings.filter(b => b.status === 'declined').length;
  const totalRevenue = creatorBookings
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + b.budget, 0);

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    let note = '';
    if (newStatus === 'approved') {
      note = 'Booking approved by creator. Secure escrow confirmed. Security escort scheduled.';
    } else if (newStatus === 'declined') {
      note = 'Booking declined. Reason: Safety or scheduling incompatibility.';
    } else if (newStatus === 'under_review') {
      note = 'ID verification passed. Security is executing a standard background check.';
    }
    onUpdateBookingStatus(bookingId, newStatus, note);
  };

  const handleSaveNotes = (bookingId: string) => {
    onUpdateBookingStatus(bookingId, selectedBooking?.status || 'pending', tempNotes);
    setEditingNotesId(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedBookingId) return;

    onAddMessage(selectedBookingId, messageSender, messageText);
    setMessageText('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Creator Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={activeCreator.image} 
              alt={activeCreator.name} 
              className="h-16 w-16 rounded-full object-cover border-2 border-amber-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-4 w-4 rounded-full border-2 border-zinc-950" title="Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-black text-white">{activeCreator.name}</h2>
              <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Creator Mode
              </span>
            </div>
            <p className="text-xs text-zinc-400">{activeCreator.tagline}</p>
          </div>
        </div>

        {/* Creator Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider hidden lg:inline">Switch Creator:</span>
          <select
            value={selectedCreatorId}
            onChange={(e) => {
              setSelectedCreatorId(e.target.value);
              const firstBooking = bookings.find(b => b.creatorId === e.target.value);
              setSelectedBookingId(firstBooking?.id || null);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-white font-semibold focus:outline-none focus:border-amber-500 transition"
          >
            {creators.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl border transition ${
              showSettings 
                ? 'bg-amber-500 border-amber-500 text-black font-bold' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Creator Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Sub-Panel */}
      {showSettings && (
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-amber-500/20 animate-in fade-in slide-in-from-top-4 duration-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Booking Rates</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Minimum Hourly Rate ($)</label>
                <input 
                  type="number" 
                  value={minHourly} 
                  onChange={(e) => setMinHourly(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 w-full text-white font-bold"
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Availability Status</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={vacationMode} 
                  onChange={(e) => setVacationMode(e.target.checked)}
                  className="accent-rose-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-white">Vacation / Pause Bookings</span>
                  <p className="text-[10px] text-zinc-500">Temporarily hide booking form for your profile.</p>
                </div>
              </label>
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => {
                alert("Settings saved successfully! (Simulated)");
                setShowSettings(false);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-black py-2.5 rounded-xl font-bold text-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Escrow Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Funds locked in escrow</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Awaiting Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {pendingCount}
          </div>
          <p className="text-[10px] text-amber-400 mt-1">Requires security decision</p>
        </div>

        {/* Approved Meetings */}
        <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Scheduled Meets</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {approvedCount}
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Confirmed & secure</p>
        </div>

        {/* Declined Meetings */}
        <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Declined Requests</span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {declinedCount}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Flagged / Safety violations</p>
        </div>
      </div>

      {/* Main Grid: List vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Bookings List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden">
            {/* Header / Search */}
            <div className="p-4 border-b border-zinc-900 bg-zinc-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Meetup Requests ({filteredBookings.length})</h3>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search name, city, ID, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-zinc-900 max-h-[500px] overflow-y-auto">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No requests match the criteria.
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBookingId(b.id);
                      setTempNotes(b.notes);
                    }}
                    className={`p-4 text-left cursor-pointer transition-all flex justify-between items-center ${
                      selectedBookingId === b.id
                        ? 'bg-amber-500/5 border-l-4 border-amber-500'
                        : 'hover:bg-zinc-900/45'
                    }`}
                  >
                    <div className="space-y-1 pr-2 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{b.fanName}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">({b.fanAge})</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span className="truncate">{b.fanCity}, {b.fanState}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">{b.id}</div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-xs font-black text-amber-400">${b.budget}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        b.status === 'approved'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : b.status === 'declined'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : b.status === 'under_review' || b.status === 'id_verified'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Booking Review (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedBooking ? (
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col">
              {/* Detail Header */}
              <div className="p-6 border-b border-zinc-900 bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-bold text-white">{selectedBooking.fanName}</h3>
                    <span className="text-xs font-mono text-zinc-500">({selectedBooking.id})</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Submitted on {new Date(selectedBooking.createdAt).toLocaleDateString()} at {new Date(selectedBooking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'under_review')}
                        className="bg-amber-500 text-black text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition flex items-center gap-1"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Verify ID
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'declined')}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold py-2 px-3 rounded-lg border border-rose-500/20 transition"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {selectedBooking.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'approved')}
                        className="bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg hover:opacity-90 transition flex items-center gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve Booking
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'declined')}
                        className="bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 text-xs font-bold py-2 px-3 rounded-lg border border-rose-500/20 transition"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {(selectedBooking.status === 'approved' || selectedBooking.status === 'declined') && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                        selectedBooking.status === 'approved' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        Decision: {selectedBooking.status}
                      </span>
                      {onDeleteBooking && (
                        <button
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this record?")) {
                              onDeleteBooking(selectedBooking.id);
                              setSelectedBookingId(null);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition border border-transparent hover:border-rose-500/20"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                
                {/* Section: Meeting Motivation (The Core Requirement) */}
                <div className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-800/60">
                  <span className="text-[10px] font-extrabold tracking-wider text-amber-500 uppercase block mb-2">Reason to Meet (Fan Statement)</span>
                  <p className="text-sm text-zinc-200 leading-relaxed italic whitespace-pre-line">
                    "{selectedBooking.reasonToMeet}"
                  </p>
                </div>

                {/* Section: Fan Profile & Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block mb-3">Fan Contact Profile</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Age:</span>
                        <span className="text-white font-semibold">{selectedBooking.fanAge} years old</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Location:</span>
                        <span className="text-white font-semibold">{selectedBooking.fanCity}, {selectedBooking.fanState}, {selectedBooking.fanCountry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Email:</span>
                        <span className="text-white font-mono">{selectedBooking.fanEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Phone:</span>
                        <span className="text-white font-mono">{selectedBooking.fanPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block mb-3">Vetted Social Handles</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">X (Twitter):</span>
                        <span className="text-amber-400 font-bold">{selectedBooking.fanSocials.twitter || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Instagram:</span>
                        <span className="text-amber-400 font-bold">{selectedBooking.fanSocials.instagram || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">OnlyFans:</span>
                        <span className="text-amber-400 font-bold">{selectedBooking.fanSocials.onlyfans || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Meeting Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/20 p-4 rounded-xl border border-zinc-800/40 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Format</span>
                    <span className="text-xs font-bold text-white uppercase block mt-1">{selectedBooking.meetingType}</span>
                  </div>
                  <div className="border-x border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Schedule</span>
                    <span className="text-xs font-bold text-white block mt-1">{selectedBooking.date} @ {selectedBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Duration & Budget</span>
                    <span className="text-xs font-bold text-amber-400 block mt-1">{selectedBooking.duration} / ${selectedBooking.budget}</span>
                  </div>
                </div>

                {/* Section: Security Verification Files */}
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block mb-3">Security Document Submissions</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID Document Preview */}
                    <div className="border border-zinc-800 bg-zinc-950/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-500 font-mono font-bold shrink-0">
                        ID
                      </div>
                      <div className="truncate text-xs">
                        <span className="text-white font-bold block truncate">{selectedBooking.idImageName || 'No ID Uploaded'}</span>
                        <span className="text-[10px] text-zinc-500 block">Government Passport / DL</span>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                          Attached
                        </span>
                      </div>
                    </div>

                    {/* Selfie Preview */}
                    <div className="border border-zinc-800 bg-zinc-950/60 p-3 rounded-xl flex items-center gap-3">
                      <div className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-500 font-mono font-bold shrink-0">
                        IMG
                      </div>
                      <div className="truncate text-xs">
                        <span className="text-white font-bold block truncate">{selectedBooking.selfieImageName || 'No Selfie Uploaded'}</span>
                        <span className="text-[10px] text-zinc-500 block">Handwritten Note Selfie</span>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                          Attached
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Internal Security Notes */}
                <div className="border border-zinc-800/80 bg-zinc-950/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold tracking-wider text-rose-400 uppercase block">Internal Security & Vetting Notes</span>
                    {editingNotesId !== selectedBooking.id ? (
                      <button
                        onClick={() => {
                          setEditingNotesId(selectedBooking.id);
                          setTempNotes(selectedBooking.notes);
                        }}
                        className="text-[10px] font-bold text-amber-500 hover:underline"
                      >
                        Edit Notes
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveNotes(selectedBooking.id)}
                        className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </button>
                    )}
                  </div>

                  {editingNotesId === selectedBooking.id ? (
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  ) : (
                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/50 p-3 rounded-lg border border-zinc-900">
                      {selectedBooking.notes || 'No internal notes recorded.'}
                    </p>
                  )}
                </div>

                {/* Section: Live Chat with Fan */}
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden">
                  <div className="bg-zinc-950/60 px-4 py-2.5 border-b border-zinc-900 flex justify-between items-center">
                    <span className="text-[10px] font-extrabold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                      Booking Communication Channel
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold">Secure, Monitored</span>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-3.5 max-h-[220px] overflow-y-auto bg-zinc-950/20 text-xs">
                    {selectedBooking.messages.length === 0 ? (
                      <p className="text-center text-zinc-600 italic py-4">No communication history yet.</p>
                    ) : (
                      selectedBooking.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[85%] ${
                            msg.sender === 'fan' ? 'mr-auto items-start' : 'ml-auto items-end'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${
                              msg.sender === 'creator' 
                                ? 'text-amber-400' 
                                : msg.sender === 'security' 
                                ? 'text-rose-400' 
                                : 'text-zinc-400'
                            }`}>
                              {msg.sender === 'creator' ? activeCreator.name : msg.sender === 'security' ? 'Security Detail' : 'Fan'}
                            </span>
                            <span className="text-[8px] text-zinc-600">
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-xl leading-relaxed ${
                            msg.sender === 'fan'
                              ? 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                              : msg.sender === 'security'
                              ? 'bg-rose-950/30 text-rose-200 border border-rose-900/40 rounded-tr-none'
                              : 'bg-amber-500 text-black font-medium rounded-tr-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Compose */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950/60 border-t border-zinc-900 flex gap-2">
                    {/* Sender Switcher */}
                    <select
                      value={messageSender}
                      onChange={(e) => setMessageSender(e.target.value as 'creator' | 'security')}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 px-2 focus:outline-none shrink-0"
                    >
                      <option value="creator">As {activeCreator.name}</option>
                      <option value="security">As Security Detail</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Type a secure message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      Send
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-12 text-center text-zinc-500 text-sm flex flex-col items-center justify-center h-full">
              <Users className="h-10 w-10 text-zinc-700 mb-3" />
              <p className="font-bold text-white mb-1">No Booking Selected</p>
              <p className="text-xs">Select a meetup request from the left column to review the fan statement, ID, and background check status.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
