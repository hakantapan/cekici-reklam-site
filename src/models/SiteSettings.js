const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Şirket Bilgileri
  companyName: {
    type: String,
    required: true,
    default: 'Hızlı Çekici'
  },
  companySlogan: {
    type: String,
    default: '7/24 Profesyonel Çekici Hizmeti'
  },
  
  // İletişim Bilgileri
  phone: {
    type: String,
    required: true,
    default: '0850 123 45 67'
  },
  whatsapp: {
    type: String,
    required: true,
    default: '905321234567'
  },
  email: {
    type: String,
    required: true,
    default: 'info@hizlicekici.com'
  },
  address: {
    type: String,
    default: 'İstanbul, Türkiye'
  },
  
  // Hero Section
  heroTitle: {
    type: String,
    default: '7/24 Hızlı ve Güvenilir Çekici Hizmeti'
  },
  heroSubtitle: {
    type: String,
    default: 'Tüm İstanbul Avrupa Yakası\'nda profesyonel çekici hizmetimizle yanınızdayız. Acil durumlarınızda bir telefon kadar yakınız!'
  },
  heroImage: {
    type: String,
    default: '/images/hero-background.jpg'
  },
  
  // Hizmetler
  services: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // SEO Ayarları
  seo: {
    title: {
      type: String,
      default: 'Hızlı Çekici - 7/24 Profesyonel Çekici Hizmeti'
    },
    description: {
      type: String,
      default: 'İstanbul Avrupa Yakası\'nda 7/24 hızlı ve güvenilir çekici hizmeti. Acil durumlarınızda bir telefon kadar yakınız!'
    },
    keywords: {
      type: String,
      default: 'çekici, oto çekici, 7/24 çekici, istanbul çekici, acil çekici'
    }
  },
  
  // Sosyal Medya
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  
  // Site Ayarları
  isMaintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'Site bakımdadır. Kısa süre sonra tekrar deneyin.'
  },
  
  // Analytics
  googleAnalyticsId: String,
  googleTagManagerId: String,
  
  // Güncelleme Bilgileri
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Single instance pattern - sadece bir settings document olacak
siteSettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema); 