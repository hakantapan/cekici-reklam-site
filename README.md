# 🚛 Hızlı Çekici - Professional Towing Company Backend

Node.js + Express + MongoDB ile geliştirilmiş profesyonel çekici firması backend sistemi. İstanbul Avrupa Yakası'nda 7/24 çekici hizmeti için tam özellikli API ve admin panel.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/towing-company)

**2 dakikada canlıya çıkar!** → [Vercel Deployment Rehberi](VERCEL_DEPLOY.md)

## ✨ Features

- **🔐 Admin Panel**: Secure authentication with JWT
- **📊 Real-time Dashboard**: Live statistics and call tracking
- **📱 Mobile Responsive**: Perfect on all devices
- **🗄️ MongoDB Integration**: Atlas cloud database support
- **🔒 Security**: Rate limiting, CSRF protection, password hashing
- **⚡ Performance**: Optimized for speed and scalability
- **🌐 SEO Friendly**: Auto sitemap, meta tags
- **📈 Analytics**: Call tracking and conversion metrics

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas recommended)
- **Authentication**: JWT + Sessions
- **Template Engine**: EJS
- **Security**: Helmet, CORS, bcrypt
- **Deployment**: Vercel (serverless) / PM2 (traditional)

## 📋 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/towing-company.git
cd towing-company

# Install dependencies
npm install

# Setup environment
cp env.vercel.example .env
# Edit .env with your MongoDB connection

# Seed database
npm run seed

# Start development server
npm run dev
```

Access:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login (admin/123456)

### Vercel Deployment

1. **Fork this repo** on GitHub
2. **Connect to Vercel**: https://vercel.com/new
3. **Add Environment Variables** in Vercel dashboard
4. **Deploy** automatically! ✨

Detailed guide: [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)

## 🗂️ Project Structure

```
├── server.js              # Main Express server
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
│
├── src/
│   ├── models/            # MongoDB schemas
│   ├── routes/            # Express routes
│   ├── middleware/        # Authentication & security
│   └── config/            # Database connection
│
├── views/                 # EJS templates
│   ├── pages/            # Public pages
│   └── admin/            # Admin panel
│
├── public/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side scripts
│   └── images/          # Images
│
├── scripts/             # Utility scripts
└── docs/               # Documentation
```

## 🔌 API Endpoints

### Public APIs
```
GET  /api/settings              # Site configuration
GET  /api/service-areas         # Active service areas
POST /track-call               # Call tracking
```

### Admin APIs (Auth Required)
```
GET  /admin/dashboard          # Admin dashboard
PUT  /api/admin/settings       # Update settings
POST /api/admin/service-areas  # Manage service areas
GET  /api/admin/export/calls   # Export call data
```

## 🔐 Security Features

- **JWT Authentication** with secure sessions
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **CSRF Protection** for forms
- **Input Validation** on all inputs
- **SQL Injection Protection** via Mongoose
- **XSS Protection** with security headers

## 📊 Admin Panel Features

- **📈 Dashboard**: Real-time statistics
- **⚙️ Site Settings**: Content management
- **🗺️ Service Areas**: Geographic coverage
- **📞 Call Tracking**: Lead monitoring
- **📋 Reports**: Data export and analytics
- **👤 User Management**: Admin accounts

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
- ✅ **Free hosting** with global CDN
- ✅ **Auto-scaling** and HTTPS
- ✅ **Git integration** for CI/CD
- ⚠️ Serverless limitations (no Socket.io)

### Option 2: Traditional VPS
- ✅ **Full control** with PM2
- ✅ **Socket.io support** for real-time
- ✅ **Custom domains** and SSL
- 📋 Guide: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🗄️ Database Schema

### Collections
- **Users**: Admin authentication
- **SiteSettings**: Dynamic configuration (singleton)
- **ServiceAreas**: Geographic coverage with SEO
- **CallTracking**: Lead tracking and analytics

### Indexes
- Optimized queries for performance
- Geographic indexing for service areas
- Time-based indexing for analytics

## 📱 Mobile Features

- **Responsive Design** for all screen sizes
- **Touch-Friendly** admin interface
- **Fast Loading** with optimized assets
- **Progressive Enhancement** for offline

## 🔍 SEO Optimization

- **Dynamic Meta Tags** from database
- **Auto-Generated Sitemap** XML
- **Robots.txt** configuration
- **Structured Data** for rich snippets
- **Performance Optimized** for Core Web Vitals

## 📈 Analytics & Tracking

- **Call Tracking**: Phone and WhatsApp clicks
- **Geographic Analytics**: Service area performance
- **Conversion Metrics**: Lead-to-call tracking
- **Admin Dashboard**: Real-time statistics
- **Export Functions**: CSV and Excel reports

## 🛠️ Development

### Local Setup
```bash
# Development mode with nodemon
npm run dev

# Run tests
npm test

# Database seed
npm run seed

# Production build
npm start
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/towing-company
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check docs/ folder
- **Issues**: GitHub Issues
- **Deployment**: [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)
- **Server Setup**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 Use Cases

Perfect for:
- **Towing Companies** 🚛
- **Emergency Services** 🚨
- **Local Businesses** 🏪
- **Service Providers** 🔧

Easily customizable for any service-based business!

---

**Made with ❤️ for professional towing services**

⭐ **Star this repo** if you find it useful! 