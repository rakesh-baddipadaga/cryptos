// utils/dbconnect.ts
import 'dotenv/config';
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const globalWithMongoose = global as typeof globalThis & { mongoose?: { conn: Connection | null, promise: Promise<Connection> | null } };


// Initialize mongoose connection variables
let cached = globalWithMongoose.mongoose ?? { conn: null, promise: null };

// Export an async function to connect to MongoDB
export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}