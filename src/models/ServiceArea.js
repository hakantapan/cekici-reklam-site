const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bölge adı gerekli'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Coğrafi Bilgiler
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  
  // Hizmet Detayları
  coverage: {
    type: String,
    enum: ['full', 'partial'],
    default: 'full'
  },
  estimatedResponseTime: {
    type: Number, // dakika cinsinden
    default: 15
  },
  serviceHours: {
    type: String,
    default: '7/24'
  },
  
  // Fiyatlandırma
  baseFee: {
    type: Number,
    default: 0
  },
  perKmFee: {
    type: Number,
    default: 0
  },
  
  // Popülerlik ve İstatistikler
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  totalCalls: {
    type: Number,
    default: 0
  },
  lastCallDate: {
    type: Date
  },
  
  // Durum
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  
  // Notlar
  notes: {
    type: String,
    trim: true
  },
  
  // Alt Bölgeler (isteğe bağlı)
  subAreas: [{
    name: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Oluşturan/Güncelleyen
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Slug oluşturma middleware
serviceAreaSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Call tracking method
serviceAreaSchema.methods.recordCall = async function() {
  this.totalCalls += 1;
  this.lastCallDate = new Date();
  return await this.save();
};

// Popüler bölgeleri getir
serviceAreaSchema.statics.getPopularAreas = function(limit = 5) {
  return this.find({ isActive: true })
    .sort({ totalCalls: -1, priority: -1 })
    .limit(limit);
};

// Aktif bölgeleri getir
serviceAreaSchema.statics.getActiveAreas = function() {
  return this.find({ isActive: true })
    .sort({ priority: -1, name: 1 });
};

module.exports = mongoose.model('ServiceArea', serviceAreaSchema); 