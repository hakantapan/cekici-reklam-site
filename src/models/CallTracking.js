const mongoose = require('mongoose');

const callTrackingSchema = new mongoose.Schema({
  // Arama Tipi
  callType: {
    type: String,
    enum: ['phone', 'whatsapp'],
    required: true
  },
  
  // Telefon Numarası (nereden arandı)
  phoneNumber: {
    type: String,
    required: true
  },
  
  // IP ve Konum Bilgileri
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  
  // Coğrafi Bilgiler
  location: {
    city: String,
    region: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  
  // Referral Bilgileri
  referrer: {
    type: String
  },
  source: {
    type: String,
    enum: ['direct', 'search', 'social', 'referral', 'unknown'],
    default: 'unknown'
  },
  
  // Sayfa Bilgileri
  currentPage: {
    type: String,
    default: '/'
  },
  pageTitle: {
    type: String
  },
  
  // Hizmet Alanı (eğer varsa)
  serviceArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceArea'
  },
  
  // Session Bilgileri
  sessionId: {
    type: String
  },
  isNewVisitor: {
    type: Boolean,
    default: true
  },
  
  // Cihaz Bilgileri
  device: {
    type: {
      type: String,
      enum: ['desktop', 'tablet', 'mobile'],
      default: 'unknown'
    },
    os: String,
    browser: String
  },
  
  // Arama Durumu
  callStatus: {
    type: String,
    enum: ['initiated', 'connected', 'completed', 'failed'],
    default: 'initiated'
  },
  
  // Süre Bilgileri
  duration: {
    type: Number, // saniye cinsinden
    default: 0
  },
  
  // Ekstra Bilgiler
  notes: {
    type: String
  },
  isTest: {
    type: Boolean,
    default: false
  },
  
  // Conversion Tracking
  isConversion: {
    type: Boolean,
    default: false
  },
  conversionValue: {
    type: Number,
    default: 0
  },
  
  // Takip Eden
  trackedBy: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

// Index'ler
callTrackingSchema.index({ createdAt: -1 });
callTrackingSchema.index({ callType: 1, createdAt: -1 });
callTrackingSchema.index({ serviceArea: 1, createdAt: -1 });
callTrackingSchema.index({ ipAddress: 1 });

// Static methods
callTrackingSchema.statics.getTodayStats = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        isTest: false
      }
    },
    {
      $group: {
        _id: '$callType',
        count: { $sum: 1 },
        uniqueCallers: { $addToSet: '$ipAddress' }
      }
    },
    {
      $project: {
        callType: '$_id',
        count: 1,
        uniqueCallers: { $size: '$uniqueCallers' },
        _id: 0
      }
    }
  ]);
};

callTrackingSchema.statics.getWeeklyStats = function() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: weekAgo },
        isTest: false
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          callType: '$callType'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ]);
};

callTrackingSchema.statics.getPopularServiceAreas = function(limit = 5) {
  return this.aggregate([
    {
      $match: {
        serviceArea: { $exists: true },
        isTest: false
      }
    },
    {
      $group: {
        _id: '$serviceArea',
        callCount: { $sum: 1 },
        lastCall: { $max: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'serviceareas',
        localField: '_id',
        foreignField: '_id',
        as: 'area'
      }
    },
    {
      $unwind: '$area'
    },
    {
      $sort: { callCount: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// Instance methods
callTrackingSchema.methods.markAsCompleted = function(duration = 0) {
  this.callStatus = 'completed';
  this.duration = duration;
  this.isConversion = true;
  return this.save();
};

module.exports = mongoose.model('CallTracking', callTrackingSchema); 