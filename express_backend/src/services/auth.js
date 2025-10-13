const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getDb } = require('../db/mongo');

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

function generateToken(user) {
  // PUBLIC_INTERFACE
  // Create JWT with minimal fields for client usage
  return jwt.sign(
    { id: user._id?.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

async function registerUser({ email, password, name }) {
  const db = await getDb();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) {
    throw new Error('Email already registered');
  }

  const salt = generateSalt();
  // NOTE: Minimal hashing per seed requirement. For production use bcrypt/argon2.
  const passwordHash = hashPassword(password, salt);

  const { insertedId } = await users.insertOne({
    email,
    name: name || '',
    passwordHash,
    salt,
    createdAt: new Date(),
  });

  const user = { _id: insertedId, email, name };
  const token = generateToken(user);
  return { user: { id: insertedId.toString(), email, name }, token };
}

async function loginUser({ email, password }) {
  const db = await getDb();
  const users = db.collection('users');

  const user = await users.findOne({ email });
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
