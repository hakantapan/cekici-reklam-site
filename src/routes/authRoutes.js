const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { 
  trackLoginAttempt, 
  recordLoginAttempt, 
  getClientIP,
  generateCSRFToken 
} = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Login sayfası
router.get('/login', generateCSRFToken, (req, res) => {
  // Zaten giriş yapmışsa dashboard'a yönlendir
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    title: 'Admin Girişi - Hızlı Çekici',
    error: null,
    csrfToken: res.locals.csrfToken
  });
});

// Login işlemi
router.post('/login', [
  trackLoginAttempt,
  body('username').trim().isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
], asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      recordLoginAttempt(req, false);
      return res.status(400).render('admin/login', {
        title: 'Admin Girişi - Hızlı Çekici',
        error: errors.array()[0].msg,
        csrfToken: res.locals.csrfToken
      });
    }

    const { username, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!user) {
      recordLoginAttempt(req, false);
      return res.status(401).render('admin/login', {
        title: 'Admin Girişi - Hızlı Çekici',
        error: 'Kullanıcı adı veya şifre hatalı',
        csrfToken: res.locals.csrfToken
      });
    }

    // Şifre kontrolü
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      recordLoginAttempt(req, false);
      return res.status(401).render('admin/login', {
        title: 'Admin Girişi - Hızlı Çekici',
        error: 'Kullanıcı adı veya şifre hatalı',
        csrfToken: res.locals.csrfToken
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Session bilgilerini kaydet
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.token = token;

    // Login bilgilerini güncelle
    await user.updateLoginInfo();

    // Başarılı login kaydı
    recordLoginAttempt(req, true);

    // API isteği ise JSON döndür
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        message: 'Giriş başarılı',
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          fullName: user.fullName
        }
      });
    }

    // HTML isteği ise dashboard'a yönlendir
    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Login hatası:', error);
    recordLoginAttempt(req, false);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      });
    }
    
    res.status(500).render('admin/login', {
      title: 'Admin Girişi - Hızlı Çekici',
      error: 'Sunucu hatası oluştu',
      csrfToken: res.locals.csrfToken
    });
  }
}));

// Logout işlemi
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout hatası:', err);
    }
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        message: 'Çıkış yapıldı'
      });
    }
    
    res.redirect('/admin/login');
  });
});

// Session durumu kontrolü (API)
router.get('/status', (req, res) => {
  if (req.session.userId) {
    return res.json({
      success: true,
      authenticated: true,
      userId: req.session.userId,
      userRole: req.session.userRole
    });
  }
  
  res.status(401).json({
    success: false,
    authenticated: false,
    message: 'Giriş yapmanız gerekiyor'
  });
});

// Şifre değiştirme (sadece API)
router.post('/change-password', [
  body('currentPassword').isLength({ min: 6 }).withMessage('Mevcut şifre gerekli'),
  body('newPassword').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalı'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Şifreler eşleşmiyor');
    }
    return true;
  })
], asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Giriş yapmanız gerekiyor'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Mevcut şifre kontrolü
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }

    // Yeni şifreyi kaydet
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    });

  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
}));

module.exports = router; 