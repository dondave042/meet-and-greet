import { useState, useEffect } from 'react';
import { Booking, Creator, FanProfile } from './types';
import { creators } from './data/creators';
import { mockBookings } from './data/mockBookings';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatorCard from './components/CreatorCard';
import BookingForm from './components/BookingForm';
import BookingTracker from './components/BookingTracker';
import CreatorDashboard from './components/CreatorDashboard';
import SafetyGuidelines from './components/SafetyGuidelines';
import AdminPortal from './components/AdminPortal';
import FanProfileView from './components/FanProfileView';
import Footer from './components/Footer';
import { Shield, Sparkles, X, ShieldCheck, Heart, Info, AlertTriangle } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<'fan' | 'admin' | 'creator'>('fan');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [preselectedCreatorId, setPreselectedCreatorId] = useState<string>('');
  const [preselectedBookingId, setPreselectedBookingId] = useState<string>('');
  const [selectedCreatorRules, setSelectedCreatorRules] = useState<Creator | null>(null);

  // Dynamic list of creators (pornstars)
  const [creatorsList, setCreatorsList] = useState<Creator[]>(() => {
    const saved = localStorage.getItem('aura_creators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse creators from localStorage:", e);
      }
    }
    return creators;
  });

  // Save creators to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aura_creators', JSON.stringify(creatorsList));
  }, [creatorsList]);

  // Dynamic Fan Profile state
  const [userProfile, setUserProfile] = useState<FanProfile | null>(() => {
    const saved = localStorage.getItem('aura_fan_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse fan profile from localStorage:", e);
      }
    }
    return null;
  });

  // Save fan profile to localStorage
  const handleSaveProfile = (profile: FanProfile) => {
    setUserProfile(profile);
    localStorage.setItem('aura_fan_profile', JSON.stringify(profile));
  };

  // Delete fan profile
  const handleDeleteProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('aura_fan_profile');
  };

  // Admin handlers for creators
  const handleAddCreator = (newCreator: Creator) => {
    setCreatorsList(prev => [newCreator, ...prev]);
  };

  const handleUpdateCreator = (updatedCreator: Creator) => {
    setCreatorsList(prev => prev.map(c => c.id === updatedCreator.id ? updatedCreator : c));
  };

  const handleDeleteCreator = (creatorId: string) => {
    setCreatorsList(prev => prev.filter(c => c.id !== creatorId));
  };

  // Initialize bookings state from localStorage or mockBookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aura_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse bookings from localStorage:", e);
      }
    }
    return mockBookings;
  });

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aura_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handler to add a new booking
  const handleBookingSubmit = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setPreselectedBookingId(newBooking.id);
  };

  // Handler to navigate to tracker with preselected ID
  const handleNavigateToTracker = (bookingId: string) => {
    setPreselectedBookingId(bookingId);
    setActiveTab('tracker');
  };

  // Handler to update booking status and notes from Creator Dashboard
  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status'], notes?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updatedNotes = notes !== undefined ? notes : b.notes;
        
        // Add automatic system message when status changes
        const systemMessages = [...b.messages];
        if (b.status !== status) {
          let systemText = `System Update: Status changed to ${status.replace('_', ' ')}.`;
          if (status === 'approved') {
            systemText = `Security Notice: Booking APPROVED. Escrow deposit verified. Meeting coordinates will be released 24 hours prior to the meeting.`;
          } else if (status === 'declined') {
            systemText = `Security Notice: Booking DECLINED. Escrow deposit released. Your profile has been cleared from active files.`;
          } else if (status === 'under_review') {
            systemText = `Security Notice: ID validated successfully. Charlotte Prestige Security detail has initiated background clearance checks.`;
          }
          
          systemMessages.push({
            id: `sys-${Date.now()}`,
            sender: 'security',
            text: systemText,
            timestamp: new Date().toISOString()
          });
        }

        return {
          ...b,
          status,
          notes: updatedNotes,
          messages: systemMessages
        };
      }
      return b;
    }));
  };

  // Handler to add a chat message
  const handleAddMessage = (bookingId: string, sender: 'creator' | 'fan' | 'security', text: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          messages: [
            ...b.messages,
            {
              id: `msg-${Date.now()}`,
              sender,
              text,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return b;
    }));
  };

  // Handler to delete a booking record (e.g. for reset/cleanup)
  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // Quick reset to original mock data if desired
  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This will restore initial stars, galleries, and mock bookings, and delete custom fan profiles.")) {
      setBookings(mockBookings);
      setCreatorsList(creators);
      setUserProfile(null);
      localStorage.removeItem('aura_bookings');
      localStorage.removeItem('aura_creators');
      localStorage.removeItem('aura_fan_profile');
      alert("All system data reset successfully!");
    }
  };

  // Automatically pre-select first creator if none selected
  const activeCreatorId = preselectedCreatorId || (creatorsList.length > 0 ? creatorsList[0].id : '');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Age Gate Banner */}
      <div className="bg-red-700 text-white py-2.5 px-4 text-center font-bold text-xs flex items-center justify-center gap-2 relative z-50 shadow-md">
        <Shield className="h-4 w-4 stroke-[2.5]" />
        <span>ATTENTION: 18+ ADULT ENTERTAINMENT DIRECTORY. YOU MUST BE 18 YEARS OR OLDER TO ENTER AND BOOK.</span>
      </div>

      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile}
        onLogout={handleDeleteProfile}
        setAuthMode={setAuthMode}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Banner if Fan Profile is missing and user is booking */}
        {!userProfile && activeTab === 'book' && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">MANDATORY SIGN UP REQUIRED</h4>
                <p className="text-xs text-zinc-400">
                  You must Sign up and create a verified Fan Profile with a mandatory profile picture before booking. This speeds up approval and pre-fills your data.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-lg shrink-0 transition"
            >
              Sign up Now
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <Home 
            creators={creatorsList}
            setActiveTab={setActiveTab} 
            setPreselectedCreatorId={setPreselectedCreatorId}
            onViewRules={setSelectedCreatorRules}
          />
        )}

        {activeTab === 'creators' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-serif font-black text-white tracking-wide">Elite Creator Roster</h2>
              <p className="text-xs text-zinc-400">
                Book safe, verified meetings with top-tier content creators in highly secure, pre-approved public or convention settings.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creatorsList.map((creator) => (
                <div key={creator.id} className="animate-in zoom-in-95 duration-200">
                  <CreatorCard
                    creator={creator}
                    onBook={(id: string) => {
                      setPreselectedCreatorId(id);
                      setActiveTab('book');
                    }}
                    onViewRules={setSelectedCreatorRules}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'book' && (
          <BookingForm 
            creators={creatorsList}
            preselectedCreatorId={activeCreatorId}
            onBookingSubmit={handleBookingSubmit}
            onNavigateToTracker={handleNavigateToTracker}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'tracker' && (
          <BookingTracker 
            bookings={bookings}
            preselectedBookingId={preselectedBookingId}
            onAddMessage={handleAddMessage}
          />
        )}

        {activeTab === 'profile' && (
          <FanProfileView 
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
            pastBookingsCount={bookings.filter(b => b.fanName === userProfile?.name).length}
            authMode={authMode}
            setAuthMode={setAuthMode}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyGuidelines />
        )}

        {activeTab === 'admin' && (
          <AdminPortal 
            creators={creatorsList}
            onAddCreator={handleAddCreator}
            onUpdateCreator={handleUpdateCreator}
            onDeleteCreator={handleDeleteCreator}
          />
        )}

        {activeTab === 'dashboard' && (
          <CreatorDashboard 
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddMessage={handleAddMessage}
            onDeleteBooking={handleDeleteBooking}
          />
        )}
      </main>

      {/* Sticky Demo / Quick Actions Bar */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={handleResetData}
          className="bg-zinc-950/90 text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-700 font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl backdrop-blur shadow-lg transition"
          title="Reset all system data to default mock records"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* POPUP MODAL: Creator Rules & Boundaries */}
      {selectedCreatorRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-lg w-full p-6 text-left space-y-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedCreatorRules.image} 
                  alt={selectedCreatorRules.name} 
                  className="h-12 w-12 rounded-full object-cover border border-zinc-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop`;
                  }}
                />
                <div>
                  <h3 className="text-lg font-serif font-black text-white">{selectedCreatorRules.name} Guidelines</h3>
                  <p className="text-xs text-red-500 font-semibold">{selectedCreatorRules.tagline}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCreatorRules(null)}
                className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block">Approved Formats</span>
              <div className="flex flex-wrap gap-2">
                {selectedCreatorRules.specialties.map((spec, i) => (
                  <span key={i} className="text-xs bg-zinc-900 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Boundaries Checklist */}
            <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
              <span className="text-[10px] font-extrabold tracking-wider text-red-500 uppercase block flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                Strict Personal Boundaries
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                {selectedCreatorRules.boundaries.map((b, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Base Rates Info */}
            <div className="grid grid-cols-3 gap-2 text-center bg-zinc-950 p-3 rounded-xl border border-zinc-900">
              <div>
                <span className="text-[10px] text-zinc-500 block">Hourly Rate</span>
                <span className="text-sm font-bold text-white">${selectedCreatorRules.rates.hourly}/hr</span>
              </div>
              <div className="border-l border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">VIP Dinner</span>
                <span className="text-sm font-bold text-white">${selectedCreatorRules.rates.VIPDinner}</span>
              </div>
              <div className="border-l border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">Day Event</span>
                <span className="text-sm font-bold text-white">${selectedCreatorRules.rates.event}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedCreatorRules(null)}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition border border-zinc-800"
              >
                Close Guidelines
              </button>
              <button
                onClick={() => {
                  setPreselectedCreatorId(selectedCreatorRules.id);
                  setSelectedCreatorRules(null);
                  setActiveTab('book');
                }}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 text-white hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                Proceed to Booking
                <ShieldCheck className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
