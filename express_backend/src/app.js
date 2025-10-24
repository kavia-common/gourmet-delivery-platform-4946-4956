const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { connect } = require('./db/mongo');

dotenv.config();

/**
 * App initializes MongoDB connection and serves API with Swagger docs.
 * CORS and JWT are configured via environment variables.
 */
const app = express();

// Parse JSON and urlencoded request body early
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration via env:
 * - CORS_ORIGIN: comma-separated list or single origin. If not provided, defaults to allowing localhost:3000
 */
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow same-host requests (e.g., when proxied)
    try {
      const host = `http://${this?.req?.headers?.host || ''}`; // fallback
      if (origin === host) return callback(null, true);
    } catch (_) { /* ignore */ }
    // For safety in production, reject others
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400,
}));
app.options('*', cors());

app.set('trust proxy', true);

// Connect to MongoDB on startup
(async () => {
  try {
    await connect();
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection failed:', err.message);
  }
})();

// Serve OpenAPI JSON dynamically with correct server URL
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  res.json(dynamicSpec);
});

// Swagger UI referencing dynamic spec
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Mount routes
app.use('/', routes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
