/**
 * MongoDB connection helper (Mongoose)
 * MongoDB-ready structure — uses JSON data as fallback when DB is not configured.
 * Set MONGODB_URI in .env.local to enable persistence.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global to cache the connection across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn(
      "[DB] MONGODB_URI not set — running in JSON-only mode. Set MONGODB_URI in .env.local to enable persistence."
    );
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => {
        console.log("[DB] MongoDB connected");
        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
