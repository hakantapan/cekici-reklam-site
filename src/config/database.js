const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/towing-company', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 