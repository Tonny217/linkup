import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Shield, Eye, MapPin, Moon, HelpCircle, LogOut, ChevronRight, User, Volume2, MessageSquare, Fingerprint } from 'lucide-react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';

export default function Settings({ onBack, onLogout }) {
  const [showSafety, setShowSafety] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);

  const sections = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: notifications, toggle: setNotifications },
        { icon: MapPin, label: 'Location Services', value: location, toggle: setLocation },
        { icon: Moon, label: 'Dark Mode', value: darkMode, toggle: setDarkMode },
        { icon: Eye, label: 'Private Mode', value: privateMode, toggle: setPrivateMode },
      ]
    },
    {
      title: 'Safety & Privacy',
      items: [
        { icon: Shield, label: 'Safety Center', action: () => setShowSafety(true) },
        { icon: Fingerprint, label: 'Verification Status', value: 'Verified', arrow: true },
        { icon: User, label: 'Blocked Users', arrow: true },
        { icon: Volume2, label: 'Voice & Video Settings', arrow: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', arrow: true },
        { icon: MessageSquare, label: 'Contact Us', arrow: true },
      ]
    }
  ];

  return (
    <div className="page-container">
      <TopBar title="Settings" showBack onBack={onBack} />

      <div className="px-4 py-2 space-y-6">
        {sections.map((section, si) => (
          <div key={si}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              {section.items.map((item, ii) => (
                <motion.button
                  key={ii}
                  whileTap={{ scale: 0.99 }}
                  onClick={item.action || (() => item.toggle && item.toggle(!item.value))}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-all ${
                    ii !== section.items.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <item.icon size={20} className="text-slate-500" />
                  <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
                  {item.toggle !== undefined ? (
                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                      item.value ? 'bg-primary-600' : 'bg-slate-200'
                    }`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                        item.value ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </div>
                  ) : item.arrow ? (
                    <ChevronRight size={18} className="text-slate-300" />
                  ) : (
                    <span className="text-sm text-slate-500">{item.value}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-all"
        >
          <LogOut size={18} />
          Log Out
        </motion.button>

        <p className="text-center text-xs text-slate-400">
          LinkUp v1.0.0 - Made with care for Tanzania
        </p>
      </div>

      {/* Safety Center Modal */}
      <Modal isOpen={showSafety} onClose={() => setShowSafety(false)} title="Safety Center">
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <h4 className="font-semibold text-emerald-900 mb-2">Meeting Safety</h4>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                Always meet in public places
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                Tell a friend where you are going
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                Use our in-app safety button
              </li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2">Report System</h4>
            <p className="text-sm text-blue-800">
              Our AI monitors conversations for scams and inappropriate content. You can report users directly from their profile or chat.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <h4 className="font-semibold text-amber-900 mb-2">Verification</h4>
            <p className="text-sm text-amber-800">
              Verified users have passed photo and ID checks. Look for the verification badge on profiles.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
