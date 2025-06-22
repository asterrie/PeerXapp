import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB połączone');
  } catch (err) {
    console.error('❌ Błąd MongoDB:', err.message);
    process.exit(1);
  }
}
