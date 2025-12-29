import { PraiseStyle } from '../types';

export interface DailyActivity {
  date: string;
  praisesGenerated: number;
  favoritesAdded: number;
  sharesCount: number;
}

export interface StyleUsage {
  style: PraiseStyle;
  count: number;
  percentage: number;
}

export interface Statistics {
  // Genel İstatistikler
  totalPraises: number;
  totalFavorites: number;
  totalShares: number;
  totalDays: number;
  
  // Seri İstatistikleri
  currentStreak: number;
  longestStreak: number;
  lastPraiseDate: string | null;
  
  // Stil İstatistikleri
  favoriteStyle: PraiseStyle | null;
  styleUsage: StyleUsage[];
  
  // Aktivite
  dailyActivities: DailyActivity[];
  weeklyAverage: number;
  monthlyAverage: number;
  
  // Tarihler
  firstUsedDate: string;
  lastUsedDate: string;
  
  // Başarımlar
  achievementsUnlocked: number;
  achievementsTotal: number;
}

export const calculateStatistics = (
  praises: number,
  favorites: string[],
  shares: number,
  stylesUsed: Record<PraiseStyle, number>,
  dailyActivities: DailyActivity[],
  lastPraiseDate: string | null,
  achievementsUnlocked: number,
  achievementsTotal: number
): Statistics => {
  // Stil kullanımını hesapla
  const totalStyleUsage = Object.values(stylesUsed).reduce((sum, count) => sum + count, 0);
  const styleUsage: StyleUsage[] = (Object.keys(stylesUsed) as PraiseStyle[])
    .map(style => ({
      style,
      count: stylesUsed[style] || 0,
      percentage: totalStyleUsage > 0 ? Math.round((stylesUsed[style] / totalStyleUsage) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
  
  const favoriteStyle = styleUsage.length > 0 ? styleUsage[0].style : null;
  
  // Seri hesaplama
  const { currentStreak, longestStreak } = calculateStreaks(dailyActivities, lastPraiseDate);
  
  // Ortalamalar
  const weeklyAverage = calculateAverage(dailyActivities, 7);
  const monthlyAverage = calculateAverage(dailyActivities, 30);
  
  // Tarihler
  const sortedActivities = [...dailyActivities].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const firstUsedDate = sortedActivities.length > 0 ? sortedActivities[0].date : new Date().toISOString();
  const lastUsedDate = sortedActivities.length > 0 ? sortedActivities[sortedActivities.length - 1].date : new Date().toISOString();
  
  return {
    totalPraises: praises,
    totalFavorites: favorites.length,
    totalShares: shares,
    totalDays: dailyActivities.length,
    currentStreak,
    longestStreak,
    lastPraiseDate,
    favoriteStyle,
    styleUsage,
    dailyActivities: dailyActivities.slice(-30), // Son 30 gün
    weeklyAverage,
    monthlyAverage,
    firstUsedDate,
    lastUsedDate,
    achievementsUnlocked,
    achievementsTotal
  };
};

const calculateStreaks = (activities: DailyActivity[], lastDate: string | null) => {
  if (activities.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Mevcut seri hesaplama
  for (let i = 0; i < sortedActivities.length; i++) {
    const activityDate = new Date(sortedActivities[i].date);
    activityDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);
    
    if (activityDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // En uzun seri hesaplama
  let consecutiveDays = 1;
  for (let i = 1; i < sortedActivities.length; i++) {
    const currentDate = new Date(sortedActivities[i].date);
    const prevDate = new Date(sortedActivities[i - 1].date);
    
    const diffDays = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveDays++;
      longestStreak = Math.max(longestStreak, consecutiveDays);
    } else {
      consecutiveDays = 1;
    }
  }
  
  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
};

const calculateAverage = (activities: DailyActivity[], days: number): number => {
  const recentActivities = activities.slice(-days);
  if (recentActivities.length === 0) return 0;
  
  const total = recentActivities.reduce((sum, activity) => sum + activity.praisesGenerated, 0);
  return Math.round((total / recentActivities.length) * 10) / 10;
};

// Bugünün aktivitesini güncelle/oluştur
export const updateDailyActivity = (
  activities: DailyActivity[],
  type: 'praise' | 'favorite' | 'share'
): DailyActivity[] => {
  const today = new Date().toISOString().split('T')[0];
  const existingIndex = activities.findIndex(a => a.date === today);
  
  if (existingIndex >= 0) {
    // Bugünün aktivitesini güncelle
    const updated = [...activities];
    const current = updated[existingIndex];
    
    if (type === 'praise') current.praisesGenerated++;
    if (type === 'favorite') current.favoritesAdded++;
    if (type === 'share') current.sharesCount++;
    
    return updated;
  } else {
    // Yeni gün aktivitesi oluştur
    const newActivity: DailyActivity = {
      date: today,
      praisesGenerated: type === 'praise' ? 1 : 0,
      favoritesAdded: type === 'favorite' ? 1 : 0,
      sharesCount: type === 'share' ? 1 : 0
    };
    
    return [...activities, newActivity];
  }
};

// Chart için veri hazırlama
export const prepareChartData = (activities: DailyActivity[], days: number = 7) => {
  const recent = activities.slice(-days);
  
  return {
    labels: recent.map(a => {
      const date = new Date(a.date);
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Övgüler',
        data: recent.map(a => a.praisesGenerated),
        color: '#8B5CF6'
      },
      {
        label: 'Favoriler',
        data: recent.map(a => a.favoritesAdded),
        color: '#EC4899'
      },
      {
        label: 'Paylaşımlar',
        data: recent.map(a => a.sharesCount),
        color: '#06B6D4'
      }
    ]
  };
};
