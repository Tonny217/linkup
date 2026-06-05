import { ArrowLeft, Settings, Shield, Crown } from 'lucide-react';

export default function TopBar({ title, subtitle, showBack, onBack, rightAction, rightIcon: RightIcon, onRightClick, isPremium }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 safe-top">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              <ArrowLeft size={22} className="text-slate-700" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
              <Crown size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">PRO</span>
            </div>
          )}
          {RightIcon && (
            <button 
              onClick={onRightClick}
              className="p-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              <RightIcon size={22} className="text-slate-700" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
