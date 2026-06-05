import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, MessageCircle, Zap, Check, MapPin, Briefcase, GraduationCap, Camera, Volume2, Video, Star, ChevronRight, Crown, AlertTriangle, Phone, Fingerprint } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import Community from './pages/Community';
import Events from './pages/Events';
import { api } from './services/api';
import { initTelegramAuth } from './services/telegram';

const steps = [
  { field: 'photos', icon: Camera, label: 'Add Photos', desc: 'Upload your best photos' },
  { field: 'bio', icon: MessageCircle, label: 'Bio', desc: 'Tell us about yourself' },
  { field: 'profession', icon: Briefcase, label: 'Profession', desc: 'What do you do?' },
  { field: 'education', icon: GraduationCap, label: 'Education', desc: 'Your academic background' },
  { field: 'interests', icon: Star, label: 'Interests', desc: 'What do you love?' },
  { field: 'voice', icon: Volume2, label: 'Voice Intro', desc: '30-second voice clip' },
  { field: 'video', icon: Video, label: 'Video Intro', desc: '15-second video intro' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [chatMatch, setChatMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const current = api.getCurrentUser();
    if (current) {
      setUser(current);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleNav = (e) => {
      if (e.detail === 'matches') setPage('matches');
      if (e.detail === 'home') setPage('home');
    };
    window.addEventListener('navigate', handleNav);
    return () => window.removeEventListener('navigate', handleNav);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const tgUser = await initTelegramAuth();
    const newUser = {
      id: tgUser.id,
      name: tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
      photos: [tgUser.photo_url],
      verified: true,
      verificationLevel: 'basic',
      age: 25,
      gender: 'male',
      location: 'Dar es Salaam',
      profession: 'Professional',
      education: 'University',
      interests: [],
      goals: 'Long-term relationship',
      bio: '',
      voiceIntro: false,
      videoIntro: false,
      community: 'IT Professionals',
      highlights: [],
      premium: false,
      online: true
    };
    api.setCurrentUser(newUser);
    setUser(newUser);
    setLoading(false);
    setOnboarding(true);
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < steps.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      const finalUser = { ...user, ...profileData };
      api.setCurrentUser(finalUser);
      setUser(finalUser);
      setOnboarding(false);
    }
  };

  const handleNavigate = (target, data) => {
    if (target === 'chat' && data) {
      setChatMatch(data);
      setPage('chat');
    } else if (target === 'settings') {
      setPage('settings');
    } else if (target === 'premium') {
      setPage('premium');
    } else {
      setPage(target);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('linkup_data');
    setUser(null);
    setPage('home');
  };

  const handlePurchase = () => {
    const updated = { ...user, premium: true };
    api.setCurrentUser(updated);
    setUser(updated);
    setPage('profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center"
        >
          <Heart size={32} className="text-white fill-white" />
        </motion.div>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-primary-200"
          >
            <Heart size={48} className="text-white fill-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-slate-900 mb-3"
          >
            LinkUp
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-slate-500 mb-12 max-w-xs"
          >
            Meaningful connections for Tanzania's vibrant communities
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xs space-y-4"
          >
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-[#0088cc] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#0077b3] active:scale-95 transition-all shadow-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Continue with Telegram
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Phone size={20} />
              Use Phone Number
            </button>
          </motion.div>
        </div>

        <div className="px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield size={14} className="text-emerald-500" />
              Verified Profiles
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Fingerprint size={14} className="text-primary-500" />
              AI Scam Detection
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} className="text-accent-500" />
              Local Focus
            </div>
          </div>
          <p className="text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  // Onboarding
  if (onboarding) {
    const step = steps[onboardingStep];
    const StepIcon = step.icon;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i <= onboardingStep ? 'bg-primary-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={() => setOnboarding(false)}
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            Skip for now
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center w-full max-w-xs"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <StepIcon size={36} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.label}</h2>
            <p className="text-slate-500 mb-8">{step.desc}</p>

            {step.field === 'photos' && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1,2,3,4,5,6].map(i => (
                  <button key={i} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border-2 border-dashed border-slate-200">
                    <Camera size={20} className="text-slate-400" />
                  </button>
                ))}
              </div>
            )}
            {step.field === 'bio' && (
              <textarea 
                className="input-field min-h-[120px] resize-none mb-8"
                placeholder="I love hiking, cooking, and deep conversations..."
                onChange={e => setProfileData({...profileData, bio: e.target.value})}
              />
            )}
            {step.field === 'profession' && (
              <input 
                type="text"
                className="input-field mb-8"
                placeholder="e.g. Software Engineer"
                onChange={e => setProfileData({...profileData, profession: e.target.value})}
              />
            )}
            {step.field === 'education' && (
              <select 
                className="input-field mb-8"
                onChange={e => setProfileData({...profileData, education: e.target.value})}
              >
                <option>High School</option>
                <option>College/Diploma</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>PhD</option>
              </select>
            )}
            {step.field === 'interests' && (
              <div className="flex flex-wrap gap-2 mb-8">
                {['Travel', 'Music', 'Food', 'Sports', 'Tech', 'Art', 'Reading', 'Dancing', 'Photography', 'Gaming'].map(i => (
                  <button 
                    key={i}
                    onClick={() => {
                      const current = profileData.interests || [];
                      const updated = current.includes(i) ? current.filter(x => x !== i) : [...current, i];
                      setProfileData({...profileData, interests: updated});
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      (profileData.interests || []).includes(i)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            )}
            {(step.field === 'voice' || step.field === 'video') && (
              <button className="w-full py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-2 hover:bg-slate-100 transition-all mb-8">
                <StepIcon size={32} className="text-slate-400" />
                <span className="text-sm text-slate-500">Tap to record</span>
              </button>
            )}
          </motion.div>
        </div>

        <div className="px-6 py-8">
          <button 
            onClick={handleOnboardingNext}
            className="btn-primary w-full"
          >
            {onboardingStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            {page === 'home' && <Home />}
            {page === 'matches' && <Matches onNavigate={handleNavigate} />}
            {page === 'chat' && <Chat match={chatMatch} onBack={() => setPage('matches')} />}
            {page === 'profile' && <Profile onNavigate={handleNavigate} />}
            {page === 'premium' && <Premium onBack={() => setPage('profile')} onPurchase={handlePurchase} />}
            {page === 'settings' && <Settings onBack={() => setPage('profile')} onLogout={handleLogout} />}
            {page === 'community' && <Community onNavigate={handleNavigate} />}
            {page === 'events' && <Events onNavigate={handleNavigate} />}
          </motion.div>
        </AnimatePresence>

        {['home', 'matches', 'community', 'events', 'profile'].includes(page) && (
          <BottomNav active={page} onNavigate={setPage} />
        )}
      </div>
    </div>
  );
}
