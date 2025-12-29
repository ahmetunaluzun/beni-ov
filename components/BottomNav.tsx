import React from 'react';
import { SparklesIcon, HeartIcon, UserIcon } from './Icons';

// Home icon component
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

type View = 'praise' | 'favorites' | 'about';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems: Array<{ id: View; icon: React.FC<{ className?: string }>; label: string }> = [
    { id: 'praise', icon: HomeIcon, label: 'Ana Sayfa' },
    { id: 'favorites', icon: HeartIcon, label: 'Favoriler' },
    { id: 'about', icon: UserIcon, label: 'Hakkında' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 safe-area-bottom z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-400' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
