const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

/**
 * App runs in no-DB mode with in-memory repositories.
 * Data is seeded at startup via src/db/memory.js.
 */
// Initialize express app
const app = express();

// Parse JSON and urlencoded request body early
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * CORS: allow local frontend and support preflight broadly in dev.
 * This is permissive by design for in-memory demo mode.
 */
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser and localhost:3000 by default
    if (!origin) return callback(null, true);
    if (/^https?:\/\/localhost:3000$/.test(origin)) return callback(null, true);
    // Also allow same-host (useful when proxied)
    const host = `http://${req?.headers?.host || ''}`;
    if (origin === host) return callback(null, true);
    return callback(null, true); // permissive for demo mode
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400,
}));
app.options('*', cors());

app.set('trust proxy', true);

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

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
