const mongoose = require('mongoose');
const databaseURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/repair-app';
module.exports = async function connectToDatabase() {
  try {
    await mongoose.connect(databaseURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log('Connected to database');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};