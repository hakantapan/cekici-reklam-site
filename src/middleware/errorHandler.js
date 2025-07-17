const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log hatayı
  console.error('Error:', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Kaynak bulunamadı';
    error = { message, statusCode: 404 };
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = 'Bu kayıt zaten mevcut';
    error = { message, statusCode: 400 };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Geçersiz token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token süresi dolmuş';
    error = { message, statusCode: 401 };
  }

  // Multer Errors (File Upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Dosya boyutu çok büyük';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Çok fazla dosya yüklendi';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Beklenmeyen dosya türü';
    error = { message, statusCode: 400 };
  }

  // API isteği ise JSON döndür
  if (req.xhr || req.headers.accept.includes('application/json')) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Sunucu hatası',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // HTML sayfası için error page render et
  res.status(error.statusCode || 500).render('pages/error', {
    title: 'Hata - Hızlı Çekici',
    error: {
      status: error.statusCode || 500,
      message: error.message || 'Sunucu hatası'
    },
    layout: false
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Sayfa bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async hataları yakalamak için wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
}; 