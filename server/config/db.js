import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas or local database using the MONGO_URI environment variable.
 * @returns {Promise<void>} Resolves when connection is successful, or exits process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
