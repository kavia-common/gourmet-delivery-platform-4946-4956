'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * User schema
 * - email: unique
 * - name: optional
 * - passwordHash, salt: required for auth
 * - timestamps: createdAt, updatedAt
 */

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    name: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure unique index on email
UserSchema.index({ email: 1 }, { unique: true });

/**
 * PUBLIC_INTERFACE
 * User model accessor.
 */
const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
