import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Heart, ChevronRight, Star } from 'lucide-react';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { api } from '../services/api';
import { formatTime } from '../utils/helpers';

export default function Matches({ onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    const loadMatches = () => {
      const data = api.getMatches();
      setMatches(data);
    };
    loadMatches();
    const interval = setInterval(loadMatches, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = matches.filter(m => 
    m.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const newMatches = filtered.filter(m => {
    const messages = api.getMessages(m.id);
    return messages.length === 0;
  });

  const activeChats = filtered.filter(m => {
    const messages = api.getMessages(m.id);
    return messages.length > 0;
  });

  const displayMatches = activeTab === 'matches' ? newMatches : activeChats;

  return (
    <div className="page-container">
      <TopBar title="Matches" subtitle={`${matches.length} connections`} />

      <div className="px-4 py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search matches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="flex px-4 gap-2 mb-4">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'matches' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          New Matches
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'messages' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Messages
        </button>
      </div>

      {displayMatches.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={activeTab === 'matches' ? "No new matches" : "No messages yet"}
          description={activeTab === 'matches' ? "Start swiping to find your perfect match" : "When you match with someone, your conversations will appear here"}
          action={() => onNavigate('home')}
          actionLabel="Start Swiping"
        />
      ) : (
        <div className="px-4 space-y-3">
          {displayMatches.map((match, index) => {
            const messages = api.getMessages(match.id);
            const lastMessage = messages[messages.length - 1];

            return (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onNavigate('chat', match)}
                className="w-full flex items-center gap-4 p-3 bg-white rounded-2xl card-shadow hover:bg-slate-50 transition-all text-left"
              >
                <div className="relative">
                  <img 
                    src={match.user.photos[0]} 
                    alt={match.user.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  {match.user.online && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                  {match.superLike && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Star size={10} className="text-white fill-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-slate-900 truncate">{match.user.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-slate-400">{formatTime(lastMessage.timestamp)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {lastMessage ? lastMessage.text : `Matched ${formatTime(match.matchedAt)}`}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
