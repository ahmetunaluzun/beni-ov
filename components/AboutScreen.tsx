import React from 'react';
import { CloseIcon } from './Icons';

interface AboutScreenProps {
  onClose?: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onClose }) => {
  const socialLinks = [
    { 
      name: 'GitHub', 
      url: 'https://github.com/ahmetunaluzun',
      icon: '🐱',
      color: 'hover:text-gray-300'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/ahmetunaluzun/',
      icon: '💼',
      color: 'hover:text-blue-400'
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/ahmetunaluzun/',
      icon: '📸',
      color: 'hover:text-pink-400'
    }
  ];

  const features = [
    { icon: '✨', text: '8 Farklı Övgü Tarzı' },
    { icon: '🎊', text: '15 Özel Gün Desteği' },
    { icon: '🤖', text: 'Google Gemini AI' },
    { icon: '🎨', text: '6 Renkli Tema' },
    { icon: '🏆', text: 'Başarım Sistemi' },
    { icon: '📊', text: 'İstatistik Takibi' },
    { icon: '💾', text: 'Yedekleme & Geri Yükleme' },
    { icon: '📱', text: 'PWA Desteği' }
  ];

  const technologies = [
    { name: 'Google Gemini AI', icon: '🤖' },
    { name: 'React 19', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Vite', icon: '⚡' },
    { name: 'Vercel', icon: '▲' }
  ];

  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl shadow-purple-500/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        )}
        <div className="text-6xl mb-3">🌟</div>
        <h1 className="text-3xl font-bold text-white mb-1">Beni Öv</h1>
        <p className="text-white/90 text-sm">Versiyon 2.0</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Description */}
        <div className="text-center">
          <p className="text-gray-300 leading-relaxed">
            Sana özel yapay zeka destekli övgüler. Her gün kendini daha iyi hissetmen için 
            AI destekli kişiselleştirilmiş motivasyon.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            ✨ Özellikler
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-300"
              >
                <span className="text-lg">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            🛠️ Teknolojiler
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-300"
              >
                <span className="text-lg">{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            👨‍💻 Geliştirici
          </h2>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white font-semibold text-lg mb-4">Ahmet Ünal Uzun</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-gray-300 ${link.color} transition-colors text-sm px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
            🔗 Bağlantılar
          </h2>
          <div className="space-y-2">
            <a
              href="https://github.com/ahmetunaluzun/beni-ov"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-white font-medium">GitHub'da Yıldızla</p>
                  <p className="text-gray-400 text-sm">Açık kaynak kod</p>
                </div>
              </div>
            </a>
            <a
              href="mailto:ahmetunaluzun@gmail.com"
              className="block bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-white font-medium">Geri Bildirim Gönder</p>
                  <p className="text-gray-400 text-sm">Öneri & hata bildirimi</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Thanks */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
            💝 Teşekkürler
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Google Gemini AI ekibine, React topluluğuna ve tüm kullanıcılarımıza 
            destekleri için teşekkür ederiz.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-gray-500 text-xs">
            Yapay Zeka ile ❤️ ile Kodlandı
          </p>
          <p className="text-gray-600 text-xs mt-1">
            © 2025 Beni Öv. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};
