# Hızlı Çekici - Landing Page

Bu proje, bir çekici şirketi için tasarlanmış modern ve responsive bir landing page'dir. Vanilla HTML, CSS ve JavaScript kullanılarak kodlanmıştır.

## 🚛 Özellikler

- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- **Modern UI/UX**: Temiz ve kullanıcı dostu arayüz
- **Hızlı Yükleme**: Optimize edilmiş kod ve minimum bağımlılık
- **SEO Uyumlu**: Semantik HTML ve meta etiketler
- **Erişilebilirlik**: WCAG standartlarına uygun
- **Animasyonlar**: Smooth scroll ve hover efektleri
- **Mobil Optimizasyonu**: Sticky call button ve touch-friendly design

## 📁 Dosya Yapısı

```
.
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── script.js           # JavaScript fonksiyonları
├── README.md          # Bu dosya
├── SETUP.md           # Görsel ekleme kılavuzu
├── admin.html         # Admin panel giriş sayfası
├── dashboard.html     # Admin dashboard
├── site-settings.html # Site ayarları sayfası
├── areas.html         # Hizmet bölgeleri yönetimi
├── statistics.html    # İstatistikler ve raporlar
├── admin.css          # Admin panel CSS stilleri
├── admin.js           # Admin panel JavaScript
└── hero-background.jpg # Hero arkaplan görseli (eklenecek)
```

## 🎛️ Admin Panel

Siteniz artık güçlü bir **admin panel** ile birlikte geliyor!

### 📊 Admin Panel Özellikleri:
- **Login Sistemi**: Güvenli giriş (demo: admin/123456)
- **Dashboard**: İstatistikler ve hızlı işlemler
- **Site Ayarları**: İçerik düzenleme, telefon numarası değiştirme
- **Hizmet Bölgeleri**: Bölge ekleme/çıkarma/düzenleme
- **İstatistikler**: Telefon/WhatsApp tıklama raporları
- **Responsive**: Mobil uyumlu tasarım

### 🔐 Giriş Bilgileri:
- **URL**: `admin.html`
- **Kullanıcı Adı**: `admin`
- **Şifre**: `123456`

### 📱 Mobil Uyumluluk:
- Mobil navigasyon
- Touch-friendly arayüz
- Responsive dashboard
- Mobil optimized formlar

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Ana Renk**: #268835 (Yeşil)
- **Metin**: #1f2937 (Koyu Gri)
- **Arka Plan**: #ffffff (Beyaz) / #f9fafb (Açık Gri)
- **Vurgu**: #86efac (Açık Yeşil)

### Tipografi
- **Font**: Inter (Google Fonts)
- **Boyutlar**: Responsive font scaling
- **Ağırlık**: 400, 500, 600, 700, 800

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Kurulum ve Kullanım

1. **Dosyaları İndirin**
   ```bash
   # Bu dosyaları bilgisayarınıza kaydedin:
   # - index.html
   # - styles.css
   # - script.js
   ```

2. **Tarayıcıda Açın**
   ```bash
   # index.html dosyasını çift tıklayarak açın
   # veya bir web sunucusu kullanın
   ```

3. **Web Sunucusu ile Çalıştırma (Opsiyonel)**
   ```bash
   # Python ile
   python -m http.server 8000
   
   # Node.js ile
   npx http-server
   
   # PHP ile
   php -S localhost:8000
   ```

## ⚙️ Özelleştirme

### Telefon Numarası Değiştirme
`script.js` dosyasında telefon numarasını güncelleyin:
```javascript
const phoneNumber = "+90 555 123 45 67"; // Buraya kendi numaranızı yazın
```

### WhatsApp Numarası Değiştirme
`script.js` dosyasında WhatsApp numarasını güncelleyin:
```javascript
const whatsappNumber = "905551234567"; // + işareti olmadan
```

### Şirket Bilgilerini Değiştirme
`index.html` dosyasında şirket adını ve diğer bilgileri güncelleyin:
```html
<span class="logo-text">Hızlı Çekici</span> <!-- Şirket adı -->
```

### Renkleri Özelleştirme
`styles.css` dosyasında ana rengi değiştirin:
```css
/* Ana yeşil rengi değiştirmek için bu değerleri arayın ve değiştirin */
background-color: #268835; /* Yeni renginiz */
```

## 📋 Bölümler

1. **Header**: Logo ve telefon butonu
2. **Hero**: Ana banner ve CTA butonları
3. **Hizmetler**: Araç çekme, yol yardımı, kaza yardımı
4. **Neden Biz**: Avantajlar ve özellikler
5. **Hizmet Bölgeleri**: İstanbul Avrupa Yakası ilçeleri
6. **Acil CTA**: Acil durum çağrısı
7. **İletişim**: İletişim bilgileri
8. **Footer**: Alt bilgiler

## 📱 Mobil Özellikler

- Sticky header navigation
- Mobil optimized buttons
- Touch-friendly interface
- Mobil sticky call button
- Responsive typography
- Optimized images

## 🖼️ Hero Arkaplan Görseli

Kendi çekici kamyonu görselinizi hero bölümünde kullanabilirsiniz:

- Görselinizi `hero-background.jpg` olarak kaydedin
- Önerilen boyut: 1920x1080 piksel
- Maksimum dosya boyutu: 500KB
- Detaylı kılavuz için `SETUP.md` dosyasına bakın

## 🎯 JavaScript Fonksiyonları

- **handleCall()**: Telefon arama
- **handleWhatsApp()**: WhatsApp yönlendirme
- **Scroll animasyonları**: Intersection Observer
- **Header gizleme**: Scroll-based
- **Loading states**: Button feedback
- **Emergency notification**: 2 dakika sonra uyarı

## 🌐 Browser Desteği

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🔧 Geliştirme Notları

### Performance Optimizations
- CSS Grid ve Flexbox kullanımı
- Minimal JavaScript
- Optimized animations
- Lazy loading hazır altyapısı

### Accessibility Features
- Semantic HTML
- ARIA labels
- Keyboard navigation
- High contrast support
- Reduced motion support

### SEO Features
- Meta tags
- Semantic structure
- Alt texts
- Fast loading

## 📞 İletişim Özellikleri

- **Telefon Arama**: `tel:` protokolü ile direk arama
- **WhatsApp**: Hazır mesajla WhatsApp yönlendirme
- **Click-to-call**: Mobil cihazlarda dokunmatik arama

## 🎨 Ekstra Özellikler

- Smooth scrolling
- Hover animations
- Loading states
- Emergency notifications
- Local storage preferences
- Analytics ready (Google Analytics)

## 📝 Lisans

Bu proje açık kaynak kodludur ve kişisel/ticari kullanım için serbesttir.

## 🤝 Katkıda Bulunma

1. Hataları bildirin
2. Özellik önerileri yapın
3. Code review yapın
4. Dokümantasyonu geliştirin

---

**Not**: Bu landing page template'ini farklı sektörler için de kolayca uyarlayabilirsiniz. İletişim bilgileri ve içerikleri değiştirerek kendi işiniz için kullanabilirsiniz. 