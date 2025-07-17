#!/bin/bash

echo "🚀 Hızlı Çekici - Production Deployment"
echo "======================================"

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Node.js kontrolü
echo -e "${YELLOW}📋 Node.js kontrolü...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı!${NC}"
    echo "Node.js kurulum komutu: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js versiyonu: $NODE_VERSION${NC}"

# NPM kontrolü
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ NPM versiyonu: $NPM_VERSION${NC}"

# PM2 kontrolü ve kurulumu
echo -e "${YELLOW}📋 PM2 kontrolü...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🔄 PM2 kuruluyor...${NC}"
    npm install -g pm2
fi

# Dependencies kurulumu
echo -e "${YELLOW}📦 Dependencies kuruluyor...${NC}"
npm install --production

# Environment dosyası kontrolü
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  .env dosyası oluşturuluyor...${NC}"
    cp production.env .env
    echo -e "${RED}⚠️  UYARI: .env dosyasındaki ayarları düzenleyin!${NC}"
    echo -e "${RED}   - MongoDB Atlas connection string${NC}"
    echo -e "${RED}   - JWT ve Session secret keys${NC}"
    echo -e "${RED}   - Admin şifresi${NC}"
fi

# Uploads klasörü oluştur
mkdir -p public/uploads
echo -e "${GREEN}✅ Uploads klasörü hazır${NC}"

# PM2 ile başlat
echo -e "${YELLOW}🚀 Uygulama başlatılıyor...${NC}"
pm2 start server.js --name "towing-company" --env production

# PM2 otomatik başlatma
pm2 startup
pm2 save

echo ""
echo -e "${GREEN}🎉 Deployment tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📋 Önemli Bilgiler:${NC}"
echo -e "   🌐 Site URL: http://your-domain.com:3000"
echo -e "   🔐 Admin Panel: http://your-domain.com:3000/admin/login"
echo -e "   👤 Kullanıcı: admin"
echo -e "   🔑 Şifre: (.env dosyasında ayarlayın)"
echo ""
echo -e "${YELLOW}📝 Yapılacaklar:${NC}"
echo -e "   1. .env dosyasını düzenleyin"
echo -e "   2. MongoDB Atlas cluster oluşturun"
echo -e "   3. Database seed çalıştırın: npm run seed"
echo -e "   4. Nginx reverse proxy ayarlayın (isteğe bağlı)"
echo ""
echo -e "${YELLOW}🔧 PM2 Komutları:${NC}"
echo -e "   📊 Status: pm2 status"
echo -e "   📜 Logs: pm2 logs towing-company"
echo -e "   🔄 Restart: pm2 restart towing-company"
echo -e "   🛑 Stop: pm2 stop towing-company" 