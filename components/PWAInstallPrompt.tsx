import React, { useEffect, useState } from 'react';
import { DownloadIcon, CloseIcon } from './Icons';

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS kontrolü
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Standalone mode kontrolü (zaten yüklü mü?)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // PWA install event'i dinle
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      onDismiss();
    }
  };

  // Zaten yüklüyse veya prompt yoksa gösterme
  if (isStandalone || (!deferredPrompt && !isIOS)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl z-50 animate-slide-up">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <CloseIcon className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <DownloadIcon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">
            Ana Ekrana Ekle
          </h3>
          <p className="text-white/90 text-sm mb-3">
            {isIOS 
              ? 'Safari\'de paylaş butonuna tıklayıp "Ana Ekrana Ekle" seçin'
              : 'Uygulamayı telefonunuza yükleyin, daha hızlı erişin!'
            }
          </p>

          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Şimdi Yükle
            </button>
          )}

          {isIOS && (
            <div className="flex items-center gap-2 text-white text-sm">
              <span>Paylaş</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span>→ Ana Ekrana Ekle</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
