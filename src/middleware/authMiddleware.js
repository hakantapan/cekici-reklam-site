const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Token doğrulama middleware'i
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Erişim reddedildi. Token bulunamadı.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Geçersiz token. Kullanıcı bulunamadı.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Hesap devre dışı bırakılmış.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware hatası:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Geçersiz token.' 
    });
  }
};

// Session tabanlı auth (admin panel için)
const authenticateSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // API isteği ise JSON response
  if (req.xhr || req.headers.accept.includes('application/json')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Giriş yapmanız gerekiyor.' 
    });
  }
  
  // Normal HTTP isteği ise login sayfasına yönlendir
  return res.redirect('/admin/login');
};

// Admin rolü kontrolü
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Kimlik doğrulaması gerekli.' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin yetkisi gerekli.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware hatası:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası.' 
    });
  }
};

// Rate limiting için kullanıcı IP'si al
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Login attempt tracking
const loginAttempts = new Map();

const trackLoginAttempt = (req, res, next) => {
  const ip = getClientIP(req);
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  // 15 dakika geçmişse reset et
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  // Çok fazla deneme varsa engelle
  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.',
      retryAfter: 15 * 60
    });
  }
  
  req.loginAttempts = attempts;
  req.clientIP = ip;
  next();
};

const recordLoginAttempt = (req, success = false) => {
  const ip = req.clientIP;
  if (!ip) return;
  
  if (success) {
    loginAttempts.delete(ip);
  } else {
    const attempts = req.loginAttempts;
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(ip, attempts);
  }
};

// CSRF koruması (basit)
const csrfProtection = (req, res, next) => {
  // GET isteklerini atla
  if (req.method === 'GET') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token geçersiz.'
    });
  }
  
  next();
};

// CSRF token oluştur
const generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

module.exports = {
  authenticateToken,
  authenticateSession,
  requireAdmin,
  trackLoginAttempt,
  recordLoginAttempt,
  getClientIP,
  csrfProtection,
  generateCSRFToken
}; 