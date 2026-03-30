const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
    bufferCommands: false
  };

  let attempt = 0;
  while (attempt < retries) {
    try {
      console.log(`Connecting to MongoDB Atlas... (attempt ${attempt + 1}/${retries})`);
      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log('MongoDB Atlas Connected successfully!');
      
      // Graceful disconnect on process termination
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB disconnected');
        process.exit(0);
      });
      
      return;
    } catch (err) {
      attempt++;
      console.error(`DB connect failed (attempt ${attempt}/${retries}):`, err.message);
      
      if (attempt === retries) {
        console.log('\n=== DB Connection Failed ===');
        console.log('Server will continue without DB (retries can be manual via rs)');
        console.log('Fix Atlas IP: https://cloud.mongodb.com → Security → Network Access → Add 0.0.0.0/0');
        console.log('Current state:', mongoose.connection.readyState ? 'Connected' : 'Disconnected');
        console.log('============================\n');
        // No process.exit() - server continues
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s delay
    }
  }
};

// Export for use in app.js
module.exports = connectDB;
