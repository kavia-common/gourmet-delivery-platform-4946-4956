'use strict';

const mongoose = require('mongoose');

/**
 * MongoDB connection helper using Mongoose.
 * Reads MONGODB_URI from environment variables.
 * Exports connect and disconnect helpers for use in scripts and app lifecycle.
 */

let isConnected = false;

/**
 * PUBLIC_INTERFACE
 * Connect to MongoDB using MONGODB_URI.
 * Returns the mongoose connection instance.
 */
async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Please configure it in the environment.');
  }
  if (isConnected) return mongoose.connection;

  // recommended options
  const opts = {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  await mongoose.connect(uri, opts);
  isConnected = true;

  // basic events logging in development
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });

  return mongoose.connection;
}

/**
 * PUBLIC_INTERFACE
 * Disconnect from MongoDB.
 */
async function disconnect() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

module.exports = {
  connect,
  disconnect,
};
