const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const TOKEN_EXPIRES_IN = '7d';

// Simple salted hash using sha256 for demo purposes
function hashPassword(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// PUBLIC_INTERFACE
function generateToken(user) {
  /** Issue JWT including Mongo _id as string for client */
  const id = user.id || user._id?.toString();
  return jwt.sign({ id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

// PUBLIC_INTERFACE
async function registerUser({ email, password, name }) {
  const existing = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
  if (existing) {
    throw new Error('Email already registered');
  }

  const salt = generateSalt();
  // NOTE: Minimal hashing per seed requirement. For production use bcrypt/argon2.
  const passwordHash = hashPassword(password, salt);

  const created = await User.create({
    email: String(email).toLowerCase().trim(),
    name: name || '',
    passwordHash,
    salt,
  });

  const token = generateToken(created);
  return { user: { id: created._id.toString(), email: created.email, name: created.name || '' }, token };
}

// PUBLIC_INTERFACE
async function loginUser({ email, password }) {
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  return { user: { id: user._id.toString(), email: user.email, name: user.name || '' }, token };
}

module.exports = {
  // PUBLIC_INTERFACE
  registerUser,
  // PUBLIC_INTERFACE
  loginUser,
  // PUBLIC_INTERFACE
  generateToken,
};
