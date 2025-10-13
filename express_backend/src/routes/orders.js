const express = require('express');
const ordersController = require('../controllers/orders');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Create and track orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order (auth required)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, items]
 *             properties:
 *               restaurantId: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItemId, quantity]
 *                   properties:
 *                     menuItemId: { type: string }
 *                     quantity: { type: integer }
 *                     instructions: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', auth, ordersController.create.bind(ordersController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', ordersController.getById.bind(ordersController));

/**
 * @swagger
 * /orders/{id}/status:
 *   get:
 *     tags: [Orders]
 *     summary: Get order status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order status
 */
router.get('/:id/status', ordersController.getStatus.bind(ordersController));

module.exports = router;
