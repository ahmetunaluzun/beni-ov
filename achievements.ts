export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: number;
  category: 'praise' | 'favorite' | 'share' | 'streak' | 'style';
}

export const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Övgü Başarımları
  {
    id: 'first_praise',
    title: '🌟 İlk Adım',
    description: 'İlk övgünü aldın!',
    icon: '🌟',
    requirement: 1,
    category: 'praise'
  },
  {
    id: 'praise_10',
    title: '✨ Övgü Avcısı',
    description: '10 övgü ürettin',
    icon: '✨',
    requirement: 10,
    category: 'praise'
  },
  {
    id: 'praise_50',
    title: '💫 Övgü Ustası',
    description: '50 övgü ürettin',
    icon: '💫',
    requirement: 50,
    category: 'praise'
  },
  {
    id: 'praise_100',
    title: '🌠 Övgü Efsanesi',
    description: '100 övgü ürettin!',
    icon: '🌠',
    requirement: 100,
    category: 'praise'
  },
  
  // Favori Başarımları
  {
    id: 'first_favorite',
    title: '❤️ İlk Favori',
    description: 'İlk favorini ekledin',
    icon: '❤️',
    requirement: 1,
    category: 'favorite'
  },
  {
    id: 'favorite_10',
    title: '💖 Koleksiyoncu',
    description: '10 favori biriktirdin',
    icon: '💖',
    requirement: 10,
    category: 'favorite'
  },
  {
    id: 'favorite_25',
    title: '💝 Hazine Avcısı',
    description: '25 favori topladın',
    icon: '💝',
    requirement: 25,
    category: 'favorite'
  },
  
  // Paylaşım Başarımları
  {
    id: 'first_share',
    title: '📤 Paylaşımcı',
    description: 'İlk övgünü paylaştın',
    icon: '📤',
    requirement: 1,
    category: 'share'
  },
  {
    id: 'share_10',
    title: '📣 Motivasyon Elçisi',
    description: '10 övgü paylaştın',
    icon: '📣',
    requirement: 10,
    category: 'share'
  },
  
  // Streak Başarımları
  {
    id: 'streak_3',
    title: '🔥 3 Günlük Seri',
    description: '3 gün üst üste övgü aldın',
    icon: '🔥',
    requirement: 3,
    category: 'streak'
  },
  {
    id: 'streak_7',
    title: '⚡ 1 Haftalık Seri',
    description: '7 gün üst üste övgü aldın',
    icon: '⚡',
    requirement: 7,
    category: 'streak'
  },
  {
    id: 'streak_30',
    title: '💪 1 Aylık Seri',
    description: '30 gün üst üste övgü aldın',
    icon: '💪',
    requirement: 30,
    category: 'streak'
  },
  
  // Stil Başarımları
  {
    id: 'all_styles',
    title: '🎨 Stil Uzmanı',
    description: 'Tüm stilleri denedin',
    icon: '🎨',
    requirement: 8,
    category: 'style'
  },
  {
    id: 'style_lover',
    title: '🎭 Stil Aşığı',
    description: 'Aynı stilde 20 övgü aldın',
    icon: '🎭',
    requirement: 20,
    category: 'style'
  }
];

export interface Stats {
  totalPraises: number;
  totalFavorites: number;
  totalShares: number;
  currentStreak: number;
  longestStreak: number;
  lastPraiseDate: string | null;
  stylesUsed: Record<string, number>;
  achievements: Achievement[];
}

export const checkAchievements = (stats: Stats): Achievement[] => {
  const newlyUnlocked: Achievement[] = [];
  
  achievementDefinitions.forEach(def => {
    const existing = stats.achievements.find(a => a.id === def.id);
    if (existing?.unlocked) return; // Zaten açılmış
    
    let shouldUnlock = false;
    
    switch (def.category) {
      case 'praise':
        shouldUnlock = stats.totalPraises >= def.requirement;
        break;
      case 'favorite':
        shouldUnlock = stats.totalFavorites >= def.requirement;
        break;
      case 'share':
        shouldUnlock = stats.totalShares >= def.requirement;
        break;
      case 'streak':
        shouldUnlock = stats.currentStreak >= def.requirement || stats.longestStreak >= def.requirement;
        break;
      case 'style':
        if (def.id === 'all_styles') {
          shouldUnlock = Object.keys(stats.stylesUsed).length >= def.requirement;
        } else if (def.id === 'style_lover') {
          shouldUnlock = Object.values(stats.stylesUsed).some(count => count >= def.requirement);
        }
        break;
    }
    
    if (shouldUnlock) {
      newlyUnlocked.push({
        ...def,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
  });
  
  return newlyUnlocked;
};

export const calculateStreak = (lastDate: string | null): number => {
  if (!lastDate) return 0;
  
  const last = new Date(lastDate);
  const today = new Date();
  
  // Tarihleri sadece gün bazında karşılaştır
  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
