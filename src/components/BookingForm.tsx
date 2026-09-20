import React, { useState, useEffect } from 'react';
import { Creator, Booking, FanProfile } from '../types';
import { 
  User, MapPin, Calendar, Clock, ShieldCheck, FileText, 
  ChevronRight, ChevronLeft, Upload, AlertTriangle, CheckCircle2, 
  HelpCircle, DollarSign, ArrowRight, Shield, Heart, Landmark, Copy, Check
} from 'lucide-react';

interface BookingFormProps {
  creators: Creator[];
  preselectedCreatorId?: string;
  onBookingSubmit: (booking: Booking) => void;
  onNavigateToTracker: (bookingId: string) => void;
  userProfile: FanProfile | null;
}

export default function BookingForm({ creators, preselectedCreatorId, onBookingSubmit, onNavigateToTracker, userProfile }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Form states
  const [creatorId, setCreatorId] = useState(preselectedCreatorId || (creators.length > 0 ? creators[0].id : ''));
  const [fanName, setFanName] = useState('');
  const [fanAge, setFanAge] = useState<number | ''>('');
  const [fanCountry, setFanCountry] = useState('United States');
  const [fanState, setFanState] = useState('');
  const [fanCity, setFanCity] = useState('');
  const [fanEmail, setFanEmail] = useState('');
  const [fanPhone, setFanPhone] = useState('');
  
  // Social media handles
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [onlyfans, setOnlyfans] = useState('');

  // Meeting details
  const [meetingType, setMeetingType] = useState<Booking['meetingType']>('convention');
  const [reasonToMeet, setReasonToMeet] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('1 Hour');
  const [budget, setBudget] = useState<number | ''>('');

  // Verification & Safety
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFileName, setIdFileName] = useState('');
  const [idFilePreview, setIdFilePreview] = useState<string | null>(null);
  
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfieFileName, setSelfieFileName] = useState('');
  const [selfieFilePreview, setSelfieFilePreview] = useState<string | null>(null);

  const [backgroundCheckAgreed, setBackgroundCheckAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Pre-fill form states from User Profile if available
  useEffect(() => {
    if (userProfile) {
      setFanName(userProfile.name);
      setFanAge(userProfile.age);
      setFanCountry(userProfile.country);
      setFanState(userProfile.state);
      setFanCity(userProfile.city);
    }
  }, [userProfile]);

  const selectedCreator = creators.find(c => c.id === creatorId) || creators[0] || { rates: { hourly: 400 }, name: '' };

  // Validate current step
  const validateStep = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!creatorId) newErrors.creatorId = 'Please select a creator.';
      if (!meetingType) newErrors.meetingType = 'Please select a meeting type.';
    }

    if (currentStep === 2) {
      if (!fanName.trim()) newErrors.fanName = 'Full Name is required.';
      if (!fanAge) {
        newErrors.fanAge = 'Age is required.';
      } else if (Number(fanAge) < 18) {
        newErrors.fanAge = 'You must be 18 years or older to book a meeting.';
      }
      if (!fanCountry.trim()) newErrors.fanCountry = 'Country is required.';
      if (!fanState.trim()) newErrors.fanState = 'State/Province is required.';
      if (!fanCity.trim()) newErrors.fanCity = 'City is required.';
      if (!fanEmail.trim()) {
        newErrors.fanEmail = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(fanEmail)) {
        newErrors.fanEmail = 'Please enter a valid email address.';
      }
      if (!fanPhone.trim()) newErrors.fanPhone = 'Phone number is required.';
    }

    if (currentStep === 3) {
      if (!reasonToMeet.trim()) {
        newErrors.reasonToMeet = 'Please provide a detailed reason for the meeting.';
      } else if (reasonToMeet.trim().length < 30) {
        newErrors.reasonToMeet = 'Please expand your explanation (minimum 30 characters).';
      }
      if (!date) newErrors.date = 'Meeting date is required.';
      if (!time) newErrors.time = 'Meeting time is required.';
      if (!duration) newErrors.duration = 'Duration is required.';
      if (!budget) {
        newErrors.budget = 'Please enter your proposed budget/offer.';
      } else if (Number(budget) < selectedCreator.rates.hourly) {
        newErrors.budget = `Budget must meet or exceed the creator's hourly rate of $${selectedCreator.rates.hourly}.`;
      }
    }

    if (currentStep === 4) {
      if (!idFileName) newErrors.idFile = 'A photo of your Government-Issued ID is required.';
      if (!selfieFileName) newErrors.selfieFile = 'A verification selfie is required.';
      if (!backgroundCheckAgreed) newErrors.backgroundCheck = 'You must consent to a standard safety background check.';
      if (!termsAgreed) newErrors.terms = 'You must agree to the Aura VIP Safety & Code of Conduct terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulated file uploads
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file);
      setIdFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear error
      setErrors(prev => ({ ...prev, idFile: '' }));
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      setSelfieFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear error
      setErrors(prev => ({ ...prev, selfieFile: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const generatedId = `CPM-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
      
      const newBooking: Booking = {
        id: generatedId,
        creatorId,
        creatorName: selectedCreator.name,
        fanName,
        fanAge: Number(fanAge),
        fanCountry,
        fanState,
        fanCity,
        fanEmail,
        fanPhone,
        fanSocials: {
          twitter: twitter || undefined,
          instagram: instagram || undefined,
          onlyfans: onlyfans || undefined,
        },
        meetingType,
        reasonToMeet,
        date,
        time,
        duration,
        budget: Number(budget),
        idVerified: true, // Simulated verification
        idImageName: idFileName,
        selfieImageName: selfieFileName,
        backgroundCheckAgreed,
        termsAgreed,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: 'Awaiting initial ID validation and background check processing.',
        messages: [
          {
            id: 'init-msg',
            sender: 'security',
            text: `Welcome, ${fanName}. Your booking request has been registered under ID: ${generatedId}. We are initiating our standard 18+ ID check and safety screening. You can chat with security and track progress here.`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      onBookingSubmit(newBooking);
      setSubmittedBooking(newBooking);
      setIsSubmitting(false);
      setStep(5); // Success step
    }, 1800);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const meetingTypes = [
    { id: 'convention', label: 'Convention Autograph/Photo', desc: 'Meet in a pre-approved convention setting (e.g. AVN, Exxxotica, Comic-Con).' },
    { id: 'dinner', label: 'VIP Private Dinner', desc: 'Elegant dining at a pre-screened upscale restaurant (private dining room, security present).' },
    { id: 'content_shoot', label: 'Private Content Collaboration Shoot', desc: 'Book a professional 18+ content shoot, behind-the-scenes collab, or video production session.' },
    { id: 'fetish_session', label: 'VIP Fetish/BDSM Session', desc: 'A secure, strictly boundaries-enforced fetish or BDSM session in a pre-vetted professional studio.' },
    { id: 'lounge', label: 'Private Hotel Lounge', desc: 'Secure meeting in a luxury hotel lounge or pre-approved private club lobby.' },
    { id: 'cafe', label: 'Public Coffee/Cafe Meet', desc: 'Casual conversation in a busy, high-end public coffee house or bistro.' },
    { id: 'appearance', label: 'Event Guest Appearance', desc: 'Book the creator to attend your private birthday, party, or brand event.' },
    { id: 'custom', label: 'Custom Request', desc: 'Propose a unique, safe itinerary subject to rigorous security approval.' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      {step < 5 && (
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step === num
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-110 ring-4 ring-amber-500/10'
                      : step > num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                  }`}>
                    {step > num ? '✓' : `0${num}`}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                    step === num ? 'text-amber-500' : 'text-zinc-500'
                  }`}>
                    {num === 1 ? 'Target' : num === 2 ? 'Profile' : num === 3 ? 'Details' : 'Verify'}
                  </span>
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-all duration-300 ${
                    step > num ? 'bg-emerald-500' : 'bg-zinc-900'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden backdrop-blur-md">
        {step < 5 && (
          <div className="border-b border-zinc-900 px-6 py-4 flex justify-between items-center bg-zinc-950/40">
            <div>
              <h2 className="text-lg font-serif font-bold text-white">VIP Meetup Request Form</h2>
              <p className="text-xs text-zinc-400">All information is kept strictly confidential & secure.</p>
            </div>
            <div className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              100% Encrypted
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          
          {/* STEP 1: SELECT CREATOR & MEETING TYPE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Creator Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  1. Select Creator
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {creators.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCreatorId(c.id)}
                      className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${
                        creatorId === c.id
                          ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5'
                          : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover border border-zinc-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop`;
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.name}</h4>
                        <p className="text-[10px] text-amber-500 font-semibold">Min. ${c.rates.hourly}/hr</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.creatorId && <p className="text-xs text-rose-500 mt-1.5">{errors.creatorId}</p>}
              </div>

              {/* Meetup Type Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  2. Choose Meeting Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meetingTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setMeetingType(type.id as Booking['meetingType'])}
                      className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${
                        meetingType === type.id
                          ? 'border-amber-500 bg-amber-500/5'
                          : 'border-zinc-800 bg-zinc-950/20 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{type.label}</span>
                        <input
                          type="radio"
                          checked={meetingType === type.id}
                          onChange={() => {}}
                          className="accent-amber-500 h-4 w-4"
                        />
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Alert */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Aura Safe-Meeting Protocol</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    All meetups are subject to pre-screening and approval by our management team. Private bookings require physical security present in an adjacent room or nearby area. Absolutely no illegal activities or boundary violations are tolerated.
                  </p>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold text-sm py-3 px-6 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  Continue to Profile
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FAN PERSONAL PROFILE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 mb-4">
                <h3 className="text-sm font-bold text-white mb-1">Step 2: Fan Identity Profile</h3>
                <p className="text-xs text-zinc-400">
                  Please provide your legal name and contact details. This must match the Government ID you upload in Step 4.
                </p>
              </div>

              {/* Name & Age */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Legal Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={fanName}
                      onChange={(e) => setFanName(e.target.value)}
                      className={`w-full bg-zinc-950/60 border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                        errors.fanName ? 'border-rose-500' : 'border-zinc-800'
                      }`}
                    />
                  </div>
                  {errors.fanName && <p className="text-xs text-rose-500 mt-1">{errors.fanName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Min. 18"
                    value={fanAge}
                    onChange={(e) => setFanAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanAge ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanAge && <p className="text-xs text-rose-500 mt-1">{errors.fanAge}</p>}
                </div>
              </div>

              {/* Country, State, City */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United States"
                    value={fanCountry}
                    onChange={(e) => setFanCountry(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanCountry ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanCountry && <p className="text-xs text-rose-500 mt-1">{errors.fanCountry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    State / Province <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. California"
                    value={fanState}
                    onChange={(e) => setFanState(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanState ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanState && <p className="text-xs text-rose-500 mt-1">{errors.fanState}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Los Angeles"
                    value={fanCity}
                    onChange={(e) => setFanCity(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanCity ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanCity && <p className="text-xs text-rose-500 mt-1">{errors.fanCity}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Secure Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@domain.com"
                    value={fanEmail}
                    onChange={(e) => setFanEmail(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanEmail ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanEmail && <p className="text-xs text-rose-500 mt-1">{errors.fanEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Direct Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={fanPhone}
                    onChange={(e) => setFanPhone(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.fanPhone ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.fanPhone && <p className="text-xs text-rose-500 mt-1">{errors.fanPhone}</p>}
                </div>
              </div>

              {/* Social Media Links (Optional but highly recommended for vetting) */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Social Media Links <span className="text-zinc-500 text-[10px] font-normal">(Highly recommended for faster approval)</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1 font-bold">X (Twitter) Handle</span>
                    <input
                      type="text"
                      placeholder="@username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1 font-bold">Instagram Handle</span>
                    <input
                      type="text"
                      placeholder="@username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1 font-bold">OnlyFans/Fansly Handle</span>
                    <input
                      type="text"
                      placeholder="@username"
                      value={onlyfans}
                      onChange={(e) => setOnlyfans(e.target.value)}
                      className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-zinc-900 text-zinc-300 font-bold text-sm py-3 px-6 rounded-xl hover:bg-zinc-800 transition flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold text-sm py-3 px-6 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  Continue to Details
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MEETUP SCHEDULING & MOTIVATION */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 mb-4">
                <h3 className="text-sm font-bold text-white mb-1">Step 3: Meetup Scheduling & Reason to Meet</h3>
                <p className="text-xs text-zinc-400">
                  Provide details about your proposed meeting. Be highly specific about your reason to meet. This is the primary factor the creator reviews.
                </p>
              </div>

              {/* Reason to Meet */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Reason to Meet & Proposed Itinerary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Please describe exactly why you want to meet, what you expect to talk about, your intentions, and any specific activities or gifts you have planned. High-quality details increase your chance of approval significantly."
                  value={reasonToMeet}
                  onChange={(e) => setReasonToMeet(e.target.value)}
                  className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition leading-relaxed ${
                    errors.reasonToMeet ? 'border-rose-500' : 'border-zinc-800'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-zinc-500">Minimum 30 characters. Respectful language is mandatory.</p>
                  <p className="text-[10px] text-zinc-400 font-bold">{reasonToMeet.length} chars</p>
                </div>
                {errors.reasonToMeet && <p className="text-xs text-rose-500 mt-1">{errors.reasonToMeet}</p>}
              </div>

              {/* Date, Time, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Proposed Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.date ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Proposed Start Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition ${
                      errors.time ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.time && <p className="text-xs text-rose-500 mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Proposed Duration <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="1 Hour">1 Hour (Standard)</option>
                    <option value="2 Hours">2 Hours (Recommended)</option>
                    <option value="3 Hours">3 Hours (VIP)</option>
                    <option value="Half Day">Half Day (4 Hours)</option>
                    <option value="Full Day">Full Day (8 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Budget/Offer */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Proposed Budget / Offer ($ USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                  <input
                    type="number"
                    placeholder={`Minimum $${selectedCreator.rates.hourly} for ${selectedCreator.name}`}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full bg-zinc-950/60 border rounded-xl py-3 pl-10 pr-4 text-sm text-white font-bold focus:outline-none focus:border-amber-500 transition ${
                      errors.budget ? 'border-rose-500' : 'border-zinc-800'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Offers must cover the creator's base hourly rate (${selectedCreator.rates.hourly}/hr) or appropriate package rates. Funds are held in a secure, audited escrow and only released upon successful completion of the meeting.
                </p>
                {errors.budget && <p className="text-xs text-rose-500 mt-1">{errors.budget}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-zinc-900 text-zinc-300 font-bold text-sm py-3 px-6 rounded-xl hover:bg-zinc-800 transition flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold text-sm py-3 px-6 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  Continue to Verification
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFICATION & SAFETY AGREEMENTS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl mb-4">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  Mandatory Security Verification
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  To ensure the physical safety and legal protection of our creators, we require all fans to submit a government-issued ID and pass a background check. Your documents are encrypted and automatically deleted after verification.
                </p>
              </div>

              {/* File Uploads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID Upload */}
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold tracking-wider text-zinc-400 uppercase block mb-1">1. Government ID Upload</span>
                    <p className="text-[10px] text-zinc-500 mb-3">Upload a clear photo of your Passport, Driver's License, or National ID. Must show name and age clearly.</p>
                  </div>
                  
                  <div className="relative border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-lg p-6 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {idFilePreview ? (
                      <div className="space-y-2">
                        <img src={idFilePreview} alt="ID Preview" className="h-20 mx-auto rounded border border-zinc-800 object-cover" />
                        <span className="text-xs text-emerald-400 font-bold block truncate">{idFileName}</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="h-6 w-6 text-zinc-500 mx-auto" />
                        <span className="text-xs text-zinc-300 font-semibold block">Select ID Image</span>
                        <span className="text-[9px] text-zinc-500 block">PNG, JPG up to 10MB</span>
                      </div>
                    )}
                  </div>
                  {errors.idFile && <p className="text-xs text-rose-500 mt-2">{errors.idFile}</p>}
                </div>

                {/* Selfie Verification */}
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold tracking-wider text-zinc-400 uppercase block mb-1">2. Selfie Verification</span>
                    <p className="text-[10px] text-zinc-500 mb-3">Upload a selfie holding a handwritten note saying: <strong className="text-amber-500">"CPM VIP + [Today's Date]"</strong>.</p>
                  </div>

                  <div className="relative border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-lg p-6 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {selfieFilePreview ? (
                      <div className="space-y-2">
                        <img src={selfieFilePreview} alt="Selfie Preview" className="h-20 mx-auto rounded border border-zinc-800 object-cover" />
                        <span className="text-xs text-emerald-400 font-bold block truncate">{selfieFileName}</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="h-6 w-6 text-zinc-500 mx-auto" />
                        <span className="text-xs text-zinc-300 font-semibold block">Select Selfie Image</span>
                        <span className="text-[9px] text-zinc-500 block">PNG, JPG up to 10MB</span>
                      </div>
                    )}
                  </div>
                  {errors.selfieFile && <p className="text-xs text-rose-500 mt-2">{errors.selfieFile}</p>}
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3.5 pt-2">
                {/* Background Check */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={backgroundCheckAgreed}
                    onChange={(e) => setBackgroundCheckAgreed(e.target.checked)}
                    className="accent-amber-500 h-4 w-4 mt-0.5 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                      I consent to a standard safety and background screening
                    </span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                      I authorize Aura VIP and its accredited security partners to conduct a standard criminal record check and public record verification to ensure safety. I understand this is kept confidential.
                    </p>
                    {errors.backgroundCheck && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.backgroundCheck}</p>}
                  </div>
                </label>

                {/* Terms of Conduct */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="accent-amber-500 h-4 w-4 mt-0.5 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                      I agree to the Creator Safety Code of Conduct & Boundaries
                    </span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                      I agree to respect all of {selectedCreator.name}'s boundaries. I understand that any form of harassment, non-consensual physical contact, secret recording, or stalking will result in immediate termination of the meeting, forfeiture of my budget deposit, and legal action.
                    </p>
                    {errors.terms && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.terms}</p>}
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-zinc-900 text-zinc-300 font-bold text-sm py-3 px-6 rounded-xl hover:bg-zinc-800 transition flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-sm py-3 px-8 rounded-xl hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Submit Secure Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS / BOOKING GENERATED */}
          {step === 5 && submittedBooking && (
            <div className="text-center py-8 px-4 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-black text-white">Booking Request Submitted!</h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Your VIP meetup request with <strong className="text-amber-400">{submittedBooking.creatorName}</strong> has been successfully registered. Our security team is reviewing your documents.
                </p>
              </div>

              {/* Booking ID Plate */}
              <div className="max-w-md mx-auto bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase block">YOUR SECURE BOOKING ID</span>
                <div className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 py-3 px-4 rounded-xl">
                  <span className="text-lg font-mono font-black text-amber-400 tracking-wider">
                    {submittedBooking.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(submittedBooking.id)}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                    title="Copy Booking ID"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Please save this ID. You will need it to track your approval status and chat with the creator's security detail.
                </p>
              </div>

              {/* Quick Summary of details */}
              <div className="max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fan Name:</span>
                  <span className="text-white font-semibold">{submittedBooking.fanName} ({submittedBooking.fanAge})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span className="text-white font-semibold">{submittedBooking.fanCity}, {submittedBooking.fanState}, {submittedBooking.fanCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Meeting Type:</span>
                  <span className="text-white font-semibold capitalize">{submittedBooking.meetingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date & Time:</span>
                  <span className="text-white font-semibold">{submittedBooking.date} at {submittedBooking.time} ({submittedBooking.duration})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Escrow Deposit:</span>
                  <span className="text-amber-400 font-extrabold">${submittedBooking.budget} USD</span>
                </div>
              </div>

              {/* Next Action */}
              <div className="pt-6 flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    // reset form
                    setStep(1);
                    setFanName('');
                    setFanAge('');
                    setFanState('');
                    setFanCity('');
                    setReasonToMeet('');
                    setDate('');
                    setTime('');
                    setBudget('');
                    setIdFileName('');
                    setIdFilePreview(null);
                    setSelfieFileName('');
                    setSelfieFilePreview(null);
                    setBackgroundCheckAgreed(false);
                    setTermsAgreed(false);
                    setSubmittedBooking(null);
                  }}
                  className="py-3 px-5 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition border border-zinc-800"
                >
                  Book Another Meeting
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTracker(submittedBooking.id)}
                  className="py-3 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-black hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
                >
                  Track Status & Chat
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
