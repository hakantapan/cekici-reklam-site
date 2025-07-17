# Görsel Ekleme Kılavuzu

## Hero Arkaplan Görseli Ekleme

Sitenizin hero bölümünde kendi çekici kamyonu görselinizi kullanmak için:

### 1. Görsel Hazırlama
- **Dosya Adı**: `hero-background.jpg`
- **Önerilen Boyut**: 1920x1080 piksel (Full HD)
- **Format**: JPG veya PNG
- **Dosya Boyutu**: Maksimum 500KB (hızlı yükleme için)

### 2. Görseli Projeye Ekleme
1. Hazırladığınız görseli `hero-background.jpg` olarak adlandırın
2. Bu dosyayı `index.html` dosyasının bulunduğu klasöre koyun

### 3. Dosya Yapısı
```
towing-company-landing/
├── index.html
├── styles.css
├── script.js
├── hero-background.jpg  ← Görselinizi buraya ekleyin
└── README.md
```

### 4. Görsel Özellikleri
- **Otomatik boyutlandırma**: Görsel otomatik olarak hero alanını kaplayacak
- **Merkez hizalama**: Görsel merkeze hizalanacak
- **Yeşil overlay**: Görselin üzerine şeffaf yeşil renk katmanı eklenecek
- **Responsive**: Tüm cihazlarda düzgün görünecek

### 5. Öneriler
- **Yüksek kalite**: Net ve profesyonel görsel kullanın
- **Kontrast**: Metin okunabilirliği için uygun kontrast seçin
- **Hız optimizasyonu**: Görseli optimize edin (TinyPNG gibi araçlarla)

## Alternatif Görseller

Farklı görseller kullanmak isterseniz:

### Dosya Adını Değiştirme
`styles.css` dosyasında 157. satırda:
```css
background: url('hero-background.jpg') center/cover no-repeat;
```

Bu satırda `hero-background.jpg` kısmını kendi görsel dosyanızın adıyla değiştirin.

## Sorun Giderme

### Görsel Görünmüyor
1. Dosya adının doğru olduğunu kontrol edin
2. Dosyanın doğru klasörde olduğunu kontrol edin  
3. Tarayıcı cache'ini temizleyin (Ctrl+F5)

### Görsel Bulanık
1. Daha yüksek çözünürlüklü görsel kullanın
2. JPG kalitesini artırın
3. PNG formatını deneyin

### Yavaş Yükleme
1. Görsel boyutunu küçültün
2. Optimizasyon araçları kullanın
3. WebP formatını deneyin (modern tarayıcılar için) 