# 🌟 Beni Öv - AI Destekli Kişiselleştirilmiş Övgü Uygulaması

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)

**Sana özel yapay zeka destekli övgüler**

Her gün kendini daha iyi hissetmen için AI destekli kişiselleştirilmiş motivasyon uygulaması.

[Demo](https://beni-ov.vercel.app) · [Hata Bildir](https://github.com/ahmetunaluzun/beni-ov/issues) · [Özellik İste](https://github.com/ahmetunaluzun/beni-ov/issues)

</div>

---

## ✨ Özellikler

### 🎨 Övgü Özellikleri
- **8 Farklı Övgü Tarzı**: Motive Edici, Esprili, Sevgi Dolu, Kahramanca, Şiirsel, Samimi, Arkadaşça, Akrostiş
- **15 Özel Gün Desteği**: Doğum günü, Anneler/Babalar Günü, Sevgililer Günü, Düğün, Mezuniyet ve daha fazlası
- **Kişiselleştirilmiş İçerik**: İsim, yaş ve cinsiyete göre özelleştirilmiş övgüler

### 🤖 Yapay Zeka
- **Google Gemini AI 2.0 Flash**: En güncel AI teknolojisi
- **Benzersiz Övgüler**: Her seferinde farklı ve yaratıcı içerik
- **Akıllı Prompt Sistemi**: Özel günlere özel mesajlar

### 🎨 Görsel & UX
- **Alt Navigation Bar**: Instagram tarzı kolay erişim


### 💾 Veri Yönetimi
- **Favorilere Ekleme**: Sevdiğin övgüleri kaydet

### 🔗 Paylaşım
- **Sosyal Medya**: WhatsApp, Twitter, Facebook, Instagram
- **Link Paylaşımı**: Uygulama linki otomatik eklenir

---

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Google Gemini API Key ([buradan alın](https://ai.google.dev/))

### Yerel Kurulum

1. **Repoyu klonlayın**
```bash
git clone https://github.com/ahmetunaluzun/beni-ov.git
cd beni-ov
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **API Key ayarlayın**
```bash
# .env.local dosyası oluşturun
echo "VITE_API_KEY=your_gemini_api_key_here" > .env.local
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:5173
```

---

## 📦 Deployment

### Vercel (Önerilen)

1. **Vercel CLI yükleyin**
```bash
npm i -g vercel
```

2. **Deploy edin**
```bash
vercel --prod
```

3. **Environment Variable ekleyin**
```bash
vercel env add API_KEY
# Production ve Preview için API key girin
```

### Netlify

1. **Build komutu**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment Variables**: `API_KEY=your_gemini_api_key`

---

## 🛠️ Teknolojiler

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Google Gemini 2.0 Flash** - AI model
- **Vercel** - Hosting

---

## 📁 Proje Yapısı

```
beni-ov/
├── components/          # React bileşenleri
├── services/           # AI & API servisleri
├── hooks/              # Custom React hooks
├── public/             # Static dosyalar
├── App.tsx            # Ana component
├── types.ts           # TypeScript tipler
└── vite.config.ts     # Vite config
```

---

## 🎯 Kullanım

1. **Profil Oluştur**: Adını, yaşını, cinsiyetini gir
2. **Övgü Tarzı Seç**: 8 farklı tarzdan birini seç
3. **Özel Gün Belirt**: (İsteğe bağlı) Doğum günü, düğün vs.
4. **Beni Öv**: AI sana özel övgü üretsin! 🎉
5. **Favorile & Paylaş**: Beğendiğin övgüleri kaydet ve paylaş

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 🐛 Hata Bildirimi

[GitHub Issues](https://github.com/ahmetunaluzun/beni-ov/issues) üzerinden bildirebilirsiniz.

---

## 📝 Yapılacaklar

- [ ] İstatistikler sayfası
- [ ] Başarım sistemi detayları
- [ ] Ayarlar sayfası
- [ ] Sesli övgü (Text-to-speech)
- [ ] Kullanıcı hesapları
- [ ] Native mobil app

---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

---

## 👨‍💻 Geliştirici

**Ahmet Ünal Uzun**

- 🐱 GitHub: [@ahmetunaluzun](https://github.com/ahmetunaluzun)
- 💼 LinkedIn: [ahmetunaluzun](https://www.linkedin.com/in/ahmetunaluzun/)
- 📸 Instagram: [@ahmetunaluzun](https://www.instagram.com/ahmetunaluzun/)

---

## 💝 Teşekkürler

- **Google Gemini AI** - AI altyapısı
- **React Community** - Framework desteği
- **Vercel** - Hosting
- **Tüm katkıda bulunanlar** - Destek ve geri bildirimler

---
Virus Total Testine aşağıdan ulaşabilirsiniz.

https://www.virustotal.com/gui/url/50c1da218f2423a8214a5e0ebc92696f50157d4777f8eda1eea64c879cc32caa?nocache=1

<div align="center">

**Beğendiyseniz ⭐ vermeyi unutmayın!**

Yapay Zeka ile ❤️ ile Kodlandı

</div>
