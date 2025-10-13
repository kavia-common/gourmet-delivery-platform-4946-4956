const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const restaurantsRoutes = require('./restaurants');
const menuRoutes = require('./menuItems');
const ordersRoutes = require('./orders');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantsRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', ordersRoutes);

module.exports = router;
