import React, { useState, useEffect } from 'react';
import { FanProfile } from '../types';
import { 
  User, MapPin, Calendar, Upload, Check, ShieldCheck, 
  Sparkles, Heart, Lock, Mail, Eye, EyeOff, LogOut, LogIn, Key, UserPlus
} from 'lucide-react';

interface FanProfileViewProps {
  userProfile: FanProfile | null;
  onSaveProfile: (profile: FanProfile) => void;
  onDeleteProfile: () => void;
  pastBookingsCount: number;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
}

export default function FanProfileView({ userProfile, onSaveProfile, onDeleteProfile, pastBookingsCount, authMode, setAuthMode }: FanProfileViewProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Common form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign-up specific fields
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [profilePic, setProfilePic] = useState('');

  // Local storage of registered users list for login simulation
  const [registeredUsers, setRegisteredUsers] = useState<FanProfile[]>(() => {
    const saved = localStorage.getItem('aura_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse registered users:", e);
      }
    }
    // Pre-registered mock user
    return [
      {
        email: 'fan@aura.vip',
        password: 'password123',
        name: 'Marcus Miller',
        age: 29,
        country: 'United States',
        state: 'California',
        city: 'San Jose',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      }
    ];
  });

  // Save registered users list to localStorage
  useEffect(() => {
    localStorage.setItem('aura_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Handle Profile Picture Upload (converting to Base64)
  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Sign-up Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !country || !state || !city || !profilePic || !email || !password) {
      alert("Please fill in all fields, enter email/password, and upload a mandatory profile picture.");
      return;
    }

    if (Number(age) < 18) {
      alert("You must be 18 years or older to register on Aura VIP.");
      return;
    }

    // Check if email already exists
    const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      alert("An account with this email already exists. Please login instead.");
      setAuthMode('login');
      return;
    }

    const newProfile: FanProfile = {
      name,
      age: Number(age),
      country,
      state,
      city,
      profilePicture: profilePic,
      email: email.toLowerCase(),
      password: password
    };

    // Add to registered users list
    setRegisteredUsers(prev => [...prev, newProfile]);
    
    // Log them in
    onSaveProfile(newProfile);
    alert(`Account created successfully, ${name}! You are now logged in.`);
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Check if the credentials are the Admin Credentials!
    if (email.toLowerCase().trim() === 'techethanedward@gmail.com' && password === 'Charlotte') {
      const adminProfile: FanProfile = {
        name: "Tech Ethan Edward (Admin)",
        age: 35,
        country: "United States",
        state: "North Carolina",
        city: "Charlotte",
        profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        email: "techethanedward@gmail.com"
      };
      onSaveProfile(adminProfile);
      alert("Admin Access Granted. Welcome back, Ethan!");
      return;
    }

    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      onSaveProfile(foundUser);
      alert(`Welcome back, ${foundUser.name}!`);
    } else {
      alert("Invalid email or password. Please check your credentials.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left">
      {userProfile ? (
        /* LOGGED IN VIEW: VIP Fan Passport Card */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative shadow-xl">
            {/* Design accents */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-red-600/5 blur-2xl pointer-events-none" />
            
            {/* Main Passport Layout */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image Column */}
              <div className="space-y-3 shrink-0 text-center">
                <img 
                  src={userProfile.profilePicture} 
                  alt={userProfile.name} 
                  className="h-32 w-32 rounded-2xl object-cover border-4 border-red-600 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop`;
                  }}
                />
                <span className="bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase block tracking-wider">
                  Verified Member
                </span>
              </div>

              {/* Bio Details Column */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <span className="text-[10px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase block">VIP FAN PASSPORT</span>
                  <h2 className="text-2xl font-serif font-black text-white mt-1">{userProfile.name}</h2>
                  
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                      <span>{userProfile.city}, {userProfile.state}, {userProfile.country}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-400">
                      <Mail className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-mono">{userProfile.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Age</span>
                    <span className="text-sm font-black text-white">{userProfile.age}</span>
                  </div>
                  <div className="border-x border-zinc-900">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Bookings</span>
                    <span className="text-sm font-black text-white">{pastBookingsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Trust Rating</span>
                    <span className="text-sm font-black text-emerald-400">A+</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg justify-center md:justify-start">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>18+ Age & Government ID verified by Aura Security Detail.</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-zinc-950/50 px-6 py-4 border-t border-zinc-900 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete your fan profile? This will wipe your account from the system.")) {
                    // Remove from registered list
                    setRegisteredUsers(prev => prev.filter(u => u.email !== userProfile.email));
                    onDeleteProfile();
                  }
                }}
                className="text-xs font-bold text-zinc-500 hover:text-red-500 transition"
              >
                Delete Account
              </button>

              <button
                onClick={onDeleteProfile}
                className="bg-red-600 hover:bg-red-700 text-white border border-red-500/20 text-xs font-bold py-2 px-4 rounded-xl transition flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* AUTH PORTAL: Sign-Up & Login Split Screens */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Info & Mock Login (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-zinc-900/40 p-6 rounded-2xl border border-zinc-850 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 bg-red-600/10 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure Auth Gateway
              </div>
              <h3 className="text-xl font-serif font-black text-white">Join the Elite Club</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Registering an account on Aura VIP grants you access to premium 18+ creator portfolios, background clearance, secure escrow bookings, and direct communication with security details.
              </p>
            </div>

            {/* Mock Login Credentials Helper */}
            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 space-y-2.5">
              <span className="text-[10px] font-extrabold tracking-wider text-red-500 uppercase block flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Demo Accounts
              </span>
              <p className="text-[10px] text-zinc-400">Use these credentials to log in instantly:</p>
              
              {/* Fan Account */}
              <div className="text-[10px] font-mono space-y-0.5 bg-zinc-900 p-2 rounded border border-zinc-850">
                <span className="text-[8px] font-bold text-amber-500 block uppercase">Fan Portal</span>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-white font-bold">fan@aura.vip</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Password:</span>
                  <span className="text-white font-bold">password123</span>
                </div>
              </div>

              {/* Admin Account */}
              <div className="text-[10px] font-mono space-y-0.5 bg-zinc-900 p-2 rounded border border-zinc-850">
                <span className="text-[8px] font-bold text-amber-500 block uppercase">Admin Portal Control</span>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-white font-bold">techethanedward@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Password:</span>
                  <span className="text-white font-bold">Charlotte</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sign-Up & Login Forms (8 Cols) */}
          <div className="lg:col-span-8 bg-zinc-900/40 p-6 md:p-8 rounded-2xl border border-zinc-850 flex flex-col justify-between">
            {/* Form Mode Selector Header */}
            <div className="flex border-b border-zinc-900 pb-4 mb-6 justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-black text-white">
                  {authMode === 'signup' ? 'Create Your Account' : 'Log In to Your Account'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {authMode === 'signup' ? 'Complete all fields and upload a profile picture.' : 'Enter your email and password to access your pass.'}
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    authMode === 'signup' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    authMode === 'login' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Log In
                </button>
              </div>
            </div>

            {/* SIGN-UP FORM */}
            {authMode === 'signup' ? (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                {/* Profile Picture Upload (Mandatory) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Mandatory Profile Picture *
                  </label>
                  <div className="relative border border-dashed border-zinc-800 hover:border-red-500/30 rounded-xl p-4 text-center cursor-pointer transition bg-zinc-950/40">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePicUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {profilePic ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={profilePic} alt="Avatar" className="h-12 w-12 rounded-full object-cover border-2 border-red-600" />
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Profile Photo Loaded!
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                        <Upload className="h-4 w-4" />
                        <span>Upload Profile Picture (Required)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input 
                        type="email" 
                        placeholder="your.email@domain.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Min. 6 characters" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name & Age */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Age *</label>
                    <input 
                      type="number" 
                      placeholder="Min. 18" 
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                {/* Country, State, City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Country *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. United States" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">State *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. California" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">City *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. San Jose" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg mt-2 flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up & Create Profile
                </button>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-6 py-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type="email" 
                      placeholder="enter your registered email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  Log In to Account
                </button>
              </form>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
