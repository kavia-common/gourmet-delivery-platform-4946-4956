const ordersService = require('../services/orders');

class OrdersController {
  // PUBLIC_INTERFACE
  async create(req, res) {
    try {
      const userId = req.user?.id;
      const { restaurantId, items, notes } = req.body || {};
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!restaurantId || !Array.isArray(items)) {
        return res.status(400).json({ error: 'restaurantId and items are required' });
      }
      const result = await ordersService.createOrder({ userId, restaurantId, items, notes });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }
  }

  // PUBLIC_INTERFACE
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await ordersService.getOrderById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json(order);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get order' });
    }
  }

  // PUBLIC_INTERFACE
  async getStatus(req, res) {
    try {
      const { id } = req.params;
      const status = await ordersService.getOrderStatus(id);
      if (!status) return res.status(404).json({ error: 'Order not found' });
      return res.json(status);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get order status' });
    }
  }
}

module.exports = new OrdersController();
