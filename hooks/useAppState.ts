import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Profile, PraiseStyle } from '../types';
import { ThemeName } from '../themes';
import { 
  Achievement, 
  achievementDefinitions, 
  checkAchievements, 
  calculateStreak,
  Stats 
} from '../achievements';
import { 
  Statistics, 
  calculateStatistics, 
  updateDailyActivity,
  DailyActivity 
} from '../services/statisticsService';
import { 
  NotificationSettings, 
  defaultNotificationSettings, 
  sendLocalNotification,
  requestNotificationPermission 
} from '../services/notificationService';
import { generatePraise } from '../services/geminiService';

export const useAppState = () => {
  // Basic state
  const [profile, setProfile] = useLocalStorage<Profile | null>('beni-ov-profile', null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('beni-ov-favorites', []);
  const [currentPraise, setCurrentPraise] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Theme
  const [theme, setTheme] = useLocalStorage<ThemeName>('beni-ov-theme', 'purple');

  // Statistics
  const [totalPraises, setTotalPraises] = useLocalStorage<number>('beni-ov-total-praises', 0);
  const [totalShares, setTotalShares] = useLocalStorage<number>('beni-ov-total-shares', 0);
  const [stylesUsed, setStylesUsed] = useLocalStorage<Record<PraiseStyle, number>>(
    'beni-ov-styles-used',
    {} as Record<PraiseStyle, number>
  );
  const [dailyActivities, setDailyActivities] = useLocalStorage<DailyActivity[]>(
    'beni-ov-daily-activities',
    []
  );
  const [lastPraiseDate, setLastPraiseDate] = useLocalStorage<string | null>(
    'beni-ov-last-praise-date',
    null
  );

  // Achievements
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'beni-ov-achievements',
    achievementDefinitions.map(def => ({ ...def, unlocked: false }))
  );
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Notifications
  const [notificationSettings, setNotificationSettings] = useLocalStorage<NotificationSettings>(
    'beni-ov-notification-settings',
    defaultNotificationSettings
  );

  // Generate praise
  const handleGeneratePraise = useCallback(async () => {
    if (!profile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPraise = await generatePraise(profile, [...favorites, currentPraise]);
      setCurrentPraise(newPraise);
      
      // Update statistics
      setTotalPraises(prev => prev + 1);
      setStylesUsed(prev => ({
        ...prev,
        [profile.praiseStyle]: (prev[profile.praiseStyle] || 0) + 1
      }));
      setDailyActivities(prev => updateDailyActivity(prev, 'praise'));
      setLastPraiseDate(new Date().toISOString());
      
      // Check achievements
      const stats = createStats();
      stats.totalPraises = totalPraises + 1;
      const newAchievements = checkAchievements(stats);
      
      if (newAchievements.length > 0) {
        setAchievements(prev => {
          const updated = [...prev];
          newAchievements.forEach(newAch => {
            const index = updated.findIndex(a => a.id === newAch.id);
            if (index >= 0) {
              updated[index] = newAch;
            }
          });
          return updated;
        });
        
        // Show first new achievement
        setNewAchievement(newAchievements[0]);
        
        // Send notification
        if (notificationSettings.enabled && notificationSettings.achievementUnlocked) {
          sendLocalNotification('🏆 Yeni Başarım!', {
            body: newAchievements[0].title,
            tag: 'achievement'
          });
        }
      }
      
      // Send praise notification
      if (notificationSettings.enabled && notificationSettings.praiseGenerated) {
        sendLocalNotification('✨ Yeni Övgün Hazır!', {
          body: newPraise.substring(0, 100),
          tag: 'praise'
        });
      }
      
    } catch (err: any) {
      setError(err.message || 'Bir şeyler ters gitti.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, favorites, currentPraise, totalPraises, notificationSettings]);

  // Add to favorites
  const handleAddToFavorites = useCallback(() => {
    if (currentPraise && !favorites.includes(currentPraise)) {
      setFavorites([currentPraise, ...favorites]);
      setDailyActivities(prev => updateDailyActivity(prev, 'favorite'));
      showNotification("Favorilere eklendi!");
      
      // Check achievements
      const stats = createStats();
      stats.totalFavorites = favorites.length + 1;
      checkAndUpdateAchievements(stats);
    }
  }, [currentPraise, favorites]);

  // Remove from favorites
  const handleRemoveFromFavorites = useCallback((praise: string) => {
    setFavorites(favorites.filter(p => p !== praise));
    showNotification("Favorilerden kaldırıldı.");
  }, [favorites]);

  // Handle share
  const handleShare = useCallback(() => {
    setTotalShares(prev => prev + 1);
    setDailyActivities(prev => updateDailyActivity(prev, 'share'));
    
    // Check achievements
    const stats = createStats();
    stats.totalShares = totalShares + 1;
    checkAndUpdateAchievements(stats);
  }, [totalShares]);

  // Show notification helper
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Create stats helper
  const createStats = (): Stats => {
    const diffDays = lastPraiseDate ? calculateStreak(lastPraiseDate) : 0;
    const currentStreak = diffDays <= 1 ? (lastPraiseDate ? 1 : 0) : 0;
    
    return {
      totalPraises,
      totalFavorites: favorites.length,
      totalShares,
      currentStreak,
      longestStreak: currentStreak,
      lastPraiseDate,
      stylesUsed,
      achievements
    };
  };

  // Check and update achievements
  const checkAndUpdateAchievements = (stats: Stats) => {
    const newAchievements = checkAchievements(stats);
    
    if (newAchievements.length > 0) {
      setAchievements(prev => {
        const updated = [...prev];
        newAchievements.forEach(newAch => {
          const index = updated.findIndex(a => a.id === newAch.id);
          if (index >= 0) {
            updated[index] = newAch;
          }
        });
        return updated;
      });
      
      setNewAchievement(newAchievements[0]);
      
      if (notificationSettings.enabled && notificationSettings.achievementUnlocked) {
        sendLocalNotification('🏆 Yeni Başarım!', {
          body: newAchievements[0].title,
          tag: 'achievement'
        });
      }
    }
  };

  // Get statistics
  const getStatistics = (): Statistics => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    return calculateStatistics(
      totalPraises,
      favorites,
      totalShares,
      stylesUsed,
      dailyActivities,
      lastPraiseDate,
      unlockedCount,
      achievementDefinitions.length
    );
  };

  // Enable notifications
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationSettings({ ...notificationSettings, enabled: true });
      showNotification('Bildirimler açıldı!');
    } else {
      showNotification('Bildirim izni reddedildi');
    }
  };

  // Auto-generate praise on profile load
  useEffect(() => {
    if (profile && !currentPraise && !isLoading) {
      handleGeneratePraise();
    }
  }, [profile]);

  return {
    // State
    profile,
    setProfile,
    favorites,
    currentPraise,
    isLoading,
    error,
    notification,
    showNotification,
    theme,
    setTheme,
    achievements,
    newAchievement,
    setNewAchievement,
    notificationSettings,
    setNotificationSettings,
    
    // Actions
    handleGeneratePraise,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleShare,
    getStatistics,
    enableNotifications,
    
    // Computed
    isFavorited: favorites.includes(currentPraise)
  };
};
