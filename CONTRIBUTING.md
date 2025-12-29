# 🤝 Katkıda Bulunma Rehberi

Beni Öv projesine katkıda bulunmayı düşündüğünüz için teşekkürler! 🎉

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Geliştirme Süreci](#geliştirme-süreci)
- [Commit Kuralları](#commit-kuralları)
- [Pull Request Süreci](#pull-request-süreci)

---

## 📜 Davranış Kuralları

Bu proje, tüm katkıda bulunanlardan saygılı ve yapıcı davranış bekler:

- Herkes için kapsayıcı ve misafirperver bir ortam yaratın
- Farklı görüş ve deneyimlere saygı gösterin
- Yapıcı eleştiri kabul edin
- Topluluk için en iyisine odaklanın

---

## 🚀 Nasıl Katkıda Bulunabilirim?

### 🐛 Hata Bildirimi

1. [Issues](https://github.com/ahmetunaluzun/beni-ov/issues) sayfasını kontrol edin
2. Aynı hata daha önce bildirilmediyse yeni issue açın
3. Şunları ekleyin:
   - Hatanın açık açıklaması
   - Tekrar etme adımları
   - Beklenen davranış
   - Gerçek davranış
   - Ekran görüntüleri (varsa)
   - Tarayıcı/cihaz bilgisi

### 💡 Özellik Önerisi

1. [Issues](https://github.com/ahmetunaluzun/beni-ov/issues) sayfasında "Feature Request" etiketiyle yeni issue açın
2. Şunları ekleyin:
   - Özelliğin detaylı açıklaması
   - Neden gerekli olduğu
   - Muhtemel kullanım senaryoları
   - Varsa UI mockup'ları

### 📝 Dokümantasyon

- README.md iyileştirmeleri
- Kod yorumları
- Kullanım örnekleri
- API dokümantasyonu

### 💻 Kod Katkısı

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi yapın
4. Test edin
5. Pull Request açın

---

## 🛠️ Geliştirme Süreci

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/ahmetunaluzun/beni-ov.git
cd beni-ov
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. API Key Ayarlayın

```bash
echo "VITE_API_KEY=your_gemini_api_key" > .env.local
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

### 5. Branch Oluşturun

```bash
git checkout -b feature/amazing-feature
```

### 6. Değişikliklerinizi Yapın

- Kod stiline uyun
- TypeScript tiplerini kullanın
- Yorum ekleyin
- Test edin

### 7. Commit & Push

```bash
git add .
git commit -m "feat: Add amazing feature"
git push origin feature/amazing-feature
```

---

## 📝 Commit Kuralları

[Conventional Commits](https://www.conventionalcommits.org/) formatını kullanıyoruz:

### Format

```
<tip>(<kapsam>): <açıklama>

[isteğe bağlı gövde]

[isteğe bağlı footer]
```

### Tipler

- **feat**: Yeni özellik
- **fix**: Hata düzeltmesi
- **docs**: Dokümantasyon değişikliği
- **style**: Kod formatı (mantık değişikliği yok)
- **refactor**: Kod yeniden düzenleme
- **test**: Test ekleme/düzenleme
- **chore**: Build, CI/CD vb. değişiklikler

### Örnekler

```bash
feat(themes): Add dark mode theme
fix(ai): Fix Gemini API timeout error
docs(readme): Update installation instructions
style(button): Format button component code
refactor(hooks): Simplify useLocalStorage hook
test(profile): Add profile validation tests
chore(deps): Update React to 19.0
```

---

## 🔄 Pull Request Süreci

### 1. PR Öncesi Kontrol

- [ ] Kod çalışıyor
- [ ] TypeScript hataları yok
- [ ] Build başarılı (`npm run build`)
- [ ] Commit mesajları kurallara uygun
- [ ] README güncel (gerekirse)

### 2. PR Açın

- Açık ve detaylı başlık
- Değişikliklerin açıklaması
- İlgili issue referansı (#123)
- Ekran görüntüleri (UI değişikliği varsa)

### 3. PR Template

```markdown
## Değişiklik Türü
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Açıklama
...

## İlgili Issue
Closes #123

## Test Edildi Mi?
- [ ] Evet
- [ ] Hayır

## Ekran Görüntüleri (UI değişikliği varsa)
...
```

### 4. Review Süreci

- Maintainer PR'ı inceleyecek
- Değişiklik talepleri gelebilir
- Onaylandıktan sonra merge edilir

---

## 🎨 Kod Stili

### TypeScript

```typescript
// ✅ İyi
interface Profile {
  name: string;
  age: number;
}

const user: Profile = {
  name: 'Ahmet',
  age: 30
};

// ❌ Kötü
const user = {
  name: 'Ahmet',
  age: 30
};
```

### React Components

```typescript
// ✅ İyi
export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
};

// ❌ Kötü
export default function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Tailwind CSS

```typescript
// ✅ İyi
<div className="flex items-center gap-2 p-4 rounded-lg bg-purple-500 hover:bg-purple-600">

// ❌ Kötü
<div className="flex items-center p-4 rounded-lg bg-purple-500 gap-2 hover:bg-purple-600">
```

---

## 🧪 Test

```bash
# Unit testler (yakında)
npm test

# Build test
npm run build

# Type check
npm run type-check
```

---

## 📚 Kaynaklar

- [React Dokümantasyonu](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini API](https://ai.google.dev/docs)

---

## ❓ Sorular?

Sorularınız için:
- GitHub Issues
- [Email](mailto:ahmet@example.com)
- [LinkedIn](https://www.linkedin.com/in/ahmetunaluzun/)

---

## 💝 Teşekkürler!

Beni Öv projesine katkıda bulunduğunuz için teşekkürler! 🎉

Her katkı, ister büyük ister küçük, çok değerlidir.
