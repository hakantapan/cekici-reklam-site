const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
require('dotenv').config();

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const siteRoutes = require('./src/routes/siteRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

// Middleware imports
const errorHandler = require('./src/middleware/errorHandler');
const authMiddleware = require('./src/middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/towing-company', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📊 MongoDB bağlantısı başarılı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware setup
app.use(helmet({
  contentSecurityPolicy: false, // HTML sayfalar için
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'towing-company-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/towing-company'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View engine setup - EJS kullanacağız
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('👤 Kullanıcı bağlandı:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('👋 Kullanıcı ayrıldı:', socket.id);
  });
  
  // Admin panel real-time updates
  socket.on('join-admin', () => {
    socket.join('admin-room');
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/', siteRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: 'Sayfa Bulunamadı - Hızlı Çekici',
    error: 'Aradığınız sayfa bulunamadı.'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
}); 