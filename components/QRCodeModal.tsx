import React, { useState, useEffect } from 'react';
import { generateQRCode, createShareableLink, downloadQRCode } from '../services/qrService';
import { CloseIcon } from './Icons';

interface QRCodeModalProps {
  text: string;
  onClose: () => void;
  showNotification: (message: string) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ text, onClose, showNotification }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [shareableLink, setShareableLink] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateCode = async () => {
      try {
        const link = createShareableLink(text);
        setShareableLink(link);
        
        const qrUrl = await generateQRCode(link);
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('QR kod oluşturulamadı:', error);
        showNotification('QR kod oluşturulamadı');
      } finally {
        setLoading(false);
      }
    };

    generateCode();
  }, [text]);

  const handleDownload = async () => {
    try {
      await downloadQRCode(qrCodeUrl);
      showNotification('QR kod indirildi!');
    } catch (error) {
      showNotification('QR kod indirilemedi');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    showNotification('Link kopyalandı!');
  };

  return (
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
            QR Kod ile Paylaş
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Övgü Metni */}
            <div className="bg-white/5 rounded-lg p-4 max-h-24 overflow-y-auto">
              <p className="text-gray-300 text-sm text-center italic">"{text}"</p>
            </div>

            {/* QR Kod */}
            <div className="bg-white rounded-xl p-4 flex justify-center">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>

            {/* Açıklama */}
            <p className="text-gray-400 text-sm text-center">
              Bu QR kodu taratarak övgünü başkalarıyla paylaşabilirsin!
            </p>

            {/* Butonlar */}
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>📥</span>
                <span>QR Kodu İndir</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>🔗</span>
                <span>Linki Kopyala</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
