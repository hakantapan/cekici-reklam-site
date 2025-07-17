const express = require('express');
const { authenticateSession } = require('../middleware/authMiddleware');
const SiteSettings = require('../models/SiteSettings');
const ServiceArea = require('../models/ServiceArea');
const CallTracking = require('../models/CallTracking');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Tüm admin routes için authentication gerekli
router.use(authenticateSession);

// Dashboard
router.get('/dashboard', asyncHandler(async (req, res) => {
  try {
    // İstatistikleri al
    const [todayStats, weeklyStats, totalCalls, totalAreas, recentCalls] = await Promise.all([
      CallTracking.getTodayStats(),
      CallTracking.getWeeklyStats(),
      CallTracking.countDocuments(),
      ServiceArea.countDocuments({ isActive: true }),
      CallTracking.find().sort({ createdAt: -1 }).limit(10).populate('serviceArea')
    ]);

    res.render('admin/dashboard', {
      title: 'Dashboard - Admin Panel',
      todayStats,
      weeklyStats,
      totalCalls,
      totalAreas,
      recentCalls,
      currentPage: 'dashboard'
    });
  } catch (error) {
    console.error('Dashboard hatası:', error);
    res.status(500).render('admin/error', {
      title: 'Hata - Admin Panel',
      error: 'Dashboard yüklenirken hata oluştu'
    });
  }
}));

// Site Ayarları
router.get('/site-settings', asyncHandler(async (req, res) => {
  try {
    const settings = await SiteSettings.getInstance();
    
    res.render('admin/site-settings', {
      title: 'Site Ayarları - Admin Panel',
      settings,
      currentPage: 'site-settings'
    });
  } catch (error) {
    console.error('Site ayarları hatası:', error);
    res.status(500).render('admin/error', {
      title: 'Hata - Admin Panel',
      error: 'Site ayarları yüklenirken hata oluştu'
    });
  }
}));

// Hizmet Alanları
router.get('/areas', asyncHandler(async (req, res) => {
  try {
    const areas = await ServiceArea.find().sort({ priority: -1, name: 1 });
    
    res.render('admin/areas', {
      title: 'Hizmet Alanları - Admin Panel',
      areas,
      currentPage: 'areas'
    });
  } catch (error) {
    console.error('Hizmet alanları hatası:', error);
    res.status(500).render('admin/error', {
      title: 'Hata - Admin Panel',
      error: 'Hizmet alanları yüklenirken hata oluştu'
    });
  }
}));

// İstatistikler
router.get('/statistics', asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate, callType } = req.query;
    
    // Filtre objesi oluştur
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (callType) {
      filter.callType = callType;
    }

    const [calls, popularAreas, weeklyStats] = await Promise.all([
      CallTracking.find(filter).sort({ createdAt: -1 }).populate('serviceArea'),
      CallTracking.getPopularServiceAreas(),
      CallTracking.getWeeklyStats()
    ]);

    res.render('admin/statistics', {
      title: 'İstatistikler - Admin Panel',
      calls,
      popularAreas,
      weeklyStats,
      filters: { startDate, endDate, callType },
      currentPage: 'statistics'
    });
  } catch (error) {
    console.error('İstatistikler hatası:', error);
    res.status(500).render('admin/error', {
      title: 'Hata - Admin Panel',
      error: 'İstatistikler yüklenirken hata oluştu'
    });
  }
}));

module.exports = router; 