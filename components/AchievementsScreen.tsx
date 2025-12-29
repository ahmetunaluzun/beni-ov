import React from 'react';
import { Achievement } from '../achievements';

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-2xl shadow-purple-500/10">
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Başarımlar
        </h2>
        <p className="text-gray-400">
          {unlocked.length} / {achievements.length} Başarım Açıldı
        </p>
        <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Açılan Başarımlar */}
      {unlocked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-300 px-2">Açılan Başarımlar ✨</h3>
          {unlocked.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} unlocked={true} />
          ))}
        </div>
      )}

      {/* Kilitli Başarımlar */}
      {locked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-300 px-2">Kilitli Başarımlar 🔒</h3>
          {locked.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
          ))}
        </div>
      )}
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked }) => {
  return (
    <div
      className={`bg-black/30 backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 ${
        unlocked
          ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
          : 'border-white/10 opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`text-4xl ${unlocked ? 'animate-bounce' : 'grayscale'}`}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-bold text-lg ${unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.title}
            </h4>
            {unlocked && (
              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                ✓ Açıldı
              </span>
            )}
          </div>
          
          <p className={`text-sm mt-1 ${unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {achievement.description}
          </p>

          {unlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}

          {!unlocked && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-600 to-gray-700"
                  style={{ width: '0%' }}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                0/{achievement.requirement}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Başarım bildirim kartı (modal)
interface AchievementUnlockedNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementUnlockedNotification: React.FC<AchievementUnlockedNotificationProps> = ({
  achievement,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 border-2 border-yellow-400 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl shadow-yellow-400/30 animate-bounce">
        <div className="text-6xl mb-4 animate-spin-slow">{achievement.icon}</div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Başarım Açıldı!</h2>
        <h3 className="text-xl font-semibold text-white mb-2">{achievement.title}</h3>
        <p className="text-gray-300 mb-6">{achievement.description}</p>
        <button
          onClick={onClose}
          className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-lg"
        >
          Harika! 🎉
        </button>
      </div>
    </div>
  );
};
