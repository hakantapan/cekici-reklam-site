# Hızlı Çekici - Professional Towing Company Backend

Node.js + Express.js + MongoDB ile geliştirilmiş profesyonel çekici firması web sitesi. İstanbul Avrupa Yakası'nda 7/24 çekici hizmeti için tam özellikli backend sistemi.

## 🚀 Teknolojiler

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework  
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - ODM library
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **EJS** - Template engine
- **Multer** - File upload
- **Bcrypt** - Password hashing

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **Morgan** - HTTP request logger
- **Express Validator** - Input validation

## 📁 Proje Yapısı

```
project/
├── server.js                   # Ana server dosyası
├── package.json               # Dependencies ve scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
│
├── src/
│   ├── models/               # MongoDB models
│   │   ├── User.js          # Admin kullanıcıları
│   │   ├── SiteSettings.js  # Site ayarları
│   │   ├── ServiceArea.js   # Hizmet alanları
│   │   └── CallTracking.js  # Arama takibi
│   │
│   ├── routes/              # Express routes
│   │   ├── authRoutes.js    # Authentication
│   │   ├── siteRoutes.js    # Ana site
│   │   ├── adminRoutes.js   # Admin panel
│   │   └── apiRoutes.js     # API endpoints
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js # Auth & security
│   │   └── errorHandler.js   # Error handling
│   │
│   ├── config/             # Configuration
│   │   └── database.js     # DB connection
│   │
│   └── utils/              # Utility functions
│
├── views/                  # EJS templates
│   ├── pages/             # Ana site sayfaları
│   └── admin/             # Admin panel sayfaları
│
├── public/                # Static files
│   ├── css/              # CSS dosyaları
│   ├── js/               # Client-side JS
│   ├── images/           # Resimler
│   └── uploads/          # Yüklenen dosyalar
│
├── scripts/              # Utility scripts
│   └── seed.js          # Database seed
│
└── tests/               # Test dosyaları
```

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
```bash
- Node.js 18+
- MongoDB 5.0+
- NPM veya Yarn
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Environment Variables
```bash
# .env dosyası oluştur ve düzenle:
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/towing-company
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
```

### 4. MongoDB Başlat
```bash
# MongoDB'yi başlat
mongod
```

### 5. Database Seed (Demo Data)
```bash
npm run seed
# Demo admin kullanıcısı: admin/123456
```

### 6. Sunucuyu Başlat
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 7. Erişim URLs
- **Ana Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API**: http://localhost:3000/api

## 🔌 API Endpoints

### Public APIs
```
GET  /api/settings              # Site ayarları
GET  /api/service-areas         # Aktif hizmet alanları
POST /track-call               # Arama takibi
```

### Authentication APIs
```
GET  /auth/login               # Giriş sayfası
POST /auth/login               # Giriş işlemi
POST /auth/logout              # Çıkış işlemi
```

### Admin APIs (Authentication Required)
```
GET  /admin/dashboard          # Dashboard
PUT  /api/admin/settings       # Ayarları güncelle
POST /api/admin/service-areas  # Yeni alan ekle
GET  /api/admin/export/calls   # CSV export
```

## 🔐 Admin Panel Kullanımı

### İlk Giriş
- URL: `/admin/login`
- Kullanıcı: `admin`
- Şifre: `123456`

### Özellikler
- **Dashboard**: Günlük istatistikler ve son aramalar
- **Site Ayarları**: Şirket bilgileri ve içerik düzenleme
- **Hizmet Alanları**: Bölge yönetimi ve priorite belirleme
- **İstatistikler**: Detaylı raporlar ve export fonksiyonları

## 🛡️ Security Features

- JWT Authentication
- Password Hashing (Bcrypt)
- Rate Limiting
- CSRF Protection
- Input Validation
- XSS Protection
- Session Management

## 📊 Real-time Features

- Socket.io Integration
- Live call tracking
- Real-time admin notifications
- Dynamic dashboard updates

## 🚀 Deployment

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "towing-company"
pm2 startup
pm2 save
```

### Environment Variables (Production)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://[username:password@]host[:port][/database]
JWT_SECRET=[strong-production-secret]
```

## 📧 Support

Teknik destek için:
- **Email**: support@hizlicekici.com

---

**Hızlı Çekici** - Profesyonel 7/24 Çekici Hizmeti  
Geliştirildi: Node.js + Express.js + MongoDB 