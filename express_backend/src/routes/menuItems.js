const express = require('express');
const menuController = require('../controllers/menuItems');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Browse menu items
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     tags: [Menu]
 *     summary: List menu items
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get('/', menuController.list.bind(menuController));

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     tags: [Menu]
 *     summary: List menu for a restaurant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant menu
 */
router.get('/restaurants/:id/menu', menuController.listByRestaurant.bind(menuController));

module.exports = router;
