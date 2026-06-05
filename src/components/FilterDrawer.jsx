import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export default function FilterDrawer({ isOpen, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);

  const locations = ['All', 'Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar'];
  const communities = ['All', 'IT Professionals', 'Entrepreneurs', 'Teachers', 'Healthcare Workers', 'University Students'];
  const goals = ['All', 'Long-term relationship', 'Marriage', 'Serious relationship', 'Casual'];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-[55] bg-white rounded-t-3xl shadow-2xl max-w-md mx-auto"
      style={{ height: '75vh' }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100">
          <X size={20} className="text-slate-500" />
        </button>
      </div>

      <div className="overflow-y-auto p-6 space-y-6" style={{ height: 'calc(75vh - 140px)' }}>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">Location</label>
          <div className="flex flex-wrap gap-2">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setLocal({...local, location: loc})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  local.location === loc 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">Age Range</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={local.minAge}
              onChange={e => setLocal({...local, minAge: parseInt(e.target.value)})}
              className="input-field w-24 text-center"
              min={18}
              max={80}
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              value={local.maxAge}
              onChange={e => setLocal({...local, maxAge: parseInt(e.target.value)})}
              className="input-field w-24 text-center"
              min={18}
              max={80}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">Community</label>
          <div className="flex flex-wrap gap-2">
            {communities.map(c => (
              <button
                key={c}
                onClick={() => setLocal({...local, community: c})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  local.community === c 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">Relationship Goal</label>
          <div className="flex flex-wrap gap-2">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => setLocal({...local, goal: g})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  local.goal === g 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="verified"
            checked={local.verifiedOnly}
            onChange={e => setLocal({...local, verifiedOnly: e.target.checked})}
            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="verified" className="text-sm font-medium text-slate-700">Verified profiles only</label>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <button 
          onClick={() => { onApply(local); onClose(); }}
          className="btn-primary w-full"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}
