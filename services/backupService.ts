// Backup & Restore Service
export interface BackupData {
  version: string;
  createdAt: string;
  profile: any;
  favorites: string[];
  statistics: any;
  achievements: any;
  settings: any;
}

// Tüm verileri yedekle
export const createBackup = (
  profile: any,
  favorites: string[],
  statistics: any,
  achievements: any,
  settings: any
): BackupData => {
  return {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    profile,
    favorites,
    statistics,
    achievements,
    settings
  };
};

// Yedek dosyası indir (JSON)
export const downloadBackup = (data: BackupData) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const fileName = `beni-ov-yedek-${new Date().toISOString().split('T')[0]}.json`;
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Yedek dosyasını yükle
export const uploadBackup = (): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('Dosya seçilmedi'));
        return;
      }
      
      try {
        const text = await file.text();
        const data = JSON.parse(text) as BackupData;
        
        // Versiyon kontrolü
        if (!data.version) {
          throw new Error('Geçersiz yedek dosyası');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Yedek dosyası okunamadı'));
      }
    };
    
    input.click();
  });
};

// Verileri geri yükle
export const restoreBackup = (data: BackupData) => {
  if (data.profile) {
    localStorage.setItem('beni-ov-profile', JSON.stringify(data.profile));
  }
  if (data.favorites) {
    localStorage.setItem('beni-ov-favorites', JSON.stringify(data.favorites));
  }
  if (data.statistics) {
    localStorage.setItem('beni-ov-statistics', JSON.stringify(data.statistics));
  }
  if (data.achievements) {
    localStorage.setItem('beni-ov-achievements', JSON.stringify(data.achievements));
  }
  if (data.settings) {
    localStorage.setItem('beni-ov-settings', JSON.stringify(data.settings));
  }
};

// Paylaşılabilir yedek linki oluştur (Base64 encoded)
export const createShareableBackupLink = (data: BackupData): string => {
  const jsonString = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(jsonString));
  const baseUrl = window.location.origin;
  
  return `${baseUrl}?backup=${encoded}`;
};

// URL'den yedek verisini al
export const getBackupFromUrl = (): BackupData | null => {
  const params = new URLSearchParams(window.location.search);
  const backupParam = params.get('backup');
  
  if (!backupParam) return null;
  
  try {
    const decoded = decodeURIComponent(atob(backupParam));
    const data = JSON.parse(decoded) as BackupData;
    return data;
  } catch (error) {
    console.error('Yedek verisi çözümlenemedi:', error);
    return null;
  }
};

// Otomatik yedekleme (LocalStorage)
export const autoBackup = (data: BackupData) => {
  localStorage.setItem('beni-ov-auto-backup', JSON.stringify(data));
  localStorage.setItem('beni-ov-auto-backup-date', new Date().toISOString());
};

// Son otomatik yedeği al
export const getLastAutoBackup = (): { data: BackupData; date: string } | null => {
  const backup = localStorage.getItem('beni-ov-auto-backup');
  const date = localStorage.getItem('beni-ov-auto-backup-date');
  
  if (!backup || !date) return null;
  
  try {
    const data = JSON.parse(backup) as BackupData;
    return { data, date };
  } catch (error) {
    return null;
  }
};

// Tüm verileri sıfırla
export const resetAllData = () => {
  const keysToRemove = [
    'beni-ov-profile',
    'beni-ov-favorites',
    'beni-ov-statistics',
    'beni-ov-achievements',
    'beni-ov-settings',
    'beni-ov-theme',
    'beni-ov-notification-settings'
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
