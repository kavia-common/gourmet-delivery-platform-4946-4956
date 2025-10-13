const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// PUBLIC_INTERFACE
function authMiddleware(req, res, next) {
  /** Verify JWT provided via Authorization: Bearer <token> header. */
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (!token || scheme.toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid Authorization header' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info (e.g., { id, email })
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

module.exports = authMiddleware;
