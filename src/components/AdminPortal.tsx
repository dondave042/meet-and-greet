import React, { useState } from 'react';
import { Creator } from '../types';
import { 
  Plus, Edit3, Trash2, Upload, FileText, Image, Video, 
  DollarSign, AlertTriangle, ShieldCheck, Check, Sparkles, X, Eye
} from 'lucide-react';

interface AdminPortalProps {
  creators: Creator[];
  onAddCreator: (creator: Creator) => void;
  onUpdateCreator: (creator: Creator) => void;
  onDeleteCreator: (creatorId: string) => void;
}

export default function AdminPortal({ creators, onAddCreator, onUpdateCreator, onDeleteCreator }: AdminPortalProps) {
  const [activeSubTab, setActiveTab] = useState<'manage' | 'create'>('manage');
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [selectedCreatorForGallery, setSelectedCreatorForGallery] = useState<Creator | null>(null);

  // Form states for creating/editing creator
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(400);
  const [eventRate, setEventRate] = useState<number>(3000);
  const [dinnerRate, setVIPDinnerRate] = useState<number>(1200);
  const [specialties, setSpecialties] = useState('');
  const [boundaries, setBoundaries] = useState('');

  // Form states for gallery upload
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('');
  const [galleryType, setGalleryType] = useState<'image' | 'video'>('image');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryIsAdult, setGalleryIsAdult] = useState(true);

  // Handle Profile Image Upload (simulated)
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Gallery Media Upload (simulated)
  const handleGalleryMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline || !bio || !imagePreview) {
      alert("Please fill in all required fields and upload a profile picture.");
      return;
    }

    const creatorData: Creator = {
      id: editingCreator ? editingCreator.id : name.toLowerCase().replace(/\s+/g, '-'),
      name,
      tagline,
      bio,
      image: imagePreview,
      rates: {
        hourly: Number(hourlyRate),
        event: Number(eventRate),
        VIPDinner: Number(dinnerRate)
      },
      specialties: specialties.split(',').map(s => s.trim()).filter(Boolean),
      boundaries: boundaries.split('\n').map(b => b.trim()).filter(Boolean),
      stats: editingCreator ? editingCreator.stats : { totalMeetups: 0, rating: 5.0, responseTime: '< 2 hours' },
      gallery: editingCreator ? editingCreator.gallery : [],
      upcomingEvents: editingCreator ? editingCreator.upcomingEvents : []
    };

    if (editingCreator) {
      onUpdateCreator(creatorData);
      alert("Pornstar profile updated successfully!");
      setEditingCreator(null);
    } else {
      onAddCreator(creatorData);
      alert("New Pornstar profile created successfully!");
      setActiveTab('manage');
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTagline('');
    setBio('');
    setImagePreview('');
    setHourlyRate(400);
    setEventRate(3000);
    setVIPDinnerRate(1200);
    setSpecialties('');
    setBoundaries('');
  };

  const handleEditClick = (creator: Creator) => {
    setEditingCreator(creator);
    setName(creator.name);
    setTagline(creator.tagline);
    setBio(creator.bio);
    setImagePreview(creator.image);
    setHourlyRate(creator.rates.hourly);
    setEventRate(creator.rates.event);
    setVIPDinnerRate(creator.rates.VIPDinner);
    setSpecialties(creator.specialties.join(', '));
    setBoundaries(creator.boundaries.join('\n'));
    setActiveTab('create');
  };

  // Gallery actions
  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorForGallery || !galleryTitle || !galleryCategory || !galleryUrl) {
      alert("Please fill in all gallery fields and select a file.");
      return;
    }

    const newItem = {
      id: `gal-${Date.now()}`,
      type: galleryType,
      url: galleryUrl,
      title: galleryTitle,
      category: galleryCategory,
      isAdult: galleryIsAdult
    };

    const updatedCreator = {
      ...selectedCreatorForGallery,
      gallery: [...selectedCreatorForGallery.gallery, newItem]
    };

    onUpdateCreator(updatedCreator);
    setSelectedCreatorForGallery(updatedCreator); // update local panel state
    
    // Reset gallery form
    setGalleryTitle('');
    setGalleryCategory('');
    setGalleryUrl('');
    setGalleryIsAdult(true);
    alert("Media uploaded to gallery successfully!");
  };

  const handleDeleteGalleryItem = (creator: Creator, itemId: string) => {
    if (!confirm("Are you sure you want to delete this image/video from the gallery?")) return;

    const updatedCreator = {
      ...creator,
      gallery: creator.gallery.filter(item => item.id !== itemId)
    };

    onUpdateCreator(updatedCreator);
    setSelectedCreatorForGallery(updatedCreator); // update local panel state
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-850">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-black text-white">Admin Control Panel</h2>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-zinc-400">Manage Pornstar accounts, upload 18+ explicit media, edit boundaries and rates.</p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('manage');
              setEditingCreator(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'manage' && !editingCreator
                ? 'bg-red-600 text-white'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Manage Roster
          </button>
          <button
            onClick={() => {
              setActiveTab('create');
              setEditingCreator(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'create' && !editingCreator
                ? 'bg-red-600 text-white'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Pornstar
          </button>
        </div>
      </div>

      {/* Main Panel */}
      {activeSubTab === 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Pornstars List */}
          <div className={`${selectedCreatorForGallery ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-850 overflow-hidden">
              <div className="p-4 border-b border-zinc-900 bg-zinc-950/40">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Star Profiles ({creators.length})</h3>
              </div>
              <div className="divide-y divide-zinc-900">
                {creators.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/30 transition">
                    <div className="flex items-center gap-3">
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
                        <p className="text-[10px] text-zinc-400">{c.tagline}</p>
                        <span className="text-[9px] text-zinc-500 font-mono">Gallery: {c.gallery.length} items</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCreatorForGallery(c)}
                        className={`p-2 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                          selectedCreatorForGallery?.id === c.id
                            ? 'bg-red-600/10 border-red-500/20 text-red-400'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title="Manage Photo/Video Gallery"
                      >
                        <Image className="h-3.5 w-3.5" />
                        Media
                      </button>
                      <button
                        onClick={() => handleEditClick(c)}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                        title="Edit Account Details"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete ${c.name}'s profile?`)) {
                            onDeleteCreator(c.id);
                            if (selectedCreatorForGallery?.id === c.id) setSelectedCreatorForGallery(null);
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Gallery Management (shows up when a star is selected) */}
          {selectedCreatorForGallery && (
            <div className="lg:col-span-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-zinc-900/40 rounded-2xl border border-zinc-850 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">Gallery of {selectedCreatorForGallery.name}</h3>
                    <p className="text-[10px] text-zinc-400">Upload explicit 18+ content, solo loops, or delete existing items.</p>
                  </div>
                  <button 
                    onClick={() => setSelectedCreatorForGallery(null)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload New Media Form */}
                <form onSubmit={handleAddGalleryItem} className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 space-y-4">
                  <span className="text-[10px] font-extrabold tracking-wider text-red-500 uppercase block">Upload New Image/Video</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-bold">Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Red Lingerie Solo" 
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-bold">Category</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Solo / Hardcore Teaser" 
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-bold">Media Type</label>
                      <select
                        value={galleryType}
                        onChange={(e) => setGalleryType(e.target.value as 'image' | 'video')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="image">Photo / Image</option>
                        <option value="video">Video Loop</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input 
                        type="checkbox" 
                        id="galIsAdult"
                        checked={galleryIsAdult} 
                        onChange={(e) => setGalleryIsAdult(e.target.checked)}
                        className="accent-red-600 h-4 w-4"
                      />
                      <label htmlFor="galIsAdult" className="text-xs font-bold text-white cursor-pointer select-none">
                        18+ Explicit Content
                      </label>
                    </div>
                  </div>

                  {/* Media File Upload */}
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-bold">Media File</label>
                    <div className="relative border border-dashed border-zinc-800 hover:border-red-500/30 rounded-lg p-4 text-center cursor-pointer transition">
                      <input 
                        type="file" 
                        accept={galleryType === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleGalleryMediaUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {galleryUrl ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-400 font-bold">Media Loaded Successfully!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                          <Upload className="h-4 w-4" />
                          <span>Select {galleryType === 'image' ? 'Photo' : 'Video'} File</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg transition"
                  >
                    Upload & Add to Gallery
                  </button>
                </form>

                {/* Existing Gallery List */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase block">Existing Gallery Items ({selectedCreatorForGallery.gallery.length})</span>
                  {selectedCreatorForGallery.gallery.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No media items in gallery yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedCreatorForGallery.gallery.map((item) => (
                        <div key={item.id} className="relative bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden group">
                          {item.type === 'image' ? (
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              className="h-24 w-full object-cover opacity-80"
                            />
                          ) : (
                            <div className="h-24 w-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-xs gap-1">
                              <Video className="h-4 w-4" />
                              Video Loop
                            </div>
                          )}

                          {/* Overlay details */}
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-between text-left">
                            <div className="truncate">
                              <span className="text-[10px] font-bold text-white block truncate">{item.title}</span>
                              <span className="text-[8px] text-zinc-400 block truncate">{item.category}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              {item.isAdult && (
                                <span className="bg-red-600 text-[7px] text-white font-extrabold px-1 py-0.5 rounded">
                                  18+
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryItem(selectedCreatorForGallery, item.id)}
                                className="p-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded transition"
                                title="Delete Media"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Create / Edit Form */}
      {activeSubTab === 'create' && (
        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-850 p-6 md:p-8">
          <h3 className="text-lg font-serif font-black text-white mb-4">
            {editingCreator ? `Edit Account: ${editingCreator.name}` : 'Create New Pornstar Profile'}
          </h3>

          <form onSubmit={handleSaveCreator} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Stage Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Amara Vance" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white"
                    required
                    disabled={!!editingCreator}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tagline *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Content Creator & Streamer" 
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Biography *</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe their background, career details, and meetup preferences..." 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Rates & Upload */}
              <div className="space-y-4">
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Profile Picture *</label>
                  <div className="relative border border-dashed border-zinc-800 hover:border-red-500/30 rounded-xl p-6 text-center cursor-pointer transition bg-zinc-950/40">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img src={imagePreview} alt="Profile Preview" className="h-20 w-20 mx-auto rounded-full object-cover border border-zinc-800" />
                        <span className="text-xs text-emerald-400 font-bold block">Profile Picture Loaded!</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="h-6 w-6 text-zinc-500 mx-auto" />
                        <span className="text-xs text-zinc-300 font-semibold block">Upload Profile Photo</span>
                        <span className="text-[9px] text-zinc-500 block">PNG, JPG up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialties / Tags */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Approved Specialties / Services</label>
                  <span className="text-[10px] text-zinc-500 block mb-2">Comma separated (e.g. Cosplay Photo Session, Fetish, Private Dining)</span>
                  <input 
                    type="text" 
                    placeholder="Cosplay Photo Sessions, VIP Dinners, Private Shoots" 
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Base Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Base Hourly Rate ($)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">VIP Dinner Rate ($)</label>
                <input 
                  type="number" 
                  value={dinnerRate}
                  onChange={(e) => setVIPDinnerRate(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Day Event Rate ($)</label>
                <input 
                  type="number" 
                  value={eventRate}
                  onChange={(e) => setEventRate(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white"
                  required
                />
              </div>
            </div>

            {/* Boundaries */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Strict Boundaries & Rules</label>
              <span className="text-[10px] text-zinc-500 block mb-2">Enter each rule on a new line. These are displayed to fans before they book.</span>
              <textarea 
                rows={4}
                placeholder="Strictly professional and platonic public meetups only.&#10;No physical contact beyond a polite hug.&#10;No unauthorized recording." 
                value={boundaries}
                onChange={(e) => setBoundaries(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('manage');
                  setEditingCreator(null);
                  resetForm();
                }}
                className="bg-zinc-900 text-zinc-300 font-bold text-sm py-3 px-6 rounded-xl hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-8 rounded-xl transition flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                {editingCreator ? 'Save Changes' : 'Publish Star Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
