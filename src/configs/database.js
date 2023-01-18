import mongoose from 'mongoose';

export const connectDB = () => {
  return mongoose.connect(process.env.MONGO_URL);
};
