import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Briefcase, GraduationCap, Heart, Settings, Edit3, Share2, Link as LinkIcon, Crown, Shield, Volume2, Video, Star, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import VerificationBadge from '../components/VerificationBadge';
import { api } from '../services/api';

export default function Profile({ onNavigate }) {
  const user = api.getCurrentUser() || {
    id: 'me',
    name: 'Telegram User',
    age: 25,
    location: 'Dar es Salaam',
    profession: 'Developer',
    education: 'University',
    interests: ['Tech', 'Music', 'Travel'],
    goals: 'Long-term relationship',
    bio: 'New to LinkUp! Excited to meet amazing people.',
    photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop'],
    voiceIntro: false,
    videoIntro: false,
    verified: true,
    verificationLevel: 'basic',
    community: 'IT Professionals',
    highlights: [],
    premium: false
  };

  const [showShare, setShowShare] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const profileUrl = `https://linkup.app/u/${user.id}`;

  return (
    <div className="page-container">
      <TopBar 
        title="Profile" 
        rightIcon={Settings}
        onRightClick={() => onNavigate('settings')}
        isPremium={user.premium}
      />

      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-br from-primary-400 to-accent-400 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <img 
              src={user.photos[0]} 
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-all">
              <Camera size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.name}, {user.age}</h1>
        <div className="flex items-center justify-center gap-2 mb-3">
          <VerificationBadge level={user.verificationLevel} />
          {user.premium && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
              <Crown size={12} />
              Premium
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mb-4">
          <MapPin size={14} />
          {user.location}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">24</p>
            <p className="text-xs text-slate-500">Matches</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">156</p>
            <p className="text-xs text-slate-500">Likes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">12</p>
            <p className="text-xs text-slate-500">Events</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setShowEdit(true)}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
          <button 
            onClick={() => setShowShare(true)}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-slate-900 mb-3">About</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{user.bio}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Briefcase size={16} className="text-slate-400" />
              <span className="text-slate-600">{user.profession}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <GraduationCap size={16} className="text-slate-400" />
              <span className="text-slate-600">{user.education}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Heart size={16} className="text-slate-400" />
              <span className="text-slate-600">{user.goals}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={16} className="text-slate-400" />
              <span className="text-slate-600">{user.community}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-slate-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(interest => (
              <span key={interest} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-slate-900 mb-3">Media</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-all">
              <Volume2 size={24} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Voice Intro</span>
            </button>
            <button className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-all">
              <Video size={24} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Video Intro</span>
            </button>
          </div>
        </div>

        {!user.premium && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('premium')}
            className="w-full p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl text-white text-left relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={18} className="fill-white" />
                  <span className="font-bold">Upgrade to Premium</span>
                </div>
                <p className="text-sm text-white/90">Unlock unlimited likes, advanced filters, and more</p>
              </div>
              <ChevronRight size={20} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          </motion.button>
        )}
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShare} onClose={() => setShowShare(false)} title="Share Profile">
        <div className="text-center">
          <div className="w-48 h-48 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-40 h-40 bg-white rounded-xl p-2">
              <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
                <LinkIcon size={40} className="text-slate-400" />
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-4">Share this link with friends</p>
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl mb-4">
            <input 
              type="text" 
              value={profileUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
            />
            <button 
              onClick={() => navigator.clipboard?.writeText(profileUrl)}
              className="px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700"
            >
              Copy
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Bio</label>
            <textarea className="input-field min-h-[100px] resize-none" defaultValue={user.bio} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Profession</label>
            <input type="text" className="input-field" defaultValue={user.profession} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Relationship Goal</label>
            <select className="input-field">
              <option>Long-term relationship</option>
              <option>Marriage</option>
              <option>Serious relationship</option>
              <option>Casual</option>
            </select>
          </div>
          <button 
            onClick={() => setShowEdit(false)}
            className="btn-primary w-full"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}
