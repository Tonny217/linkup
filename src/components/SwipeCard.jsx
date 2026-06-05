import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Heart, X, Star, Volume2, Video, ChevronRight, Shield, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import VerificationBadge from './VerificationBadge';
import CompatibilityScore from './CompatibilityScore';

export default function SwipeCard({ user, onLike, onPass, onSuperLike, isTop }) {
  const [expanded, setExpanded] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 150) {
      controls.start({ x: 300, opacity: 0 }).then(() => onLike(user));
    } else if (info.offset.x < -150) {
      controls.start({ x: -300, opacity: 0 }).then(() => onPass(user));
    } else {
      controls.start({ x: 0, rotate: 0 });
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 w-full h-full ${!isTop ? 'scale-95 translate-y-4' : ''}`}
    >
      <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden card-shadow">
        {/* Image */}
        <div className="relative h-[65%] overflow-hidden">
          <img 
            src={user.photos[0]} 
            alt={user.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Overlays */}
          <motion.div 
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-8 border-4 border-emerald-500 rounded-xl px-4 py-2 transform -rotate-12"
          >
            <span className="text-3xl font-bold text-emerald-500 uppercase tracking-wider">LIKE</span>
          </motion.div>
          <motion.div 
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-8 border-4 border-red-500 rounded-xl px-4 py-2 transform rotate-12"
          >
            <span className="text-3xl font-bold text-red-500 uppercase tracking-wider">NOPE</span>
          </motion.div>

          {/* Top info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2">
              {user.online && (
                <span className="px-2 py-1 bg-emerald-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Online
                </span>
              )}
              <VerificationBadge level={user.verificationLevel} />
            </div>
            <CompatibilityScore score={user.compatibility} />
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}, {user.age}</h2>
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.distance}km away
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {user.voiceIntro && (
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                    <Volume2 size={18} className="text-white" />
                  </button>
                )}
                {user.videoIntro && (
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                    <Video size={18} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="h-[35%] p-5 overflow-y-auto scrollbar-hide">
          <div className="flex flex-wrap gap-2 mb-3">
            {user.interests.map(interest => (
              <span key={interest} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                {interest}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-slate-400" />
              {user.profession}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap size={14} className="text-slate-400" />
              {user.education}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-3">{user.bio}</p>

          {user.highlights && (
            <div className="space-y-1.5 mb-3">
              {user.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  {h}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield size={12} />
            <span>Community: {user.community}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
