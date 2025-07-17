const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateSession } = require('../middleware/authMiddleware');
const SiteSettings = require('../models/SiteSettings');
const ServiceArea = require('../models/ServiceArea');
const CallTracking = require('../models/CallTracking');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Genel API routes (authentication gerektirmez)

// Site ayarlarını al
router.get('/settings', asyncHandler(async (req, res) => {
  try {
    const settings = await SiteSettings.getInstance();
    res.json({
      success: true,
      data: {
        companyName: settings.companyName,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        services: settings.services.filter(s => s.isActive)
      }
    });
  } catch (error) {
    console.error('Settings API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Aktif hizmet alanlarını al
router.get('/service-areas', asyncHandler(async (req, res) => {
  try {
    const areas = await ServiceArea.getActiveAreas();
    res.json({
      success: true,
      data: areas
    });
  } catch (error) {
    console.error('Service areas API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Admin API routes (authentication gerektirir)
router.use('/admin', authenticateSession);

// Site ayarlarını güncelle
router.put('/admin/settings', [
  body('companyName').trim().isLength({ min: 1 }).withMessage('Şirket adı gerekli'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Telefon numarası gerekli'),
  body('whatsapp').trim().isLength({ min: 10 }).withMessage('WhatsApp numarası gerekli'),
  body('email').isEmail().withMessage('Geçerli email adresi gerekli')
], asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const settings = await SiteSettings.getInstance();
    
    // Gelen verileri settings'e ata
    Object.keys(req.body).forEach(key => {
      if (key in settings.toObject()) {
        settings[key] = req.body[key];
      }
    });

    settings.lastUpdatedBy = req.session.userId;
    await settings.save();

    res.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi',
      data: settings
    });

  } catch (error) {
    console.error('Settings update hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Hizmet alanı ekleme
router.post('/admin/service-areas', [
  body('name').trim().isLength({ min: 1 }).withMessage('Bölge adı gerekli'),
  body('description').optional().trim(),
  body('priority').optional().isInt({ min: 0, max: 10 })
], asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const areaData = {
      ...req.body,
      createdBy: req.session.userId
    };

    const area = new ServiceArea(areaData);
    await area.save();

    res.status(201).json({
      success: true,
      message: 'Hizmet alanı başarıyla eklendi',
      data: area
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu bölge adı zaten mevcut'
      });
    }
    
    console.error('Service area create hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Hizmet alanı güncelleme
router.put('/admin/service-areas/:id', [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Bölge adı boş olamaz'),
  body('description').optional().trim(),
  body('priority').optional().isInt({ min: 0, max: 10 }),
  body('isActive').optional().isBoolean()
], asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Hizmet alanı bulunamadı'
      });
    }

    // Güncelleme verilerini ata
    Object.keys(req.body).forEach(key => {
      if (key in area.toObject() && key !== '_id') {
        area[key] = req.body[key];
      }
    });

    area.updatedBy = req.session.userId;
    await area.save();

    res.json({
      success: true,
      message: 'Hizmet alanı başarıyla güncellendi',
      data: area
    });

  } catch (error) {
    console.error('Service area update hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Hizmet alanı silme
router.delete('/admin/service-areas/:id', asyncHandler(async (req, res) => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Hizmet alanı bulunamadı'
      });
    }

    await ServiceArea.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Hizmet alanı başarıyla silindi'
    });

  } catch (error) {
    console.error('Service area delete hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// İstatistikler API
router.get('/admin/statistics', asyncHandler(async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let stats;
    if (period === 'today') {
      stats = await CallTracking.getTodayStats();
    } else {
      stats = await CallTracking.getWeeklyStats();
    }

    const popularAreas = await CallTracking.getPopularServiceAreas();

    res.json({
      success: true,
      data: {
        stats,
        popularAreas,
        period
      }
    });

  } catch (error) {
    console.error('Statistics API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Call tracking export (CSV)
router.get('/admin/export/calls', asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const calls = await CallTracking.find(filter)
      .populate('serviceArea', 'name')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // CSV format
      let csv = 'Tarih,Saat,Tip,Telefon,Bölge,IP Adresi\n';
      calls.forEach(call => {
        const date = call.createdAt.toLocaleDateString('tr-TR');
        const time = call.createdAt.toLocaleTimeString('tr-TR');
        const area = call.serviceArea ? call.serviceArea.name : '-';
        csv += `${date},${time},${call.callType},${call.phoneNumber},${area},${call.ipAddress}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=call-tracking.csv');
      res.send(csv);
    } else {
      // JSON format
      res.json({
        success: true,
        data: calls,
        count: calls.length
      });
    }

  } catch (error) {
    console.error('Export hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

module.exports = router; 