import { Home, MessageCircle, Users, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'home', label: 'Discover', icon: Home },
  { id: 'community', label: 'Circles', icon: Users },
  { id: 'matches', label: 'Matches', icon: MessageCircle },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary-50 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
              <span className="relative z-10 text-[10px] font-semibold">{item.label}</span>
              {item.id === 'matches' && isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-primary-500 rounded-full z-20" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
