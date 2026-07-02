import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  // During build time or when MONGODB_URI is not set,
  // provide a dummy promise that will fail at runtime
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    console.warn("⚠️ MONGODB_URI not set. MongoDB features will be disabled.");
  }
  // Export a promise that rejects when actually used
  clientPromise = Promise.reject(new Error("MONGODB_URI not configured"));
  // Prevent unhandled rejection warnings
  clientPromise.catch(() => {});
} else {
  const options = {};

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the client
    // across hot reloads. This prevents creating multiple MongoClient instances.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, create a new client.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
