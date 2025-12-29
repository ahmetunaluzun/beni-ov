import React, { useState } from 'react';
import { ThemeName, themes } from '../themes';
import { NotificationSettings } from '../services/notificationService';

interface SettingsScreenProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  notificationSettings: NotificationSettings;
  onNotificationSettingsChange: (settings: NotificationSettings) => void;
  onBackup: () => void;
  onRestore: () => void;
  onReset: () => void;
  onEnableNotifications: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentTheme,
  onThemeChange,
  notificationSettings,
  onNotificationSettingsChange,
  onBackup,
  onRestore,
  onReset,
  onEnableNotifications
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="space-y-4">
      {/* Tema Ayarları */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          🎨 Tema
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(themes) as ThemeName[]).map((themeName) => {
            const theme = themes[themeName];
            return (
              <button
                key={themeName}
                onClick={() => onThemeChange(themeName)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentTheme === themeName
                    ? 'border-white shadow-lg scale-105'
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                }}
              >
                <div className="text-white font-semibold text-sm">{theme.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          🔔 Bildirimler
        </h3>

        {!notificationSettings.enabled ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Bildirimler kapalı</p>
            <button
              onClick={onEnableNotifications}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-all duration-300"
            >
              Bildirimleri Aç
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <ToggleSetting
              label="Günlük Hatırlatıcı"
              description="Her gün belirli saatte bildirim al"
              enabled={notificationSettings.dailyReminder}
              onChange={(enabled) =>
                onNotificationSettingsChange({
                  ...notificationSettings,
                  dailyReminder: enabled
                })
              }
            />

            {notificationSettings.dailyReminder && (
              <div className="ml-4 flex gap-2">
                <input
                  type="time"
                  value={`${String(notificationSettings.reminderTime.hour).padStart(2, '0')}:${String(
                    notificationSettings.reminderTime.minute
                  ).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hour, minute] = e.target.value.split(':').map(Number);
                    onNotificationSettingsChange({
                      ...notificationSettings,
                      reminderTime: { hour, minute }
                    });
                  }}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            )}

            <ToggleSetting
              label="Övgü Oluşturuldu"
              description="Yeni övgü oluşturulduğunda bildir"
              enabled={notificationSettings.praiseGenerated}
              onChange={(enabled) =>
                onNotificationSettingsChange({
                  ...notificationSettings,
                  praiseGenerated: enabled
                })
              }
            />

            <ToggleSetting
              label="Başarım Açıldı"
              description="Yeni başarım kazandığında bildir"
              enabled={notificationSettings.achievementUnlocked}
              onChange={(enabled) =>
                onNotificationSettingsChange({
                  ...notificationSettings,
                  achievementUnlocked: enabled
                })
              }
            />
          </div>
        )}
      </div>

      {/* Veri Yönetimi */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          💾 Veri Yönetimi
        </h3>
        <div className="space-y-3">
          <button
            onClick={onBackup}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>Yedek Oluştur</span>
          </button>

          <button
            onClick={onRestore}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>📤</span>
            <span>Yedekten Geri Yükle</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            <span>Tüm Verileri Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Uygulama Bilgisi */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-gray-400 text-sm">Beni Öv v1.0.0</p>
        <p className="text-gray-500 text-xs mt-1">Yapay Zeka ile ❤️ ile kodlandı</p>
      </div>

      {/* Sıfırlama Onay Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Emin misiniz?</h3>
            <p className="text-gray-300 mb-6">
              Tüm verileriniz (profil, favoriler, istatistikler, başarımlar) kalıcı olarak silinecek!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all font-semibold"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ label, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        <div className="text-gray-400 text-sm">{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
          enabled ? 'bg-purple-500' : 'bg-white/10'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 ${
            enabled ? 'left-8' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
};
