import React, { useState } from 'react';
import { Shield, Heart, HelpCircle, FileLock2, ShieldAlert, Settings, Users, X, Key, Phone, MessageSquare, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  userRole: 'fan' | 'admin' | 'creator';
  setUserRole: (role: 'fan' | 'admin' | 'creator') => void;
}

export default function Footer({ setActiveTab, userRole, setUserRole }: FooterProps) {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Admin Login Gate States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleRoleChange = (role: 'fan' | 'admin' | 'creator') => {
    setUserRole(role);
    if (role === 'fan') {
      setActiveTab('home');
    } else if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'creator') {
      setActiveTab('dashboard');
    }
    setShowAdminPanel(false);
    alert(`Role switched to ${role.toUpperCase()} Mode! Directing to appropriate dashboard.`);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().trim() === 'techethanedward@gmail.com' && password === 'Charlotte') {
      setIsUnlocked(true);
      setLoginError('');
      alert("Access Granted. Portal Control Unlocked.");
    } else {
      setLoginError("Access Denied: Invalid Admin Credentials.");
    }
  };

  const handleClosePanel = () => {
    setShowAdminPanel(false);
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-20 text-left relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="relative mr-3 bg-zinc-950 border border-amber-500 p-1 rounded-lg shadow-lg shadow-amber-500/10">
                <img src="/logo.jpeg" alt="Charlotte Prestige Management Logo" className="h-10 w-auto max-w-[120px] object-contain rounded" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-sans uppercase">
                  Charlotte Prestige
                </span>
                <span className="text-[9px] font-black tracking-[0.2em] text-amber-500 block -mt-0.5 uppercase">
                  Management
                </span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Charlotte Prestige Management is a secure, premium booking agency and safety protocol platform facilitating verified meetups between fans and content creators. We provide absolute privacy, secure escrow, and professional physical security details.
            </p>

            {/* Direct Contact Info & Support Section */}
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-amber-500/10 space-y-3 max-w-sm">
              <span className="text-[10px] font-extrabold tracking-wider text-amber-500 uppercase block flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Direct Agency Dispatch
              </span>
              <div className="space-y-2 text-xs">
                <a 
                  href="tel:+13474358842" 
                  className="flex items-center gap-2 text-zinc-300 hover:text-amber-500 transition group"
                >
                  <Phone className="h-4 w-4 text-amber-500 shrink-0 group-hover:scale-110 transition" />
                  <div>
                    <span className="text-[10px] text-zinc-500 block leading-none font-bold">SMS / Call Support</span>
                    <span className="font-mono font-bold text-white group-hover:underline">+1 (347) 435-8842</span>
                  </div>
                </a>
                <a 
                  href="https://t.me/lanatheblondie" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-zinc-300 hover:text-amber-500 transition group"
                >
                  <MessageSquare className="h-4 w-4 text-amber-500 shrink-0 group-hover:scale-110 transition" />
                  <div>
                    <span className="text-[10px] text-zinc-500 block leading-none font-bold">Secure Telegram Dispatch</span>
                    <span className="font-bold text-white group-hover:underline">@lanatheblondie</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold bg-zinc-900 py-1.5 px-3 rounded-lg inline-block border border-zinc-805">
              <FileLock2 className="h-3.5 w-3.5 text-amber-500" />
              Fully compliant with 18 U.S.C. § 2257 Record-Keeping Requirements.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-500 transition text-left cursor-pointer">
                  Home / Explore
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('creators')} className="hover:text-amber-500 transition text-left cursor-pointer">
                  Creator Roster
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-amber-500 transition text-left cursor-pointer">
                  Book a Meeting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-amber-500 transition text-left cursor-pointer">
                  Status Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('safety')} className="hover:text-amber-500 transition text-left cursor-pointer">
                  Safety & Conduct
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Safety & Compliance</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5 text-amber-500 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Strictly 18+ Only
              </li>
              <li>
                <span className="text-zinc-500 block">Vetting Partner:</span>
                <span className="text-white font-semibold">Aegis Security Group</span>
              </li>
              <li>
                <span className="text-zinc-500 block">Payment Escrow:</span>
                <span className="text-white font-semibold">Charlotte Prestige Trust</span>
              </li>
              <li className="text-[10px] text-zinc-500 leading-relaxed pt-2">
                All creators on Charlotte Prestige operate as independent contractors. Charlotte Prestige coordinates security, identity vetting, and escrow services.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Charlotte Prestige Management. All rights reserved.</span>
            
            {/* The Dedicated Admin/Portal Button Icon in the Footer! */}
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-amber-500 transition shadow-md cursor-pointer"
              title="Open Secret Portal Controls"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              Portal Control
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            Designed with
            <Heart className="h-3 w-3 text-amber-500 fill-amber-500" />
            for creator safety & peace of mind.
          </div>
        </div>
      </div>

      {/* POPUP OVERLAY: SECRET ADMIN PORTAL CONTROLS WITH LOGIN GATE */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-5 relative overflow-hidden shadow-2xl">
            {/* Hologram Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Key className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-extrabold tracking-wider uppercase">System Controller</span>
              </div>
              <button 
                onClick={handleClosePanel}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* IF LOCKED: Show Secure Admin Login Form */}
            {!isUnlocked ? (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-serif font-black text-white uppercase tracking-wider">Admin Authentication Required</h3>
                  <p className="text-[10px] text-zinc-500">Authorized personnel only. Enter Portal Control credentials.</p>
                </div>

                {loginError && (
                  <p className="text-[10px] text-red-500 font-bold text-center bg-red-500/5 border border-red-500/10 py-1.5 rounded">
                    {loginError}
                  </p>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type="email" 
                      placeholder="techethanedward@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Admin Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Charlotte" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-9 text-xs text-white font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Lock className="h-3.5 w-3.5 text-black" />
                  Unlock Portal Control
                </button>
              </form>
            ) : (
              /* IF UNLOCKED: Show standard Role Switcher Buttons */
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-black text-white">System Controller Unlocked</h3>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Access granted for <strong className="text-amber-500">techethanedward@gmail.com</strong>. Choose your role to simulate and inspect:
                  </p>
                </div>

                {/* Selector Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => handleRoleChange('fan')}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      userRole === 'fan'
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    FAN MODE (Browse & Book)
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      userRole === 'admin'
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    ADMIN MODE (Manage Stars & Media)
                  </button>

                  <button
                    onClick={() => handleRoleChange('creator')}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      userRole === 'creator'
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    CREATOR MODE (Manage Bookings)
                  </button>
                </div>

                {/* Relock Button */}
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="text-[10px] font-bold text-red-500 hover:underline flex items-center justify-center gap-1 mx-auto pt-2"
                >
                  <Lock className="h-3 w-3" />
                  Relock Controller
                </button>
              </div>
            )}

            <p className="text-[9px] text-zinc-500 leading-relaxed">
              These controls are only available to accredited platform administrators and developers.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

// Simple inline ShieldCheck replacement to avoid TS compile error if not imported
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
