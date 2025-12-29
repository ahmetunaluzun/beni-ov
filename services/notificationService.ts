// Push notification service
export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!checkNotificationSupport()) {
    return { granted: false, denied: true, default: false };
  }
  
  const permission = Notification.permission;
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default'
  };
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationSupport()) {
    console.warn('Bildirimler bu tarayıcıda desteklenmiyor');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Bildirim izni alınamadı:', error);
    return false;
  }
};

export const sendLocalNotification = (title: string, options?: NotificationOptions) => {
  if (!checkNotificationSupport() || Notification.permission !== 'granted') {
    return;
  }
  
  const defaultOptions: NotificationOptions = {
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [200, 100, 200],
    ...options
  };
  
  new Notification(title, defaultOptions);
};

// Günlük hatırlatıcı ayarlama
export const scheduleDailyReminder = (hour: number = 9, minute: number = 0) => {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );
  
  // Eğer bugün için zaman geçmişse, yarın için planla
  if (scheduledTime.getTime() <= now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntilReminder = scheduledTime.getTime() - now.getTime();
  
  setTimeout(() => {
    sendLocalNotification('🌟 Günlük Övgün Hazır!', {
      body: 'Bugün seni motive edecek yeni bir övgü almaya ne dersin?',
      tag: 'daily-praise',
      requireInteraction: true
    });
    
    // Bir sonraki gün için tekrar planla
    scheduleDailyReminder(hour, minute);
  }, timeUntilReminder);
  
  return scheduledTime;
};

// Service Worker'a bildirim gönderme (gelecekteki push notification için)
export const sendPushNotification = async (title: string, body: string) => {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  
  const registration = await navigator.serviceWorker.ready;
  
  registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [200, 100, 200],
    tag: 'praise-notification',
    requireInteraction: false
  });
};

// Bildirim ayarlarını kaydetme
export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: { hour: number; minute: number };
  praiseGenerated: boolean;
  achievementUnlocked: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  reminderTime: { hour: 9, minute: 0 },
  praiseGenerated: true,
  achievementUnlocked: true
};
