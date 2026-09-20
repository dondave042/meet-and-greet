import React, { useState } from 'react';
import { Shield, Menu, X, User, Sparkles, Heart, LogIn, LogOut, UserPlus } from 'lucide-react';
import { FanProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: FanProfile | null;
  onLogout: () => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
}

export default function Navbar({ activeTab, setActiveTab, userProfile, onLogout, setAuthMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'creators', label: 'Creators' },
    { id: 'book', label: 'Book a Meeting' },
    { id: 'tracker', label: 'Track Booking' },
    { id: 'profile', label: userProfile ? 'My Fan Profile' : 'Sign up' },
    { id: 'safety', label: 'Safety & Rules' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative mr-3.5 bg-zinc-950 border-2 border-amber-500 p-1 rounded-2xl shadow-xl shadow-amber-500/20 transition-transform duration-300 hover:scale-105">
              <img src="/logo.jpeg" alt="Charlotte Prestige Management Logo" className="h-12 w-auto max-w-[140px] object-contain rounded-xl" />
              <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-0.5 border border-white/20">
                18<span className="text-[7px]">+</span>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xl md:text-2xl font-black tracking-tight text-white font-sans uppercase block leading-none">
                Charlotte Prestige
              </span>
              <span className="text-[9px] font-black tracking-[0.2em] text-white block mt-1.5 uppercase">
                Management
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeTab === item.id
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons / User Profile Widget */}
          <div className="hidden lg:flex items-center space-x-3">
            {userProfile ? (
              /* Logged In: Show Avatar, Name & Log Out button */
              <div className="flex items-center gap-3 bg-zinc-900/60 p-1.5 pl-3 pr-2.5 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <img 
                    src={userProfile.profilePicture} 
                    alt={userProfile.name} 
                    className="h-8 w-8 rounded-full object-cover border border-amber-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop`;
                    }}
                  />
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">
                    {userProfile.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500 transition cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-4 w-4 text-amber-500" />
                </button>
              </div>
            ) : (
              /* Not Logged In: Show explicit Sign Up & Login buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setActiveTab('profile');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-amber-500" />
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setActiveTab('profile');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition flex items-center gap-1 shadow-lg cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5 text-black" />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button & Auth Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            {userProfile ? (
              <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800">
                <img 
                  src={userProfile.profilePicture} 
                  alt={userProfile.name} 
                  className="h-8 w-8 rounded-full object-cover border border-amber-500 cursor-pointer"
                  onClick={() => setActiveTab('profile')}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop`;
                  }}
                />
                <button
                  onClick={onLogout}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-amber-500 transition cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-3.5 w-3.5 text-amber-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setActiveTab('profile');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-zinc-900 text-zinc-300 border border-zinc-800 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setActiveTab('profile');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-amber-500 text-black cursor-pointer shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  activeTab === item.id
                    ? 'text-amber-500 bg-amber-500/10 border-l-4 border-amber-500'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-zinc-900 mt-2 px-4 space-y-2">
              {userProfile ? (
                <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-xl border border-zinc-850">
                  <div className="flex items-center gap-2">
                    <img 
                      src={userProfile.profilePicture} 
                      alt={userProfile.name} 
                      className="h-8 w-8 rounded-full object-cover border border-amber-500"
                    />
                    <span className="text-xs font-bold text-white">{userProfile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="text-xs font-bold text-amber-500 flex items-center gap-1"
                  >
                    <LogOut className="h-3.5 w-3.5 text-amber-500" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setActiveTab('profile');
                      setIsOpen(false);
                    }}
                    className="py-2 text-center text-xs font-bold rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center justify-center gap-1"
                  >
                    <LogIn className="h-3.5 w-3.5 text-amber-500" />
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setActiveTab('profile');
                      setIsOpen(false);
                    }}
                    className="py-2 text-center text-xs font-bold rounded-lg bg-amber-500 text-black flex items-center justify-center gap-1"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-black" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
