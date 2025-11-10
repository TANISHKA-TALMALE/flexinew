const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || '';
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — using NeDB file storage for development.');
    return; // Skip MongoDB connection; models will use NeDB fallback
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connectDB };