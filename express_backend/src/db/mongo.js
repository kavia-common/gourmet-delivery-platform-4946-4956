const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const DEFAULT_URL = 'mongodb://appuser:dbuser123@localhost:5001/myapp?authSource=admin';
const MONGODB_URL = process.env.MONGODB_URL || DEFAULT_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'myapp';

let client;
let db;

/**
 * Get a connected MongoDB database instance.
 * Ensures a single shared client/connection is reused across requests.
 * Uses MONGODB_URL and MONGODB_DB env variables.
 */
async function getDb() {
  if (db) {
    return db;
  }

  if (!client) {
    client = new MongoClient(MONGODB_URL, {
      // modern drivers handle pooling by default
      maxPoolSize: 10,
    });
    await client.connect();
  }

  db = client.db(MONGODB_DB);
  return db;
}

/**
 * Helper to safely parse string IDs to ObjectId
 */
function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return null;
  }
}

module.exports = {
  getDb,
  toObjectId,
};
