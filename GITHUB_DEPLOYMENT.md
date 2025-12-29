# 🚀 GitHub'a Yükleme ve Deployment Rehberi

## 📦 1. GitHub'a İlk Yükleme

### Yeni Repo Oluşturma

1. **GitHub'da yeni repo oluşturun**
   - Repo adı: `beni-ov`
   - Açıklama: "AI Destekli Kişiselleştirilmiş Övgü Uygulaması"
   - Public
   - **README, .gitignore, LICENSE eklemeyin** (zaten var)

2. **Lokal repo'yu başlatın**
```bash
cd beni-ov
git init
git add .
git commit -m "feat: Initial commit - Beni Öv v2.0"
```

3. **GitHub'a push edin**
```bash
git remote add origin https://github.com/ahmetunaluzun/beni-ov.git
git branch -M main
git push -u origin main
```

---

## ✅ 2. GitHub'da Ayarlar

### Repository Settings

1. **About** bölümünü düzenleyin:
   - Description: "🌟 AI Destekli Kişiselleştirilmiş Övgü Uygulaması"
   - Website: `https://beni-ov.vercel.app`
   - Topics: `react`, `typescript`, `ai`, `gemini`, `tailwindcss`, `pwa`, `motivasyon`

2. **Social Preview** resmi ekleyin:
   - Settings → General → Social Preview
   - 1280x640 px resim yükleyin

---

## 🎯 3. GitHub Pages (Alternatif Hosting)

### Option 1: GitHub Actions ile Otomatik Deployment

1. **.github/workflows/deploy.yml** oluşturun:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        env:
          VITE_API_KEY: ${{ secrets.API_KEY }}
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. **GitHub Secrets ekleyin**:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `API_KEY`
   - Secret: Your Gemini API Key

3. **GitHub Pages'i aktifleştirin**:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / root

### Option 2: Manuel Deployment

```bash
npm run build
npx gh-pages -d dist
```

---

## 🔄 4. Vercel ile Deployment (Önerilen)

### İlk Deployment

1. **Vercel'e GitHub repo'yu bağlayın**
   - https://vercel.com/new
   - Import Git Repository
   - `ahmetunaluzun/beni-ov` seçin

2. **Environment Variables ekleyin**
   ```
   API_KEY=your_gemini_api_key
   ```

3. **Deploy edin**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy

### Otomatik Deployment

Her `git push` sonrası otomatik deploy olacak:
```bash
git add .
git commit -m "feat: Add new feature"
git push
# Vercel otomatik deploy eder
```

---

## 📋 5. GitHub Issues & Projects

### Issue Templates

**.github/ISSUE_TEMPLATE/bug_report.md**:
```markdown
---
name: Bug Report
about: Hata bildirimi
title: '[BUG] '
labels: bug
---

**Hata Açıklaması**
Açık ve net bir açıklama.

**Tekrar Etme Adımları**
1. '...' sayfasına git
2. '....' butonuna tıkla
3. '....' alanına yaz
4. Hatayı gör

**Beklenen Davranış**
Ne olmasını bekliyordunuz?

**Ekran Görüntüleri**
Varsa ekleyin.

**Sistem Bilgisi:**
 - Cihaz: [örn. iPhone 12]
 - Tarayıcı: [örn. Chrome, Safari]
 - Versiyon: [örn. 22]
```

**.github/ISSUE_TEMPLATE/feature_request.md**:
```markdown
---
name: Feature Request
about: Özellik önerisi
title: '[FEATURE] '
labels: enhancement
---

**Özellik Açıklaması**
Açık ve net bir açıklama.

**Neden Gerekli?**
Hangi problemi çözer?

**Önerilen Çözüm**
Nasıl çalışmasını istersiniz?

**Alternatifler**
Başka hangi çözümleri düşündünüz?
```

---

## 🏷️ 6. Releases & Versioning

### Semantic Versioning

```
v2.0.0
│ │ │
│ │ └─ Patch (Bug fixes)
│ └─── Minor (New features, backward compatible)
└───── Major (Breaking changes)
```

### Release Oluşturma

1. **Tag oluşturun**:
```bash
git tag -a v2.0.0 -m "Release v2.0.0 - Major Update"
git push origin v2.0.0
```

2. **GitHub'da Release oluşturun**:
   - Releases → Create a new release
   - Tag: v2.0.0
   - Title: "🎉 Beni Öv v2.0 - Major Update"
   - Changelog ekleyin
   - Publish release

---

## 🔐 7. Güvenlik

### Dependabot

`.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Security Policy

**SECURITY.md**:
```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

Email: ahmet@example.com
```

---

## 📊 8. GitHub Badges

README.md'ye ekleyin:

```markdown
![Build](https://github.com/ahmetunaluzun/beni-ov/workflows/CI/badge.svg)
![Version](https://img.shields.io/github/v/release/ahmetunaluzun/beni-ov)
![License](https://img.shields.io/github/license/ahmetunaluzun/beni-ov)
![Stars](https://img.shields.io/github/stars/ahmetunaluzun/beni-ov)
![Issues](https://img.shields.io/github/issues/ahmetunaluzun/beni-ov)
```

---

## 🎯 9. Quick Commands

### Günlük İş Akışı

```bash
# Feature başlat
git checkout -b feature/new-feature

# Geliştir & test et
npm run dev

# Commit et
git add .
git commit -m "feat: Add new feature"

# Push et
git push origin feature/new-feature

# GitHub'da PR aç
# Merge sonrası otomatik deploy
```

### Hotfix

```bash
# Hotfix branch
git checkout -b hotfix/critical-bug

# Fix yap
# ...

# Commit & push
git add .
git commit -m "fix: Critical bug fix"
git push origin hotfix/critical-bug

# PR aç ve acil merge et
```

---

## ✅ Checklist

- [ ] GitHub repo oluşturuldu
- [ ] İlk commit yapıldı
- [ ] README.md güncellendi
- [ ] LICENSE eklendi
- [ ] .gitignore kontrol edildi
- [ ] About section ayarlandı
- [ ] Topics eklendi
- [ ] Vercel'e bağlandı
- [ ] Environment variables eklendi
- [ ] İlk deployment başarılı
- [ ] Issue templates oluşturuldu
- [ ] v2.0.0 release yapıldı

---

## 🎉 Başarılı!

Tebrikler! Projeniz GitHub'da ve canlı olarak yayında! 🚀

**Sonraki Adımlar:**
1. ⭐ Star toplayın
2. 🐛 Issue'ları takip edin
3. 🤝 Contribution'ları kabul edin
4. 📈 Projeyi geliştirin
