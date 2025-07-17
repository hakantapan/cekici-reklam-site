# 🚀 Hızlı Çekici - Production Deployment Guide

Bu rehber sayesinde Node.js + MongoDB çekici firması projenizi sunucunuza kolayca yükleyebilirsiniz.

## 📋 Gereksinimler

### Sunucu Gereksinimleri
- **İşletim Sistemi**: Linux (Ubuntu/CentOS/RHEL)
- **RAM**: Minimum 1GB (2GB önerilen)
- **Disk**: Minimum 5GB boş alan
- **CPU**: 1 Core (2 Core önerilen)

### Yazılım Gereksinimleri
- **Node.js**: v18+ (v20 önerilen)
- **NPM**: v9+
- **PM2**: Process manager
- **MongoDB**: Atlas (Cloud) önerilen
- **Nginx**: Reverse proxy (isteğe bağlı)

## 🚀 Hızlı Deployment (5 Dakika)

### 1. Sunucuya Proje Yükleme

```bash
# Sunucunuza SSH ile bağlanın
ssh your-user@your-server-ip

# Proje klasörüne gidin
cd /var/www/html
# veya
cd /home/your-user

# Projeyi yükleyin (GitHub, FTP, SCP ile)
git clone your-repo-url towing-company
# veya dosyaları manual upload edin

cd towing-company
```

### 2. Otomatik Kurulum

```bash
# Deploy script'ini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

Deploy script otomatik olarak:
- ✅ Node.js kontrolü yapar
- ✅ Dependencies kurar  
- ✅ PM2 kurar ve yapılandırır
- ✅ Environment dosyası oluşturur
- ✅ Uygulamayı başlatır

### 3. Environment Ayarları

```bash
# .env dosyasını düzenleyin
nano .env
```

**Önemli:** Aşağıdaki değerleri mutlaka düzenleyin:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/towing-company

# Strong Security Keys (Generate new ones!)
JWT_SECRET=your-super-strong-jwt-secret-here
SESSION_SECRET=your-super-strong-session-secret-here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-admin-password
```

### 4. MongoDB Atlas Setup

1. **MongoDB Atlas'a Git**: https://www.mongodb.com/atlas
2. **Ücretsiz Hesap Oluştur**
3. **Cluster Oluştur** (Free tier - 512MB)
4. **Database User Ekle** (username/password)
5. **Network Access** → IP Whitelist → Add Current IP (veya 0.0.0.0/0)
6. **Connect** → Application → Connection String Al
7. **.env dosyasında MONGODB_URI güncelle**

### 5. Database Seed

```bash
# Demo data oluştur
npm run seed
```

### 6. Uygulamayı Restart Et

```bash
pm2 restart towing-company
```

## 🎉 Tamamlandı!

- **Ana Site**: `http://your-server-ip:3000`
- **Admin Panel**: `http://your-server-ip:3000/admin/login`
- **Kullanıcı**: admin
- **Şifre**: .env dosyasında belirlediğiniz

---

## 🔧 Manuel Kurulum (Detaylı)

### 1. Node.js Kurulumu

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Kontrol
node --version
npm --version
```

### 2. PM2 Kurulumu

```bash
# Global PM2 kurulumu
sudo npm install -g pm2

# PM2 otomatik başlatma
pm2 startup
# Komut çıktısındaki komutu çalıştırın
```

### 3. Dependencies Kurulumu

```bash
# Production dependencies
npm install --production

# veya
npm ci --only=production
```

### 4. Environment Dosyası

```bash
# Production template'ini kopyala
cp production.env .env

# Düzenle
nano .env
```

### 5. Uygulamayı Başlat

```bash
# PM2 ile başlat
pm2 start server.js --name "towing-company" --env production

# Otomatik kaydet
pm2 save
```

---

## 🌐 Domain ve SSL Setup (Nginx)

### 1. Nginx Kurulumu

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. Nginx Konfigürasyonu

```bash
# Site konfigürasyonunu kopyala
sudo cp nginx.conf /etc/nginx/sites-available/towing-company

# Domain'inizi düzenleyin
sudo nano /etc/nginx/sites-available/towing-company
# server_name your-domain.com www.your-domain.com;

# Site'ı aktifleştir
sudo ln -s /etc/nginx/sites-available/towing-company /etc/nginx/sites-enabled/

# Nginx restart
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme test
sudo certbot renew --dry-run
```

---

## 🔧 PM2 Management

### Temel Komutlar

```bash
# Status kontrolü
pm2 status

# Logs görüntüle
pm2 logs towing-company

# Restart
pm2 restart towing-company

# Stop
pm2 stop towing-company

# Delete
pm2 delete towing-company

# Monitoring
pm2 monit
```

### Memory ve CPU İzleme

```bash
# Real-time monitoring
pm2 monit

# Process bilgileri
pm2 show towing-company

# Memory kullanımı
pm2 list
```

---

## 🔒 Security Checklist

### Firewall Ayarları

```bash
# UFW (Ubuntu)
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable

# Port 3000'i kapatın (Nginx proxy kullanıyorsanız)
# sudo ufw deny 3000
```

### System Updates

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### Environment Security

```bash
# .env dosyası izinleri
chmod 600 .env

# Logs klasörü izinleri
mkdir -p logs
chmod 755 logs
```

---

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Port 3000 kullanan process'i bul
sudo lsof -i :3000
sudo kill -9 PID

# PM2 restart
pm2 restart towing-company
```

**MongoDB Connection Error**
```bash
# .env dosyasını kontrol et
cat .env | grep MONGODB_URI

# Network ayarlarını kontrol et
# MongoDB Atlas'ta IP whitelist kontrol et
```

**Permission Errors**
```bash
# Node modules yeniden kur
rm -rf node_modules
npm install --production
```

**Nginx 502 Error**
```bash
# PM2 status kontrol
pm2 status

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Node.js uygulama logs
pm2 logs towing-company
```

### Log Dosyaları

```bash
# PM2 logs
pm2 logs towing-company

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

---

## 📊 Performance Optimization

### PM2 Cluster Mode

```bash
# Cluster mode ile başlat (CPU core sayısınca)
pm2 start server.js --name "towing-company" -i max

# veya belirli sayıda instance
pm2 start server.js --name "towing-company" -i 2
```

### Memory Limits

```bash
# Memory limit ile başlat
pm2 start server.js --name "towing-company" --max-memory-restart 1G
```

### Nginx Caching

```bash
# nginx.conf'a ekleyin
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;
```

---

## 🔄 Backup & Updates

### Database Backup

```bash
# MongoDB Atlas otomatik backup yapıyor
# Manuel backup için MongoDB Compass kullanın
```

### Code Updates

```bash
# Git pull (eğer git kullanıyorsanız)
git pull origin main

# Dependencies güncelle
npm install --production

# PM2 restart
pm2 restart towing-company
```

### Environment Backup

```bash
# .env dosyasını backup'layın
cp .env .env.backup
```

---

## 📞 Support

Deployment sırasında sorun yaşarsanız:

- **PM2 Status**: `pm2 status`
- **Logs**: `pm2 logs towing-company`
- **Nginx Status**: `sudo systemctl status nginx`
- **Server Resources**: `htop` veya `free -h`

**Başarılı deployment sonrası admin panel erişimi:**
- URL: `http://your-domain.com/admin/login`
- Kullanıcı: admin
- Şifre: .env dosyasında belirlediğiniz

---

**🎉 Başarılı deployment'lar dileriz!** 