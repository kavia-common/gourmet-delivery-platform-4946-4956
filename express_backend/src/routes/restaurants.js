const express = require('express');
const restaurantsController = require('../controllers/restaurants');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Browse restaurants
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: List restaurants
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get('/', restaurantsController.list.bind(restaurantsController));

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get restaurant by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant details
 */
router.get('/:id', restaurantsController.getById.bind(restaurantsController));

module.exports = router;
