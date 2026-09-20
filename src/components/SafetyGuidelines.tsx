import React from 'react';
import { Shield, EyeOff, Lock, AlertOctagon, HeartHandshake, HelpCircle, CheckCircle } from 'lucide-react';

export default function SafetyGuidelines() {
  const safetyPillars = [
    {
      icon: Shield,
      title: 'Physical Security & Escorts',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/5',
      borderColor: 'border-amber-500/10',
      desc: 'All private venue meetings are accompanied by professional, discreet security details who remain in close proximity. Emergency panic buttons and instant coordinates sharing are active during all bookings.'
    },
    {
      icon: Lock,
      title: '100% Encrypted Identity Vetting',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/5',
      borderColor: 'border-rose-500/10',
      desc: 'All submitted government IDs and background check documents are fully encrypted at rest. Once our accredited security agency clears the fan, the actual document files are automatically purged from our active databases.'
    },
    {
      icon: EyeOff,
      title: 'Strict Non-Disclosure & Privacy',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/5',
      borderColor: 'border-purple-500/10',
      desc: 'Absolutely no photography, audio recording, or video streaming is permitted during private bookings unless explicitly contracted. Fans are required to sign a standard digital NDA prior to meeting co-ordinates being shared.'
    },
    {
      icon: HeartHandshake,
      title: 'Boundary Consent & Respect',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/10',
      desc: 'All meetings are strictly platonic and professional. The creator\'s boundaries are absolute. Any violation of boundaries, suggestive jokes, or inappropriate behavior will result in immediate security intervention and booking forfeiture.'
    }
  ];

  const faqs = [
    {
      q: 'Why do you require my Government ID and Age?',
      a: 'To comply with adult-industry safety standards and legal 18+ requirements, we must verify the identity of every single fan. This ensures that creators are only meeting with real, verified, and legally consenting adults in a fully accountable environment.'
    },
    {
      q: 'How does the Secure Escrow System work?',
      a: 'When you submit a booking, your proposed budget is authorized and held in a secure, audited escrow account. The creator does not receive the funds until the meeting has been successfully completed and confirmed by both parties. If the creator declines your request, the escrow is immediately released back to you.'
    },
    {
      q: 'Can I book a meeting in a private residence or hotel room?',
      a: 'No. To ensure absolute safety, Charlotte Prestige Management strictly prohibits bookings in private residences or hotel rooms. Permitted locations include pre-approved convention halls, public upscale restaurants (with private dining rooms), hotel lobbies, public cafes, or commercial fitness/event spaces.'
    },
    {
      q: 'What happens if a booking is cancelled?',
      a: 'Cancellations made more than 48 hours in advance receive a full refund of the escrow deposit. Cancellations within 48 hours are subject to a 20% creator-compensation fee. Cancellations made by the creator at any time are refunded 100% immediately.'
    }
  ];

  return (
    <div className="space-y-12 text-left">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold text-amber-500">
          <Shield className="h-3.5 w-3.5" />
          Charlotte Prestige Trust & Safety Protocol
        </div>
        <h2 className="text-3xl font-serif font-black text-white tracking-wide">Creator Safety & Code of Conduct</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          At Charlotte Prestige Management, we maintain an uncompromising commitment to the physical safety, legal protection, and privacy of our creators and fans. Please read our core safety guidelines before booking.
        </p>
      </div>

      {/* Safety Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safetyPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border ${pillar.borderColor} ${pillar.bgColor} space-y-3.5`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 ${pillar.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-white text-base">{pillar.title}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Code of Conduct Checklist */}
      <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800/80 space-y-6">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="h-6 w-6 text-rose-500" />
          <h3 className="text-lg font-serif font-bold text-white">Absolute Zero-Tolerance Rules</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white block mb-0.5">No Physical Contact</strong>
              Meetings are strictly non-physical. Handshakes, polite hugs, and standard posed photos are permitted only with explicit creator permission.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white block mb-0.5">No Secret Recording</strong>
              Any attempt to record audio, take secret photos, or stream the meeting will result in immediate security escort, booking termination, and permanent platform ban.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white block mb-0.5">No Unsolicited Gifts</strong>
              All gifts must be declared in your booking form and scanned by our security detail prior to the meeting. No food, drinks, or sealed packages are allowed.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Strict Legal Compliance</strong>
              All parties must be 18+. Any attempt to book a meeting under a false name, mock ID, or on behalf of someone else constitutes a breach of contract.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-serif font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-zinc-400">Everything you need to know about the booking process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-900 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
