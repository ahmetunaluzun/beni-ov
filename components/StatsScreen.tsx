import React from 'react';
import { Statistics } from '../services/statisticsService';

interface StatsScreenProps {
  stats: Statistics;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ stats }) => {
  return (
    <div className="space-y-4">
      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon="✨"
          label="Toplam Övgü"
          value={stats.totalPraises}
          color="purple"
        />
        <StatCard
          icon="❤️"
          label="Favoriler"
          value={stats.totalFavorites}
          color="pink"
        />
        <StatCard
          icon="🔥"
          label="Mevcut Seri"
          value={`${stats.currentStreak} gün`}
          color="orange"
        />
        <StatCard
          icon="🏆"
          label="En Uzun Seri"
          value={`${stats.longestStreak} gün`}
          color="amber"
        />
      </div>

      {/* Stil Kullanımı */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Stil Kullanımı
        </h3>
        <div className="space-y-3">
          {stats.styleUsage.map((style, index) => (
            <div key={style.style} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 capitalize">{getStyleName(style.style)}</span>
                <span className="text-gray-400">{style.count} kez ({style.percentage}%)</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getStyleColor(index)}`}
                  style={{ width: `${style.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ortalamalar */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Ortalamalar
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Haftalık Ortalama</span>
            <span className="text-white font-semibold">{stats.weeklyAverage} övgü/gün</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Aylık Ortalama</span>
            <span className="text-white font-semibold">{stats.monthlyAverage} övgü/gün</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Toplam Paylaşım</span>
            <span className="text-white font-semibold">{stats.totalShares}</span>
          </div>
        </div>
      </div>

      {/* Başarım İlerlemesi */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">Başarımlar</h3>
          <span className="text-gray-400 text-sm">
            {stats.achievementsUnlocked}/{stats.achievementsTotal}
          </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${(stats.achievementsUnlocked / stats.achievementsTotal) * 100}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-2 text-center">
          {Math.round((stats.achievementsUnlocked / stats.achievementsTotal) * 100)}% Tamamlandı
        </p>
      </div>

      {/* Kullanım Süresi */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-gray-400 text-sm">
          Beni Öv ile <span className="text-purple-400 font-semibold">{stats.totalDays} gündür</span> berabersin! 💜
        </p>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className={`text-${color}-400 text-2xl font-bold`}>{value}</div>
    </div>
  );
};

const getStyleName = (style: string): string => {
  const names: Record<string, string> = {
    motivational: 'Motive Edici',
    humorous: 'Esprili',
    loving: 'Sevgi Dolu',
    heroic: 'Kahramanca',
    poetic: 'Şiirsel',
    sincere: 'Samimi',
    friendly: 'Arkadaşça',
    acrostic: 'Akrostiş'
  };
  return names[style] || style;
};

const getStyleColor = (index: number): string => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-teal-500 to-green-500'
  ];
  return colors[index % colors.length];
};
