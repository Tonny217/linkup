import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Search, UserPlus, MessageCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { api } from '../services/api';

const communities = [
  {
    id: 'it',
    name: 'IT Professionals',
    icon: '💻',
    color: 'bg-blue-500',
    members: 1240,
    description: 'Developers, designers, and tech enthusiasts',
    trending: true
  },
  {
    id: 'entrepreneurs',
    name: 'Entrepreneurs',
    icon: '🚀',
    color: 'bg-amber-500',
    members: 856,
    description: 'Business owners and startup founders',
    trending: true
  },
  {
    id: 'teachers',
    name: 'Teachers',
    icon: '📚',
    color: 'bg-emerald-500',
    members: 643,
    description: 'Educators shaping the future',
    trending: false
  },
  {
    id: 'healthcare',
    name: 'Healthcare Workers',
    icon: '🏥',
    color: 'bg-red-500',
    members: 920,
    description: 'Doctors, nurses, and medical staff',
    trending: false
  },
  {
    id: 'students',
    name: 'University Students',
    icon: '🎓',
    color: 'bg-purple-500',
    members: 2100,
    description: 'Students from universities across Tanzania',
    trending: true
  },
  {
    id: 'parents',
    name: 'Single Parents',
    icon: '👨‍👩‍👧',
    color: 'bg-pink-500',
    members: 432,
    description: 'Supportive community for single parents',
    trending: false
  },
  {
    id: 'sports',
    name: 'Sports Lovers',
    icon: '⚽',
    color: 'bg-orange-500',
    members: 1567,
    description: 'Football, basketball, athletics fans',
    trending: false
  },
  {
    id: 'arts',
    name: 'Artists & Creatives',
    icon: '🎨',
    color: 'bg-indigo-500',
    members: 734,
    description: 'Musicians, painters, writers, dancers',
    trending: false
  }
];

export default function Community({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [joined, setJoined] = useState(['it']);

  const filtered = communities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleJoin = (id) => {
    setJoined(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="page-container">
      <TopBar title="Community Circles" subtitle="Find your tribe" />

      <div className="px-4 py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* My Communities */}
      {joined.length > 0 && (
        <div className="px-4 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">My Circles</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {joined.map(id => {
              const c = communities.find(x => x.id === id);
              return (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-32 p-3 bg-white rounded-2xl card-shadow text-center"
                >
                  <div className={`w-12 h-12 ${c.color} rounded-full flex items-center justify-center mx-auto mb-2 text-2xl`}>
                    <Users size={24} className="text-white" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.members} members</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* All Communities */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Discover</h3>
        {filtered.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-4 card-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 ${community.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Users size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-slate-900">{community.name}</h3>
                  {community.trending && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full">
                      HOT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-2">{community.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{community.members.toLocaleString()} members</span>
                  <button
                    onClick={() => toggleJoin(community.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      joined.includes(community.id)
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {joined.includes(community.id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Users}
          title="No communities found"
          description="Try a different search term"
        />
      )}
    </div>
  );
}
