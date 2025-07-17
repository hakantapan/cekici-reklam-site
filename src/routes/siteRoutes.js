const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const ServiceArea = require('../models/ServiceArea');
const CallTracking = require('../models/CallTracking');
const { asyncHandler } = require('../middleware/errorHandler');
const { getClientIP } = require('../middleware/authMiddleware');

const router = express.Router();

// Ana sayfa
router.get('/', asyncHandler(async (req, res) => {
  try {
    // Site ayarlarını ve aktif hizmet alanlarını al
    const [settings, serviceAreas] = await Promise.all([
      SiteSettings.getInstance(),
      ServiceArea.getActiveAreas()
    ]);

    res.render('pages/index', {
      title: settings.seo.title,
      description: settings.seo.description,
      keywords: settings.seo.keywords,
      settings,
      serviceAreas,
      currentPage: 'home'
    });
  } catch (error) {
    console.error('Ana sayfa hatası:', error);
    res.status(500).render('pages/error', {
      title: 'Hata - Hızlı Çekici',
      error: {
        status: 500,
        message: 'Sayfa yüklenirken hata oluştu'
      }
    });
  }
}));

// Hizmet alanı detay sayfası
router.get('/alan/:slug', asyncHandler(async (req, res) => {
  try {
    const area = await ServiceArea.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!area) {
      return res.status(404).render('pages/404', {
        title: 'Sayfa Bulunamadı - Hızlı Çekici',
        error: 'Aradığınız hizmet alanı bulunamadı.'
      });
    }

    const settings = await SiteSettings.getInstance();

    res.render('pages/service-area', {
      title: `${area.name} Çekici Hizmeti - ${settings.companyName}`,
      description: area.seoDescription || `${area.name} bölgesinde 7/24 çekici hizmeti`,
      keywords: area.seoKeywords || `${area.name} çekici, ${area.name} oto çekici`,
      settings,
      area,
      currentPage: 'service-area'
    });
  } catch (error) {
    console.error('Hizmet alanı hatası:', error);
    res.status(500).render('pages/error', {
      title: 'Hata - Hızlı Çekici',
      error: {
        status: 500,
        message: 'Sayfa yüklenirken hata oluştu'
      }
    });
  }
}));

// Hakkımızda sayfası
router.get('/hakkimizda', asyncHandler(async (req, res) => {
  try {
    const settings = await SiteSettings.getInstance();

    res.render('pages/about', {
      title: `Hakkımızda - ${settings.companyName}`,
      description: 'Profesyonel çekici hizmeti hakkında bilgi alın',
      settings,
      currentPage: 'about'
    });
  } catch (error) {
    console.error('Hakkımızda sayfa hatası:', error);
    res.status(500).render('pages/error', {
      title: 'Hata - Hızlı Çekici',
      error: {
        status: 500,
        message: 'Sayfa yüklenirken hata oluştu'
      }
    });
  }
}));

// İletişim sayfası
router.get('/iletisim', asyncHandler(async (req, res) => {
  try {
    const settings = await SiteSettings.getInstance();

    res.render('pages/contact', {
      title: `İletişim - ${settings.companyName}`,
      description: 'Çekici hizmeti için bize ulaşın',
      settings,
      currentPage: 'contact'
    });
  } catch (error) {
    console.error('İletişim sayfa hatası:', error);
    res.status(500).render('pages/error', {
      title: 'Hata - Hızlı Çekici',
      error: {
        status: 500,
        message: 'Sayfa yüklenirken hata oluştu'
      }
    });
  }
}));

// Call tracking endpoint
router.post('/track-call', asyncHandler(async (req, res) => {
  try {
    const { callType, phoneNumber, serviceAreaId, currentPage } = req.body;
    
    // Gerekli alanları kontrol et
    if (!callType || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Gerekli alanlar eksik'
      });
    }

    // Call tracking kaydı oluştur
    const callData = {
      callType,
      phoneNumber,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      currentPage: currentPage || req.get('Referer'),
      sessionId: req.sessionID,
      device: {
        type: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    };

    // Service area varsa ekle
    if (serviceAreaId) {
      callData.serviceArea = serviceAreaId;
      
      // Service area'nın call count'ını artır
      try {
        const area = await ServiceArea.findById(serviceAreaId);
        if (area) {
          await area.recordCall();
        }
      } catch (err) {
        console.error('Service area call record hatası:', err);
      }
    }

    const callRecord = new CallTracking(callData);
    await callRecord.save();

    // Real-time admin notification (only for non-Vercel)
    const io = req.app.get('io');
    if (io && !process.env.VERCEL) {
      io.to('admin-room').emit('new-call', {
        type: callType,
        phone: phoneNumber,
        area: serviceAreaId,
        timestamp: new Date(),
        ip: callData.ipAddress
      });
    }

    res.json({
      success: true,
      message: 'Arama kaydedildi',
      callId: callRecord._id
    });

  } catch (error) {
    console.error('Call tracking hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

// Site haritası (XML)
router.get('/sitemap.xml', asyncHandler(async (req, res) => {
  try {
    const [settings, serviceAreas] = await Promise.all([
      SiteSettings.getInstance(),
      ServiceArea.find({ isActive: true })
    ]);

    res.set('Content-Type', 'text/xml');
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${req.protocol}://${req.get('host')}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${req.protocol}://${req.get('host')}/hakkimizda</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${req.protocol}://${req.get('host')}/iletisim</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Hizmet alanlarını ekle
    serviceAreas.forEach(area => {
      sitemap += `
  <url>
    <loc>${req.protocol}://${req.get('host')}/alan/${area.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap hatası:', error);
    res.status(500).send('Sitemap oluşturulamadı');
  }
}));

// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

module.exports = router; 