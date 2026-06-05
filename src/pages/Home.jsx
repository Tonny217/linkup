import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, MapPin, Heart, X, Star, Zap, RotateCcw, Volume2 } from 'lucide-react';
import SwipeCard from '../components/SwipeCard';
import FilterDrawer from '../components/FilterDrawer';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import TopBar from '../components/TopBar';
import { api } from '../services/api';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    location: 'All',
    minAge: 18,
    maxAge: 50,
    community: 'All',
    goal: 'All',
    verifiedOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [matchModal, setMatchModal] = useState(null);
  const [dailyMatch, setDailyMatch] = useState(null);
  const [showDaily, setShowDaily] = useState(false);

  useEffect(() => {
    const allUsers = api.getUsers();
    const current = api.getCurrentUser();
    const filtered = allUsers.filter(u => {
      if (u.id === current?.id) return false;
      if (filters.location !== 'All' && u.location !== filters.location) return false;
      if (u.age < filters.minAge || u.age > filters.maxAge) return false;
      if (filters.community !== 'All' && u.community !== filters.community) return false;
      if (filters.goal !== 'All' && u.goals !== filters.goal) return false;
      if (filters.verifiedOnly && !u.verified) return false;
      return !api.hasLiked(u.id);
    });
    setUsers(filtered);

    // Daily match
    if (filtered.length > 0 && !dailyMatch) {
      const best = filtered.reduce((prev, curr) => prev.compatibility > curr.compatibility ? prev : curr);
      setDailyMatch(best);
      setShowDaily(true);
    }
  }, [filters]);

  const handleLike = (user) => {
    api.addLike(user.id);
    // Simulate match
    if (Math.random() > 0.3) {
      const match = {
        id: `match_${user.id}`,
        user,
        matchedAt: new Date().toISOString(),
        unread: 0
      };
      api.addMatch(match);
      setMatchModal(match);
    }
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handlePass = (user) => {
    api.addLike(user.id);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleSuperLike = (user) => {
    api.addLike(user.id);
    const match = {
      id: `match_${user.id}`,
      user,
      matchedAt: new Date().toISOString(),
      unread: 1,
      superLike: true
    };
    api.addMatch(match);
    api.sendMessage(match.id, "Super liked your profile! Let's connect.", 'me');
    setMatchModal(match);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleRewind = () => {
    const allUsers = api.getUsers();
    const current = api.getCurrentUser();
    const filtered = allUsers.filter(u => u.id !== current?.id);
    setUsers(filtered);
  };

  return (
    <div className="page-container">
      <TopBar 
        title="Discover" 
        subtitle={users.length > 0 ? `${users.length} people nearby` : 'No more profiles'}
        rightIcon={SlidersHorizontal}
        onRightClick={() => setShowFilters(true)}
      />

      {/* Daily Match Banner */}
      {showDaily && dailyMatch && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 p-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="fill-white" />
                <span className="text-xs font-bold uppercase tracking-wider">Daily Match</span>
              </div>
              <p className="text-sm font-medium">{dailyMatch.name} is {dailyMatch.compatibility}% compatible</p>
            </div>
            <button 
              onClick={() => setShowDaily(false)}
              className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold hover:bg-white/30"
            >
              View
            </button>
          </div>
        </motion.div>
      )}

      {/* Card Stack */}
      <div className="relative mx-4 mt-4" style={{ height: 'calc(100vh - 280px)' }}>
        <AnimatePresence>
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.id} className="absolute inset-0" style={{ zIndex: users.length - index }}>
                <SwipeCard 
                  user={user} 
                  onLike={handleLike}
                  onPass={handlePass}
                  isTop={index === 0}
                />
              </div>
            )).reverse()
          ) : (
            <EmptyState
              icon={MapPin}
              title="No more profiles"
              description="Adjust your filters or check back later for new people in your area."
              action={handleRewind}
              actionLabel="Reset & Rewind"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {users.length > 0 && (
        <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-4 px-6">
          <button 
            onClick={() => handlePass(users[0])}
            className="w-14 h-14 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <X size={24} className="text-red-500" strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => handleSuperLike(users[0])}
            className="w-12 h-12 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <Star size={20} className="text-amber-500 fill-amber-500" />
          </button>
          <button 
            onClick={() => handleLike(users[0])}
            className="w-14 h-14 bg-white border-2 border-emerald-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <Heart size={24} className="text-emerald-500 fill-emerald-500" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
      />

      {/* Match Modal */}
      <Modal isOpen={!!matchModal} onClose={() => setMatchModal(null)} title="It's a Match!">
        {matchModal && (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img 
                src={matchModal.user.photos[0]} 
                alt={matchModal.user.name}
                className="w-full h-full object-cover rounded-full border-4 border-primary-200"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                <Heart size={20} className="text-white fill-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              You and {matchModal.user.name}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {matchModal.superLike ? 'Super Liked each other!' : 'Have liked each other'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMatchModal(null)}
                className="btn-secondary flex-1"
              >
                Keep Swiping
              </button>
              <button 
                onClick={() => {
                  setMatchModal(null);
                  window.dispatchEvent(new CustomEvent('navigate', { detail: 'matches' }));
                }}
                className="btn-primary flex-1"
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
