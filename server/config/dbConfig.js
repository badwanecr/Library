const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoUrl = process.env.mongo_url || "mongodb://localhost:27017/library";

async function connectDB() {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('Mongo DB Connection Successfull');
  } catch (err) {
    console.log('Mongo DB Connection Failed:', err.message);
    console.log('Attempting in-memory database fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to In-Memory Mongo DB instance successfully!');
    } catch (fallbackErr) {
      console.log('In-Memory DB fallback failed or module not installed. Please start MongoDB locally or provide a valid mongo_url in .env');
    }
  }
}

connectDB();

const connection = mongoose.connection;

connection.on('connected', () => {
    // Already handled in connectDB
});

connection.on('error', (err) => {
    // Suppress unhandled error crash
});

module.exports = connection;