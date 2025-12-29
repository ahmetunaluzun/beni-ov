import React, { useState } from 'react';
import { CloseIcon, CopyIcon, WhatsappIcon, InstagramIcon, TwitterIcon, FacebookIcon, QRCodeIcon } from './Icons';
import { QRCodeModal } from './QRCodeModal';

interface ShareModalEnhancedProps {
  text: string;
  onClose: () => void;
  showNotification: (message: string) => void;
  onShare?: () => void;
}

export const ShareModalEnhanced: React.FC<ShareModalEnhancedProps> = ({ 
  text, 
  onClose, 
  showNotification,
  onShare
}) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${text}"`);
    showNotification("Övgü panoya kopyalandı!");
    onShare?.();
    onClose();
  };

  const shareOn = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'instagram') => {
    const appUrl = window.location.origin;
    const fullText = `"${text}"\n\n✨ Beni Öv uygulamasından\n${appUrl}`;
    const encodedText = encodeURIComponent(fullText);
    let url = '';
    
    if (platform === 'instagram') {
      navigator.clipboard.writeText(`${text}\n\n✨ Beni Öv: ${appUrl}`);
      showNotification("Metin kopyalandı. Instagram'da yapıştırabilirsiniz.");
      url = 'https://www.instagram.com';
      window.open(url, '_blank', 'noopener,noreferrer');
      onShare?.();
      return;
    }

    switch(platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedText}`;
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    onShare?.();
    onClose();
  };

  const handleQRCode = () => {
    setShowQRModal(true);
    onShare?.();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
        onClick={onClose}
      >
        <div 
          className="bg-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-purple-500/20" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Paylaş
            </h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
              <CloseIcon className="w-6 h-6"/>
            </button>
          </div>

          {/* Övgü Önizleme */}
          <div className="bg-white/5 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
            <p className="text-gray-300 text-sm text-center italic">"{text}"</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleCopy} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <CopyIcon className="w-6 h-6 text-gray-300" />
              <span className="font-medium text-base">Metni Kopyala</span>
            </button>

            <button 
              onClick={handleQRCode} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <QRCodeIcon className="w-6 h-6 text-purple-400" />
              <span className="font-medium text-base">QR Kod Oluştur</span>
            </button>

            <button 
              onClick={() => shareOn('whatsapp')} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <WhatsappIcon className="w-6 h-6 text-[#25D366]"/>
              <span className="font-medium text-base">WhatsApp</span>
            </button>

            <button 
              onClick={() => shareOn('instagram')} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <InstagramIcon className="w-6 h-6 text-pink-500"/>
              <span className="font-medium text-base">Instagram</span>
            </button>

            <button 
              onClick={() => shareOn('twitter')} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <TwitterIcon className="w-6 h-6 text-[#1DA1F2]"/>
              <span className="font-medium text-base">X (Twitter)</span>
            </button>

            <button 
              onClick={() => shareOn('facebook')} 
              className="w-full flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FacebookIcon className="w-6 h-6 text-[#1877F2]"/>
              <span className="font-medium text-base">Facebook</span>
            </button>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal
          text={text}
          onClose={() => {
            setShowQRModal(false);
            onClose();
          }}
          showNotification={showNotification}
        />
      )}
    </>
  );
};
