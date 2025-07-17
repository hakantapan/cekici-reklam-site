const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../src/models/User');
const SiteSettings = require('../src/models/SiteSettings');
const ServiceArea = require('../src/models/ServiceArea');
const CallTracking = require('../src/models/CallTracking');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/towing-company', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
    process.exit(1);
  }
};

// Admin user oluştur
const createAdminUser = async () => {
  try {
    // Mevcut admin kullanıcısını kontrol et
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin kullanıcısı zaten mevcut');
      return existingAdmin;
    }

    const adminUser = new User({
      username: 'admin',
      email: 'admin@hizlicekici.com',
      password: '123456', // Model'de hash'lenecek
      fullName: 'Admin User',
      role: 'admin',
      phone: '05321234567'
    });

    await adminUser.save();
    console.log('✅ Admin kullanıcısı oluşturuldu (admin/123456)');
    return adminUser;
  } catch (error) {
    console.error('❌ Admin kullanıcı oluşturma hatası:', error);
    throw error;
  }
};

// Site ayarlarını oluştur
const createSiteSettings = async (adminUser) => {
  try {
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings({
        companyName: 'Hızlı Çekici',
        companySlogan: '7/24 Profesyonel Çekici Hizmeti',
        phone: '0850 123 45 67',
        whatsapp: '905321234567',
        email: 'info@hizlicekici.com',
        address: 'İstanbul, Türkiye',
        heroTitle: '7/24 Hızlı ve Güvenilir Çekici Hizmeti',
        heroSubtitle: 'Tüm İstanbul Avrupa Yakası\'nda profesyonel çekici hizmetimizle yanınızdayız. Acil durumlarınızda bir telefon kadar yakınız!',
        heroImage: '/images/hero-background.jpg',
        services: [
          {
            title: 'Acil Çekici',
            description: '7/24 acil durum çekici hizmeti',
            icon: 'truck',
            isActive: true
          },
          {
            title: 'Oto Kurtarma',
            description: 'Profesyonel araç kurtarma hizmeti',
            icon: 'wrench',
            isActive: true
          },
          {
            title: 'Lastik Değişimi',
            description: 'Yol kenarında lastik değişim hizmeti',
            icon: 'circle',
            isActive: true
          },
          {
            title: 'Akü Takviyesi',
            description: 'Akü boş kaldığında marş takviyesi',
            icon: 'battery',
            isActive: true
          }
        ],
        seo: {
          title: 'Hızlı Çekici - 7/24 Profesyonel Çekici Hizmeti İstanbul',
          description: 'İstanbul Avrupa Yakası\'nda 7/24 hızlı ve güvenilir çekici hizmeti. Acil durumlarınızda bir telefon kadar yakınız!',
          keywords: 'çekici, oto çekici, 7/24 çekici, istanbul çekici, acil çekici, araç kurtarma'
        },
        socialMedia: {
          facebook: 'https://facebook.com/hizlicekici',
          instagram: 'https://instagram.com/hizlicekici',
          twitter: 'https://twitter.com/hizlicekici'
        },
        lastUpdatedBy: adminUser._id
      });

      await settings.save();
      console.log('✅ Site ayarları oluşturuldu');
    } else {
      console.log('✅ Site ayarları zaten mevcut');
    }
    
    return settings;
  } catch (error) {
    console.error('❌ Site ayarları oluşturma hatası:', error);
    throw error;
  }
};

// Hizmet alanlarını oluştur
const createServiceAreas = async (adminUser) => {
  try {
    const existingCount = await ServiceArea.countDocuments();
    if (existingCount > 0) {
      console.log('✅ Hizmet alanları zaten mevcut');
      return;
    }

    const serviceAreas = [
      {
        name: 'Bağcılar',
        description: 'Bağcılar ilçesinde 7/24 çekici hizmeti',
        priority: 10,
        estimatedResponseTime: 12,
        totalCalls: 45,
        isPopular: true,
        createdBy: adminUser._id
      },
      {
        name: 'Kağıthane',
        description: 'Kağıthane ilçesinde profesyonel çekici hizmeti',
        priority: 9,
        estimatedResponseTime: 10,
        totalCalls: 38,
        isPopular: true,
        createdBy: adminUser._id
      },
      {
        name: 'Beyoğlu',
        description: 'Beyoğlu merkez bölgesinde çekici hizmeti',
        priority: 8,
        estimatedResponseTime: 15,
        totalCalls: 52,
        isPopular: true,
        createdBy: adminUser._id
      },
      {
        name: 'Şişli',
        description: 'Şişli ilçesinde hızlı çekici hizmeti',
        priority: 8,
        estimatedResponseTime: 12,
        totalCalls: 41,
        createdBy: adminUser._id
      },
      {
        name: 'Beşiktaş',
        description: 'Beşiktaş bölgesinde çekici hizmeti',
        priority: 7,
        estimatedResponseTime: 18,
        totalCalls: 35,
        createdBy: adminUser._id
      },
      {
        name: 'Bakırköy',
        description: 'Bakırköy ilçesinde 7/24 çekici',
        priority: 7,
        estimatedResponseTime: 20,
        totalCalls: 29,
        createdBy: adminUser._id
      },
      {
        name: 'Fatih',
        description: 'Fatih tarihi yarımada çekici hizmeti',
        priority: 6,
        estimatedResponseTime: 25,
        totalCalls: 22,
        createdBy: adminUser._id
      },
      {
        name: 'Beylikdüzü',
        description: 'Beylikdüzü modern yaşam alanlarında çekici',
        priority: 6,
        estimatedResponseTime: 15,
        totalCalls: 31,
        createdBy: adminUser._id
      },
      {
        name: 'Avcılar',
        description: 'Avcılar ilçesinde güvenilir çekici hizmeti',
        priority: 5,
        estimatedResponseTime: 22,
        totalCalls: 18,
        createdBy: adminUser._id
      },
      {
        name: 'Bahçelievler',
        description: 'Bahçelievler bölgesinde çekici hizmeti',
        priority: 5,
        estimatedResponseTime: 18,
        totalCalls: 25,
        createdBy: adminUser._id
      },
      {
        name: 'Sarıyer',
        description: 'Sarıyer ilçesinde profesyonel çekici',
        priority: 4,
        estimatedResponseTime: 30,
        totalCalls: 16,
        createdBy: adminUser._id
      },
      {
        name: 'Esenyurt',
        description: 'Esenyurt büyükşehir bölgesinde çekici hizmeti',
        priority: 4,
        estimatedResponseTime: 25,
        totalCalls: 21,
        createdBy: adminUser._id
      }
    ];

    await ServiceArea.insertMany(serviceAreas);
    console.log(`✅ ${serviceAreas.length} hizmet alanı oluşturuldu`);
  } catch (error) {
    console.error('❌ Hizmet alanları oluşturma hatası:', error);
    throw error;
  }
};

// Demo call tracking verileri oluştur
const createCallTrackingData = async () => {
  try {
    const existingCount = await CallTracking.countDocuments();
    if (existingCount > 0) {
      console.log('✅ Call tracking verileri zaten mevcut');
      return;
    }

    const serviceAreas = await ServiceArea.find();
    const callData = [];

    // Son 30 günde demo aramalar oluştur
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Her gün için 2-8 arama oluştur
      const dailyCalls = Math.floor(Math.random() * 7) + 2;
      
      for (let j = 0; j < dailyCalls; j++) {
        const callTime = new Date(date);
        callTime.setHours(Math.floor(Math.random() * 24));
        callTime.setMinutes(Math.floor(Math.random() * 60));
        
        const randomArea = serviceAreas[Math.floor(Math.random() * serviceAreas.length)];
        const callType = Math.random() > 0.3 ? 'phone' : 'whatsapp';
        
        callData.push({
          callType,
          phoneNumber: callType === 'phone' ? '0850 123 45 67' : '905321234567',
          serviceArea: randomArea._id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          userAgent: 'Mozilla/5.0 (Mobile Demo)',
          location: {
            city: 'İstanbul',
            country: 'Turkey'
          },
          device: {
            type: Math.random() > 0.6 ? 'mobile' : 'desktop'
          },
          callStatus: 'completed',
          duration: Math.floor(Math.random() * 180) + 30,
          isConversion: true,
          createdAt: callTime,
          updatedAt: callTime
        });
      }
    }

    await CallTracking.insertMany(callData);
    console.log(`✅ ${callData.length} call tracking kaydı oluşturuldu`);
  } catch (error) {
    console.error('❌ Call tracking verileri oluşturma hatası:', error);
    throw error;
  }
};

// Ana seed fonksiyonu
const seedDatabase = async () => {
  try {
    console.log('🌱 Database seed işlemi başlatılıyor...\n');
    
    await connectDB();
    
    // Verileri sırayla oluştur
    const adminUser = await createAdminUser();
    await createSiteSettings(adminUser);
    await createServiceAreas(adminUser);
    await createCallTrackingData();
    
    console.log('\n🎉 Database seed işlemi tamamlandı!');
    console.log('\n📋 Giriş Bilgileri:');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Kullanıcı: admin');
    console.log('   Şifre: 123456');
    console.log('\n🌐 Ana Site: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Seed işlemi hatası:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database bağlantısı kapatıldı');
    process.exit(0);
  }
};

// Script'i çalıştır
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  createAdminUser,
  createSiteSettings,
  createServiceAreas,
  createCallTrackingData
}; 